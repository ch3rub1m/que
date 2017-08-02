import Dependence from 'que/dependence'
import Watcher from 'que/watcher'

export const observe = (data) => {
  if (data && data instanceof Object) {
    Object.keys(data).forEach((key) => {
      reactive(data, key, data[key])
    })
  }
}

const reactive = (data, key, value) => {
  const dependence = new Dependence()
  observe(value)
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: false,
    get: () => {
      const watcher = Watcher.currentWatcher
      watcher && watcher.addToDependence(dependence)
      return value
    },
    set: (newValue) => {
      if (newValue !== value) {
        value = newValue
        observe(newValue)
        dependence.notify()
      }
    }
  })
}
