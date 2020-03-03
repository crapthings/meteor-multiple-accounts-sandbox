import { setStubbingMode as _setStubbingMode, stub as _stub } from '@lvfang/react-stubber'
import { composeWithTracker as _composeWithTracker } from './composers'
import { compose as _compose, setOptions as _setOptions } from './compose'

export function setDefaults (mainOptions = {}) {
  return function (dataLoader, otherOptions = {}) {
    const options = { ...mainOptions, ...otherOptions }
    return _compose(dataLoader, options)
  }
}

export function merge (...enhancers) {
  // TODO: Try to get a single HOC merging all the composers together
  return function (Child) {
    return enhancers.reduce((C, enhancer) => {
      return enhancer(C)
    }, Child)
  }
}

export const setStubbingMode = _setStubbingMode
export const stub = _stub
export const composeAll = merge
export const compose = _compose
export const setOptions = _setOptions
export const composeWithTracker = _composeWithTracker
