## 生命周期

### Vue3 生命周期

<img :src="'https://cn.vuejs.org/assets/lifecycle.16e4c08e.png'"/>

### Vue 父组件能够监听到的子组件的生命周期有哪些？

- 在 Vue 2 中，可以监听到的子组件的生命周期钩子函数有：
  - beforeCreate：在实例初始化之后，数据观测(data observer) 和 event/watcher 事件配置之前被调用。
  - created：实例创建完成后被立即调用。
    - 在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。
  - beforeMount：在挂载开始之前被调用：相关的 render 函数首次被调用。
  - mounted：el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。
  - beforeUpdate：数据更新时调用，发生在虚拟 DOM 打补丁之前。
  - updated：由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
  - beforeDestroy：实例销毁之前调用。在这一步，实例仍然完全可用。
  - destroyed：实例销毁后调用。调用后，所有的事件监听器会被移除，所有的子实例也会被销毁。
  -
- 在 Vue 3 中，组合式 API 的引入带来了一些变化。可以监听到的子组件的生命周期钩子函数有：
  - onBeforeMount：在挂载开始之前被调用。
  - onMounted：在挂载完成后被调用。
  - onBeforeUpdate：在更新开始之前被调用。
  - onUpdated：在更新完成后被调用。
  - onBeforeUnmount：在卸载开始之前被调用。
  - onUnmounted：在卸载完成后被调用。

值得注意的是，在 Vue 3 中，beforeCreate 和 created 钩子函数不再被支持，取而代之的是 setup 函数，它在组件实例创建之前被调用，因此在 setup 函数中可以执行类似 beforeCreate 和 created 阶段的操作。此外，beforeDestroy 和 destroyed 钩子函数也被重命名为 onBeforeUnmount 和 onUnmounted。
