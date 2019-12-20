import '/imports/collections'

Posts.remove({})

if (!Posts.findOne()) {
  Posts.insert({ name: 'this is post from server 1' })
}

if (!Meteor.users.findOne()) {
  Accounts.createUser({ username: 'demo', password: 'demo' })
}

Meteor.publish('posts', function() {
  if (!this.userId) return this.stop()
  return Posts.find()
})

Meteor.publish('servers', function() {
  if (!this.userId) return this.stop()
  return Meteor.users.find({ _id: this.userId }, { fields: { services: false } })
})

Meteor.methods({
  'servers.create': function({ url, username, password }) {
    Meteor.users.update(this.userId, { $addToSet: { servers: { url, username, password } } })
  }
})
