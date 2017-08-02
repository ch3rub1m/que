class Dependence {
  static id = 0
  constructor () {
    this.id = Dependence.id++
    this.subscribers = []
  }
  addSubscriber (subscriber) {
    this.subscribers.push(subscriber)
  }
  removeSubscriber (subscriber) {
    const index = this.subscribers.indexOf(subscriber)
    if (index !== -1) {
      this.subscribers.splice(index, 1)
    }
  }
  notify () {
    this.subscribers.forEach((subscriber) => {
      subscriber.update()
    })
  }
}

export default Dependence
