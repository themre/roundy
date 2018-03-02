import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

import Component from 'src/'

describe('Roundy', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('mount roundy', () => {
    render(<Component/>, node, () => {
      expect(node.innerHTML).toContain('svg')
    })
  })
})
