import Post from '../components/post';
import {useDeps, composeWithTracker, composeAll} from 'mantra-core';

export const composer = ({context, postId}, onData) => {
  const {Meteor, Collections, LocalState, _Collections} = context();
  const lastAccount = LocalState.get('lastAccount')
  const targetUserCollections = _Collections[lastAccount]

  if (targetUserCollections.connection.subscribe('posts.single', postId).ready()) {
    const post = targetUserCollections.posts.findOne(postId);
    onData(null, {post});
  } else {
    const post = targetUserCollections.posts.findOne(postId);
    if (post) {
      onData(null, {post});
    } else {
      onData();
    }
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(Post);
