import { AccountsClient } from 'meteor/accounts-base'

window.AccountsClient = AccountsClient

import PostsContainer from './posts'

const ServersTracker = () => {
  const ready = Meteor.subscribe('servers').ready()
  console.log(ready)
  const { servers = [] } = Meteor.user() || {}
  return { ready, servers }
}

class ServersList extends Component {
  switchServer = server => evt => {
    const { url, username, password, domain } = server

    const connection = DDP.connect(url)

    CurrentAuth = new AccountsClient({ connection })

    console.log(connection)

    CurrentAuth.callLoginMethod({
      methodArguments: [{
        user: { username },
        password
      }],
      userCallback: (err, result) => {
        console.log(result)
        const lastLoginToken = localStorage.getItem('Meteor.loginToken:' + url)
        localStorage.setItem('lastLoginToken', lastLoginToken)

        Meteor.connection._stream.disconnect()
        Meteor.connection._stream._changeUrl(url)
        Meteor.connection._stream.reconnect()
      }
    })

    // Meteor.loginWithPassword(username, password)
  }

  submit = evt => {
    evt.preventDefault()
    const url = evt.target[0].value
    const username = evt.target[1].value
    const password = Accounts._hashPassword(evt.target[2].value)
    Meteor.call('servers.create', { url, username, password })
  }

  // onLoad = server => {
  //   const { url, username, password } = server
  //   const connection = DDP.connect(url)
  //   const account = new AccountsClient({ connection })
  //   account.callLoginMethod({
  //     methodArguments: [{
  //       user: { username },
  //       password: Accounts._hashPassword(password)
  //     }],
  //     userCallback: (err, result) => {
  //       connection.subscribe('posts', {
  //         onReady: () => {
  //           Tracker.autorun(() => {
  //             console.log(Posts.find({}).fetch())
  //           })
  //         }
  //       })
  //     }
  //   })
  // }

  render() {
    const { servers } = this.props
    return (
      <div>
        <div>{servers.map((server, idx) => (
          <div key={`server-${idx}`}>
            <button onClick={this.switchServer(server)}>subscribe to {server.url}</button>
          </div>
        ))}</div>
        <form onSubmit={this.submit}>
          <input type='text' placeholder='server url' autoComplete='new-password' />
          <input type='text' placeholder='username' autoComplete='new-password' />
          <input type='password' placeholder='password' autoComplete='new-password' />
          <input type='submit' />
        </form>
      </div>
    )
  }
}

const ServersContainer = withTracker(ServersTracker)(ServersList |> Loader)

export default class Home extends Component {
  render() {
    return (
      <div id='home'>
        <ServersContainer />
        <PostsContainer />
      </div>
    )
  }
}
