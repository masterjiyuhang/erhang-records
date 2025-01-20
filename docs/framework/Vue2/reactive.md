# 响应式原理

就是处理变化 DOM 时的操作，简单来说就是数据变化会动态改变 DOM。

先抛出几个问题？

正常 JavaScript 中改变 html 页面上数据，就是监听事件，修改数据，手动操作 DOM 数据重新渲染。👋

在 Vue 中省略了手动的操作，变成了自动档。🤖️

那面临的问题如下：

1. 页面修改了哪块 DOM 数据？

2. 操作时机是否是最优的？ 效率是不是最高的？

3. 修改 DOM 时是操作完统一修改，还是改一个变一个？ 每一次数据的修改都要去操作 DOM 不是爆炸了？

## Vue2 响应式核心

利用 `Object.defineProperty` 给数据添加了 `getter` 和 `setter` ，目的就是为了在访问数据以及写数据的时候能自动执行一些逻辑： `getter` 做的事情是依赖收集， `setter` 做的事情是派发更新。

### initState

初始化阶段时， `_init` 方法执行的时候， 会执行 `initState(vm)` 方法。

- `initProps`
  - 通过遍历 `props` ，调用 `defineReactive` 方法把每个 `prop` 对应的值变成响应式。
  - 通过 proxy 方法， 注意这个方式是 Vue2 中自己实现的, 不是 Vue3 里面用到的的 `Proxy` 。
  - **proxy(vm, `_props`, key)**
- `initData`
  - 通过 observe 监测整个 data 的变化， 把 data 变成响应式。
  - 遍历 data 函数返回的对象， 通过 proxy 把每一个值代理到 vm.xxx 上。
  - **proxy(vm, `_data`, key)**

```js
export function initState(vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe((vm._data = {}), true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

### proxy

把 `props` 和 `data` 上的属性代理到 `vm` 实例上。
通过 `Object.defineProperty` 把 `target[sourceKey][key]` 的读写变成了对 `target[key]` 的读写。

```js
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export function proxy(target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

### observe

`observe` 就是用来监测数据的变化的。
给非 `VNode` 的对象类型数据添加一个 `Observer` ，如果已经添加过则直接返回，否则在满足一定条件下去实例化一个 `Observer` 对象实例。

```js
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe(value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (shouldObserve && !isServerRendering() && (Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```

### Observer

给对象的属性添加 `getter` 和 `setter` ，用于依赖收集和派发更新。

- 首先实例化 `Dep` 对象
- 接着通过执行 `def` 函数把自身实例添加到数据对象 `value` 的 **ob** 属性上
- 接下来会对 `value` 做判断，对于数组会调用 `observeArray` 方法
- 否则对纯对象调用 `walk` 方法
- 看到 `observeArray` 是遍历数组再次调用 `observe` 方法，而 `walk` 方法是遍历对象的 `key` 调用 `defineReactive` 方法

```ts
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  constructor(value: any) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, "__ob__", this);

    if (Array.isArray(value)) {
      const argument = hasProto ? protoAugment : copyAugment;
      argument(value, arrayMethods, arrayKeys);
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk(obj: Object) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  }
}
```

### defineReactive

`defineReactive` 的功能就是定义一个响应式对象，给对象动态添加 `getter` 和 `setter`

- 最开始初始化 `Dep` 对象的实例
- 拿到 `obj` 的属性描述符，然后对子对象递归调用 `observe` 方法
  - 样就保证了无论 `obj` 的结构多复杂，它的所有子属性也能变成响应式的对象
  - 这样我们访问或修改 `obj` 中一个嵌套较深的属性，也能触发 `getter` 和 `setter` 。
- 最后利用 `Object.defineProperty` 去给 `obj` 的属性 `key` 添加 `getter` 和 `setter` 。

```js
/**
 * Define a reactive property on an Object.
 */
export function defineReactive(obj: Object, key: string, val: any, customSetter?: ?Function, shallow?: boolean) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}
```

## 依赖收集

`Vue` 会把普通对象变成响应式对象，响应式对象 `getter` 相关的逻辑就是做依赖收集。

回顾上面的 `defineReactive` 方法。

- `const dep = new Dep()` 实例化一个 `Dep` 的实例
- 在 `get` 函数中通过 `dep.depend` 做依赖收集

### Dep 依赖收集的核心

`Dep` 是一个 `Class` ，它定义了一些属性和方法，这里需要特别注意的是它有一个静态属性 `target` ，这是一个全局唯一 `Watcher` 。
这是一个非常巧妙的设计，因为在同一时间只能有一个全局的 `Watcher` 被计算，另外它的自身属性 `subs` 也是 `Watcher` 的数组。
`Watcher` 是一个 `Class` ，在它的构造函数中，定义了一些和 `Dep` 相关的属性。

```js
import type Watcher from './watcher'
import { remove } from '../util/index'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher
  id: number
  subs: Array<Watcher>

  constructor() {
    this.id = uid++
    this.subs = []
  }

  addSub(sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub(sub: Watcher) {
    remove(this.subs, sub)
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify() {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null
const targetStack = []

export function pushTarget(_target: ?Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget() {
  Dep.target = targetStack.pop()
}
```

## 派发更新

`setter` 的逻辑有 2 个关键的点

- 一个是 `childOb = !shallow && observe(newVal)`，如果 `shallow` 为 `false` 的情况，会对新设置的值变成一个响应式对象；
- 另一个是 `dep.notify()`，通知所有的订阅者。
  - 遍历所有的 `subs` ，也就是 `Watcher` 的实例数组，然后调用每一个 `watcher` 的 `update` 方法

```js
class Dep {
  // ...
  notify() {
    // stabilize the subscriber list first
    const subs = this.subs.slice();
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}
```

```js
class Watcher {
  // ...
  update() {
    /* istanbul ignore else */
    if (this.computed) {
      // A computed property watcher has two modes: lazy and activated.
      // It initializes as lazy by default, and only becomes activated when
      // it is depended on by at least one subscriber, which is typically
      // another computed property or a component's render function.
      if (this.dep.subs.length === 0) {
        // In lazy mode, we don't want to perform computations until necessary,
        // so we simply mark the watcher as dirty. The actual computation is
        // performed just-in-time in this.evaluate() when the computed property
        // is accessed.
        this.dirty = true;
      } else {
        // In activated mode, we want to proactively perform the computation
        // but only notify our subscribers when the value has indeed changed.
        this.getAndInvoke(() => {
          this.dep.notify();
        });
      }
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  }
}
```

### queueWatcher

这里引入了一个队列的概念，这也是 `Vue` 在做派发更新的时候的一个优化的点，它并不会每次数据改变都触发 `watcher` 的回调，而是把这些 `watcher` 先添加到一个队列里，然后在 `nextTick` 后执行 `flushSchedulerQueue`。

- 首先用 has 对象保证同一个 `Watcher` 只添加一次
- 对 `flushing` 的判断
- 通过 `waiting` 保证对 `nextTick(flushSchedulerQueue)` 的调用逻辑只有一次, 异步的去执行 `flushSchedulerQueue`

```js
const queue: Array<Watcher> = []
let has: { [key: number]: ?true } = {}
let waiting = false
let flushing = false
/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
export function queueWatcher(watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}
```

## nextTick

JS 运行机制， 它是单线程的。
JS 中的事件循环机制：

1. 所有同步任务在主线程上进行，形成一个执行栈。 execution context stack
2. 主线程之外，还存在一个 任务队列 task queue ， 只要异步任务有了运行结果， 就在任务队列中加入一个事件。
3. 一旦执行栈中的所有同步任务执行完毕，就会取出任务队列，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
4. 主线程不断重复上面的第三步。

task queue 中存储的 task 可以分为两类：

- macro task
- micro task

每个 macro 结束后，要清空所有的 micro。

在浏览器环境中

- 常见的 macro task 有 `setTimeout` 、 `MessageChannel` 、 `postMessage` 、 `setImmediate` ；
- 常见的 micro task 有 `MutationObsever` 和 `Promise.then`。

### Vue nextTick

声明了 `microTimerFunc` 和 `macroTimerFunc` 两个变量。

- 对于 macro task 的实现
  - 优先检测是否支持原生 setImmediate，这是一个高版本 IE 和 Edge 才支持的特性
  - 不支持的话再去检测是否支持原生的 MessageChannel
  - 如果也不支持的话就会降级为 setTimeout 0
- 而对于 micro task 的实现
  - 检测浏览器是否原生支持 Promise，不支持的话直接指向 macro task 的实现。

```js
import { noop } from 'shared/util'
import { handleError } from './error'
import { isIOS, isNative } from './env'

const callbacks = []
let pending = false

// flushCallbacks 的逻辑非常简单，对 callbacks 遍历，然后执行相应的回调函数。
function flushCallbacks() {
  pending = false
  const copies = callbacks.slice(0) // 复制数组
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

// Here we have async deferring wrappers using both microtasks and (macro) tasks.
// In < 2.4 we used microtasks everywhere, but there are some scenarios where
// microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using (macro) tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use microtask by default, but expose a way to force (macro) task when
// needed (e.g. in event handlers attached by v-on).
let microTimerFunc
let macroTimerFunc
let useMacroTask = false

// Determine (macro) task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else if (
  typeof MessageChannel !== 'undefined' &&
  (isNative(MessageChannel) ||
    // PhantomJS
    MessageChannel.toString() === '[object MessageChannelConstructor]')
) {
  const channel = new MessageChannel()
  const port = channel.port2
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () => {
    port.postMessage(1)
  }
} else {
  /* istanbul ignore next */
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

// Determine microtask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  microTimerFunc = () => {
    p.then(flushCallbacks)
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) setTimeout(noop)
  }
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a (macro) task instead of a microtask.
 */
export function withMacroTask(fn: Function): Function {
  return (
    fn._withTask ||
    (fn._withTask = function () {
      useMacroTask = true
      const res = fn.apply(null, arguments)
      useMacroTask = false
      return res
    })
  )
}

export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimerFunc()
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise((resolve) => {
      _resolve = resolve
    })
  }
}
```

## 组件更新

```js
// updates
vm.$el = vm.__patch__(prevVnode, vnode);
```

调用 patch 方法

这里执行 patch 的逻辑和首次渲染是不一样的，因为 oldVnode 不为空，并且它和 vnode 都是 VNode 类型，接下来会通过 sameVNode(oldVnode, vnode) 判断它们是否是相同的 VNode 来决定走不同的更新逻辑。

### 新旧节点不同

1. 创建新节点
   - 以当前旧节点为参考节点，创建新的节点
   - `createElm(vnode, insertedVnodeQueue, oldElm._leaveCb ? nu;; : parentElm, needOps.nextSibling(oldElm))`
2. 更新父的占位符节点

   - 找到当前 vnode 的父的占位符节点，先执行各个 module 的 destroy 的钩子函数
   - 如果当前占位符是一个可挂载的节点，则执行 module 的 create 钩子函数。

3. 删除旧节点
   - 把 oldVnode 从当前 DOM 树中删除，如果父节点存在，则执行 removeVnodes 方法：
     - 就是遍历待删除的 vnodes 做删除，其中 removeAndInvokeRemoveHook 的作用是从 DOM 中移除节点并执行 module 的 remove 钩子函数，并对它的子节点递归调用 removeAndInvokeRemoveHook 函数

### 新旧节点相同

调用 `patchVNode` 方法， patchVnode 的作用就是把新的 vnode patch 到旧的 vnode 上。

1. 执行 `prepatch` 钩子函数

2. 执行 `update` 钩子函数

3. 完成 `patch` 过程

   如果 vnode 是个文本节点且新旧文本不相同，则直接替换文本内容。如果不是文本节点，则判断它们的子节点，并分了几种情况处理：

   1. oldCh 与 ch 都存在且不相同时，使用 `updateChildren` 函数来更新子节点 🌟
   2. 如果只有 ch 存在，表示旧节点不需要了。如果旧的节点是文本节点则先将节点的文本清除，然后通过 addVnodes 将 ch 批量插入到新节点 elm 下。
   3. 如果只有 oldCh 存在，表示更新的是空节点，则需要将旧的节点通过 removeVnodes 全部清除。
   4. 当只有旧节点是文本节点的时候，则清除其节点文本内容。

4. 执行 `postpatch` 钩子函数

```js
function sameVnode(a, b) {
  return (
    a.key === b.key &&
    ((a.tag === b.tag &&
      a.isComment === b.isComment &&
      isDef(a.data) === isDef(b.data) &&
      sameInputType(a, b)) ||
      (isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)))
  );
}

function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
  if (oldVnode === vnode) {
    return;
  }

  const elm = (vnode.elm = oldVnode.elm);

  if (isTrue(oldVnode.isAsyncPlaceholder)) {
    if (isDef(vnode.asyncFactory.resolved)) {
      hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
    } else {
      vnode.isAsyncPlaceholder = true;
    }
    return;
  }

  // reuse element for static trees.
  // note we only do this if the vnode is cloned -
  // if the new node is not cloned it means the render functions have been
  // reset by the hot-reload-api and we need to do a proper re-render.
  if (
    isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
  ) {
    vnode.componentInstance = oldVnode.componentInstance;
    return;
  }

  let i;
  const data = vnode.data;
  if (isDef(data) && isDef((i = data.hook)) && isDef((i = i.prepatch))) {
    i(oldVnode, vnode);
  }

  const oldCh = oldVnode.children;
  const ch = vnode.children;
  if (isDef(data) && isPatchable(vnode)) {
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
    if (isDef((i = data.hook)) && isDef((i = i.update))) i(oldVnode, vnode);
  }
  if (isUndef(vnode.text)) {
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch)
        updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
    } else if (isDef(ch)) {
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, "");
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
    } else if (isDef(oldCh)) {
      removeVnodes(elm, oldCh, 0, oldCh.length - 1);
    } else if (isDef(oldVnode.text)) {
      nodeOps.setTextContent(elm, "");
    }
  } else if (oldVnode.text !== vnode.text) {
    nodeOps.setTextContent(elm, vnode.text);
  }
  if (isDef(data)) {
    if (isDef((i = data.hook)) && isDef((i = i.postpatch))) i(oldVnode, vnode);
  }
}

return function patch(oldVnode, vnode, hydrating, removeOnly) {
  if (isUndef(vnode)) {
    if (isDef(oldVnode)) invokeDestroyHook(oldVnode);
    return;
  }

  let isInitialPatch = false;
  const insertedVnodeQueue = [];

  if (isUndef(oldVnode)) {
    // empty mount (likely as component), create new root element
    isInitialPatch = true;
    createElm(vnode, insertedVnodeQueue);
  } else {
    const isRealElement = isDef(oldVnode.nodeType);
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // patch existing root node
      patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
    } else {
      // 新旧节点不同时执行的逻辑
      if (isRealElement) {
        // ...
      }

      // replacing existing element
      const oldElm = oldVnode.elm;
      const parentElm = nodeOps.parentNode(oldElm);

      // create new node
      createElm(
        vnode,
        insertedVnodeQueue,
        // extremely rare edge case: do not insert if old element is in a
        // leaving transition. Only happens when combining transition +
        // keep-alive + HOCs. (#4590)
        oldElm._leaveCb ? null : parentElm,
        nodeOps.nextSibling(oldElm),
      );

      // update parent placeholder node element, recursively
      if (isDef(vnode.parent)) {
        let ancestor = vnode.parent;
        const patchable = isPatchable(vnode);
        while (ancestor) {
          for (let i = 0; i < cbs.destroy.length; ++i) {
            cbs.destroy[i](ancestor);
          }
          ancestor.elm = vnode.elm;
          if (patchable) {
            for (let i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, ancestor);
            }
            // #6513
            // invoke insert hooks that may have been merged by create hooks.
            // e.g. for directives that uses the "inserted" hook.
            const insert = ancestor.data.hook.insert;
            if (insert.merged) {
              // start at index 1 to avoid re-invoking component mounted hook
              for (let i = 1; i < insert.fns.length; i++) {
                insert.fns[i]();
              }
            }
          } else {
            registerRef(ancestor);
          }
          ancestor = ancestor.parent;
        }
      }

      // destroy old node
      if (isDef(parentElm)) {
        removeVnodes(parentElm, [oldVnode], 0, 0);
      } else if (isDef(oldVnode.tag)) {
        invokeDestroyHook(oldVnode);
      }
    }
  }

  invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
  return vnode.elm;
};
```

### updateChildren

```js
function updateChildren(
  parentElm,
  oldCh,
  newCh,
  insertedVnodeQueue,
  removeOnly,
) {
  let oldStartIdx = 0; // 初始化旧虚拟节点的起始索引为 0。
  let newStartIdx = 0; // 初始化新虚拟节点的起始索引为 0。
  let oldEndIdx = oldCh.length - 1; // 初始化旧虚拟节点的结束索引为旧虚拟节点数组的长度减 1。
  let oldStartVnode = oldCh[0]; // 获取旧虚拟节点数组中的第一个节点作为起始节点。
  let oldEndVnode = oldCh[oldEndIdx]; // 获取旧虚拟节点数组中的最后一个节点作为结束节点。
  let newEndIdx = newCh.length - 1; // 初始化新虚拟节点的结束索引为新虚拟节点数组的长度减 1。
  let newStartVnode = newCh[0]; // 获取新虚拟节点数组中的第一个节点作为起始节点。
  let newEndVnode = newCh[newEndIdx]; // 获取新虚拟节点数组中的最后一个节点作为结束节点。
  let oldKeyToIdx, idxInOld, vnodeToMove, refElm; // 定义一些变量，用于后续的逻辑处理。

  // removeOnly is a special flag used only by <transition-group>
  // to ensure removed elements stay in correct relative positions
  // during leaving transitions
  const canMove = !removeOnly; //  如果 removeOnly 不为 true，则设置 canMove 为 true。 removeOnly 是一个特殊的标志，用于确保在离开过渡期间移除的元素保持在正确的相对位置。

  if (process.env.NODE_ENV !== "production") {
    checkDuplicateKeys(newCh);
  }

  // 当旧虚拟节点的起始索引小于等于结束索引，且新虚拟节点的起始索引小于等于结束索引时，执行循环体内的代码。
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 处理了旧虚拟节点数组中可能存在的空节点（undefined）
    if (isUndef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx]; // 如果 oldStartVnode 为空，则将 oldStartIdx 向右移动一位，并将 oldStartVnode 设置为新的旧起始节点
    } else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx]; // 如果 oldEndVnode 为空，则将 oldEndIdx 向左移动一位，并将 oldEndVnode 设置为新的旧结束节点
    }
    // 用于比较旧起始节点和新起始节点是否相同
    else if (sameVnode(oldStartVnode, newStartVnode)) {
      // 如果它们相同，则调用 patchVnode 函数更新节点，并将旧和新的起始索引都向右移动一位。
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    }
    // 用于比较旧结束节点和新结束节点是否相同
    else if (sameVnode(oldEndVnode, newEndVnode)) {
      // 如果它们相同，则调用 patchVnode 函数更新节点，并将旧和新的结束索引都向左移动一位。
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    }
    // 用于处理旧起始节点移动到了新结束节点的情况
    else if (sameVnode(oldStartVnode, newEndVnode)) {
      // Vnode moved right
      // 首先调用 patchVnode 函数更新节点，然后将旧起始节点移动到新结束节点的后面。最后，更新旧和新的起始索引。
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
      canMove &&
        nodeOps.insertBefore(
          parentElm,
          oldStartVnode.elm,
          nodeOps.nextSibling(oldEndVnode.elm),
        );
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    }
    // 用于处理旧结束节点移动到了新起始节点的情况。
    else if (sameVnode(oldEndVnode, newStartVnode)) {
      // Vnode moved left
      // 首先调用 patchVnode 函数更新节点，然后将旧结束节点移动到旧起始节点的前面。最后，更新旧和新的结束索引。
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
      canMove &&
        nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    }
    // 这个 else 分支处理了旧节点和新节点不匹配的情况
    else {
      // 根据新节点是否存在于旧节点中来决定是创建新节点还是更新旧节点。
      // 检查是否已经创建了 oldKeyToIdx 对象。  如果没有，则调用 createKeyToOldIdx 函数创建一个以旧节点的 key 为键，索引为值的对象，用于快速查找新节点是否存在于旧节点中。
      if (isUndef(oldKeyToIdx))
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      // 如果新节点有 key 属性，则通过 oldKeyToIdx 对象快速查找新节点在旧节点数组中的索引位置； 否则，通过 findIdxInOld 函数线性搜索新节点在旧节点数组中的位置。
      idxInOld = isDef(newStartVnode.key)
        ? oldKeyToIdx[newStartVnode.key]
        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);

      // 如果在旧节点数组中找不到与新节点相匹配的节点（即 idxInOld 为 undefined） 则表示新节点是一个全新的节点，需要创建它
      if (isUndef(idxInOld)) {
        // 调用 createElm 函数来创建新节点，并将其插入到旧节点数组中。
        createElm(
          newStartVnode,
          insertedVnodeQueue,
          parentElm,
          oldStartVnode.elm,
          false,
          newCh,
          newStartIdx,
        );
      }
      // 如果在旧节点数组中找到了与新节点相匹配的节点（即 idxInOld 不为 undefined）
      else {
        // 获取在旧节点数组中找到的与新节点相匹配的节点，并将其保存在 vnodeToMove 变量中
        vnodeToMove = oldCh[idxInOld];
        // 然后，比较这两个节点是否相同。
        if (sameVnode(vnodeToMove, newStartVnode)) {
          // 如果它们相同，则调用 patchVnode 函数来更新旧节点，并将旧节点数组中对应位置的节点设为 undefined。
          patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
          oldCh[idxInOld] = undefined;
          // 最后，如果允许移动节点，则将找到的节点移动到旧起始节点的前面
          canMove &&
            nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
        } else {
          // same key but different element. treat as new element
          // 如果它们不相同，则将新节点视为全新的节点，并调用 createElm 函数来创建它。
          createElm(
            newStartVnode,
            insertedVnodeQueue,
            parentElm,
            oldStartVnode.elm,
            false,
            newCh,
            newStartIdx,
          );
        }
      }
      newStartVnode = newCh[++newStartIdx];
    }
  }
  // 在处理剩余的节点，如果旧节点数组中有剩余的节点，或者新节点数组中有剩余的节点，就会继续执行相应的操作
  if (oldStartIdx > oldEndIdx) {
    // 如果旧节点数组的起始索引大于结束索引，说明旧节点数组中有剩余的节点，需要将这些节点从 DOM 中移除。
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
    // 根据新节点数组中是否还有节点，决定新节点的插入位置，然后调用 addVnodes 函数将剩余的新节点插入到 DOM 中。
    addVnodes(
      parentElm,
      refElm,
      newCh,
      newStartIdx,
      newEndIdx,
      insertedVnodeQueue,
    );
  } else if (newStartIdx > newEndIdx) {
    // 如果新节点数组的起始索引大于结束索引，说明新节点数组中有剩余的节点，需要将这些节点添加到 DOM 中。在这种情况下，没有旧节点数组中的节点需要移除，所以不需要执行移除节点的操作。
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
  }
}
```
