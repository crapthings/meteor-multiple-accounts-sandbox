import PostList from '../components/postlist';
import {useDeps, composeWithTracker, composeAll} from 'mantra-core';

export const composer = ({context}, onData) => {
  const { Meteor, Collections, LocalState, _Collections } = context();
  const lastAccount = LocalState.get('lastAccount')
  const targetUserCollections = _Collections[lastAccount]
  const targetUserId = targetUserCollections.users.userId()

  if (targetUserCollections.connection.subscribe('posts.list').ready()) {
    const posts = targetUserCollections.posts.find({ userId: targetUserId }).fetch();
    onData(null, { posts, lastAccount });
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(PostList);
