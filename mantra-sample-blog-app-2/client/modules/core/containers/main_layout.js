import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import Main_Layout from '../components/main_layout'

export const composer = ({ context }, onData) => {
  const { LocalState } = context()
  const _accounts = LocalState.get('accounts')
  const _lastAccount = LocalState.get('lastAccount')
  const accounts = _accounts.map(account => {
    const connection = DDP.connect(account.url)
    account.collection = new Mongo.Collection('user', { connection })
  })
  console.log(_accounts, _lastAccount)

  onData(null, {})
}

export const depsMapper = (context, actions) => ({
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Main_Layout)
