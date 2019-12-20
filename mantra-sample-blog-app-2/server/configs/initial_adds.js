import {Posts} from '/lib/collections';

export default function () {
  if (!Meteor.users.findOne({ username: 'demo' })) {
    Accounts.createUser({ username: 'demo', password: 'demo' })
  }

  if (!Meteor.users.findOne({ username: 'demo2' })) {
    Accounts.createUser({ username: 'demo2', password: 'demo2' })
  }

  const user1 = Meteor.users.findOne({ username: 'demo' })
  const user2 = Meteor.users.findOne({ username: 'demo2' })

  const userIds = [user1._id, user2._id]

  Posts.remove({})

  if (!Posts.findOne()) {
    for (let lc = 1; lc <= 100; lc++) {
      const title = `This is the post title from server 2: ${lc}`;
      const content = `Post ${lc}'s content is great!`;
      const userId = _.sample(userIds)
      Posts.insert({title, content,userId});
    }
  }
}
