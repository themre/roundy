import React, { Component } from 'react'
import { render } from 'react-dom'

import Roundy from '../../src'
import RoundyGroup from '../../src/RoundyGroup'

class Demo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      max: 100,
      min: 0,
      color:'#00ff00',
      step: 10,
      radius: 100
    }
  }
  render() {
    const {max, min, step, radius, color} = this.state
    return (
      <div>
        <h1>roundy Demo</h1>
        <p>Simple rounded slider with some basic options:</p>
        <ul>
          <li>radius</li>
          <li>step</li>
          <li>color</li>
          <li>max</li>
          <li>min</li>
        </ul>
        <h3>Tweak it</h3>
        Max <input value={max} onChange={e => this.setState({max: e.target.value})} type='number' min={100} max={1000} />
        Min <input value={min} onChange={e => this.setState({min: e.target.value})} type='number' min={0} max={50} />
        Color <input value={color} onChange={e => this.setState({color: e.target.value})} type='color' />
        Radius <input value={radius} onChange={e => this.setState({radius: e.target.value})} type='number' min={40} max={300} />
        <Roundy value={50} radius={parseInt(radius)} min={parseInt(min)} max={parseInt(max)} color={color} overrideStyle={`
          .sliderHandle:after {
            background: pink;
          }
        `} />
        <h1>roundy group</h1>
        <p>Use array of objects to easily create stacked group of roundy sliders.</p>
        <pre>{
          `<RoundyGroup sliders={[
              { value: 30, step: 10, id: 'mjaw', max: 50,  radius: 60, color: 'blueviolet', onChange:(val, props) => console.log(props) },
              { value: 30, step: 10, max: 50, radius: 100 },
              { value: 100, step: 20, max: 200, color: 'orange', radius: 140, sliced: false, step: 1 }
            ]} />`
        }</pre>
        <RoundyGroup
          sliders={[
            { value: 30, step: 10, id: 'mjaw', max: 50,  radius: 60, color: 'blueviolet', onChange:(val, props) => console.log(props) },
            { value: 30, step: 10, max: 50, radius: 100 },
            { value: 100, step: 20, max: 200, color: 'orange', radius: 140, sliced: false, step: 1 }
          ]}
        />
      </div>
    )
  }
}

render(<Demo />, document.querySelector('#demo'))
