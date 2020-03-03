import * as simpleSimpleDiExports from '@lvfang/react-simple-di'
import * as reactKomposerExports from '@lvfang/react-komposer'
import { describe, it } from 'mocha'
import { expect } from 'chai'
import * as indexExports from '../'

describe('Module', () => {
  describe('createApp', async () => {
    it('should create app with provided args', () => {
      const context = { aa: 10 }
      const app = indexExports.createApp(context)
      expect(app.context).to.deep.equal(context)
    })
  })

  it('should have useDeps from react-simple-di', () => {
    expect(indexExports.useDeps).to.be.equal(simpleSimpleDiExports.useDeps)
  })

  it('should have all functions from react-komposer', () => {
    const fnNames = [
      'compose', 'composeWithPromise', 'composeWithTracker',
      'composeWithObservable', 'composeAll', 'disable'
    ]

    fnNames.forEach(fnName => {
      const reactKomposerFn = reactKomposerExports[fnName]
      const indexFN = indexExports[fnName]
      expect(reactKomposerFn).to.be.equal(indexFN)
    })
  })
})
