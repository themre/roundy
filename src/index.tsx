import * as React from 'react';
import { useDrag } from 'react-use-gesture';
import hexoid from 'hexoid';
import Style from './Style';
import { InternalRoundyProps } from 'types';
import {
  valueToAngle,
  getCenter,
  getAngle,
  angleToValue,
  limitValue,
  getArc,
} from './utils';

const classNamePrefix = 'RoundSlider';

const defaultProps: InternalRoundyProps = {
  color: 'purple',
  bgColor: '#ccc',
  max: 100,
  min: 0,
  stepSize: 0,
  // by default we want smooth sliding
  steps: 0,
  sliced: true,
  strokeWidth: 35,
  rotationOffset: 0,
  arcSize: 360,
  value: 50,
  radius: 100,
};

interface StateType {
  value: number;
  angle: number;
}

export interface MainRoundyProps extends Partial<InternalRoundyProps> {
  render?: (state: StateType, props: InternalRoundyProps) => React.ReactNode;
  onAfterChange?: (state: any, props: any) => void;
  onChange?: (state: any, props: any) => void;
  style?: any;
  allowClick?: boolean;
}


function Roundy(optProps: MainRoundyProps) {
  const props = { ...defaultProps, ...optProps };
  const uniqueId = hexoid(7)();
  const {
    color,
    bgColor,
    max,
    min,
    steps,
    stepSize,
    strokeWidth,
    radius,
    sliced,
    style,
    arcSize,
    rotationOffset,
    onAfterChange,
    allowClick,
    render,
    onChange,
  } = props;

  const _wrapper = React.useRef(null);
  const _handle = React.useRef(null);

  const [state, setAll] = React.useState<StateType>({
    value: props.value,
    angle: valueToAngle(props.value, props),
  });

  const bind = useDrag(({ down, xy: [x, y] }) => {
    setValueAndAngle(x, y);
    if (!down) {
      onAfterChange && onAfterChange(state, props);
    }
  });

  React.useEffect(() => {
    setAll({
      value: props.value,
      angle: valueToAngle(props.value, props),
    });
  }, [props.value]);

  const setState = (obj: Partial<StateType>) =>
    setAll(prev => ({ ...prev, ...obj }));
  const isDrag = React.useRef(false);
  const { angle } = state;
  const segments = steps || (stepSize ? Math.floor((max - min) / stepSize) : 0);
  const maskName = `${classNamePrefix}_${uniqueId}`;
  const size = radius * 2;
  const styleRotation = {
    transform: `rotate(${rotationOffset}deg)`,
    transformOrigin: '50% 50%',
  };

  const setValueAndAngle = (x: number, y: number) => {
    const { left, top } = getCenter(_wrapper, radius);
    const dX = x - left;
    const dY = y - top;
    const { value, angle } = stepRounding(getAngle(dY, dX, rotationOffset));
    setState({ value, angle });
    onChange && onChange(value, props);
  };

  const updateOnClick = event => {
    const { clientX, clientY } = event;
    let eX = clientX,
      eY = clientY;

    eX = clientX;
    eY = clientY;
    setValueAndAngle(eX, eY);
  };

  const getMaskLine = (segments: number, index: number) => {
    const { radius, arcSize } = props;
    const val = (arcSize / segments) * index + 180;
    const rotateFunction =
      'rotate(' + val.toString() + ',' + radius + ',' + radius + ')';
    return (
      <g key={index} transform={rotateFunction}>
        <line
          x1={radius}
          y1={radius}
          x2={radius * 2}
          y2={radius}
          style={{
            stroke: 'rgb(0,0,0)',
            strokeWidth: 2,
          }}
        />
      </g>
    );
  };

  const stepRounding = (degree: number) => {
    const { stepSize, steps, min, max, arcSize } = props;
    const step = stepSize || (steps ? (max - min) / steps : 1);
    const { angle: oldAngle } = state;
    let angToValue = min;
    if (!isDrag.current) {
      angToValue = angleToValue(degree, props);
    } else {
      angToValue = angleToValue(
        oldAngle > arcSize - 20 && degree < arcSize / 4
          ? Math.max(degree, arcSize)
          : oldAngle < 20 && degree > arcSize - 20
          ? Math.min(degree, 0)
          : degree,
        props
      );
    }
    let value;
    const remain = (angToValue - min) % step;
    const currVal = angToValue - remain;
    const nextVal = limitValue(currVal + step, min, max);
    const preVal = limitValue(currVal - step, min, max);
    if (angToValue >= currVal)
      value = angToValue - currVal < nextVal - angToValue ? currVal : nextVal;
    else {
      value = currVal - angToValue > angToValue - preVal ? currVal : preVal;
    }
    value = Math.round(value);
    const ang = valueToAngle(value, props);
    return { value, angle: ang };
  };
  return (
    <Style
      className="roundy"
      onClick={updateOnClick}
      style={allowClick ? style : { ...(style || {}), pointerEvents: 'none' }}
    >
      {render ? (
        <div
          className="customWrapper"
          ref={_wrapper}
          style={{ width: size, height: size, display: 'inline-block' }}
        >
          {render(state, props)}
        </div>
      ) : (
        <React.Fragment>
          <svg ref={_wrapper} width={size} height={size}>
            {sliced && (
              <defs>
                <mask
                  id={maskName}
                  maskUnits="userSpaceOnUse"
                  style={styleRotation}
                >
                  <rect x={0} y={0} width={size} height={size} fill="white" />
                  {Array.from({ length: segments }).map((_, i) => {
                    return getMaskLine(segments, i);
                  })}
                </mask>
              </defs>
            )}

            <path
              fill="transparent"
              strokeDashoffset="0"
              strokeWidth={strokeWidth}
              stroke={bgColor}
              mask={sliced ? `url(#${maskName})` : undefined}
              style={styleRotation}
              d={getArc(Math.min(arcSize, 359.9999), 0, props)}
            />
            <path
              fill="none"
              strokeWidth={strokeWidth}
              stroke={color}
              mask={sliced ? `url(#${maskName})` : undefined}
              style={styleRotation}
              d={getArc(Math.min(angle, 359.9999), 0, props)}
            />
          </svg>
          <div
            ref={_handle}
            className="sliderHandle"
            {...bind()}
            style={{
              transform: `rotate(${angle + rotationOffset}deg) scaleX(-1)`,
            }}
          />
        </React.Fragment>
      )}
    </Style>
  );
}

export default Roundy;
