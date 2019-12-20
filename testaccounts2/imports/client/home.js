import PostsContainer from './posts'

const ServersTracker = () => {
  const { servers = [] } = Meteor.user()
  return { ready: true, servers }
}

class ServersList extends Component {
  switchServer = server => evt => {
    console.log(server)
    const { url, username, password } = server
    Meteor.disconnect()
    Meteor.connect(url)
    const userId = Auths[url]?.userId()
    Posts._connection.setUserId(userId)
    Posts._connection._stream.disconnect()
    Posts._connection._stream._changeUrl(url)
    Posts._connection._stream.reconnect()
    console.log(userId)
    // Meteor.loginWithPassword(username, password)
  }

  submit = evt => {
    evt.preventDefault()
    const url = evt.target[0].value
    const username = evt.target[1].value
    const password = Accounts._hashPassword(evt.target[2].value)
    Meteor.call('servers.create', { url, username, password })
  }

  render() {
    const { servers } = this.props
    return (
      <div>
        <div>{servers.map((server, idx) => (
          <div key={`server-${idx}`} style={{ backgroundColor: Auths[server.url]?.userId() && 'green' }}>
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
