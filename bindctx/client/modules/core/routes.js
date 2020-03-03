import React from 'react';
import {mount} from 'react-mounter';

import MainLayout from './components/main_layout';
import PostList from './containers/postlist';
import Post from './containers/post';
import NewPost from './containers/newpost';

export default function (injectDeps, { FlowRouter, ...ctx }) {
  const MainLayoutCtx = injectDeps(MainLayout);

  console.dir(MainLayoutCtx)

  FlowRouter.route('/', {
    name: 'posts.list',
    action() {
      mount(MainLayoutCtx, {
        content: () => (<PostList />)
      });
    }
  });

  FlowRouter.route('/post/:postId', {
    name: 'posts.single',
    action({postId}) {
      mount(MainLayoutCtx, {
        content: () => (<Post postId={postId}/>)
      });
    }
  });

  FlowRouter.route('/new-post', {
    name: 'newpost',
    action() {
      console.log('ctx from route', ctx)
      mount(MainLayoutCtx, {
        content: () => (<NewPost/>)
      });
    }
  });
}
