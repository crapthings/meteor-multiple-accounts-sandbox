import _ from 'lodash'
import {Posts, Users} from '/lib/collections';

export default function () {
  Users.remove({})
  Posts.remove({})

  Accounts.createUser({ username: 'demo', password: 'demo', profile: { name: '金正恩' } })
  Accounts.createUser({ username: 'demo1', password: 'demo1', profile: { name: '金正日' } })

  const users = Users.find().fetch()

  const posts =  _.times(20, n => {
    const user = _.sample(users)

    return {
      _id: Random.id(),
      title: `This is the post title you can only see it with user ${user.profile.name}`,
      content: `Post content is great!`,
      userId: user._id,
    }
  })

  Posts.rawCollection().insertMany(posts)
}
