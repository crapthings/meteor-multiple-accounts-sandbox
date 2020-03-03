import {createApp} from '/imports/react-deps/packages/mantra-core/src';
import initContext from './configs/context';

// modules
import coreModule from './modules/core';
import commentsModule from './modules/comments';

// port 3100 代码不一样
Reload._onMigrate(function() {
  return [false]
})

// mock accounts here
localStorage.setItem('contextId', 0)

localStorage.setItem('accounts', JSON.stringify([
  { name: '金正恩', username: 'demo', password: 'demo', url: 'http://localhost:3000' },
  { name: '金正日', username: 'demo1', password: 'demo1', url: 'http://localhost:3000' },
  { name: '金日成', username: 'demo', password: 'demo', url: 'http://localhost:3100' },
  { name: '特朗普', username: 'demo2', password: 'demo2', url: 'http://localhost:3100' },
]))

const contextId = parseInt(localStorage.getItem('contextId'))
const currentContextId = new ReactiveVar(contextId)
const accounts = JSON.parse(localStorage.getItem('accounts'))
const contexts = accounts.map(account => initContext({
  currentContextId,
  accounts,
  account,
}))

// init context
const context = contexts[contextId];

// create app
const app = createApp(context);
app.loadModule(coreModule);
app.loadModule(commentsModule);
app.init();

Meteor.startup(function () {
  let firstRun = true

  Tracker.autorun(() => {
    const ctxId = currentContextId.get()
    if (firstRun) return
    const ctx = app.bindContext(contexts[ctxId])
    const { account } = ctx
    console.log(account)

    Meteor.connection._stream.disconnect()
    Meteor.connection._stream._changeUrl(account.url)
    Meteor.connection._stream.reconnect()

    // Meteor.disconnect()
    // Meteor.connect(account.url)
    Meteor.loginWithPassword(account.username, account.password, console.log)
  })

  firstRun = false
})
