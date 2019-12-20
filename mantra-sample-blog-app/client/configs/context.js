import * as Collections from '/lib/collections';
import {Meteor} from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {ReactiveDict} from 'meteor/reactive-dict';
import {Tracker} from 'meteor/tracker';
import { AccountsClient } from 'meteor/accounts-base'

export default function () {
  const lastAccount = JSON.parse(localStorage.getItem('lastAccount'))

  const accounts = JSON.parse(localStorage.getItem('accounts')).map(account => ({
    failed: new ReactiveVar(false),
    ...account
  }))

  const LocalState = new ReactiveDict({ lastAccount })

  const _Collections = accounts.map((_account, namespaceIdx) => {
    const mongo = { ...Mongo }
    const connection = DDP.connect(_account.url)
    const account = new AccountsClient({ connection, namespaceIdx: 'u' + namespaceIdx })
    const posts = new Mongo.Collection('posts', { connection })
    loginWithPassword(account, _account)
    return { connection, users: account, posts }
  })

  console.log(_Collections)

  Tracker.autorun(() => {
    const lastAccount = LocalState.get('lastAccount')
    localStorage.setItem('lastAccount', lastAccount)
  })

  return {
    Meteor,
    FlowRouter,
    Collections,
    LocalState,
    Tracker,

    accounts,
    _Collections,
  };
}

function loginWithPassword(account, _account) {
  account.callLoginMethod({
    methodArguments: [{
      user: { username: _account.username },
      password: Accounts._hashPassword(_account.password)
    }],
    userCallback: (err, result) => {
      if (err) {
        _account.failed.set(true)
      }
    }
  })
}
