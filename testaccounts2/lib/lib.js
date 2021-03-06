_ = require('lodash')
faker = require('faker')

React = require('react')
Component = React.Component

withTracker = require('meteor/react-meteor-data').withTracker

Loader = Children => ({ ready, ...props }) => {
  if (ready) {
    return <Children { ...props } />
  } else {
    return <div>loading</div>
  }
}

Auths = {}
