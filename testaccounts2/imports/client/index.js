import { render } from 'react-dom'

import { AuthTracker, AuthComp } from './auth'
import Home from './home'

const Root = withTracker(AuthTracker)(AuthComp)

Meteor.startup(function () {
  render((
    <Root>
      <Home />
    </Root>
  ), document.getElementById('root'))
})
