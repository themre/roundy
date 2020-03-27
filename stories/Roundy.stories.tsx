import React, { useState } from 'react';
import Roundy from '../src';

export default {
  title: 'Roundy',
};

export const toStorybook = () => {
  const [val, setVal] = useState(30)
  return <Roundy
    arcSize={300}
    max={100}
    stepSize={10}
    value={val}
    onChange={setVal}
    allowClick={true}
    onAfterChange={(a, b, c) => console.log(a, c, b)}
  />
}
);

toStorybook.story = {
  name: 'Basic behaviour',
};

export const renderProps = () => (
  <Roundy
    value={50}
    render={({ value: val2 }, props) => (
      <div
        style={{
          width: `${(val2 / props.max) * 100}%`,
          background: 'red',
          margin: '0 auto',
          borderRadius: val2,
          height: `${(val2 / props.max) * 100}%`,
        }}
      >
        {val2}
      </div>
    )}
  />
);
