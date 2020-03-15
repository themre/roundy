import * as React from 'react';
import Roundy, { MainRoundyProps } from './index';
import styled from 'styled-components';

const Wrap = styled.div`
  position: relative;
  display: inline-block;
  width: 300px;
  height: 300px;
  > * {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;
type RoundyGroupProps = {
  sliders: MainRoundyProps[];
};
function RoundGroup(props: RoundyGroupProps) {
  const { sliders, ...rest } = props;
  const maxSize =
    sliders.reduce((sum, s) => (sum > s.radius ? sum : s.radius), 100) * 2 + 10; //default radius is 100
  return (
    <Wrap style={{ width: maxSize, height: maxSize }} {...rest}>
      {sliders.map((slider, i) => {
        return <Roundy key={i} {...slider} />;
      })}
    </Wrap>
  );
}

export default RoundGroup;
