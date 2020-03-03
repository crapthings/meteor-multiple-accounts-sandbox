import { injectDeps } from '@lvfang/react-simple-di'
import { hasOwnProperty } from './utils'

export default class App {
  constructor (context) {
    if (!context) {
      const message = 'Context is required when creating a new app.'
      throw new Error(message)
    }

    this.context = context
    this.actions = {}
    this._routeFns = []
    this.modules = []
  }

  _bindActions (_actions) {
    const actions = {}

    for (const key in _actions) {
      if (hasOwnProperty(_actions, key)) {
        const actionMap = _actions[key]
        const newActionMap = {}
        for (const actionName in actionMap) {
          if (hasOwnProperty(actionMap, actionName)) {
            newActionMap[actionName] = actionMap[actionName].bind(null, this.context)
          }
        }
        actions[key] = newActionMap
      }
    }

    return actions
  }

  bindContext = (context) => {
    console.log('before bind', this.context)
    this.context = context

    console.log('after bind', this.context)

    for (const module of this.modules) {
      const boundedActions = this._bindActions(this.actions)
      this.actions = boundedActions
      console.log(boundedActions)
      module.load(this.context, boundedActions)
    }

    return context
  }

  loadModule (module) {
    this._checkForInit()

    if (!module) {
      const message = 'Should provide a module to load.'
      throw new Error(message)
    }

    if (module.__loaded) {
      const message = 'This module is already loaded.'
      throw new Error(message)
    }

    if (module.routes) {
      if (typeof module.routes !== 'function') {
        const message = 'Module\'s routes field should be a function.'
        throw new Error(message)
      }

      this._routeFns.push(module.routes)
    }

    const actions = module.actions || {}

    this.actions = {
      ...this.actions,
      ...actions
    }

    if (module.load) {
      if (typeof module.load !== 'function') {
        const message = 'module.load should be a function'
        throw new Error(message)
      }

      // This module has no access to the actions loaded after this module.
      const boundedActions = this._bindActions(this.actions)
      module.load(this.context, boundedActions)
    }

    this.modules.push(module)
    module.__loaded = true
  }

  init () {
    this._checkForInit()

    for (const routeFn of this._routeFns) {
      const inject = comp => {
        return injectDeps(this.context, this.actions)(comp)
      }

      routeFn(inject, this.context, this.actions)
    }

    this._routeFns = []
    this.__initialized = true
  }

  _checkForInit () {
    if (this.__initialized) {
      const message = 'App is already initialized'
      throw new Error(message)
    }
  }
}
