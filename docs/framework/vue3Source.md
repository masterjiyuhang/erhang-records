## Vue3.x 做了什么优化

- 源码体积优化
  - 首先，移除一些冷门的 feature（比如 filter、inline-template 等）；
  - 其次，引入 tree-shaking 的技术，减少打包体积。
- 数据拦截优化
  - 通过 Object.defineProperty 这个 API 去劫持数据的 getter 和 setter
    - 必须预先知道要拦截的 key 是什么，所以它并不能检测对象属性的添加和删除。尽管 Vue.js 为了解决这个问题提供了 $set 和 $delete 实例方法，但是对于用户来说，还是增加了一定的心智负担。
    - Vue.js 无法判断你在运行时到底会访问到哪个属性，所以对于这样一个嵌套层级较深的对象，如果要劫持它内部深层次的对象变化，就需要递归遍历这个对象，执行 Object.defineProperty 把每一层对象数据都变成响应式的。
  - Vue.js 3.0 使用了 Proxy API 做数据劫持
    - 它劫持的是整个对象，那么自然对于对象的属性的增加和删除都能检测到
    - Proxy API 并不能监听到内部深层次的对象变化，因此 Vue.js 3.0 的处理方式是在 getter 中去递归响应式，这样的好处是真正访问到的内部对象才会变成响应式，而不是无脑递归
    - 这样无疑也在很大程度上提升了性能，我会在后面分析响应式章节详细介绍它的具体实现原理
- 编译优化
  - Vue2编译流程
    - New Vue ,init, $mount, compile, render, vnode, path, DOM
    - template compile to render function 的流程是可以借助 vue-loader 在 webpack 编译阶段离线完成，并非一定要在运行时完成。
  - 在耗时相对较多的 patch 阶段进行优化
    - Vue.js 2.x 的数据更新并触发重新渲染的粒度是组件级的，单个组件内部依然需要遍历该组件的整个 vnode 树。
    - Vue.js 3.x 通过编译阶段对静态模板的分析，编译生成了 Block tree。
      - Block tree 是一个将模版基于动态节点指令切割的嵌套区块，每个区块内部的节点结构是固定的，而且每个区块只需要以一个 Array 来追踪自身包含的动态节点。
      - 借助 Block tree，Vue.js 将 vnode 更新性能由与模版整体大小相关提升为与动态内容的数量相关，这是一个非常大的性能突破，我会在后续的章节详细分析它是如何实现的。
- 语法 API 优化
  - 组合式API
    - 某个逻辑关注点相关的代码全都放在一个函数里，这样当需要修改一个功能时，就不再需要在文件中跳来跳去。
    - 类似hooks
  - 选项式API
    - Options API 的设计是按照 methods、computed、data、props 这些不同的选项分类，当组件小的时候，这种分类方式一目了然；
    - 但是在大型组件中，一个组件可能有多个逻辑关注点，当使用 Options API 的时候，每一个关注点都有自己的 Options，如果需要修改一个逻辑点关注点，就需要在单个文件中不断上下切换和寻找

## VNode 到 DOM 经历了什么

1. 创建 vnode - 渲染 vnode - 生成 DOM
2. createApp方法
   1. 创建app对象 ` const app = ensureRenderer().createApp(...args)`
   2.
