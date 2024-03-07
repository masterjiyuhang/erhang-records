# 组件化基础

看段代码

下面这段代码通过 `createElement` 传的参数是一个组件而不是一个原生的标签。

```js
import Vue from 'vue'
import App from './App.vue'

var app = new Vue({
  el: '#app',
  // 这里的 h 是 createElement 方法
  render: (h) => h(App)
  // render: (createElement) => createElement(App)
})
```

## createComponent

`createElement` 最终会调用 `_createElement` 方法。

**`_createElement`** 方法执行的时候， 会对传入的参数 tag 进行判断。
如果是普通的 html 标签，就创建一个普通的 VNode 节点。
如果是不是，通过 `createComponent` 方法创建一个 VNode。

```js
if (typeof tag === 'string') {
  let Ctor
  ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
  if (config.isReservedTag(tag)) {
    // platform built-in elements
    vnode = new VNode(config.parsePlatformTagName(tag), data, children, undefined, undefined, context)
  } else if (isDef((Ctor = resolveAsset(context.$options, 'components', tag)))) {
    // component
    vnode = createComponent(Ctor, data, context, children, tag)
  } else {
    // unknown or unlisted namespaced elements
    // check at runtime because it may get assigned a namespace when its
    // parent normalizes children
    vnode = new VNode(tag, data, children, undefined, undefined, context)
  }
} else {
  // direct component options / constructor
  vnode = createComponent(tag, data, context, children)
}
```

本文开头我们说了，传入的是一个 App 对象，它实际上是一个 `Component` 类型的组件，那么代码实际上会执行 else 逻辑。

### 具体实现

```js
export function createComponent(
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {}
```

1. 构造子类钩子函数

```js
// 在最开始初始化Vue的阶段， initGlobalAPI时 会把_base 指向 Vue
// Vue.options._base = Vue
// 然后在_init方法执行时，会通过 mergeOptions 将 options 扩展到 vm.$options
const baseCtor = context.$options._base

if (isObject(Ctor)) {
  Ctor = baseCtor.extend(Ctor)
}
```

2. 安装组件钩子函数

`installComponentHooks()`

整个 installComponentHooks 的过程就是把 componentVNodeHooks 的钩子函数合并到 data.hook 中。

3. 实例化 VNode

```js
const name = Ctor.options.name || tag
const vnode = new VNode(
  `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
  data,
  undefined,
  undefined,
  undefined,
  context,
  { Ctor, propsData, listeners, tag, children },
  asyncFactory
)
return vnode
```
