import styled from 'styled-components'

export const Wrapper = styled.div`
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
    width: ${({thumbSize}) => thumbSize}px;
    height: ${({thumbSize}) => thumbSize}px;
    border-radius: 30px;
    position: absolute;
    right: ${({strokeWidth, thumbSize}) => Math.ceil(strokeWidth / 2) - (thumbSize / 2)}px;
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