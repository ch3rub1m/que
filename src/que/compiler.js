import { watch } from 'que/watcher'
import { valueFor, setValueFor } from 'que/helpers'

export const compile = (selector, viewModel) => {
  const compiler = new Compiler(viewModel)
  const element = document.querySelector(selector)
  compiler.expand(element)
  compiler.compile(element)
}

class Compiler {
  static trash = []
  constructor (viewModel) {
    this.viewModel = viewModel
  }

  isDirective (attribute) {
    return attribute.indexOf('q-') === 0
  }

  expand (node) {
    if (node.nodeType === 1) {
      const expression = node.getAttribute('q-for')
      if (expression) {
        const parentNode = node.parentNode
        const [elementName, arrayName] = expression.split(' of ')
        const array = valueFor(this.viewModel, arrayName)
        for (let index = 0; index < array.length; index++) {
          const newNode = node.cloneNode(true)
          newNode.removeAttribute('q-for')
          this.preCompile(newNode, elementName, arrayName, index)
          parentNode.insertBefore(newNode, node)
          this.expand(newNode)
        }
        node.remove()
      } else {
        if (node.childNodes) {
          for (const childNode of node.childNodes) {
            this.expand(childNode)
          }
        }
      }
    }
  }

  preCompile (node, elementName, arrayName, index) {
    switch (node.nodeType) {
      case 1: {
        for (const attribute of node.attributes) {
          if (this.isDirective(attribute.name)) {
            const directive = attribute.name.split('-')[1]
            switch (directive) {
              case 'for': {
                const [subElementName, subArrayName] = attribute.value.split(' of ')
                const words = subArrayName.split('.')
                if (words[0] === elementName) {
                  words[0] = `${arrayName}[${index}]`
                }
                node.setAttribute('q-for', `${subElementName} of ${words.join('.')}`)
                break
              }
              case 'click': {
                const reg = /([\w\\.[\]]+)/g
                let [functionName, ...keypaths] = attribute.value.match(reg)
                keypaths = keypaths.map((keypath) => {
                  const parts = keypath.split('.')
                  parts[0] = parts[0].replace(`${elementName}`, `${arrayName}[${index}]`)
                  return parts.join('.')
                })
                attribute.value = `${functionName}(${keypaths.join(', ')})`
                break
              }
              default: {
                const parts = attribute.value.split('.')
                if (parts[0] === elementName) {
                  parts[0] = `${arrayName}[${index}]`
                  const newValue = parts.join('.')
                  node.setAttribute(attribute.name, newValue)
                }
              }
            }
          }
        }
        for (const childNode of node.childNodes) {
          this.preCompile(childNode, elementName, arrayName, index)
        }
        break
      }
      case 3: {
        const regExp = new RegExp(`{{(${elementName}[\\w.[\\]]*)}}`, 'gm')
        node.textContent = node.textContent.replace(regExp, (expression) => {
          const parts = expression.split('.')
          parts[0] = parts[0].replace(`{{${elementName}`, `{{${arrayName}[${index}]`)
          return parts.join('.')
        })
        break
      }
      default:
    }
  }

  compile (element) {
    switch (element.nodeType) {
      case 1:
        this.compileNode(element)
        break
      case 3:
        this.compileTemplate(element)
        break
      default:
    }
    if (element.childNodes) {
      for (const childNode of element.childNodes) {
        this.compile(childNode)
      }
    }
  }

  compileTemplate (node) {
    const regExp = /{{[\w.[\]]+}}/g
    const rawText = node.textContent
    node.textContent = rawText.replace(regExp, (expression) => {
      const keypath = expression.slice(2, expression.length - 2)
      watch(this.viewModel, keypath, (value, oldValue) => {
        node.textContent = rawText.replace(regExp, (expression) => {
          const keypath = expression.slice(2, expression.length - 2)
          return valueFor(this.viewModel, keypath)
        })
      })
      return valueFor(this.viewModel, keypath)
    })
  }

  compileNode (node) {
    for (const attribute of node.attributes) {
      const attributeName = attribute.name
      if (this.isDirective(attributeName)) {
        const directive = attributeName.split('-')[1]
        if (directive === 'model') {
          const keypath = attribute.value
          let value = valueFor(this.viewModel, keypath)
          node.value = value === 'undefined' ? '' : value
          watch(this.viewModel, keypath, (value, oldValue) => {
            if (value !== node.value) {
              node.value = value
            }
          })
          node.addEventListener('input', (e) => {
            const newValue = e.target.value
            if (value === newValue) {
              return
            }
            value = newValue
            setValueFor(this.viewModel, keypath, newValue)
          })
        }
        if (directive === 'class') {
          const rawClassName = node.className
          const qclasses = attribute.value.split(' ')
          const qclassName = qclasses.map((qclass) => {
            watch(this.viewModel, qclass, (value, oldValue) => {
              const qclassName = qclasses.map((qclass) => valueFor(this.viewModel, qclass)).join(' ')
              node.className = (rawClassName + ' ' + qclassName).trim()
            })
            return valueFor(this.viewModel, qclass)
          }).join(' ')
          node.className = (rawClassName + ' ' + qclassName).trim()
        }
        if (directive === 'if') {
          const keypath = attribute.value
          const flag = valueFor(this.viewModel, keypath)
          if (!flag) node.style.display = 'none'
          watch(this.viewModel, keypath, (value, oldValue) => {
            if (!value) node.style.display = 'none'
            if (value) node.style.display = 'block'
          })
        }
        if (directive === 'src') {
          const keypath = attribute.value
          const src = valueFor(this.viewModel, keypath)
          node.src = src
          watch(this.viewModel, keypath, (value, oldValue) => {
            node.src = value
          })
        }
        if (directive === 'click') {
          const reg = /([\d.[\]\w]+)/g
          const [functionName, ...keypaths] = attribute.value.match(reg)
          const handler = this.viewModel._reducers[functionName]
          node.addEventListener(directive, (e) => {
            const args = keypaths.map((keypath) => {
              return valueFor(this.viewModel, keypath)
            })
            handler(e, ...args)
          }, false)
        }
      }
    }
  }
}
