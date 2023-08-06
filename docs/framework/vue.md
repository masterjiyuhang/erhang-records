## 1. vue2 和 vue3 有什么区别？

### 1.1 proxy 怎么解决的 define property 的缺点？

Proxy 是 ES6 引入的一个功能强大的内置对象，用于创建一个代理对象，可以拦截并改变底层对象的默认行为。通过使用 Proxy，我们可以解决 Object.defineProperty 的一些限制和缺点。

下面是一些 Proxy 的特点和如何解决 defineProperty 的缺点：

更全面的拦截操作：Proxy 提供了一系列拦截操作，比如 get、set、deleteProperty、apply 等。这使得我们可以拦截更多类型的操作，而不仅限于属性的读取和修改。

动态属性拦截：使用 Proxy 可以动态地拦截属性的读取和设置，而不需要事先定义属性。这与 defineProperty 不同，后者需要在对象创建时定义属性。

简化属性访问：通过使用 Proxy，我们可以通过在代理对象上直接访问属性，而无需通过特殊的 get 和 set 方法。这使得代码更简洁、易读。

更好的性能：相比于 defineProperty，Proxy 的性能更好。这是因为 Proxy 在底层实现上更加优化，拦截操作更高效。

需要注意的是，Proxy 是 ES6 引入的新特性，不支持老版本的浏览器。在使用 Proxy 时，需要确保目标环境支持它，或者使用相应的 polyfill 进行兼容处理。

综上所述，Proxy 提供了更灵活和强大的对象拦截功能，可以解决 defineProperty 的一些限制，并提供了更好的性能和简化的语法。

### 1.2 vue3 相比较 vue2 的 diff 算法有哪些优化

Vue 3 在与 Vue 2 相比的 diff 算法上进行了一些优化，主要包括以下几点：

静态节点提升（Static Node Hoisting）： Vue 3 使用了更高效的静态节点提升技术，将静态节点在编译阶段就提升为常量，避免了运行时的重复创建和比对。这样可以减少虚拟 DOM 的节点数，从而提高了渲染性能。
在 Vue 2 中，每次组件渲染时，都会生成新的虚拟 DOM 树，即使是静态节点也会重新创建。
但在 Vue 3 中，编译器会将模板中的静态节点（即不会改变的节点）在编译阶段优化，并将它们提升为常量。
这样在每次渲染时，静态节点不需要重新创建，减少了虚拟 DOM 的节点数，提高了渲染性能。

事件侦听器缓存： Vue 3 通过事件侦听器的缓存，减少了对事件处理函数的重复创建。在 Vue 2 中，每次渲染都会重新创建事件侦听器，而 Vue 3 会对事件处理函数进行缓存，从而减少了不必要的重复创建和销毁。
在 Vue 2 中，每次渲染时都会重新创建事件侦听器，即使事件处理函数是相同的。但在 Vue 3 中，会对事件处理函数进行缓存，只有在事件处理函数发生变化时才会重新创建。这样可以减少对事件处理函数的重复创建和销毁，提高了性能。

更细粒度的依赖追踪： Vue 3 使用了基于 Proxy 的响应式系统，相比 Vue 2 的 Object.defineProperty，可以实现更细粒度的依赖追踪。这样在数据变化时，只会触发实际依赖的更新，避免了不必要的更新操作，提高了性能。

优化的数组更新： Vue 3 对数组的更新进行了优化，采用了类似 React 的技术，通过索引跟踪和避免遍历整个数组来更高效地处理数组的变化。

Fragment 的支持： Vue 3 支持 Fragment（碎片），可以在模板中使用多个根级别的元素，而无需包裹额外的标签。这样可以减少 DOM 元素的数量，提高渲染性能。
Vue 3 支持 Fragment（碎片），即允许在模板中使用多个根级别的元素，而无需包裹额外的标签。在 Vue 2 中，模板中必须有一个根级别的元素，这可能会导致生成不必要的 DOM 元素。而在 Vue 3 中，Fragment 可以减少 DOM 元素的数量，提高渲染性能。

更好的 Tree-Shaking： Vue 3 的代码结构更利于 Tree-Shaking，可以在构建时更轻松地去除未使用的代码，从而减少最终的包体积。

Composition API 的优化： Vue 3 的 Composition API 具有更好的可组合性，可以更灵活地组织和复用逻辑，提高了代码的可维护性和可读性。

总的来说，Vue 3 在 diff 算法上进行了多方面的优化和改进，使得渲染性能得到了显著的提升，并且提供了更好的开发体验和更灵活的 API。如果你在项目中使用 Vue 3，可以享受到这些优化带来的好处。

#### 1.2.1 proxy 为什么相比 Vue 2 的 Object.defineProperty，可以实现更细粒度的依赖追踪。

Proxy 相比 Vue 2 的 Object.defineProperty 可以实现更细粒度的依赖追踪，主要有以下几个原因：

动态属性： Object.defineProperty 只能用于对对象已有的属性进行劫持，无法劫持对象新增的属性和删除的属性。而 Proxy 可以劫持对象所有的属性，包括新增的属性和删除的属性，从而可以更细粒度地进行依赖追踪。

数组变化： 在 Vue 2 中，对数组的响应式处理是通过重写数组的原型方法实现的，然后在这些方法中触发更新。但是这种方式有一定的局限性，无法捕获通过索引直接设置数组元素的变化。而 Proxy 可以直接监听数组的操作，如直接设置索引对应的元素，从而更准确地追踪数组的变化。

性能优化： Proxy 的性能通常比 Object.defineProperty 更好。在 Vue 2 中，每个响应式对象的属性都需要通过 Object.defineProperty 进行劫持，导致在大量数据变化时性能下降。而 Proxy 是通过代理整个对象来劫持操作，从而减少了对单个属性的劫持操作，提高了性能。

深层对象： Vue 2 对深层对象的响应式处理有一定的限制，需要在对象中预先定义属性并调用 Vue.set 或 this.$set 才能追踪其变化。而 Proxy 可以实现递归劫持，无论是对象的深层属性还是嵌套数组，都可以实现细粒度的依赖追踪，而无需预先定义属性。

降低内存消耗： 在 Vue 2 中，每个响应式对象需要维护一个响应式的 getter 和 setter，以及一个依赖收集的观察者列表。这些都会带来一定的内存消耗。而 Proxy 只需要一个全局的 Proxy 对象来代理整个对象，不需要为每个属性都创建 getter 和 setter，从而降低了内存消耗。

综上所述，Proxy 相比 Object.defineProperty 具有更多优势，特别是在处理动态属性、数组变化和深层对象时，可以实现更细粒度的依赖追踪，并且性能更优，更适合用于实现 Vue 3 中的响应式系统。

### 1.3 setup 语法糖， setup 函数相当于 vue2 里面的什么呢？

在 Vue 3 中，setup 是一个新的选项，它用于替代 Vue 2 中的一部分逻辑。setup 函数是组件的入口点，它在组件实例被创建之前被调用，并且在组件实例创建时被调用一次。setup 函数接收两个参数：props 和 context。

props：props 是一个响应式对象，包含了从父组件传递过来的属性。在 setup 函数中，你可以直接使用 props 对象的属性，无需在 setup 函数中使用 this 访问。

context：context 是一个包含了一些实用方法和属性的上下文对象。它包含了 attrs、slots、emit 等。你可以通过解构赋值或直接使用 context 对象来访问这些属性。

在 setup 函数中，你可以执行一些初始化逻辑，设置响应式数据，定义计算属性，监听事件，调用其他函数等等。setup 函数中返回的数据会在组件的模板中使用。

setup 函数相当于 Vue 2 中的 beforeCreate 和 created 钩子函数的组合，但是它比这两个钩子函数更加灵活，且能够访问到 props 和 context。在 setup 函数中，你可以自由地处理组件的状态和行为。

需要注意的是，setup 函数是一个普通的 JavaScript 函数，而不是 Vue 2 中的选项对象，所以在其中无法使用 this 访问组件实例，也无法使用 Vue 2 中的一些选项，比如 data、computed、methods 等。如果你需要使用这些选项，可以在 setup 函数中使用其他方式实现，比如使用 ref、reactive、computed 等 Vue 3 的 Composition API 提供的函数。

总结起来，setup 语法糖是 Vue 3 中提供的一个更灵活、更强大的组件初始化方式，它能够让你更好地组织和管理组件的状态和行为。

#### 1.3.1 setup 中怎么设置组件 name?

### 1.4 reactive 和 shallow Reactive 有什么区别？

reactive：
reactive 函数会对整个对象进行递归响应式处理，即对象中的所有嵌套属性也会被转换成响应式对象。
当通过 reactive 创建的响应式对象的属性值发生变化时，会触发依赖该属性的相关响应式更新。

shallowReactive：
shallowReactive 函数只会对对象的第一层属性进行响应式处理，而不会对嵌套的属性进行递归响应式处理。
当通过 shallowReactive 创建的响应式对象的第一层属性值发生变化时，会触发依赖该属性的相关响应式更新。但是，如果该属性的值是一个对象，而这个对象内部的属性发生变化，将不会触发更新。

在大多数情况下，推荐使用 reactive 来创建响应式对象，因为它可以深度递归地处理嵌套对象，使整个对象及其嵌套属性都能触发响应式更新。只有在特定的情况下，需要避免深度递归处理对象时，才会使用 shallowReactive。

### 1.5 ref toRefs isRef 怎么使用?

在 Vue 3 的 Composition API 中，ref、toRefs 和 isRef 是用于处理响应式数据的函数。

ref：
ref 函数用于将普通数据转换为响应式数据，使其能够在组件中进行响应式更新。
使用 ref 函数创建的响应式数据是一个包装对象，可以通过 .value 属性来访问其原始值。
示例代码：

```javascript
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // Output: 0

count.value = 10 // This will trigger reactivity
console.log(count.value) // Output: 10
```

toRefs：
toRefs 函数用于将响应式对象转换为普通对象，并将每个属性都转换为 ref 包装。
使用 toRefs 后，可以通过 .value 属性来访问每个属性的原始值，使其在模板中能够正常使用响应式数据。
示例代码：

```javascript
import { reactive, toRefs } from 'vue'

const state = reactive({
  name: 'John',
  age: 30
})

const refs = toRefs(state)

console.log(refs.name.value) // Output: "John"

refs.name.value = 'Alice' // This will trigger reactivity
console.log(state.name) // Output: "Alice"
```

isRef：
isRef 函数用于检查一个值是否是由 ref 创建的响应式数据。
如果传入的值是由 ref 创建的，则返回 true；否则返回 false。
示例代码：

```javascript
import { ref, isRef } from 'vue'

const count = ref(0)
const name = 'John'

console.log(isRef(count)) // Output: true
console.log(isRef(name)) // Output: false
```

### 1.6 readonly isReadOnly shallowReadonly 怎么使用?

在 Vue 3 的 Composition API 中，`readonly`、`isReadOnly` 和 `shallowReadonly` 是用于处理只读数据的函数。

1. `readonly`：
   - `readonly` 函数用于将普通数据转换为只读的响应式数据，使其不能在组件中进行修改。
   - 使用 `readonly` 函数创建的只读响应式数据是一个包装对象，可以通过 `.value` 属性来访问其原始值。
   - 示例代码：

```javascript
import { readonly } from 'vue'

const data = { name: 'John', age: 30 }
const readonlyData = readonly(data)

console.log(readonlyData.name) // Output: "John"

// Attempt to modify readonlyData will throw an error
// readonlyData.name = 'Alice'; // This will throw an error
```

2. `isReadOnly`：
   - `isReadOnly` 函数用于检查一个值是否是由 `readonly` 创建的只读响应式数据。
   - 如果传入的值是由 `readonly` 创建的，则返回 `true`；否则返回 `false`。
   - 示例代码：

```javascript
import { readonly, isReadOnly } from 'vue'

const data = { name: 'John', age: 30 }
const readonlyData = readonly(data)

console.log(isReadOnly(readonlyData)) // Output: true
console.log(isReadOnly(data)) // Output: false
```

3. `shallowReadonly`：
   - `shallowReadonly` 函数用于将普通对象转换为只读的浅响应式对象，使对象的属性变成只读的，但不会递归将嵌套的对象属性转换为只读的。
   - 使用 `shallowReadonly` 函数创建的只读浅响应式对象可以通过 `.value` 属性来访问其原始值。
   - 示例代码：

```javascript
import { shallowReadonly } from 'vue'

const data = { name: 'John', info: { age: 30 } }
const shallowReadonlyData = shallowReadonly(data)

console.log(shallowReadonlyData.name) // Output: "John"
console.log(shallowReadonlyData.info.age) // Output: 30

// Attempt to modify shallowReadonlyData will throw an error
// shallowReadonlyData.name = 'Alice'; // This will throw an error
// shallowReadonlyData.info.age = 31; // This will NOT throw an error
```

使用 `readonly`、`isReadOnly` 和 `shallowReadonly` 可以很方便地处理只读数据，并确保数据在组件中不会被修改。

#### 1.6.1 readonly 和 const 有什么区别？

const 是赋值保护，使用 const 定义的变量，该变量不能重新赋值。但如果 const 赋值的是对象，那么对象里面的东西是可以改的。原因是 const 定义的变量不能改说的是，对象对应的那个地址不能改变
而 readonly 是属性保护，不能给属性重新赋值

### 1.7 vue3 生命周期的变化？

在 Vue 3 中，由于采用了 Composition API 的设计，生命周期的使用方式发生了一些变化。传统的生命周期钩子函数被移除，取而代之的是可以在 `setup` 函数中使用特定的函数来模拟生命周期的行为。

1. `setup` 函数：
   - 在 Vue 3 中，组件的逻辑代码通常会写在 `setup` 函数中。
   - `setup` 函数在组件创建过程中会被调用，用于初始化组件的状态和行为。
   - 在 `setup` 函数中可以使用 Vue 提供的响应式函数和其他 API 来处理数据和逻辑。
   - 示例代码：

```javascript
import { reactive, onMounted, onUpdated, onUnmounted } from 'vue'

export default {
  setup() {
    // 声明响应式状态
    const state = reactive({
      count: 0
    })

    // 组件挂载后执行
    onMounted(() => {
      console.log('Component mounted')
    })

    // 组件更新后执行
    onUpdated(() => {
      console.log('Component updated')
    })

    // 组件卸载前执行
    onUnmounted(() => {
      console.log('Component unmounted')
    })

    // 返回响应式状态和模板中需要使用的方法
    return {
      state,
      increment() {
        state.count++
      }
    }
  }
}
```

2. 生命周期模拟函数：

   - 在 `setup` 函数中，可以使用一些特定的函数来模拟传统的生命周期行为。
   - 例如，可以使用 `onMounted`、`onUpdated` 和 `onUnmounted` 函数分别模拟组件的挂载、更新和卸载生命周期。
   - `onMounted` 在组件挂载后执行，`onUpdated` 在组件更新后执行，`onUnmounted` 在组件卸载前执行。
   - 示例代码见上面的 `setup` 函数示例。

3. `beforeCreate` 和 `created`：

   - 在 Vue 3 中，`beforeCreate` 和 `created` 生命周期钩子函数被移除了，取而代之的是使用 `setup` 函数来进行组件的初始化操作。

4. 其他生命周期钩子函数：
   - 在 Vue 3 中，其他传统的生命周期钩子函数（如 `beforeMount`、`mounted`、`beforeUpdate`、`updated`、`beforeDestroy` 和 `destroyed`）也被移除了。
   - 相关的生命周期行为可以通过 `setup` 函数中的模拟函数来处理。

总的来说，Vue 3 的生命周期变化主要体现在使用 `setup` 函数来处理组件的初始化和生命周期行为，同时移除了传统的生命周期钩子函数，使组件的逻辑更加集中和灵活。

### 1.8 组合式 api 和 选项式 api 的区别有哪些？

组合式 API（Composition API）和选项式 API 是 Vue.js 中两种不同的组件编写风格和方式。它们有一些明显的区别，如下所示：

选项式 API：

1. 传统的 Vue.js 组件编写方式采用选项式 API。
2. 使用选项式 API，组件的选项（data、methods、computed、watch 等）都是在一个对象中声明。
3. 在大型组件中，选项式 API 可能导致代码复杂度增加，难以维护。

组合式 API（Composition API）：

1. 组合式 API 是 Vue.js 3 引入的一种新的组件编写方式。
2. 使用组合式 API，可以通过将逻辑功能按照功能进行分组，将相关功能组织成一个独立的函数，从而使代码更加模块化、可读性更好。
3. 组合式 API 中的函数可以在 `setup` 函数中被调用，并且可以返回数据、方法等供模板使用。
4. 组合式 API 可以在多个组件之间共享逻辑，提高了代码的可重用性。

主要区别：

1. 组合式 API 更加灵活，能够更好地组织代码，使代码更加模块化和可读性更好。
2. 组合式 API 支持在多个组件之间共享逻辑，而选项式 API 中的逻辑复用需要通过 mixins 或高阶组件来实现，不够直观和优雅。
3. 组合式 API 可以更好地解决 Vue 2 中 mixins 带来的一些问题，例如命名冲突、混乱的调用顺序等。

总的来说，组合式 API 是 Vue.js 3 中引入的一种更加灵活和强大的组件编写方式，它能够更好地解决 Vue 2 中选项式 API 在大型组件中的一些问题，提高了代码的可读性、可维护性和复用性。对于新的项目和组件，推荐使用组合式 API 编写。对于现有的 Vue 2 项目，也可以逐渐迁移到组合式 API 来提升代码质量和开发效率。

### 1.9 vue3 里面的 v-model 语法怎么实现。 对比 vue2 有区别吗？

在 Vue 3 中，v-model 语法的实现与 Vue 2 有一些区别。

在 Vue 2 中，v-model 用于实现表单元素和组件之间的双向绑定，可以通过在组件中使用 `props` 属性来接收外部传入的数据，并通过在组件内部使用 `$emit` 方法来触发事件，从而实现父组件和子组件之间的数据双向绑定。

在 Vue 3 中，由于引入了组合式 API，v-model 的实现方式发生了变化。现在，v-model 被认为是一个语法糖，其实质是对组件内部的 `props` 和 `emit` 的包装，使得组件的双向绑定更加简洁和直观。

在 Vue 3 中，可以通过 `defineProps` 函数来定义组件的 `props`，通过 `defineEmits` 函数来定义组件的事件，然后在模板中使用 `v-model` 来实现双向绑定。

下面是一个示例，展示了 Vue 3 中如何使用 v-model：

```javascript
// 子组件 ChildComponent.vue
<script setup>
import { defineProps, defineEmits } from 'vue'

const { value } = defineProps(['modelValue'])
const emit = defineEmits()

const handleChange = (newValue) => {
  emit('update:modelValue', newValue)
}
</script>

<template>
  <input :value="value" @input="handleChange($event.target.value)" />
</template>
```

```javascript
// 父组件 ParentComponent.vue
<template>
  <child-component v-model="message" />
</template>

<script>
import ChildComponent from './ChildComponent.vue'

export default {
  components: {
    ChildComponent
  },
  data() {
    return {
      message: ''
    }
  }
}
</script>
```

在上述示例中，子组件 `ChildComponent` 中使用了 `defineProps` 定义了 `props`，并使用 `defineEmits` 定义了 `emit` 方法。在模板中，使用 `v-model` 来实现父组件和子组件之间的双向绑定。当子组件的输入框内容发生变化时，会通过 `emit` 方法触发事件 `update:modelValue`，从而将新的值传递给父组件，实现数据的双向绑定。

需要注意的是，在 Vue 3 中，v-model 只是一个语法糖，其实质是基于 `props` 和 `emit` 实现的。因此，如果在子组件中需要使用 v-model，必须在组件选项中定义名为 `modelValue` 的 `props`，以及触发名为 `update:modelValue` 的事件。这样才能使 v-model 正常工作。

### 1.10 组件通信的方式有哪些？ 两个版本有什么变化吗？

在 Vue 3 中，组件通信的方式与 Vue 2 有一些变化，主要是由于引入了组合式 API 和更加灵活的响应式系统。以下是 Vue 3 中常见的组件通信方式：

1. Props 和 Events：这是 Vue 2 和 Vue 3 中最常见的组件通信方式。父组件通过 props 将数据传递给子组件，子组件通过 $emit 方法触发事件，将数据传递回父组件。在 Vue 3 中，可以使用 `defineProps` 和 `defineEmits` 来定义组件的 props 和 events。

2. Provide 和 Inject：这是 Vue 2 中较少使用的一种组件通信方式，但在 Vue 3 中得到了改进和推广。通过在父组件中使用 `provide` 来提供数据，在子组件中使用 `inject` 来注入数据。这样可以实现跨层级的组件通信。

3. Composables（组合式 API）：Vue 3 中引入了组合式 API，允许将相关的逻辑封装在一个独立的函数中，然后在组件中使用。通过组合式 API，可以更灵活地实现组件之间的通信和共享逻辑。

4. Teleport（传送）：Vue 3 中引入了 Teleport，允许将组件的内容渲染到指定的 DOM 元素上，从而实现在 DOM 树中的不同位置渲染组件内容，实现更灵活的组件布局和通信。

5. Custom Events（自定义事件）：Vue 3 中可以使用 `emits` 选项来定义组件支持的自定义事件，这样可以更明确地定义组件的通信行为。

相比于 Vue 2，Vue 3 引入了组合式 API 和 Teleport，使得组件通信更加灵活和方便。通过组合式 API，可以将相关的逻辑封装在独立的函数中，实现逻辑的复用和组合。而 Teleport 则允许在 DOM 树中的不同位置渲染组件内容，从而实现更灵活的布局和通信。此外，在 Vue 3 中使用 `defineProps` 和 `defineEmits` 来定义组件的 props 和 events，使得组件通信更加直观和易于维护。总体而言，Vue 3 提供了更加强大和灵活的组件通信方式，让开发者可以更方便地构建复杂的应用程序。

#### 举例说明

当谈到 Vue 3 中组件通信的方式时，我们可以对每种方式进行更详细的解释，并提供具体的示例。

1. Props 和 Events：

在 Vue 3 中，Props 和 Events 的用法与 Vue 2 相似，父组件通过 Props 向子组件传递数据，子组件通过$emit 方法触发事件将数据传递回父组件。这是最常见的父子组件通信方式。

```javascript
<!-- ParentComponent.vue -->
<template>
  <div>
    <!-- 将message作为prop传递给子组件 -->
    <ChildComponent :message="message" @update-message="updateMessage" />
  </div>
</template>

<script>
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

export default {
  components: {
    ChildComponent
  },
  setup() {
    const message = ref('Hello from parent')

    // 监听子组件触发的update-message事件
    const updateMessage = (newMessage) => {
      message.value = newMessage
    }

    return {
      message,
      updateMessage
    }
  }
}
</script>

<!-- ChildComponent.vue -->
<template>
  <div>
    <button @click="sendMessageToParent">Send Message to Parent</button>
  </div>
</template>

<script>
import { defineProps, defineEmits } from 'vue'

export default {
  setup() {
    // 定义子组件接收的props和发送的事件
    const props = defineProps(['message'])
    const emits = defineEmits(['updateMessage'])

    // 子组件中的逻辑
    const sendMessageToParent = () => {
      // 触发update-message事件，将新的消息传递给父组件
      emits('updateMessage', 'Hello from child')
    }

    return {
      sendMessageToParent
    }
  }
}
</script>
```

2. Provide 和 Inject：

Provide 和 Inject 是一种用于跨层级组件通信的方式。父组件通过 provide 提供数据，然后子孙组件通过 inject 来接收数据。这样可以在组件树的不同层级之间共享数据。

```javascript
<!-- ParentComponent.vue -->
<template>
  <div>
    <!-- 提供数据给子组件 -->
    <ChildComponent />
  </div>
</template>

<script>
import { provide, ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

export default {
  components: {
    ChildComponent
  },
  setup() {
    const message = ref('Hello from parent')

    // 提供数据给子组件
    provide('message', message)

    return {
      message
    }
  }
}
</script>

<!-- ChildComponent.vue -->
<template>
  <div>
    <!-- 接收父组件提供的数据 -->
    <p>{{ injectedMessage }}</p>
  </div>
</template>

<script>
import { inject } from 'vue'

export default {
  setup() {
    // 接收父组件提供的数据
    const injectedMessage = inject('message')

    return {
      injectedMessage
    }
  }
}
</script>
```

3. Composables（组合式 API）：

Composables 是 Vue 3 引入的一种新的组件通信方式。通过封装相关的逻辑在可重用的函数中，然后在组件中使用这些函数来实现通信和逻辑共享。

```javascript
<!-- ParentComponent.vue -->
<template>
  <div>
    <!-- 使用composable实现通信 -->
    <ChildComponent />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useMessage } from './composables/useMessage'
import ChildComponent from './ChildComponent.vue'

export default {
  components: {
    ChildComponent
  },
  setup() {
    const { message, updateMessage } = useMessage()

    return {
      message,
      updateMessage
    }
  }
}
</script>

<!-- ChildComponent.vue -->
<template>
  <div>
    <button @click="sendMessageToParent">Send Message to Parent</button>
  </div>
</template>

<script>
import { useMessage } from './composables/useMessage'

export default {
  setup() {
    const { sendMessage } = useMessage()

    // 子组件中的逻辑
    const sendMessageToParent = () => {
      sendMessage('Hello from child')
    }

    return {
      sendMessageToParent
    }
  }
}
</script>
```

```javascript
<!-- composables/useMessage.js -->
import { ref } from 'vue';

export function useMessage() {
  const message = ref('Hello from parent');

  const updateMessage = (newMessage) => {
    message.value = newMessage;
  };

  const sendMessage = (newMessage) => {
    updateMessage(newMessage);
  };

  return {
    message,
    updateMessage,
    sendMessage,
  };
}

```

在 Vue 3 中，以上几种通信方式都是可用的，但由于组合式 API 的引入，使得 Composables 变得更加强大和灵活，可以更好地实现组件之间的通信和逻辑共享。而 Teleport 则是一个全新的特性，可以用于在 DOM 树中不同位置渲染组件内容，从而实现更灵活的布局和通信。总的来说，Vue 3 提供了更多的选择和更灵活的方式来进行组件通信。

### 1.11 Vue3 中父子传值 , 用 TS 怎么写，怎么设置默认值

## 2. watch 和 watchEffect 的区别

watch 和 watchEffect 都是监听器，watchEffect 是一个副作用函数。

- watch ：既要指明监视的数据源，也要指明监视的回调。
  而 watchEffect 可以自动监听数据源作为依赖。不用指明监视哪个数据，监视的回调中用到哪个数据，那就监视哪个数据。

- watch 可以访问改变之前和之后的值，watchEffect 只能获取改变后的值。

- watch 运行的时候不会立即执行，值改变后才会执行，而 watchEffect 运行后可立即执行。这一点可以通过 watch 的配置项 immediate 改变。

- watchEffect 有点像 computed ：

  - 但 computed 注重的计算出来的值（回调函数的返回值）， 所以必须要写返回值。
  - 而 watcheffect 注重的是过程（回调函数的函数体），所以不用写返回值。

- watch 与 vue2.x 中 watch 配置功能一致，但也有两个小坑

  - 监视 reactive 定义的响应式数据时，oldValue 无法正确获取，强制开启了深度监视（deep 配置失效）
  - 监视 reactive 定义的响应式数据中某个属性时，deep 配置有效。

## 3. computed 和 watch 的区别

### vue2

computed：

- computed 属性是一种依赖收集的属性，它根据其依赖的响应式数据进行计算，并返回计算结果。
- computed 属性是基于它的依赖进行缓存的，只有依赖的响应式数据发生变化时，才会重新计算。computed 属性可以被当作普通的属性来使用。

watch：

- watch 选项允许我们观察一个特定的数据源，并在数据发生变化时执行回调函数。
- 它可以用于监听单个数据的变化或监听多个数据的变化。
- watch 选项通常用于监听数据的变化并执行一些异步或开销较大的操作。

### vue3

computed：

- 在 Vue 3 中，computed 属性的用法和 Vue 2 基本相同。
- 但是，Vue 3 对 computed 属性进行了一些性能优化，使得在某些情况下，computed 属性的计算速度更快。

watch：

- Vue 3 中引入了一个新的 API，称为 watch 函数。
- watch 函数提供了更灵活的监听选项，并可以使用函数式编程的方式进行处理。
- 它可以监听多个数据源的变化，并在数据发生变化时执行回调函数。
- watch 函数还可以处理异步任务和批量更新的情况。

### vue3 的 compute 相比较 vue2 做了哪些优化

- 缓存机制优化

  - vue2 中 compute 无论依赖的值是否发生变化， 每次访问 computed 属性都会重新计算。 vue3 缓存机制进行了优化，只有当依赖发生变化的时候，才会进行重新浸酸。 否则会直接返回缓存结果。提高了性能，减少了不必要的计算。

- 惰性求值

  - vue3 中的 compute 采用了惰性求值策略。即只有在实际访问 computed 属性时，才会执行计算函数。这意味着在初始化阶段不会进行计算，只有当实际需要获取计算结果时才会进行计算。这样可以减少初始渲染的计算开销。

- Composition API 支持

  - Vue 3 的 computed 属性与 Composition API 紧密集成。在 Vue 3 中，可以使用 computed 函数来定义 computed 属性，而不仅限于使用对象字面量的形式。这使得在组合式 API 中编写和组织 computed 逻辑更加灵活和可维护。

- 更好的类型推导
  - Vue 3 通过 TypeScript 的改进提供了更好的类型推导支持。在 Vue 3 中，根据依赖关系的变化，能够更准确地推导出 computed 属性的类型，并提供更好的类型检查和智能提示。

## 4. 生命周期

### 4.1 vue 父组件能够监听到的子组件的生命周期有哪些？

在 Vue 2 中，可以监听到的子组件的生命周期钩子函数有：

beforeCreate：在实例初始化之后，数据观测(data observer) 和 event/watcher 事件配置之前被调用。
created：实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。
beforeMount：在挂载开始之前被调用：相关的 render 函数首次被调用。
mounted：el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。
beforeUpdate：数据更新时调用，发生在虚拟 DOM 打补丁之前。
updated：由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
beforeDestroy：实例销毁之前调用。在这一步，实例仍然完全可用。
destroyed：实例销毁后调用。调用后，所有的事件监听器会被移除，所有的子实例也会被销毁。
在 Vue 3 中，组合式 API 的引入带来了一些变化。可以监听到的子组件的生命周期钩子函数有：

onBeforeMount：在挂载开始之前被调用。
onMounted：在挂载完成后被调用。
onBeforeUpdate：在更新开始之前被调用。
onUpdated：在更新完成后被调用。
onBeforeUnmount：在卸载开始之前被调用。
onUnmounted：在卸载完成后被调用。
值得注意的是，在 Vue 3 中，beforeCreate 和 created 钩子函数不再被支持，取而代之的是 setup 函数，它在组件实例创建之前被调用，因此在 setup 函数中可以执行类似 beforeCreate 和 created 阶段的操作。此外，beforeDestroy 和 destroyed 钩子函数也被重命名为 onBeforeUnmount 和 onUnmounted。

## 5. 组件缓存 keep-alive 怎么做的？

`<keep-alive>` 组件是 Vue 中用于组件缓存的特殊组件。它通过组合 Vue 的内部缓存机制和特殊的组件生命周期钩子来实现组件的缓存。

具体实现方式如下：

1. **组件缓存**：当一个组件被包裹在 `<keep-alive>` 中时，Vue 会创建一个内部缓存来存储需要缓存的组件实例。缓存使用一个简单的 JavaScript 对象来实现，组件的 `name` 或 `key` 作为键，组件实例作为值。

2. **处理组件激活**：当一个组件被渲染在 `<keep-alive>` 中时，它会经历正常的生命周期，包括 `beforeMount`、`mounted`、`beforeUpdate`、`updated`、`beforeUnmount` 和 `unmounted` 等钩子。然而，当一个组件被停用（例如从 DOM 中移除），它不会立即销毁，而是保留在缓存中。

3. **处理组件停用**：当一个组件被停用（例如切换到其他路由或在 DOM 中有条件地不渲染），它会触发 `deactivated` 生命周期钩子。此时，组件不会立即被销毁，而是保留在缓存中。

4. **处理组件激活（重新渲染）**：如果一个组件被重新激活（例如切换回之前的路由或在 DOM 中有条件地重新渲染），它会触发 `activated` 生命周期钩子。此时，Vue 会检查组件实例是否存在于缓存中。如果存在，Vue 会重用缓存中的实例，而不是创建一个新的实例。这样，组件的状态和数据得以保留，看起来就像组件从未被销毁过一样。

5. **缓存限制**：为了避免缓存无限增长，`<keep-alive>` 允许设置 `max` 属性来限制缓存的组件数量。如果缓存超过指定的限制，最近最少使用（LRU）的组件实例将从缓存中移除，为新的组件腾出空间。

以下是使用 `<keep-alive>` 缓存组件的示例：

```html
<template>
  <div>
    <keep-alive>
      <!-- 当组件不活动时，它会被缓存 -->
      <MyComponent v-if="showComponent" />
    </keep-alive>

    <button @click="showComponent = !showComponent">切换组件</button>
  </div>
</template>

<script>
  import MyComponent from './MyComponent.vue'

  export default {
    components: {
      MyComponent
    },
    data() {
      return {
        showComponent: true
      }
    }
  }
</script>
```

在这个示例中，当点击 "切换组件" 按钮时，`MyComponent` 会在 `<keep-alive>` 中有条件地渲染。当组件被停用时（即 `v-if` 的值为 `false`），它会被缓存在 `<keep-alive>` 组件中。当组件被重新激活时（即 `v-if` 的值为 `true`），Vue 会重用缓存中的组件实例，而不是创建一个新的实例。

希望这样能够清楚地解释 `<keep-alive>` 在 Vue 中是如何实现组件缓存的。

#### vue2 和 vue3 中 keep-alive 的区别

在 Vue 2 和 Vue 3 中，`<keep-alive>` 的基本功能是相同的，即用于组件缓存。然而，Vue 3 中对 `<keep-alive>` 进行了一些优化和改进，使其更加灵活和高效。

主要的区别如下：

1. **语法糖的变化**：

   - Vue 2 使用 `<keep-alive>` 包裹组件时，需要使用 `include` 和 `exclude` 属性来指定需要缓存的组件名或组件名称的正则表达式，或者排除不需要缓存的组件。例如：

   ```html
   <keep-alive :include="['ComponentA', /^ComponentB/]" :exclude="['ComponentC']">
     <!-- 组件 A、B 将被缓存，组件 C 将不被缓存 -->
     <router-view></router-view>
   </keep-alive>
   ```

   - Vue 3 中，`<keep-alive>` 的语法更加简洁，使用 `v-slot` 来定义需要缓存的组件，并通过 `include` 和 `exclude` 属性来指定要缓存或排除的组件。例如：

   ```html
   <keep-alive :include="['ComponentA', /^ComponentB/]" :exclude="['ComponentC']">
     <template v-slot:default>
       <!-- 组件 A、B 将被缓存，组件 C 将不被缓存 -->
       <router-view></router-view>
     </template>
   </keep-alive>
   ```

2. **内部实现优化**：

   - Vue 3 中对 `<keep-alive>` 的内部实现进行了一些优化，提高了组件缓存的性能和效率。在 Vue 3 中，组件的状态和数据在缓存时会被更高效地管理，减少了不必要的更新和重新渲染。

3. **组件实例的激活和停用钩子**：

   - 在 Vue 2 中，`<keep-alive>` 使用 `activated` 和 `deactivated` 生命周期钩子来处理组件的激活和停用。在组件被缓存时，会触发 `deactivated` 钩子，而在组件被重新激活时，会触发 `activated` 钩子。

   - 在 Vue 3 中，`<keep-alive>` 使用 `v-slot` 的方式来处理组件的激活和停用。在组件被缓存时，会触发相应组件的 `onVnodeUnmounted` 钩子，并在组件被重新激活时，触发相应组件的 `onVnodeMounted` 钩子。

总体来说，Vue 3 中的 `<keep-alive>` 在使用语法糖方面更加简洁，并对组件缓存的实现进行了优化，提高了性能和效率。同时，针对组件实例的激活和停用也有一些变化，但其基本功能和用法与 Vue 2 是相同的。

#### vue3 的 keep-alive 具体变化

在 Vue 3 中，对 `<keep-alive>` 组件的内部实现进行了优化，主要包括以下方面：

1. **虚拟 DOM 的 Diff 算法优化**：
   在 Vue 3 中，使用了更高效的虚拟 DOM 的 Diff 算法，称为 `Fast Diff`，它能够更精确地计算出组件树的变化，减少不必要的更新和重新渲染。这使得在 `<keep-alive>` 缓存的组件在被重新激活时，能够更快速地恢复到之前的状态，从而提高了组件缓存的性能和效率。

2. **缓存组件的实例状态**：
   在 Vue 3 中，缓存的组件实例会被更精确地保存状态，包括组件的数据、状态和事件监听器等。这样，在组件被缓存时，其状态可以完整地保留，当组件被重新激活时，可以直接使用之前保存的状态，而无需重新创建组件实例和重新初始化状态，从而进一步提高了组件缓存的性能。

3. **优化缓存策略**：
   在 Vue 3 中，对于被 `<keep-alive>` 缓存的组件，内部的缓存策略也得到了优化。当组件被缓存时，它的 DOM 结构不会被销毁，而只是被隐藏起来。这样，在组件被重新激活时，无需重新创建 DOM 元素，只需要将之前隐藏的 DOM 元素重新显示出来，从而减少了不必要的 DOM 操作，进一步提高了组件缓存的性能。

总的来说，Vue 3 对 `<keep-alive>` 组件的内部实现进行了一系列优化措施，包括改进了虚拟 DOM 的 Diff 算法、优化了组件实例的状态保存和恢复，以及优化了缓存策略，从而提高了组件缓存的性能和效率。这些优化措施使得在使用 `<keep-alive>` 缓存组件时，能够更快速、高效地管理组件的状态和渲染，从而提升了整体的性能表现。

在 Vue 3 中，对 <keep-alive> 的内部实现进行了优化，具体包括以下几点：

精确的状态保存：
在 Vue 3 中，被 <keep-alive> 缓存的组件实例会被保存在内存中，而不会被销毁。这样，在组件被缓存时，组件的状态、数据和事件监听器等都得以保留。当组件被重新激活时，可以直接使用之前保存的组件实例和状态，而无需重新创建组件和初始化状态，从而提高了性能。

虚拟 DOM 的保留：
在 Vue 3 中，被 <keep-alive> 缓存的组件的虚拟 DOM 不会被销毁，而是被保留在内存中。这样，在组件被重新激活时，可以直接使用之前的虚拟 DOM，而无需重新创建和构建虚拟 DOM。这个优化措施可以减少不必要的 DOM 操作，提高渲染性能。

更灵活的缓存策略：
在 Vue 3 中，可以通过在 <keep-alive> 上使用 include 和 exclude 属性来指定需要缓存的组件和排除缓存的组件。include 属性用于指定要缓存的组件名称或组件实例，而 exclude 属性用于指定不需要缓存的组件名称或组件实例。这样，可以更灵活地控制哪些组件需要被缓存，哪些组件不需要被缓存，从而避免不必要的缓存和提高缓存的效率。

总的来说，Vue 3 在 <keep-alive> 的实现上进行了优化，通过精确保存组件状态、保留虚拟 DOM 和提供更灵活的缓存策略，进一步提高了组件缓存的性能和效率。这些优化措施使得在使用 <keep-alive> 缓存组件时，能够更高效地管理组件的状态和渲染，从而提升了整体的性能表现。

## 6. 过滤器使用过吗



**过滤器**是vue2中的一个特性，作用是用于对文本进行格式化的作用。



过滤器只能应用在两个地方：**`双花括号插值`**和**`v-bind`表达式**。

```js
<!--在双花括号中使用 格式：{{值 | 过滤器的名称}}-->
<div>{{3 | addZero}}</div>
<!--在v-bind中使用 格式：v-bind:id="值 | 过滤器的名称"-->
<div v-bind:id="1 | addZero">11</div>
```



vue3版本删除了过滤器，因为它和定义一个method没有啥本质的区别。

## 7. slot 插槽的使用

插槽分为普通插槽和作用域插槽，它们可以解决不同的场景

**扫盲**

编译是发生在调用 `vm.$mount` 的时候，所以编译的顺序是先编译父组件，再编译子组件。

- 首先编译父组件，在 `parse` 阶段，会执行 `processSlot` 处理 `slot`

  - 当解析到标签上有 `slot` 属性的时候，会给对应的 AST 元素节点添加 `slotTarget` 属性，然后在 `codegen` 阶段，在 `genData` 中会处理 `slotTarget`
  - 会给 `data` 添加一个 `slot` 属性，并指向 `slotTarget`

- 接下来编译子组件，同样在 `parser` 阶段会执行 `processSlot` 处理函数

  - 当遇到 `slot` 标签的时候会给对应的 AST 元素节点添加 `slotName` 属性，然后在 `codegen` 阶段，会判断如果当前 AST 元素节点是 `slot` 标签，则执行 `genSlot` 函数

  - ~~~js
    function genSlot (el: ASTElement, state: CodegenState): string {
      const slotName = el.slotName || '"default"'
      const children = genChildren(el, state)
      let res = `_t(${slotName}${children ? `,${children}` : ''}`
      const attrs = el.attrs && `{${el.attrs.map(a => `${camelize(a.name)}:${a.value}`).join(',')}}`
      const bind = el.attrsMap['v-bind']
      if ((attrs || bind) && !children) {
        res += `,null`
      }
      if (attrs) {
        res += `,${attrs}`
      }
      if (bind) {
        res += `${attrs ? '' : ',null'},${bind}`
      }
      return res + ')'
    }
    ~~~

  - 先不考虑 `slot` 标签上有 `attrs` 以及 `v-bind` 的情况

  - `slotName` 从 AST 元素节点对应的属性上取，默认是 `default`，而 `children` 对应的就是 `slot` 开始和闭合标签包裹的内容

- 最后 render-slot 方法

  - `render-slot` 的参数 `name` 代表插槽名称 `slotName`，`fallback` 代表插槽的默认内容生成的 `vnode` 数组。
  - 先忽略 `scoped-slot`，只看默认插槽逻辑。
  - 如果 `this.$slot[name]` 有值，就返回它对应的 `vnode` 数组，否则返回 `fallback`。



#### 默认插槽和作用域插槽的区别

有一个很大的差别是数据作用域

- 普通插槽是在父组件编译和渲染阶段生成 `vnodes`，所以数据的作用域是父组件实例，子组件渲染的时候直接拿到这些渲染好的 `vnodes`。
- 对于作用域插槽，父组件在编译和渲染阶段并不会直接生成 `vnodes`，而是在父节点 `vnode` 的 `data` 中保留一个 `scopedSlots` 对象，存储着不同名称的插槽以及它们对应的渲染函数，只有在编译和渲染子组件阶段才会执行这个渲染函数生成 `vnodes`，由于是在子组件环境执行的，所以对应的数据作用域是子组件实例。

简单地说，两种插槽的目的都是让子组件 `slot` 占位符生成的内容由父组件来决定，但数据的作用域会根据它们 `vnodes` 渲染时机不同而不同。

## 8. 为什么采用异步渲染？

为了实时更新数据被。

当你在 Vue 中更改响应式状态时，最终的 DOM 更新并不是同步生效的，而是由 Vue 将它们缓存在一个队列中，直到下一个“tick”才一起执行。这样是**为了确保每个组件无论发生多少状态改变，都仅执行一次更新**。

`nextTick()` 可以在状态改变后立即使用，以等待 DOM 更新完成。你可以传递一个回调函数作为参数，或者 await 返回的 Promise。

### 8.1 nextTick 原理及作用

其实就是为了引出`JavaScript`运行机制，进一步来讲宏任务和微任务。

JS 执行是单线程的，它是基于事件循环的。事件循环大致分为以下几个步骤：

（1）所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。

（2）主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。

（3）一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。

（4）主线程不断重复上面的第三步。



主线程的执行过程就是一个 tick，而所有的异步结果都是通过 “任务队列” 来调度。 消息队列中存放的是一个个的任务（task）。

 规范中规定 task 分为两大类，分别是 macro task 和 micro task，并且每个 macro task 结束后，都要清空所有的 micro task。



在浏览器环境中，常见的 macro task 有 setTimeout、MessageChannel、postMessage、setImmediate；常见的 micro task 有 MutationObsever 和 Promise.then



vue2版本的实现

`next-tick.js` 申明了 `microTimerFunc` 和 `macroTimerFunc` 2 个变量，它们分别对应的是 micro task 的函数和 macro task 的函数。对于 macro task 的实现，优先检测是否支持原生 `setImmediate`，这是一个高版本 IE 和 Edge 才支持的特性，不支持的话再去检测是否支持原生的 `MessageChannel`，如果也不支持的话就会降级为 `setTimeout 0`；而对于 micro task 的实现，则检测浏览器是否原生支持 Promise，不支持的话直接指向 macro task 的实现。

`next-tick.js` 对外暴露了 2 个函数，先来看 `nextTick`，这就是我们在上一节执行 `nextTick(flushSchedulerQueue)` 所用到的函数。它的逻辑也很简单，把传入的回调函数 `cb` 压入 `callbacks` 数组，最后一次性地根据 `useMacroTask` 条件执行 `macroTimerFunc` 或者是 `microTimerFunc`，而它们都会在下一个 tick 执行 `flushCallbacks`，`flushCallbacks` 的逻辑非常简单，对 `callbacks` 遍历，然后执行相应的回调函数。

这里使用 `callbacks` 而不是直接在 `nextTick` 中执行回调函数的原因是保证在同一个 tick 内多次执行 `nextTick`，不会开启多个异步任务，而把这些异步任务都压成一个同步任务，在下一个 tick 执行完毕。

## 9. 如何动态的给 vue2 的 data 添加属性值？

### 9.1 如何解决数据更新了，页面没有更新的问题

### 9.2 vue2 data 中的某一个属性发生变化，页面视图会立即执行重新渲染吗？

## 10. vue2 中如何监听对象或者数组某个值的变化？

## 11. 说一下 template 的实现原理

### 11.1 模版编译原理

### 11.2 template 和 jsx 有什么区别？

### 11.3 什么是 jsx?

## 12. 简单说一下 template 到 render 的过程，怎么实现？ 源码 compiler 的原理

`Vue` 只能通过 new 关键字初始化，然后会调用 `this._init` 方法，会初始化一些配置，主要包括

- 合并配置，初始化生命周期，初始化事件中心，初始化渲染
- 初始化 data、props、computed、watcher 等等

`vm.$createElement` 方法定义是在执行 `initRender` 方法的时候，可以看到除了 `vm.$createElement` 方法，还有一个 `vm._c` 方法，它是被模板编译成的 `render` 函数使用，而 `vm.$createElement` 是用户手写 `render` 方法使用的， 这俩个方法支持的参数相同，并且内部都调用了 `createElement` 方法

Vue 中我们是通过 `$mount` 实例方法去挂载 `vm` 的。compiler里面包括了$mount重新定义的具体实现。

- 首先缓存了原型上的 `$mount` 方法，再重新定义该方法。
- 它对 `el` 做了限制，Vue 不能挂载在 `body`、`html` 这样的根节点上。
  - 如果没有定义 `render` 方法，则会把 `el` 或者 `template` 字符串转换成 `render` 方法。
  - 在 Vue 2.0 版本中，所有 Vue 的组件的渲染最终都需要 `render` 方法，无论我们是用单文件 .vue 方式开发组件，还是写了 `el` 或者 `template` 属性，最终都会转换成 `render` 方法，那么这个过程是 Vue 的一个“在线编译”的过程，它是调用 `compileToFunctions` 方法实现的。
- 最后，调用原先原型上的 `$mount` 方法挂载。



$mount 具体干啥了

- `$mount` 方法支持传入 2 个参数
  - 第一个是 `el`，它表示挂载的元素，可以是字符串，也可以是 DOM 对象，
    - 如果是字符串在浏览器环境下会调用 `query` 方法转换成 DOM 对象的。
  - 第二个参数是和服务端渲染相关，在浏览器环境下我们不需要传第二个参数。
- `$mount` 方法实际上会去调用 `mountComponent` 方法。
  - 这个方法定义在 `src/core/instance/lifecycle.js`
  - `mountComponent` 核心就是先实例化一个渲染`Watcher`，在它的回调函数中会调用 `updateComponent` 方法，在此方法中调用 `vm._render` 方法先生成虚拟 Node，最终调用 `vm._update` 更新 DOM。
  - `Watcher` 在这里起到两个作用
    - 一个是初始化的时候会执行回调函数
    - 另一个是当 vm 实例中的监测的数据发生变化的时候执行回调函数

- 函数最后判断为根节点的时候设置 `vm._isMounted` 为 `true`， 表示这个实例已经挂载了，同时执行 `mounted` 钩子函数

## 13. 听过虚拟 dom 吗 在 vue 中怎么体现的

Virtual DOM 就是用一个原生的 JS 对象去描述一个 DOM 节点，所以它比创建一个 DOM 的代价要小很多。

核心定义无非就几个关键属性，标签名、数据、子节点、键值等，其它属性都是用来扩展 VNode 的灵活性以及实现一些特殊 feature 的。

document

Virtual DOM 除了它的数据结构的定义，映射到真实的 DOM 实际上要经历 VNode 的 create、diff、patch 等过程。那么在 Vue.js 中，VNode 的 create 是通过 `createElement` 方法创建的，具体利用 createElement 方法创建 VNode，它定义在 `src/core/vdom/create-element.js` 中。

Virtual DOM 实际上是一个树状结构，每一个 VNode 可能会有若干个子节点，这些子节点应该也是 VNode 的类型。`_createElement` 接收的第 4 个参数 children 是任意类型的，因此我们需要把它们规范成 VNode 类型。

规范化 `children` 后，接下来会去创建一个 VNode 的实例。

先对 `tag` 做判断，如果是 `string` 类型，则接着判断如果是内置的一些节点，则直接创建一个普通 VNode，如果是为已注册的组件名，则通过 `createComponent` 创建一个组件类型的 VNode，否则创建一个未知的标签的 VNode。 如果是 `tag` 一个 `Component` 类型，则直接调用 `createComponent` 创建一个组件类型的 VNode 节点

## 14. 简单说一下 vue 的 diff 算法

## 15. 异步组件使用过吗，什么场景使用的？

## 16. vue 挂载过程中执行了哪些操作

## 17. vue 组件的 name 属性有什么作用

## 18. 怎么在组件中监听路由参数的变化？

## 19. vue 的单项数据流的好处？

## 20. 在哪些生命周期里面可以直接访问到 dom?

在钩子函数 mounted 被调用前，Vue 已经将编译好的模板挂载到页面上，所以在 mounted 中可以访问操作 DOM。

### 20.1 vue3 中什么时候可以访问到 dom 呢

## 21. 简单说一下平时为了提升开发效率封装过哪些组件？

## 22. 页面首次加载的时候，会触发哪些钩子函数？

## 23. vue 模版样式 scoped 的作用和用法

### 23.1 vue 里面样式穿透的写法

## 24. 接口没出来的时候，做过 mock 吗， 常见的 mock 语法。

## 25. vue 自带的动画效果怎么实现的

## 26. data 属性和 methods 方法可以同名吗

methods 的方法名会被 data 的属性覆盖

## 27. 什么是函数式组件？ 他和 react 的 hook 有什么区别？

# Vue3 相关

## vue3 怎么实现的响应式

## vue3 对于编译做了哪些优化

Vue 3.0 作为 Vue.js 的一次重大升级，其编译器也进行了一些优化，主要包括以下几方面：

- 静态树提升： Vue 3.0 通过重写编译器，实现对静态节点（即不改变的节点）进行编译优化，使用 HoistStatic 功能将静态节点移动到 render 函数外部进行缓存，从而服务端渲染和提高前端渲染的性能。

P- atch Flag：在 Vue 3.0 中，编译的生成 vnode 会根据节点 patch 的标记，只对需要重新渲染的数据进行响应式更新，不需要更新的数据不会重新渲染，从而大大提高了渲染性能。

- 静态属性提升：Vue3 中对不参与更新的元素，会做静态提升，只会被创建一次，在渲染时直接复用。免去了重复的创建操作，优化内存。
  没做静态提升之前，未参与更新的元素也在 render 函数内部，会重复创建阶段。
  做了静态提升后，未参与更新的元素，被放置在 render 函数外，每次渲染的时候只要取出即可。同时该元素会被打上静态标记值为-1，特殊标志是负整数表示永远不会用于 Diff。

- 事件监听缓存：默认情况下绑定事件行为会被视为动态绑定（没开启事件监听器缓存），所以每次都会去追踪它的变化。开启事件侦听器缓存后，没有了静态标记。也就是说下次 diff 算法的时候直接使用。

- 优化 Render function：Vue 3.0 的 compile 优化还包括：Render 函数的换行和缩进、Render 函数的条件折叠、Render 函数的常量折叠等等。

总之，Vue 3.0 通过多方面的编译优化，进一步提高了框架的性能和效率，使得 Vue.js 更加高效和易用。

## vue3 中的内置组件 Teleport 如何使用

Teleport（瞬移）组件，可以将组件的 DOM 插到指定的组件层，而不是默认的父组件层，可以用于在应用中创建模态框、悬浮提示框、通知框等组件。
Teleport 组件可以传递两个属性：

- to (必填)：指定组件需要挂载到的 DOM 节点的 ID，如果使用插槽的方式定义了目标容器也可以传入一个选择器字符串。
- disabled (可选)：一个标志位指示此节点是否应该被瞬移到目标中，一般情况下，这个 props 建议设为一个响应式变量来控制 caption 是否展示。

虽然 DOM 插头被传送到另一个地方，但它的父组件仍然是当前组件，这一点必须牢记，否则会导致样式、交互等问题。

Teleport 组件不仅支持具体的 id/选择器，还可以为 to 属性绑定一个 Vue 组件实例

Teleport 组件是 Vue3 中新增的一个非常有用的组件，可以方便地实现一些弹出框、提示框等组件的功能，提高了开发效率。

## vue3 相比较 vue2 做了哪些升级？ 他为什么比 vue2 更快？

- 响应式系统优化：Vue3 引入了新的响应式系统，这个系统的设计让 Vue3 的渲染函数可以在编译时生成更少的代码，这也就意味着在运行时需要更少的代码来处理虚拟 DOM。这个新系统的一个重要改进就是提供了一种基于 Proxy 实现的响应式机制，这种机制为开发人员提供更加高效的 API，也减少了一些运行时代码。
- 编译优化：Vue3 的编译器对代码进行了优化，包括减少了部分注释、空白符和其他非必要字符的编译，同时也对编译后的代码进行了懒加载优化。
- 更快的虚拟 DOM：Vue3 对虚拟 DOM 进行了优化，使用了跟 React 类似的 Fiber 算法，这样可以更加高效地更新 DOM 节点，提高性能。
- Composition API：Vue3 引入了 Composition API，这种 API 通过提供逻辑组合和重用的方法来提升代码的可读性和重用性。这种 API 不仅可以让 Vue3 应用更好地组织和维护业务逻辑，还可以让开发人员更加轻松地实现优化。

## setup 中如何获取组件的实例信息？

可以使用 getCurrentInstance() 方法来获取组件实例。getCurrentInstance() 方法返回一个对象，该对象包含了组件实例以及其他相关信息。

`const instance = getCurrentInstance();`

getCurrentInstance() 方法只能在 setup 函数中使用，而不能在组件的生命周期方法（如 created、mounted 等方法）中使用。另外，需要注意的是，如果在 setup 函数返回之前访问了 instance 对象，那么它可能是 undefined ，因此我们需要对其进行处理。
