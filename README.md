# 简单说明

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

# meteor-multiple-accounts-sandbox

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
