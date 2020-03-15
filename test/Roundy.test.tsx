import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Roundy from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Roundy />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
