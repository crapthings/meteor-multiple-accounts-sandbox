#mantra-core

Core API for Mantra.

### Introduction

This repo contains the core APP api where we create an mantra app and initialize it.

Also, this package contains exported functions from both [`react-komposer`](https://github.com/nexushubs/react-deps/tree/master/packages/react-komposer) and [`react-simple-di`](https://github.com/nexushubs/react-deps/tree/master/packages/react-simple-di).
That's purely for the ease of use.

### Installation

```
npm i --save @lvfang/mantra-core
```

### App API

```js
import MyComp from './myComp';
import { createApp } from '@lvfang/mantra-core';

// Here's a simple Mantra Module
const module = {
  routes(injectDeps) {
    const InjectedComp = injectDeps(MyComp);
    // load routes and put `InjectedComp` to the screen.
  },
  load(context, actions) {
    // do any module initialization
  },
  actions: {
    myNamespace: {
      doSomething: (context, arg1) => {}
    }
  }
};

const context = {
  client: new DataClient()
};

const app = createApp(context);
app.loadModule(module);
// app.loadModule(someOtherModule);
app.init();
```
