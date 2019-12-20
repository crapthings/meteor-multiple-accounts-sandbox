class PostsList extends Component {
  render() {
    const { posts } = this.props
    return (
      <div>{posts.map(({ name }, idx) => (
        <div key={idx}>{name}</div>
      ))}</div>
    )
  }
}

const PostsTracker = () => {
  const ready = Meteor.subscribe('posts').ready()
  const posts = Posts.find({}).fetch()
  return { ready, posts }
}

export default withTracker(PostsTracker)(PostsList |> Loader)
