import React, { Component, createRef, Fragment } from 'react'
import { Wrapper } from './Style'

const DEGREE_IN_RADIANS = Math.PI / 180
const classNamePrefix = 'RoundSlider'

class Roundy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
      angle: this.valueToAngle(props.value)
    }
    if (props.arcSize < 0) {
      console.warn(
        'arcSize should be between 1 and 360. '
      )
    }
    this.uniqueId = Math.floor(Math.random() * 100) + Date.now()
    this.touches = []
    this.allowChange = false
    this.isDrag = false
    this._wrapper = createRef()
    this._handle = createRef()
  }

  componentWillReceiveProps(props) {
    if (this.state.value !== props.value) {
      this.setState({ value: props.value })
    }
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.up)
    if (!this.props.allowClick && this._wrapper.current) {
      this._wrapper.current.style.pointerEvents = 'none'
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.up)
  }

  up = e => {
    if (!this.props.allowClick && this._wrapper.current) {
      this._wrapper.current.style.pointerEvents = 'none'
    }
    this.allowChange = false
    this.isDrag = false
    this.touches = [] // clear touches
    // e.preventDefault()
    e.stopPropagation()
    this.props.onAfterChange && this.props.onAfterChange(this.value, this.props)
  }

  getTouchMove = e => {
    // e.preventDefault()
    e.stopPropagation()
    if (this.allowChange || this.isDrag) {
      let idx = 0
      for (let index = 0; index < e.changedTouches.length; index++) {
        const t = e.changedTouches[index]
        if (t.identifier >= 0) {
          this.touches = [t]
          this.updateValue(this.touches[idx])
        }
      }
    }
  }

  down = e => {
    if (this._wrapper.current) {
      this._wrapper.current.style.pointerEvents = 'auto'
    }
    e.stopPropagation()
    // e.preventDefault()
    // we update first value, then we decide based on rotation
    if (!this.isDrag) {
      this.updateValue(e, true)
    }
    this.allowChange = true
    this.isDrag = true
    if (e.changedTouches) {
      this.touches.push(...e.changedTouches)
    }
  }

  getArc = (startAngle, endAngle) => {
    let { radius, strokeWidth } = this.props
    const pathRadius = radius - strokeWidth / 2
    const start = this.polarToCartesian({
      radius,
      pathRadius,
      angle: startAngle
    })
    const end = this.polarToCartesian({
      radius,
      pathRadius,
      angle: endAngle
    })
    const arcSweep = startAngle <= 180 ? 0 : 1

    return `M ${start} A ${pathRadius} ${pathRadius} 0 ${arcSweep} 0 ${end}`
  }

  polarToCartesian({ pathRadius, angle, radius }) {
    const angleInRadians = (angle - 180) * DEGREE_IN_RADIANS
    const x = radius + pathRadius * Math.cos(angleInRadians)
    const y = radius + pathRadius * Math.sin(angleInRadians)

    return x + ' ' + y
  }

  getCenter() {
    var rect = this._wrapper.current.getBoundingClientRect()
    return {
      top: rect.top + this.props.radius,
      left: rect.left + this.props.radius
    }
  }

  limitValue = value => {
    const { min, max } = this.props
    if (value < min) value = min
    if (value > max) value = max
    return value
  }

  radToDeg(rad) {
    return rad * (180 / Math.PI)
  }

  angle(y, x) {
    const { rotation } = this.props
    let angle = this.radToDeg(Math.atan2(y, x)) + 180 - rotation
    if (angle > 360) {
      angle = angle - 360
    }
    console.log(angle)
    return angle
  }

  angleToValue = angle => {
    const { min, max, arcSize } = this.props
    const v = (angle / arcSize) * (max - min) + min
    return v
  }

  valueToAngle = value => {
    const { max, min, arcSize } = this.props
    const angle = ((value - min) / (max - min)) * arcSize
    return angle
  }

  stepRounding(degree) {
    const { step, min, arcSize, rotation } = this.props
    const { angle: oldAngle } = this.state
    let angToValue = min
    if (!this.isDrag) {
      angToValue = this.angleToValue(degree)
    } else {
      angToValue = this.angleToValue(
        oldAngle > (arcSize - 20) && degree < (arcSize / 4)
          ? Math.max(degree, arcSize)
          : oldAngle < 20 && degree > (arcSize - 20)
          ? Math.min(degree, 0)
          : degree
      )
    }
    let value
    const remain = (angToValue - min) % step
    const currVal = angToValue - remain
    const nextVal = this.limitValue(currVal + step)
    const preVal = this.limitValue(currVal - step)
    if (angToValue >= currVal)
      value = angToValue - currVal < nextVal - angToValue ? currVal : nextVal
    else {
      value = currVal - angToValue > angToValue - preVal ? currVal : preVal
    }
    value = Math.round(value)
    const ang = this.valueToAngle(value)
    return { value, angle: ang }
  }

  updateValue = (event, forceSet) => {
    if (!this.isDrag && !forceSet) return
    let eX = 0,
      eY = 0
    const { clientX, clientY } = event
    eX = clientX
    eY = clientY
    const { left, top } = this.getCenter()
    const x = eX - left,
      y = eY - top
    const { value, angle } = this.stepRounding(this.angle(y, x))
    this.setState({ value, angle })
    this.props.onChange && this.props.onChange(value, this.props)
  }

  getMaskLine(segments, index) {
    const { radius, arcSize } = this.props
    const val = (arcSize/ segments) * index + 180
    const rotateFunction =
      'rotate(' + val.toString() + ',' + radius + ',' + radius + ')'
    return (
      <g key={index} transform={rotateFunction}>
        <line
          x1={radius}
          y1={radius}
          x2={radius * 2}
          y2={radius}
          style={{
            stroke: 'rgb(0,0,0)',
            strokeWidth: 2
          }}
        />
      </g>
    )
  }

  render() {
    const {
      color,
      bgColor,
      max,
      min,
      step,
      strokeWidth,
      thumbSize,
      radius,
      sliced,
      render,
      style,
      arcSize,
      rotation,
      allowClick
    } = this.props
    const { angle } = this.state
    const segments = Math.floor((max - min) / step)
    const maskName = `${classNamePrefix}_${this.uniqueId}`
    const size = radius * 2
    const styleRotation = {
      transform: `rotate(${rotation}deg)`,
      transformOrigin: '50% 50%'
    }
    return (
      <Wrapper
        strokeWidth={strokeWidth}
        thumbSize={thumbSize}
        onMouseMove={e => this.allowChange && this.updateValue(e, false)}
        onMouseUp={this.up}
        onMouseDown={this.down}
        onTouchMove={this.getTouchMove}
        onTouchEnd={this.up}
        onTouchCancel={this.up}
        style={style}
        allowClick={allowClick}
      >
        {render ? (
          // use render props
          <div
            className="customWrapper"
            ref={this._wrapper}
            style={{ width: size, height: size, display: 'inline-block' }}
          >
            {render(this.state, this.props)}
          </div>
        ) : (
          <Fragment>
            <svg
              ref={this._wrapper}
              width={size}
              height={size}
            >
              {sliced && (
                <defs>
                  <mask id={maskName} maskUnits="userSpaceOnUse" style={styleRotation}>
                    <rect x={0} y={0} width={size} height={size} fill="white" />
                    {step &&
                      Array(segments)
                        .fill()
                        .map((e, i) => {
                          return this.getMaskLine(segments, i)
                        })}
                  </mask>
                </defs>
              )}

              <path
                fill="transparent"
                strokeDashoffset="0"
                strokeWidth={strokeWidth}
                stroke={bgColor}
                mask={`url(#${maskName})`}
                style={styleRotation}
                d={this.getArc(Math.min(arcSize, 359.9999), 0)}
              />
              <path
                fill="none"
                strokeWidth={strokeWidth}
                stroke={color}
                mask={`url(#${maskName})`}
                style={styleRotation}
                d={this.getArc(Math.min(angle, 359.9999), 0)}
              />
            </svg>
            <div
              ref={this._handle}
              className="sliderHandle"
              onMouseDown={this.down}
              onTouchStart={this.down}
              onMouseUp={this.up}
              style={{
                transform: `rotate(${angle + rotation}deg) scaleX(-1)`
              }}
            />
          </Fragment>
        )}
      </Wrapper>
    )
  }
}

Roundy.defaultProps = {
  color: 'purple',
  bgColor: '#ccc',
  max: 100,
  min: 0,
  step: 10,
  thumbSize: 20,
  sliced: true,
  strokeWidth: 35,
  rotation: 0,
  arcSize: 360,
  value: 50, // so we can see some difference
  radius: 100
}
export default Roundy
