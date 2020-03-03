import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { describe, it } from 'mocha'
import { expect } from 'chai'
import React from 'react'
import { compose } from '../'

Enzyme.configure({ adapter: new Adapter() })

class Comp extends React.Component {
  render () {
    return (
      <p>{this.props.name}</p>
    )
  }
}

describe('compose', () => {
  describe('basic features', () => {
    it('should pass props to the Child', () => {
      const Container = compose((props, onData) => {
        onData(null, {})
      })(Comp)
      const el = shallow(<Container name='arunoda' />)
      expect(el.html()).to.match(/arunoda/)
    })

    it('should pass data to the Child', () => {
      const Container = compose((props, onData) => {
        onData(null, { name: 'arunoda' })
      })(Comp)
      const el = shallow(<Container />)
      expect(el.html()).to.match(/arunoda/)
    })

    it('should pass both data and props to the Child', () => {
      const Container = compose((props, onData) => {
        onData(null, { name: 'arunoda' })
      })(({ name, age }) => (<p>{name}={age}</p>))
      const el = shallow(<Container age={20} />)
      expect(el.html()).to.match(/arunoda=20/)
    })

    it('should run with the context', (done) => {
      const context = { name: 'arunoda' }
      const options = { context }
      const Container = compose((props, onData, context) => {
        expect(context.name).to.be.equal('arunoda')
        done()
      }, options)(Comp)
      shallow(<Container />)
    })

    it('should show the given loading handler when there is no data', () => {
      const options = {
        loadingHandler: () => (<p>loading</p>)
      }
      const Container = compose((props, onData) => {
        onData()
      }, options)(Comp)
      const el = shallow(<Container />)
      expect(el.html()).to.match(/loading/)
    })

    it('should show the given error handler when there is an error', () => {
      const options = {
        errorHandler: e => (<p>{e.message}</p>)
      }
      const Container = compose((props, onData) => {
        onData(new Error('Aiyo'))
      }, options)(Comp)
      const el = shallow(<Container />)
      expect(el.html()).to.match(/Aiyo/)
    })

    it('should set the child ref', () => {
      const Container = compose((props, onData) => {
        onData(null, { name: 'arunoda' })
      })(Comp)
      const el = mount(<Container name='arunoda' />)
      expect(el.instance().child.props.name).to.be.equal('arunoda')
    })
  })

  describe('tracker features', () => {
    it('should allow to pass data multiple times', () => {
      let onData
      const Container = compose((props, _onData) => {
        onData = _onData
      })(Comp)
      const el = mount(<Container />)
      // First run
      onData(null, { name: 'arunoda' })
      expect(el.instance().state.data.name).to.be.equal('arunoda')
      // Second run
      onData(null, { name: 'kamal' })
      expect(el.instance().state.data.name).to.be.equal('kamal')
    })

    it('should unsubscribe when unmounted', (done) => {
      const Container = compose((props, onData) => {
        onData(null, {})
        return done
      })(Comp)
      const el = mount(<Container name='arunoda' />)
      el.instance().componentWillUnmount()
    })

    // TBD
    it('should unsubscribe when subscribing again', (done) => {
      let onData
      const Container = compose((props, _onData) => {
        onData = _onData
        onData(null, {})
      })(Comp)
      const el = mount(<Container name='arunoda' />)
      el.instance().track({ aa: 10 })
      if (onData) {
        done()
      }
    })

    it('should throw an error when sending data when unmounted', () => {
      let onData
      const Container = compose((props, _onData) => {
        onData = _onData
        onData(null, {})
      })(Comp)
      const el = mount(<Container name='arunoda' />)
      el.instance().componentWillUnmount()
      const run = () => onData(null, { aa: 10 })
      expect(run).to.throw('Trying to set data after component(Container(Comp)) has unmounted.')
    })
  })

  describe('performance', () => {
    describe('with propsToWatch === []', () => {
      describe('tracker', () => {
        it('should run for the first time - kkrgr', () => {
          const options = {
            propsToWatch: []
          }
          const Container = compose((props, onData) => {
            onData(null, { name: 'arunoda' })
          }, options)(Comp)
          const el = shallow(<Container />)
          expect(el.html()).to.match(/arunoda/)
        })

        it('should not run again', () => {
          const options = {
            propsToWatch: []
          }
          let callCount = 0
          const Container = compose(() => {
            callCount += 1
          }, options)(Comp)
          const el = mount(<Container />)
          el.instance().track({ aa: 10 })
          expect(callCount).to.be.equal(1)
        })
      })
    })

    describe('with propsToWatch == [some props]', () => {
      describe('tracker', () => {
        it('should not run if the watching props are the same', () => {
          const options = {
            propsToWatch: ['name']
          }
          let callCount = 0
          const Container = compose(() => {
            callCount += 1
          }, options)(Comp)
          const el = mount(<Container name='arunoda' />)
          el.instance().track({ name: 'arunoda', age: 20 })
          expect(callCount).to.be.equal(1)
        })

        it('should not run if the watching props changed', () => {
          const options = {
            propsToWatch: ['name']
          }
          let callCount = 0
          const Container = compose(() => {
            callCount += 1
          }, options)(Comp)
          const el = mount(<Container name='arunoda' />)
          el.instance().track({ name: 'kamal', age: 20 })
          expect(callCount).to.be.equal(2)
        })

        it('should do a shallow comparison', () => {
          const options = {
            propsToWatch: ['data']
          }
          const data = {}
          let callCount = 0
          const Container = compose(() => {
            callCount += 1
          }, options)(Comp)
          const el = mount(<Container data={data} />)
          // let's change the stuff inside the data
          data.foo = 100
          el.instance().track({ data })
          expect(callCount).to.be.equal(1)
        })

        it('should watch multiple props', () => {
          const options = {
            propsToWatch: ['name', 'age']
          }
          let callCount = 0
          const Container = compose(() => {
            callCount += 1
          }, options)(Comp)
          const el = mount(<Container name='arunoda' age={20} />)
          // first run with same props
          el.instance().track({ name: 'arunoda', age: 20, kkr: 20 })
          expect(callCount).to.be.equal(1)
          // second run with changed props
          el.instance().track({ name: 'arunoda', age: 30 })
          expect(callCount).to.be.equal(2)
        })
      })
    })

    describe('with shouldTrack', () => {
      describe('tracker', () => {
        it('should run for the first time even shouldTrack give false', () => {
          const options = {
            shouldTrack: () => false
          }
          const Container = compose((props, onData) => {
            onData(null, { name: 'arunoda' })
          }, options)(Comp)
          const el = shallow(<Container />)
          expect(el.html()).to.match(/arunoda/)
        })

        it('should ignore propsToWatch', () => {
          const options = {
            shouldTrack: () => true,
            propsToWatch: []
          }
          let callCount = 0
          const Container = compose(() => {
            callCount += 1
          }, options)(Comp)
          const el = mount(<Container />)
          el.instance().track({ aa: 10 })
          expect(callCount).to.be.equal(2)
        })
      })
    })

    describe('pure', () => {
      describe('default', () => {
        it('should run not be pure', () => {
          const Container = compose(() => null)(Comp)
          const i = shallow(<Container />).instance()
          expect(i.shouldComponentUpdate()).to.be.equal(true)
        })
      })

      describe('with shouldUpdate', () => {
        it('should run should update', () => {
          const nextProps = { aa: 20 }
          const options = {
            shouldUpdate (cp, np) {
              expect(cp).to.deep.equal({ aa: 10 })
              expect(np).to.deep.equal(nextProps)
              return false
            }
          }
          const Container = compose(() => null, options)(Comp)
          const i = shallow(<Container aa={10} />).instance()
          expect(i.shouldComponentUpdate(nextProps)).to.be.equal(false)
        })
      })

      describe('with props', () => {
        it('should be true if props are different', () => {
          const Container = compose(() => null, { pure: true })(Comp)
          const i = shallow(<Container p1='10' />).instance()
          expect(i.shouldComponentUpdate({ p1: '11' }, {})).to.be.equal(true)
          i.props = { p1: '11' }
          expect(i.shouldComponentUpdate({ p1: '11', p2: 10 }, {}))
            .to.be.equal(true)
        })

        it('should be false if props are the same', () => {
          const Container = compose(() => null, { pure: true })(Comp)
          const i = shallow(<Container p1='10' />).instance()
          expect(i.shouldComponentUpdate({ p1: '10' }, {}, {})).to.be.equal(false)
        })
      })

      describe('with error', () => {
        it('should be true if errors are different', () => {
          const Container = compose(() => null, { pure: true })(Comp)
          const i = shallow(<Container />).instance()
          const error = new Error('hello')
          expect(i.shouldComponentUpdate(i.props, { error })).to.be.equal(true)
          i.state = { error }
          const newError = new Error('hello')
          expect(i.shouldComponentUpdate(i.props, { error: newError }))
            .to.be.equal(true)
        })

        it('should be false if errors are the same', () => {
          const Container = compose(() => null, { pure: true })(Comp)
          const i = shallow(<Container />).instance()
          const error = new Error('hello')
          expect(i.shouldComponentUpdate(i.props, { error })).to.be.equal(true)
          i.state = { error }
          expect(i.shouldComponentUpdate(i.props, { error }, {}))
            .to.be.equal(false)
        })
      })

      describe('with data', () => {
        it('should be true if data are different', () => {
          const Container = compose(() => null, { pure: true })(Comp)
          const i = shallow(<Container />).instance()
          const data = { aa: 10 }
          expect(i.shouldComponentUpdate(i.props, { data })).to.be.equal(true)
          i.state = { data }
          const sameData = { aa: 10 }
          expect(i.shouldComponentUpdate(i.props, { data: sameData }, {}))
            .to.be.equal(false)
        })

        it('should be false if data are the same', () => {
          const Container = compose(() => null, { pure: true })(Comp)
          const i = shallow(<Container />).instance()
          const data = { aa: 10 }
          expect(i.shouldComponentUpdate(i.props, { data })).to.be.equal(true)
          i.state = { data }
          const sameData = { aa: 10 }
          expect(i.shouldComponentUpdate(i.props, { data: sameData }, {}))
            .to.be.equal(false)
        })
      })
    })
  })
})
