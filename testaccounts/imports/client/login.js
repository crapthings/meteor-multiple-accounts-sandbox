export default class Login extends Component {
  submit = evt => {
    evt.preventDefault()
    Meteor.loginWithPassword(evt.target[0].value, evt.target[1].value)
  }

  render() {
    return (
      <form onSubmit={this.submit}>
        <input type='text' placeholder='username' defaultValue='demo' />
        <input type='password' placeholder='password' defaultValue='demo' />
        <input type='submit' />
      </form>
    )
  }
}
