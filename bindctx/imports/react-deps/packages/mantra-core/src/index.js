import { useDeps as _useDeps } from '@lvfang/react-simple-di'

import {
  composeAll as _composeAll,
  compose as _compose,
  composeWithTracker as _composeWithTracker,
  setDefaults as _setDefaults,
  setOptions as _setOptions,
  setStubbingMode as _setStubbingMode,
} from '@lvfang/react-komposer'

import App from './app'

// export this module's functions
export const createApp = (...args) => (new App(...args))

// export react-simple-di functions
export const useDeps = _useDeps

// export react-komposer functions
export const composeAll = _composeAll
export const compose = _compose
export const composeWithTracker = _composeWithTracker
export const setDefaults = _setDefaults
export const setOptions = _setOptions
export const setStubbingMode = _setStubbingMode
