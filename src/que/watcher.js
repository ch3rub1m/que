import { valueFor } from 'que/helpers'

export const watch = (viewModel, keypath, callback) => {
  const watcher = new Watcher(viewModel, keypath, callback)
  watcher.watch()
}

export default class Watcher {
  static currentWatcher = null

  constructor (viewModel, keypath, callback) {
    this.viewModel = viewModel
    this.keypath = keypath
    this.callback = callback
    this.dependenceIds = new Set()
  }

  watch () {
    this.value = this.valueFor(this.viewModel, this.keypath)
  }

  update () {
    const value = this.valueFor(this.viewModel, this.keypath)
    const oldVal = this.value
    if (value !== oldVal) {
      this.value = value
      this.callback(value, oldVal)
    }
  }

  addToDependence (dependence) {
    if (!this.dependenceIds.has(dependence.id)) {
      dependence.addSubscriber(this)
      this.dependenceIds.add(dependence.id)
    }
  }

  valueFor (data, keypath) {
    Watcher.currentWatcher = this
    const value = valueFor(data, keypath)
    Watcher.currentWatcher = null
    return value
  }
}
