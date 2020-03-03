/* global Package */

import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { buildRootNode } from './utils'

export function mounter (layoutClass, regions, options) {
  const el = createElement(layoutClass, regions)
  const elHtml = renderToString(el)

  const { rootId, rootProps } = options
  const rootNodeHtml = buildRootNode(rootId, rootProps)
  const html = rootNodeHtml.replace('</div>', elHtml + '</div>')

  if (typeof Package === 'undefined') {
    const error = 'Server side mounting in only available with Meteor.'
    throw new Error(error)
  }

  if (!Package['kadira:flow-router-ssr']) {
    const error = 'FlowRouter SSR is required to mount components in the server.'
    throw new Error(error)
  }

  const FlowRouter = Package['kadira:flow-router-ssr'].FlowRouter
  const ssrContext = FlowRouter.ssrContext.get()
  ssrContext.setHtml(html)
}
