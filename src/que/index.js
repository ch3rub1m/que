import { observe } from 'que/observer'
import { compile } from 'que/compiler'

class Que {
  constructor ({props, reducers, styles}) {
    this._props = props
    this._reducers = reducers
    this._styles = styles
    Object.keys(this._props).forEach((key) => {
      this.proxy(key)
    })
    observe(this._props, this)
  }

  render (selector) {
    compile(selector, this)
  }

  proxy (key) {
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: false,
      get: function proxyGetter () {
        return this._props[key]
      },
      set: function proxySetter (newVal) {
        this._props[key] = newVal
      }
    })
  }
}

export default Que

window.Que = Que
