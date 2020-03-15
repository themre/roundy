import React from 'react';
import Roundy from '../src';

export default {
  title: 'Roundy',
};

export const toStorybook = () => <Roundy arcSize={300} max={100} stepSize={10} value={80} allowClick={true} />;

toStorybook.story = {
  name: 'Basic behaviour',
};
