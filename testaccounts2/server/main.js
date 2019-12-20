import '/imports/collections'

Posts.remove({})

if (!Posts.findOne()) {
  const data = _.times(20, n => ({
    _id: Random.id(),
    name: faker.lorem.sentences(),
  }))

  Posts.rawCollection().insertMany(data)
}

if (!Meteor.users.findOne()) {
  Accounts.createUser({ username: 'demo', password: 'demo' })
}

Meteor.publish('posts', function() {
  if (!this.userId) return this.stop()
  this.added('hello', 'id', { test: 1 })
  return [Posts.find(), ]
})

Meteor.publish('servers', function() {
  if (!this.userId) return this.stop()
  return Meteor.users.find({ _id: this.userId }, { fields: { services: false } })
})

Meteor.methods({
  'servers.create': function({ url, username, password }) {
    Meteor.users.update(this.userId, { $addToSet: { servers: { url, username, password } } })
  },

  'test'() {
    if (!this.userId)
      throw 1

    return 1
  }
})

