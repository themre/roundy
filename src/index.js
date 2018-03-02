import React, { Component } from 'react'
import styled from 'styled-components'

const DEGREE_IN_RADIANS = Math.PI / 180
const classNamePrefix = 'RoundSlider'
class Roundy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value
    }
    this.uniqueId = Math.floor(Math.random() * 100) + Date.now()
    this.touches = []
    this.allowChange = false
    this.isDrag = false
  }

  componentWillReceiveProps(props) {
    if (this.state.value !== props.value) {
      this.setState({ value: props.value })
    }
  }

  up = e => {
    e.preventDefault()
    e.stopPropagation()
    this._svgElement.style.pointerEvents = 'none'
    this.allowChange = false
    this.isDrag = false
    this.touches = [] // clear touches
    this.props.onAfterChange && this.props.onAfterChange(this.value, this.props)
  }

  getTouchMove = e => {
    e.preventDefault()
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
    this._svgElement.style.pointerEvents = 'auto'
    e.stopPropagation()
    e.preventDefault()
    this.isDrag = true
    this.allowChange = true
    if (e.changedTouches) {
      this.touches.push(...e.changedTouches)
    }
  }

  valueToAngle = value => {
    const { max, min } = this.props
    const angle = (value - min) / (max - min) * 359.9999
    return angle
  }

  getArc = value => {
    let { max, min, radius, strokeWidth } = this.props
    const angle = this.valueToAngle(value)
    const pathRadius = radius - strokeWidth / 2
    const start = this.polarToCartesian({
      radius,
      pathRadius,
      angle
    })
    const end = this.polarToCartesian({
      radius,
      pathRadius,
      angle: 0
    })
    const arcSweep = angle <= 180 ? 0 : 1

    return `M ${start} A ${pathRadius} ${pathRadius} 0 ${arcSweep} 0 ${end}`
  }

  polarToCartesian({ pathRadius, angle, radius }) {
    const angleInRadians = (angle - 90) * DEGREE_IN_RADIANS
    const x = radius + pathRadius * Math.cos(angleInRadians)
    const y = radius + pathRadius * Math.sin(angleInRadians)

    return x + ' ' + y
  }

  getCenter() {
    var rect = this._svgElement.getBoundingClientRect()
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
    let angle = this.radToDeg(Math.atan2(y, x))
    if (angle < 0 && x < 0) angle += 360
    return angle + 90
  }

  angleToValue = angle => {
    const { min, max } = this.props
    const v = angle / 360 * (max - min) + min
    return v
  }

  valueToAngle = value => {
    const { max, min } = this.props
    const angle = (value - min) / (max - min) * 359.9999
    return angle
  }

  stepRounding(degree) {
    const { step, min, max } = this.props
    const value = this.angleToValue(degree)
    let remain, currVal, nextVal, preVal, val, ang
    remain = (value - min) % step
    currVal = value - remain
    nextVal = this.limitValue(currVal + step)
    preVal = this.limitValue(currVal - step)

    if (value >= currVal)
      val = value - currVal < nextVal - value ? currVal : nextVal
    else val = currVal - value > value - preVal ? currVal : preVal
    val = Math.round(val)
    ang = this.valueToAngle(val)
    return { value: val, angle: ang }
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
    this.setState({ value })
    this.props.onChange && this.props.onChange(value, this.props)
  }

  clamp(angle) {
    return Math.max(0, Math.min(angle || 0, this.props.max))
  }

  calcOffset() {
    const { max, radius, strokeWidth, value } = RoundSlider.options
    const r = radius - strokeWidth
    const c = Math.PI * r * 2
    const offset = (1 - value / max) * c
    return offset
  }
  getMaskLine({ radius, segments, index }) {
    return (
      <line
        key={index}
        x1={radius}
        y1={radius}
        x2={radius * 2}
        y2={radius}
        style={{
          stroke: 'rgb(0,0,0)',
          strokeWidth: 2,
          transform: `rotate(${360 / segments * index - 90}deg)`,
          transformOrigin: '50% 50%'
        }}
      />
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
      radius,
      sliced,
      ...rest
    } = this.props
    const { value } = this.state
    const segments = Math.floor((max - min) / step)
    const maskName = `${classNamePrefix}_${this.uniqueId}`
    return (
      <Wrapper
        onMouseMove={e => this.allowChange && this.updateValue(e, true)}
        onMouseUp={this.up}
        onTouchMove={this.getTouchMove}
        onTouchEnd={this.up}
        onTouchCancel={this.up}
        {...rest}
      >
        <svg
          ref={el => (this._svgElement = el)}
          width={radius * 2}
          height={radius * 2}
        >
          {sliced && (
            <defs>
              <mask id={maskName}>
                <rect
                  x="0"
                  y="0"
                  width={radius * 2}
                  height={radius * 2}
                  fill="white"
                />
                {step &&
                  Array(segments)
                    .fill()
                    .map((e, i) => {
                      return this.getMaskLine({ segments, radius, index: i })
                    })}
              </mask>
            </defs>
          )}

          <circle
            cx={radius}
            cy={radius}
            r={radius - strokeWidth / 2}
            fill="transparent"
            strokeDashoffset="0"
            strokeWidth={strokeWidth}
            stroke={bgColor}
            mask={`url(#${maskName})`}
          />
          <path
            fill="none"
            strokeWidth={strokeWidth}
            stroke={color}
            d={this.getArc(value)}
          />
        </svg>
        <div
          ref={el => this._handle = el}
          className="sliderHandle"
          onMouseDown={this.down}
          onTouchStart={this.down}
          onMouseUp={this.up}
          style={{
            transform: `rotate(${this.valueToAngle(value) - 90}deg)`
          }}
        />
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  pointer-events: none;

  svg {
    path {
      opacity: 0.7;
    }
  }

  .sliderHandle {
    width: 50%;
    pointer-events: all;
    position: absolute;
    left: 50%;
    top: 50%;
    transform-origin: 0 50%;
  }
  .sliderHandle:after {
    content: '';
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 30px;
    position: absolute;
    right: -3px;
    background: linear-gradient(to top, #fff, #f2f2f2);
    border: 1px solid #ccc;
    top: -10px;
    transform: all ease 0.4s;
  }
  .sliderHandle:hover:after {
    box-shadow: 0 0 10px rgb(37, 205, 247);
  }
  ${({overrideStyle}) => overrideStyle}
`
Roundy.defaultProps = {
  color: 'purple',
  bgColor: '#ccc',
  max: 100,
  min: 0,
  step: 10,
  sliced: true,
  strokeWidth: 15,
  value: 50, // so we can see some difference
  radius: 100
}
export default Roundy
