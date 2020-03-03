import React, { Component } from 'react'
import { createApp } from '@lvfang/mantra-core'

import Collections from '../collections'
import { LocalState } from '../config'

import HomeModule from './modules/home'

const app = createApp({
  Collections,
  LocalState,
})

app.loadModule(HomeModule)

app.init()
