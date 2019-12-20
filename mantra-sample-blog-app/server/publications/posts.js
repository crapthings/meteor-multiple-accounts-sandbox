import {Posts, Comments} from '/lib/collections';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

export default function () {
  Meteor.publish('posts.list', function () {
    const userId = this.userId
    const selector = { userId };
    const options = {
      fields: {_id: 1, title: 1, userId: 1},
      sort: {createdAt: -1},
      limit: 10
    };

    const cursor = Posts.find(selector, options)

    this.onStop(() => {
      console.log('userId stopped subscription')
    })

    return cursor
  });

  Meteor.publish('posts.single', function (postId) {
    check(postId, String);
    const selector = {_id: postId};
    return Posts.find(selector);
  });

  Meteor.publish('posts.comments', function (postId) {
    check(postId, String);
    const selector = {postId};
    return Comments.find(selector);
  });
}
