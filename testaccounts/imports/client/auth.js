import Login from './login'

export const AuthTracker = () => {
  const loggingIn = Meteor.loggingIn()
  const userId = Meteor.userId()
  return { loggingIn, userId }
}

export class AuthComp extends Component {
  render() {
    const { loggingIn, userId, children } = this.props

    if (loggingIn) {
      return <div>Logging In</div>
    }

    if (userId) {
      return children
    } else {
      return <Login />
    }
  }
}
