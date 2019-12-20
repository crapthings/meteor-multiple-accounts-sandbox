import { AccountsClient } from 'meteor/accounts-base'
import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import Main_Layout from '../components/main_layout'

export const composer = (props, onData) => {
  onData(null, {})
}

export const depsMapper = (context, actions) => ({
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Main_Layout)
