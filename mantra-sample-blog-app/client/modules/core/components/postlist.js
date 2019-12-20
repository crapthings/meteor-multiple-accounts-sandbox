import React from 'react';

const PostList = ({ posts, lastAccount }) => {
  const color = Meteor._localStorage.getItem('color', 'u' + lastAccount)
  const style = { color }
  return (
    <div className='postlist'>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <a href={`/post/${post._id}`} style={style}>{post.title} - {post.userId}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PostList;
