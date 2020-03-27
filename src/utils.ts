import { InternalRoundyProps } from "types";

const DEGREE_IN_RADIANS = Math.PI / 180;

export const valueToAngle = (value: number = 0, props: InternalRoundyProps) => {
  const { max, min, arcSize } = props;
  const angle = ((value - min) / (max - min)) * arcSize;
  return angle;
};

export const getArc = (
  startAngle: number,
  endAngle: number,
  props: InternalRoundyProps
) => {
  let { radius, strokeWidth } = props;
  const pathRadius = radius - strokeWidth / 2;
  const start = polarToCartesian(pathRadius, startAngle, radius);
  const end = polarToCartesian(pathRadius, endAngle, radius);
  const largeArcFlag = startAngle <= 180 ? 0 : 1;
  return `M ${start} A ${pathRadius} ${pathRadius} 0 ${largeArcFlag} 0 ${end}`;
};

const polarToCartesian = (
  pathRadius: number,
  angle: number,
  radius: number
) => {
  const angleInRadians = (angle - 180) * DEGREE_IN_RADIANS;

  const x = radius + pathRadius * Math.cos(angleInRadians);
  const y = radius + pathRadius * Math.sin(angleInRadians);

  return x + ' ' + y;
};

export const getCenter = (
  node: React.MutableRefObject<HTMLDivElement>,
  radius: number
) => {
  var rect = node.current.getBoundingClientRect();
  return {
    top: rect.top + radius,
    left: rect.left + radius,
  };
};

export const limitValue = (value: number, min: number, max: number) => {
  if (value < min) value = min;
  if (value > max) value = max;
  return value;
};

const radToDeg = (rad: number) => {
  return rad * (180 / Math.PI);
};

export const getAngle = (y: number, x: number, rotationOffset: number) => {
  let angle = radToDeg(Math.atan2(y, x)) + 180 - rotationOffset;
  if (angle > 360) {
    angle = angle - 360;
  }
  if (angle < 0) {
    angle = 360 + angle;
  }
  return angle;
};

export const angleToValue = (angle: number, props: InternalRoundyProps) => {
  const { min, max, arcSize } = props;
  const v = (angle / arcSize) * (max - min) + min;
  return v;
};