## Welcome to que

```html
摒弃浮华，回归真我。
脱去外衣以后，前端还剩下什么。
学习技术，有心无力？
没关系，你还有que。
```

## Start

Run the commands as follow:

1. yarn
2. yarn run dev

## Documentation

Coming soon.


## Examples

#### index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Que.js</title>
    <link rel="stylesheet" href="./index.css">
  </head>
  <body>
    <div id="que-app">
      <div>
        <input q-model="display">
      </div>
      <br>
      <div q-class="title">
        {{title}}<input q-model="title"> *if the input's value is equal to que, the text will be blue
      </div>
      <br>
      <div q-for="framework of frameworks" q-if="display">
        <div q-click="alertName(framework.name)" q-class="framework.name">
          The name of {{framework.name}} is {{framework.name}}
        </div>
        <br>
        <br>
        Users List:
        <div q-for="user of framework.users" q-click="alertName(user)">
          Sr Front End Engineer {{user}}
        </div>
        <br>
      </div>
    </div>
  </body>
</html>
```

#### index.js

```javascript
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
```
