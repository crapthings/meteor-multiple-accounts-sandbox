import React from 'react';
import Navigation from './navigation';

import { useDeps, composeWithTracker, composeAll } from 'mantra-core'

const LoginStateTracker = ({ context }, onData) => {
  onData(null, {})
}

class LoginStateComp extends React.Component {
  switchUser = (accountIdx) => evt => {
    const { currentContextId } = this.props.context()
    currentContextId.set(accountIdx)
  }

  render() {
    const { context } = this.props
    const { accounts } = context()

    return (
      <div>
        {accounts.map((account, accountIdx) => (
          <button key={`user-${accountIdx}`} onClick={this.switchUser(accountIdx)}>切换到 {account.name} {account.url}</button>
        ))}
      </div>
    )
  }
}

const LoginState = composeAll(
  composeWithTracker(LoginStateTracker),
  useDeps()
)(LoginStateComp)

const Layout = ({content = () => null }) => (
  <div>
    <LoginState />
    <header>
    <h1>Mantra Voice</h1>
    <Navigation />
    </header>

    <div>
    {content()}
    </div>

    <footer>
    <small>Built with <a href='https://github.com/kadirahq/mantra'>Mantra</a> &amp; Meteor.</small>
    </footer>
  </div>
);

export default Layout;
