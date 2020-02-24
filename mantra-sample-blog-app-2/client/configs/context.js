import * as Collections from '/lib/collections';
import {Meteor} from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {ReactiveDict} from 'meteor/reactive-dict';
import {Tracker} from 'meteor/tracker';
import { AccountsClient } from 'meteor/accounts-base'

export default function () {
  // 演示用数据，这部分应该自己存储登录用 token 或者密码
  localStorage.setItem('lastAccount', 0)

  localStorage.setItem('accounts', JSON.stringify([
    { username: 'demo', password: 'demo', url: 'http://localhost:3000' },
    { username: 'demo1', password: 'demo1', url: 'http://localhost:3000' },
    { username: 'demo', password: 'demo', url: 'http://localhost:3100' },
    { username: 'demo2', password: 'demo2', url: 'http://localhost:3100' },
  ]))

  //
  Meteor._localStorage.setItem('color', 'red', 'u0')
  Meteor._localStorage.setItem('color', 'blue', 'u1')
  Meteor._localStorage.setItem('color', 'green', 'u2')
  Meteor._localStorage.setItem('color', 'purple', 'u3')

  const lastAccount = JSON.parse(localStorage.getItem('lastAccount'))

  const accounts = (JSON.parse(localStorage.getItem('accounts')) || []).map(account => ({
    failed: new ReactiveVar(false),
    ...account
  }))

  const LocalState = new ReactiveDict({ lastAccount })

  const _Collections = accounts.map((_account, namespace) => {
    const mongo = { ...Mongo }
    const connection = DDP.connect(_account.url)
    const account = new AccountsClient({ connection, namespace: 'u' + namespace })
    const posts = new Mongo.Collection('posts', { connection })
    loginWithPassword(account, _account)
    return { connection, users: account, posts }
  })

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
