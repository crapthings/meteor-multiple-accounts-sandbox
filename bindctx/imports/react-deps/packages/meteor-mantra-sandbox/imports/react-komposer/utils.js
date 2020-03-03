import hoistStatics from 'hoist-non-react-statics'

export function inheritStatics (Container, ChildComponent) {
  const childDisplayName = ChildComponent.displayName || ChildComponent.name || 'ChildComponent'

  Container.displayName = `Container(${childDisplayName})`

  return hoistStatics(Container, ChildComponent)
}

export function isStateless ({ prototype }) {
  return !(prototype && prototype.render)
}

export function isFunction (fn) {
  return fn && Object.prototype.toString.call(fn) === '[object Function]'
}

export function isArray (fn) {
  return fn && Object.prototype.toString.call(fn) === '[object Array]'
}
