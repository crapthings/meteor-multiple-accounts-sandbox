// IMPORTANT
// ---------
// This is an auto generated file with React CDK.
// Do not modify this file.
// Use `.scripts/user/pretest.js instead`.

require('@babel/register')
require('@babel/polyfill')

// Add jsdom support, which is required for enzyme.
const { JSDOM } = require('jsdom')

const opts = {
  url: 'http://localhost'
}

global.dom = new JSDOM('<!doctype html><html><body></body></html>', opts)
global.window = dom.window
global.document = dom.window.document
global.navigator = global.window.navigator
global.navigator.userAgent = 'node.js'

process.on('unhandledRejection', function (error) {
  console.error('Unhandled Promise Rejection:')
  console.error((error && error.stack) || error)
})

require('./user/pretest.js')
