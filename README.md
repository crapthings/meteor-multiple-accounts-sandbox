# meteor-multiple-accounts-sandbox

### 例1

```
cd mantra-sample-blog-app
meteor npm i
meteor
```

```
cd mantra-sample-blog-app-2
meteor npm i
meteor --port 3100
```

### 简单说明

- 采用 mantra 架构

#### 修改核心 package 前

- 支持多账号同时登陆不同服务器，由于 localStorage 限制同一服务器不能登陆多个账号，后登陆的会覆盖前一个 localStorage 存储结构

#### 修改核心 package 后

- 支持多账号同时登陆同一个服务器或不同服务器

> 通过修改 localstorage 和 accounts-base 加入 namespace 概念 [引用1](https://github.com/crapthings/meteor-multiple-accounts-sandbox/blob/master/mantra-sample-blog-app/packages/localstorage/localstorage.js#L68) [引用2](https://github.com/crapthings/meteor-multiple-accounts-sandbox/blob/master/mantra-sample-blog-app/packages/accounts-base/accounts_client.js#L495)

#### 应用部分

- 为方便证明作用，这里我们简单通过写死的代码构件预设账号信息，这里应该是通过界面交互才存到 localStorage [引用](https://github.com/crapthings/meteor-multiple-accounts-sandbox/blob/master/mantra-sample-blog-app/client/configs/context.js#L10)

- 我们通过控制一个 active 值来定位当前 view 应该采用哪些配套 ddp 连接以及方法 [引用](https://github.com/crapthings/meteor-multiple-accounts-sandbox/blob/master/mantra-sample-blog-app/client/configs/context.js#L25)

- 我们为每个需要连接的账号创建一个方便操作以及调用的“集合”，里边包括 collection 以及 ddp 连接等 [引用](https://github.com/crapthings/meteor-multiple-accounts-sandbox/blob/master/mantra-sample-blog-app/client/configs/context.js#L34)

- 通过 context 可以方便在后续的容器以及组件拿到“集合”的内容 [引用](https://github.com/crapthings/meteor-multiple-accounts-sandbox/blob/master/mantra-sample-blog-app/client/configs/context.js#L48)

- 通过简单定制核心的登录函数来控制每个账号的登录过程，在这里我们可以控制如果他登录失败，界面可以得到反馈 [引用](https://github.com/crapthings/meteor-multiple-accounts-sandbox/blob/master/mantra-sample-blog-app/client/configs/context.js#L60)

- 展示一个如何完全切换到一个服务器 [引用1](https://github.com/crapthings/meteor-multiple-accounts-sandbox/blob/master/mantra-sample-blog-app/client/modules/core/components/switch.js#L26) [引用2](https://github.com/crapthings/meteor-multiple-accounts-sandbox/blob/master/mantra-sample-blog-app/client/modules/core/actions/accounts.js#L2) [引用3~刷新页面时也知道最后连接状态](https://github.com/crapthings/meteor-multiple-accounts-sandbox/blob/master/mantra-sample-blog-app/client/configs/context.js#L43) [引用4~从“集合”里选择目标服务器的链接和数据库表实例](https://github.com/crapthings/meteor-multiple-accounts-sandbox/blob/master/mantra-sample-blog-app/client/modules/core/containers/postlist.js#L6)

- 调用方法的例子 [引用](https://github.com/crapthings/meteor-multiple-accounts-sandbox/blob/master/mantra-sample-blog-app/client/modules/core/actions/posts.js#L13)

- 调阅订阅的例子 [引用](https://github.com/crapthings/meteor-multiple-accounts-sandbox/blob/master/mantra-sample-blog-app/client/modules/core/containers/postlist.js#L10)

- 通过 namespace 每个用户都可以有自定的 localstorage 空间 [引用](https://github.com/crapthings/meteor-multiple-accounts-sandbox/blob/master/mantra-sample-blog-app/client/configs/context.js#L20)

- 决定用户 localstorage 的 namespace [引用](https://github.com/crapthings/meteor-multiple-accounts-sandbox/blob/master/mantra-sample-blog-app/client/configs/context.js#L37)

---

### 例2

```
cd bindctx
meteor npm i
meteor
```

```
cd mantra-sample-blog-app-2
meteor npm i
meteor --port 3100
```

### 简单说明

- 采用 mantra 架构

#### 修改核心 mantra-core 后

- [支持 bindContext 方法，配合 tracker 重新绑定 ctx](https://github.com/crapthings/meteor-multiple-accounts-sandbox/blob/master/bindctx/imports/react-deps/packages/mantra-core/src/app.js#L36)

#### 应用部分

- 设置一套切换逻辑 somehow [引用1](https://github.com/crapthings/meteor-multiple-accounts-sandbox/blob/master/bindctx/client/main.js#L23) [引用2](https://github.com/crapthings/meteor-multiple-accounts-sandbox/blob/master/bindctx/client/main.js#L41)

- [切换用户](https://github.com/crapthings/meteor-multiple-accounts-sandbox/blob/master/bindctx/client/modules/core/components/main_layout.js#L11)

## Issue

route and action 还是没有 ctx

我尝试把 mantra-core 改成 mutable，但是 react-di 是 immutable，我们应用在 useDeps 时候也是 immutable
要改的地方还不少，而且这样可能在 函数的参数里有 数组和 array 时候，会不会因为使用问题导致 bug

https://github.com/crapthings/meteor-multiple-accounts-sandbox/tree/diginto

### mutate 例子

```js
const context0 = {
  status: true,
  text: 'default context 0',
}

const context1 = {
  status: true,
  text: 'default context 1',
}

const actions = {
  changeStatus0(context0) {
    console.log('before changeStatus0', context0)
    context0.status = false
    context0.text = 'python text changed'
    console.log('after changeStatus0', context0)
    return context0
  },

  changeStatus1({ ...context1 }) {
    console.log('before changeStatus1', context1)
    context1.status = false
    context1.text = 'javascript text changed'
    console.log('after changeStatus1', context1)
    return context1
  }
}

actions.changeStatus0 = actions.changeStatus0.bind(null, context0)
actions.changeStatus1 = actions.changeStatus1.bind(null, context1)

console.log('changeStatus0 after all', context0, actions.changeStatus0())
console.log('changeStatus1 after all', context1, actions.changeStatus1())
```

```
before changeStatus0 { status: true, text: 'default context 0' }
after changeStatus0 { status: false, text: 'python text changed' }
changeStatus0 after all { status: false, text: 'python text changed' } { status: false, text: 'python text changed' }
before changeStatus1 { status: true, text: 'default context 1' }
after changeStatus1 { status: false, text: 'javascript text changed' }
changeStatus1 after all { status: true, text: 'default context 1' } { status: false, text: 'javascript text changed' }
```

### bind issue

> "The bind() function creates a new function (a bound function) with the same function body (internal call property in ECMAScript 5 terms) as the function it is being called on (the bound function's target function) with the this value bound to the first argument of bind(), **which cannot be overridden.**"

```js
let context1 = {
  username: 'zhang hong',
  status: true,
}

let context2 = {
  username: 'kim jong un',
  status: false,
}

const actions = {
  changeStatus(context) {
    console.log('before changeStatus', context)
    context.status = false
    console.log('after changeStatus', context)
    return context
  },
}

actions.changeStatus = actions.changeStatus.bind(null, context1)
console.log('changeStatus after all', context1, actions.changeStatus(), '\n')
context1 = context2
actions.changeStatus = actions.changeStatus.bind(null, context2)
console.log('changeStatus after all', context1, actions.changeStatus())
```

```
before changeStatus { username: 'zhang hong', status: true }
after changeStatus { username: 'zhang hong', status: false }
changeStatus after all { username: 'zhang hong', status: false } { username: 'zhang hong', status: false }

before changeStatus { username: 'zhang hong', status: false }
after changeStatus { username: 'zhang hong', status: false }
changeStatus after all { username: 'kim jong un', status: false } { username: 'zhang hong', status: false }
```
