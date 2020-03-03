import _ from 'lodash'
import React from 'react'
import shallowEqual from 'shallowequal'
import pick from 'lodash.pick'
import { mayBeStubbed } from '@lvfang/react-stubber'
import {
  inheritStatics,
  isStateless,
  isFunction,
  isArray
} from './utils'

let defaultOptions = {
  errorHandler: error => { throw error },
  loadingHandler: () => null,
  context: {},
  pure: false,
  propsToWatch: null,
  shouldTrack: null,
  shouldUpdate: null,
  withRef: true
}

export function setOptions (options = {}) {
  defaultOptions = {
    ...defaultOptions,
    ...options
  }

  return defaultOptions
}

export function compose (tracker, options = {}) {
  return function (Comp) {
    options = {
      ...defaultOptions,
      ...options
    }

    const {
      errorHandler,
      loadingHandler,
      context,
      pure,
      propsToWatch,
      shouldTrack,
      shouldUpdate
    } = options

    let {
      withRef
    } = options

    if (isStateless(Comp)) {
      withRef = false
    }

    class Container extends React.Component {
      state = {
        error: null
      }

      componentDidMount () {
        this.track(this.props)
      }

      shouldComponentUpdate (nextProps, nextState) {
        if (isFunction(shouldUpdate)) {
          return shouldUpdate(this.props, nextProps)
        }

        if (!pure) {
          return true
        }

        return (
          this.state.error !== nextState.error
            || !_.isEqual(this.state.data, nextState.data)
            || !_.isEqual(this.props, nextProps)
        )
      }

      componentDidUpdate () {
        this.track(this.props)
      }

      componentWillUnmount () {
        this.unmounted = true
        this.untrack()
      }

      shouldTrack = props => {
        const firstRun = !this.cachedProps

        const nextProps = isArray(propsToWatch)
          ? pick(props, propsToWatch)
          : props

        const currentProps = this.cachedProps || {}

        this.cachedProps = nextProps

        if (firstRun) {
          return true
        }

        if (isFunction(shouldTrack)) {
          return shouldTrack(currentProps, nextProps)
        }

        if (isArray(propsToWatch) && propsToWatch.length === 0) {
          return false
        }

        return !shallowEqual(currentProps, nextProps)
      }

      track = props => {
        if (!this.shouldTrack(props)) {
          return
        }

        const onData = (error, data) => {
          if (this.unmounted) {
            throw new Error(`Trying to set data after component(${Container.displayName}) has unmounted.`)
          }

          this.setState({ error, data })
        }

        this.untrack()
        this.stopTracker = tracker(props, onData, context)
      }

      untrack = () => {
        if (this.stopTracker) {
          this.stopTracker()
        }
      }

      setChildRef = ref => {
        this.child = ref
      }

      render () {
        const { props } = this
        const { error, data } = this.state

        if (error) {
          return errorHandler(error)
        }

        if (!data) {
          return loadingHandler()
        }

        const nextProps = { ...props, ...data }

        return (
          withRef
            ? <Comp ref={this.setChildRef} {...nextProps} />
            : <Comp {...nextProps} />
        )
      }
    }

    inheritStatics(Container, Comp)

    return mayBeStubbed(Container)
  }
}
