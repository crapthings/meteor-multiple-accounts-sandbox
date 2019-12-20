import { AccountsClient } from 'meteor/accounts-base'
import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import SwitchPanel from '../components/switch'

export const composer = ({ context }, onData) => {
  const { LocalState, _Collections, accounts: _accounts } = context()

  const accounts = _accounts.map((account, accountIdx) => {
    const collection = _Collections[accountIdx].users
    account.userId = collection?.userId()
    account.failedStatus = account.failed.get()
    return account
  })

  const lastAccount = LocalState.get('lastAccount')

  onData(null, { accounts, lastAccount })
}

export const depsMapper = (context, actions) => ({
  changeServer: actions.accounts.changeServer,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(SwitchPanel)
