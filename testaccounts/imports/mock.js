class A {
  createStore() {
    return {
      update: ({ id, msg, fields }) => {
        console.log(id, msg, fields)
      }
    }
  }
}

const connection = DDP.connect('http://localhost:3100')

const CurrentAuth = new AccountsClient({ connection })
CurrentAuth.callLoginMethod({
      methodArguments: [{
        user: { username: 'demo' },
        password: Accounts._hashPassword('demo')
      }],
      userCallback: (err, result) => {
        connection.subscribe('posts', { onReady() {
          const mongo = { ... Mongo }
          const posts = new mongo.Collection('posts', { connection })
          console.log(posts.find().fetch())
          console.log(Posts.find().fetch())
          const a = new A
          connection.registerStore('posts', a.createStore())
          connection.registerStore('hello', a.createStore())
        } })
      }
    })
