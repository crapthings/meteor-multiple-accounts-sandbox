import React from 'react';
import {mount} from 'react-mounter';

import MainLayout from './components/main_layout';
import PostList from './containers/postlist';
import Post from './containers/post';
import NewPost from './containers/newpost';

export default function (injectDeps, context) {
  console.log('invoke routefn', context)
  const { FlowRouter } = context
  const MainLayoutCtx = injectDeps(MainLayout);

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

  console.log('before ctx from route', context)

  FlowRouter.route('/new-post', {
    name: 'newpost',
    action() {
      console.log('scope ctx from route', context)
      mount(MainLayoutCtx, {
        content: () => (<NewPost/>)
      });
    }
  });
}
