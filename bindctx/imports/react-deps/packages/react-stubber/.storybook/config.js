import { configure } from '@storybook/react'
import { setStubbingMode } from '../src'

setStubbingMode(true)

function loadStories() {
  require(`../src/stories/index.stories.js`)
}

configure(loadStories, module)
