import React, { Component } from 'react'
import { setOptions, composeWithTracker } from '@lvfang/react-komposer'
import { mount as _mount, withOptions as withMountOptions } from '@lvfang/react-mounter'

const LocalState = new ReactiveDict({ ts: new Date() })

setOptions({
  loadingHandler: () => <div>读取中</div>,
  context: {
    LocalState,
  },
})

mount = withMountOptions({
  rootId: 'root',
}, _mount)

const Posts = new Mongo.Collection('posts')

const LayoutComp = ({ children }) => (
  <div>
    <div><a href='/'>home</a></div>
    <div><a href='/page1'>page1</a></div>
    <div><a href='/page2'>page2</a></div>
    {children()}
  </div>
)

const Post = ({ _id, title }) => (
  <div key={_id} style={{ cursor: 'pointer' }}>{title}</div>
)

const RootTracker1 = (props, onData) => {
  if (!Meteor.subscribe('posts1').ready()) return
  const posts = Posts.find().fetch()
  onData(null, { posts, ...props })
}

class RootComp1 extends Component {
  componentDidMount() {
    console.log('RootComp1', 'componentDidMount')
  }

  componentDidUpdate() {
    console.log('RootComp1', 'componentDidUpdate')
  }

  render() {
    return (
      <div>
        <h3>posts</h3>
        {this.props.posts.map(Post)}
      </div>
    )
  }
}

const RootTracker2 = (props, onData, context) => {
  if (!Meteor.subscribe('posts2').ready()) return
  const ts = context.LocalState.get('ts')
  const posts = Posts.find().fetch()
  onData(null, { ts, posts, ...props })
}

class RootComp2 extends Component {
  componentDidMount() {
    console.log(this)
    console.log('RootComp2', 'componentDidMount')
  }

  componentDidUpdate() {
    console.log('RootComp2', 'componentDidUpdate')
  }

  render() {
    return (
      <div>
        <h3>posts</h3>
        <span>{this.props.ts.toString()}</span>
        {this.props.posts.map(Post)}
      </div>
    )
  }
}

const RootContainer1 = composeWithTracker(RootTracker1)(RootComp1)
const RootContainer2 = composeWithTracker(RootTracker2)(RootComp2)

FlowRouter.route('/', {
  action() {
    mount(LayoutComp, {
      children: () => (
        <div>
          <RootContainer1 name='home RootContainer1' />
          <RootContainer2 name='home RootContainer2' />
        </div>
      )
    })
  }
})

FlowRouter.route('/page1', {
  action() {
    mount(LayoutComp, {
      children: () => (
        <div>
          <RootContainer1 name='page1 RootContainer1' />
        </div>
      )
    })
  }
})

FlowRouter.route('/page2', {
  action() {
    mount(LayoutComp, {
      children: () => (
        <div>
          page 2
        </div>
      )
    })
  }
})

Meteor.startup(function () {
  Meteor.setInterval(() => {
    LocalState.set('ts', new Date())
  }, 200)
})
