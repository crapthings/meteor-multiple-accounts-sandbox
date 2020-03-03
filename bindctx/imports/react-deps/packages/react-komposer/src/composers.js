import { compose } from './compose'

export const composeWithTracker = (reactiveFn, options) => {
  const tracker = (props, onData, context) => {
    let trackerCleanup

    const handler = Tracker.nonreactive(() => {
      return Tracker.autorun(() => {
        trackerCleanup = reactiveFn(props, onData, context)
      })
    })

    return () => {
      if (typeof (trackerCleanup) === 'function') {
        trackerCleanup()
      }

      return handler.stop()
    }
  }

  return compose(tracker, options)
}
