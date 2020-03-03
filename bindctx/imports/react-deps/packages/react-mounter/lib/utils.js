function hasOwnProperty (props, key) {
  return Object.prototype.hasOwnProperty.call(props, key)
}

export function buildRootNode (rootId, rootProps) {
  const props = { ...rootProps }
  props.id = rootId

  if (props.className) {
    props.class = props.className
    delete props.className
  }

  let propsString = ''

  for (const key in props) {
    if (!hasOwnProperty(props, key)) {
      continue
    }

    const value = props[key]
    propsString += ` ${key}="${value}"`
  }

  return `<div${propsString}></div>`
}
