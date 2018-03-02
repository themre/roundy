import React, { Component } from 'react'
import Roundy from './index'
import styled from 'styled-components'

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
`
class RoundGroup extends Component {
  render() {
    const { sliders, ...rest } = this.props
    const maxSize =
      sliders.reduce(
        (sum, s) => (sum.radius > s.radius ? sum.radius : s.radius),
        100
      ) *
        2 +
      10 //default radius is 100
    return (
      <Wrap style={{ width: maxSize, height: maxSize }} {...rest}>
        {sliders.map(slider => {
          return <Roundy {...slider} />
        })}
      </Wrap>
    )
  }
}

export default RoundGroup
