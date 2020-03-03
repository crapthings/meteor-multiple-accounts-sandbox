import React, { Component } from 'react'
import { composeAll, composeWithTracker, useDeps } from '@lvfang/mantra-core'

const LayoutTracker = function (props, onData) {
  onData(null, {})
}

class Layout extends Component {
  render() {
    return this.props.children()
  }
}

export const LayoutContainer = composeAll(
  composeWithTracker(LayoutTracker),
  useDeps()
)(Layout)
