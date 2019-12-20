import { AccountsClient } from 'meteor/accounts-base'

import Login from './login'

export const AuthTracker = () => {
  const loggingIn = Meteor.loggingIn()
  const userId = Meteor.userId()
  const ready = Meteor.subscribe('servers').ready()
  const currentUser = Meteor.user()
  return { loggingIn, userId, ready, currentUser }
}

export class AuthComp extends Component {
  render() {
    const { loggingIn, userId, ready, currentUser, children } = this.props

    if (loggingIn) {
      return <div>Logging In</div>
    }

    if (userId && ready) {
      loginOtherServers(currentUser)
      return children
    } else {
      return <Login />
    }
  }
}

function loginOtherServers(currentUser) {
  const { servers = [] } = currentUser
  for (const server of servers) {
    const { url, username, password } = server
    if (Auths[url]) continue
    const account = Auths[url] = new AccountsClient({ ddpUrl: url })
    account.callLoginMethod({
      methodArguments: [{
        user: { username },
        password
      }],
      userCallback: (err, result) => {}
    })
  }
}
