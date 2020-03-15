import React from 'react';
import RoundyGroup from '../src/RoundyGroup';

export default {
  title: 'Roundy Group',
};

export const toStorybook = () => (
  <RoundyGroup
    sliders={[
      {
        value: 30,
        stepSize: 4,
        id: 'mjaw',
        max: 50,
        strokeWidth: 20,
        radius: 55,
        color: 'blueviolet',
        onChange: (val, props) => console.log(props),
      },
      { value: 30, stepSize: 10, max: 50, radius: 100 },
      {
        value: 100,
        step: 20,
        max: 200,
        color: 'orange',
        radius: 140,
        // sliced: false
      },
    ]}
  />
);

toStorybook.story = {
  name: 'Basic behaviour',
};
