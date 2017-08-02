import Que from 'que'

const que = new Que({
  props: {
    title: 'que',
    frameworks: [{
      name: 'backbone',
      users: ['unknown']
    }, {
      name: 'angular',
      users: ['ch3rub1m', 'witt']
    }, {
      name: 'ember',
      users: ['ch3rub1m', 'nightmare']
    }, {
      name: 'react',
      users: ['ch3rub1m', 'unadlib']
    }, {
      name: 'vue',
      users: ['witt']
    }],
    display: 1
  },
  reducers: {
    alertName: function (e, name) {
      window.alert(`I clicked the ${name}`)
    }
  }
})

que.render('#que-app')
