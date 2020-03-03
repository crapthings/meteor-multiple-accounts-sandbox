import _ from 'lodash'
import faker from 'faker'

const Posts = new Mongo.Collection('posts')

Meteor.publish('posts1', function () {
  this.unblock()
  Meteor._sleepForMs(2000)
  return Posts.find()
})

Meteor.publish('posts2', function () {
  this.unblock()
  Meteor._sleepForMs(1000)
  return Posts.find()
})

Meteor.startup(function () {
  if (Posts.findOne()) return

  const posts = _.times(20, n => ({
    title: faker.lorem.sentence(),
  }))

  Posts.rawCollection().insertMany(posts)
})
