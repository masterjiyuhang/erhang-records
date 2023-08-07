# Vue 相关的问题

前一部分是和Vue3相关的 🤔



## 🍇Vue3常见问题

### Vue2 和 Vue3 的区别

- proxy 代替 define property 做监听
  - 更全面的拦截操作：Proxy 提供了一系列拦截操作，比如 get、set、deleteProperty、apply 等。这使得我们可以拦截更多类型的操作，而不仅限于属性的读取和修改。
  - 动态属性拦截：使用 Proxy 可以动态地拦截属性的读取和设置，而**不需要事先定义属性**。这与 defineProperty 不同，后者需要在对象创建时定义属性。
  - 简化属性访问：通过使用 Proxy，我们可以通过在代理对象上直接访问属性，而**无需通过特殊的 get 和 set 方法**。这使得代码更简洁、易读。
  - 更好的性能：相比于 defineProperty，Proxy 的性能更好。这是因为 Proxy 在底层实现上更加优化，拦截操作更高效。
- Proxy 是 ES6 引入的新特性，不支持老版本的浏览器。

  - 在使用 Proxy 时，需要确保目标环境支持它，或者使用相应的 polyfill 进行兼容处理。

- Proxy 提供了更灵活和强大的对象拦截功能，可以解决 defineProperty 的一些限制，并提供了更好的性能和简化的语法。

### Vue3 相比较 Vue2 的 diff 算法有哪些优化

Vue 3 在与 Vue 2 相比的 diff 算法上进行了一些优化，主要包括以下几点：

- 静态节点提升（Static Node Hoisting）：

  - Vue 3 使用了更高效的静态节点提升技术，将静态节点在编译阶段就提升为常量，避免了运行时的重复创建和比对。这样可以减少虚拟 DOM 的节点数，从而提高了渲染性能。
  - 在 Vue 2 中，每次组件渲染时，都会生成新的虚拟 DOM 树，即使是静态节点也会重新创建。
  - 在 Vue 3 中，编译器会将模板中的静态节点（即不会改变的节点）在编译阶段优化，并将它们提升为常量。这样在每次渲染时，静态节点不需要重新创建，减少了虚拟 DOM 的节点数，提高了渲染性能。

- 事件侦听器缓存：
  - Vue 3 通过事件侦听器的缓存，减少了对事件处理函数的重复创建。
  - 在 Vue 2 中，每次渲染时都会重新创建事件侦听器，即使事件处理函数是相同的。但在 Vue 3 中，会对事件处理函数进行缓存，只有在事件处理函数发生变化时才会重新创建。这样可以减少对事件处理函数的重复创建和销毁，提高了性能。
- 更细粒度的依赖追踪：

  - Vue 3 使用了基于 Proxy 的响应式系统，相比 Vue 2 的 Object.defineProperty，可以实现更细粒度的依赖追踪。这样在数据变化时，只会触发实际依赖的更新，避免了不必要的更新操作，提高了性能。

- 优化的数组更新：

  -  Vue 3 对数组的更新进行了优化，采用了类似 React 的技术，通过索引跟踪和避免遍历整个数组来更高效地处理数组的变化。

- Fragment 的支持：

  - Vue 3 支持 Fragment（碎片），即允许在模板中使用多个根级别的元素，而无需包裹额外的标签。Fragment 可以减少 DOM 元素的数量，提高渲染性能。
  - 在 Vue 2 中，模板中必须有一个根级别的元素，这可能会导致生成不必要的 DOM 元素。

- 更好的 Tree-Shaking：

  - Vue 3 的代码结构更利于 Tree-Shaking，可以在构建时更轻松地去除未使用的代码，从而减少最终的包体积。

- Composition API 的优化：
  - Vue 3 的 Composition API 具有更好的可组合性，可以更灵活地组织和复用逻辑，提高了代码的可维护性和可读性。

### proxy 相比 defineProperty 如何实现更细粒度的依赖追踪

Proxy 相比 Vue 2 的 Object.defineProperty 可以实现更细粒度的依赖追踪，主要有以下几个原因：

- 动态属性： Object.defineProperty 只能用于对对象已有的属性进行劫持，无法劫持对象新增的属性和删除的属性。而 **Proxy 可以劫持对象所有的属性**，包括新增的属性和删除的属性，从而可以更细粒度地进行依赖追踪。

- 数组变化： 在 Vue 2 中，对数组的响应式处理是通过重写数组的原型方法实现的，然后在这些方法中触发更新。但是这种方式有一定的局限性，无法捕获通过索引直接设置数组元素的变化。而 **Proxy 可以直接监听数组的操作**，如直接设置索引对应的元素，从而更准确地追踪数组的变化。

- 性能优化： Proxy 的性能通常比 Object.defineProperty 更好。在 Vue 2 中，每个响应式对象的属性都需要通过 Object.defineProperty 进行劫持，导致在大量数据变化时性能下降。而 Proxy 是**通过代理整个对象来劫持操作，从而减少了对单个属性的劫持操作**，提高了性能。

- 深层对象： Vue 2 对深层对象的响应式处理有一定的限制，需要在对象中预先定义属性并调用 Vue.set 或 this.$set 才能追踪其变化。而 **Proxy 可以实现递归劫持**，无论是对象的深层属性还是嵌套数组，都可以实现细粒度的依赖追踪，而无需预先定义属性。

- 降低内存消耗： 在 Vue 2 中，每个响应式对象需要维护一个响应式的 getter 和 setter，以及一个依赖收集的观察者列表。这些都会带来一定的内存消耗。而 **Proxy 只需要一个全局的 Proxy 对象来代理整个对象，不需要为每个属性都创建 getter 和 setter**，从而降低了内存消耗。

综上所述，Proxy 相比 Object.defineProperty 具有更多优势，特别是在处理动态属性、数组变化和深层对象时，可以实现更细粒度的依赖追踪，并且性能更优，更适合用于实现 Vue 3 中的响应式系统。

### setup 语法糖的理解

在 Vue 3 中，setup 是一个新的选项，它用于替代 Vue 2 中的一部分逻辑。

- setup 函数是组件的入口点，它在组件实例被创建之前被调用，并且在组件实例创建时被调用一次。
- setup 函数接收两个参数：props 和 context。

  - props：
    - props 是一个响应式对象，包含了从父组件传递过来的属性。
    - 在 setup 函数中，你可以直接使用 props 对象的属性，无需在 setup 函数中使用 this 访问。
  - context：
    - context 是一个包含了一些实用方法和属性的上下文对象。它包含了 attrs、slots、emit 等。你可以通过解构赋值或直接使用 context 对象来访问这些属性。

- 在 setup 函数中，你可以执行一些初始化逻辑，设置响应式数据，定义计算属性，监听事件，调用其他函数等等。setup 函数中返回的数据会在组件的模板中使用。

- setup 函数**相当于 Vue 2 中的 beforeCreate 和 created 钩子函数的组合**，但是它比这两个钩子函数更加灵活，且能够访问到 props 和 context。在 setup 函数中，你可以自由地处理组件的状态和行为。

- 需要**注意**的是，setup 函数是一个普通的 JavaScript 函数，而不是 Vue 2 中的选项对象，所以在其中无法使用 this 访问组件实例，也无法使用 Vue 2 中的一些选项，比如 data、computed、methods 等。如果你需要使用这些选项，可以在 setup 函数中使用其他方式实现，比如使用 ref、reactive、computed 等 Vue 3 的 Composition API 提供的函数。

总结起来，setup 语法糖是 Vue 3 中提供的一个更灵活、更强大的组件初始化方式，它能够让你更好地组织和管理组件的状态和行为。

### setup 中怎么设置组件 name

`unplugin-vue-define-options` 插件

```javascript
<script lang="ts" setup>
  defineOptions({
    name: 'nameOption',
  });
</script>
```

### reactive 和 shallow Reactive

- reactive：
  reactive 函数会对整个对象进行递归响应式处理，即对象中的所有嵌套属性也会被转换成响应式对象。
  当通过 reactive 创建的响应式对象的属性值发生变化时，会触发依赖该属性的相关响应式更新。

- shallowReactive：
  shallowReactive 函数只会对对象的第一层属性进行响应式处理，而不会对嵌套的属性进行递归响应式处理。
  当通过 shallowReactive 创建的响应式对象的第一层属性值发生变化时，会触发依赖该属性的相关响应式更新。但是，如果该属性的值是一个对象，而这个对象内部的属性发生变化，将不会触发更新。

在大多数情况下，推荐使用 reactive 来创建响应式对象，因为它可以**深度递归地处理嵌套对象，使整个对象及其嵌套属性都能触发响应式更新**。只有在特定的情况下，需要避免深度递归处理对象时，才会使用 shallowReactive。

### ref toRefs isRef 使用

在 Vue 3 的 Composition API 中，ref、toRefs 和 isRef 是用于处理响应式数据的函数。

- ref

  - 用于将普通数据转换为响应式数据，使其能够在组件中进行响应式更新。

  - 使用 ref 函数创建的响应式数据是一个包装对象，可以通过 .value 属性来访问其原始值。

  - 示例代码：

    - ```javascript
      import { ref } from 'vue'
      
      const count = ref(0)
      console.log(count.value) // Output: 0
      
      count.value = 10 // This will trigger reactivity
      console.log(count.value) // Output: 10
      ```

- toRefs

  - 用于将响应式对象转换为普通对象，并将每个属性都转换为 ref 包装。

  - 使用 toRefs 后，可以通过 .value 属性来访问每个属性的原始值，使其在模板中能够正常使用响应式数据。

  - 示例代码：

    - ```javascript
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

- isRef

  - isRef 函数用于检查一个值是否是由 ref 创建的响应式数据。

  - 如果传入的值是由 ref 创建的，则返回 true；否则返回 false。

  - 示例代码：

    - ```javascript
      import { ref, isRef } from 'vue'
      
      const count = ref(0)
      const name = 'John'
      
      console.log(isRef(count)) // Output: true
      console.log(isRef(name)) // Output: false
      ```

### readonly isReadOnly shallowReadonly 使用

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

### readonly 和 const 有什么区别？

- const 是赋值保护，使用 const 定义的变量，该变量不能重新赋值。
- 但如果 const 赋值的是对象，那么对象里面的东西是可以改的。原因是 const 定义的变量不能改说的是，对象对应的那个地址不能改变
- 而 readonly 是属性保护，不能给属性重新赋值

### Vue3 生命周期的变化？

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

### 组合式 api 和 选项式 api 的区别有哪些？

组合式 API（Composition API）和选项式 API 是 Vue.js 中两种不同的组件编写风格和方式。它们有一些明显的区别，如下所示：

- 选项式 API：

  1. 传统的 Vue.js 组件编写方式采用选项式 API。
  1. 使用选项式 API，组件的选项（data、methods、computed、watch 等）都是在一个对象中声明。
  1. 在大型组件中，选项式 API 可能导致代码复杂度增加，难以维护。

- 组合式 API（Composition API）：

  1. 组合式 API 是 Vue.js 3 引入的一种新的组件编写方式。
  1. 使用组合式 API，可以通过将逻辑功能按照功能进行分组，将相关功能组织成一个独立的函数，从而使代码更加模块化、可读性更好。
  1. 组合式 API 中的函数可以在 `setup` 函数中被调用，并且可以返回数据、方法等供模板使用。
  1. 组合式 API 可以在多个组件之间共享逻辑，提高了代码的可重用性。

- 主要区别：
  1. 组合式 API 更加灵活，能够更好地组织代码，使代码更加模块化和可读性更好。
  1. 组合式 API 支持在多个组件之间共享逻辑，而选项式 API 中的逻辑复用需要通过 mixins 或高阶组件来实现，不够直观和优雅。
  1. 组合式 API 可以更好地解决 Vue 2 中 mixins 带来的一些问题，例如命名冲突、混乱的调用顺序等。

总的来说，组合式 API 是 Vue.js 3 中引入的一种更加灵活和强大的组件编写方式，它能够更好地解决 Vue 2 中选项式 API 在大型组件中的一些问题，提高了代码的可读性、可维护性和复用性。对于新的项目和组件，推荐使用组合式 API 编写。对于现有的 Vue 2 项目，也可以逐渐迁移到组合式 API 来提升代码质量和开发效率。

### Vue3 里面的 v-model 语法实现，对比 Vue2 有区别吗？

- 在 Vue 2 中，v-model 用于实现表单元素和组件之间的双向绑定，可以通过在组件中使用 `props` 属性来接收外部传入的数据，并通过在组件内部使用 `$emit` 方法来触发事件，从而实现父组件和子组件之间的数据双向绑定。
- 在 Vue 3 中，由于引入了组合式 API，v-model 的实现方式发生了变化。现在，v-model 被认为是一个语法糖，其实质是对组件内部的 `props` 和 `emit` 的包装，使得组件的双向绑定更加简洁和直观。
- 在 Vue 3 中，可以通过 `defineProps` 函数来定义组件的 `props`，通过 `defineEmits` 函数来定义组件的事件，然后在模板中使用 `v-model` 来实现双向绑定。

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

需要注意的是，在 Vue 3 中，v-model 只是一个语法糖，其实质是基于 `props` 和 `emit` 实现的。因此，**如果在子组件中需要使用 v-model，必须在组件选项中定义名为 `modelValue` 的 `props`，以及触发名为 `update:modelValue` 的事件**。这样才能使 v-model 正常工作。

### Vue 组件通信的方式有哪些？

在 Vue 3 中，组件通信的方式与 Vue 2 有一些变化，主要是由于引入了组合式 API 和更加灵活的响应式系统。以下是 Vue 3 中常见的组件通信方式：

1. Props 和 Events：这是 Vue 2 和 Vue 3 中最常见的组件通信方式。父组件通过 props 将数据传递给子组件，子组件通过 $emit 方法触发事件，将数据传递回父组件。在 Vue 3 中，可以使用 `defineProps` 和 `defineEmits` 来定义组件的 props 和 events。

2. Provide 和 Inject：这是 Vue 2 中较少使用的一种组件通信方式，但在 Vue 3 中得到了改进和推广。通过在父组件中使用 `provide` 来提供数据，在子组件中使用 `inject` 来注入数据。这样可以实现跨层级的组件通信。

3. **Composition API**（组合式 API）：Vue 3 中引入了组合式 API，允许将相关的逻辑封装在一个独立的函数中，然后在组件中使用。通过组合式 API，可以更灵活地实现组件之间的通信和共享逻辑。

4. **Teleport**（传送）：Vue 3 中引入了 Teleport，允许将组件的内容渲染到指定的 DOM 元素上，从而实现在 DOM 树中的不同位置渲染组件内容，实现更灵活的组件布局和通信。

5. Custom Events（自定义事件）：Vue 3 中可以使用 `emits` 选项来定义组件支持的自定义事件，这样可以更明确地定义组件的通信行为。

#### 两个版本有什么变化吗？

- 相比于 Vue 2，Vue 3 引入了组合式 API 和 Teleport，使得组件通信更加灵活和方便。
- 通过组合式 API，可以将相关的逻辑封装在独立的函数中，实现逻辑的复用和组合。
- 而 Teleport 则允许在 DOM 树中的不同位置渲染组件内容，从而实现更灵活的布局和通信。
- 此外，在 Vue 3 中使用 `defineProps` 和 `defineEmits` 来定义组件的 props 和 events，使得组件通信更加直观和易于维护。
- Vue 3 提供了更加强大和灵活的组件通信方式，让开发者可以更方便地构建复杂的应用程序。

#### Vue3 中父子传值 , 用 TS 怎么写，怎么设置默认值

```javascript
export interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

### watch 和 watchEffect 的区别

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

### computed 和 watch 的区别

#### Vue2.x

computed：

- computed 属性是一种依赖收集的属性，它根据其依赖的响应式数据进行计算，并返回计算结果。
- computed 属性是基于它的依赖进行缓存的，只有依赖的响应式数据发生变化时，才会重新计算。computed 属性可以被当作普通的属性来使用。

watch：

- watch 选项允许我们观察一个特定的数据源，并在数据发生变化时执行回调函数。
- 它可以用于监听单个数据的变化或监听多个数据的变化。
- watch 选项通常用于监听数据的变化并执行一些异步或开销较大的操作。

#### Vue3.x

computed：

- 在 Vue 3 中，computed 属性的用法和 Vue 2 基本相同。
- 但是，Vue 3 对 computed 属性进行了一些性能优化，使得在某些情况下，computed 属性的计算速度更快。

watch：

- Vue 3 中引入了一个新的 API，称为 watch 函数。
- watch 函数提供了更灵活的监听选项，并可以使用函数式编程的方式进行处理。
- 它可以监听多个数据源的变化，并在数据发生变化时执行回调函数。
- watch 函数还可以处理异步任务和批量更新的情况。

#### Vue3 的 compute 相比较 Vue2 做了哪些优化

- 缓存机制优化

  - vue2 中 compute 无论依赖的值是否发生变化， 每次访问 computed 属性都会重新计算。 vue3 缓存机制进行了优化，只有当依赖发生变化的时候，才会进行重新浸酸。 否则会直接返回缓存结果。提高了性能，减少了不必要的计算。

- 惰性求值

  - vue3 中的 compute 采用了惰性求值策略。即只有在实际访问 computed 属性时，才会执行计算函数。这意味着在初始化阶段不会进行计算，只有当实际需要获取计算结果时才会进行计算。这样可以减少初始渲染的计算开销。

- Composition API 支持

  - Vue 3 的 computed 属性与 Composition API 紧密集成。在 Vue 3 中，可以使用 computed 函数来定义 computed 属性，而不仅限于使用对象字面量的形式。这使得在组合式 API 中编写和组织 computed 逻辑更加灵活和可维护。

- 更好的类型推导
  - Vue 3 通过 TypeScript 的改进提供了更好的类型推导支持。在 Vue 3 中，根据依赖关系的变化，能够更准确地推导出 computed 属性的类型，并提供更好的类型检查和智能提示。

### 组件缓存 keep-alive 怎么做的？

`<keep-alive>` 组件是 Vue 中用于组件缓存的特殊组件。它通过组合 Vue 的内部缓存机制和特殊的组件生命周期钩子来实现组件的缓存。

#### Vue2 和 Vue3 中 keep-alive 的区别

在 Vue 2 和 Vue 3 中，`<keep-alive>` 的基本功能是相同的，即用于组件缓存。然而，Vue 3 中对 `<keep-alive>` 进行了一些优化和改进，使其更加灵活和高效。

#### Vue3 的 keep-alive 具体变化

在 Vue 3 中，对 `<keep-alive>` 组件的内部实现进行了优化，主要包括以下方面：

1. **虚拟 DOM 的 Diff 算法优化**：
   在 Vue 3 中，使用了更高效的虚拟 DOM 的 Diff 算法，称为 `Fast Diff`，它能够更精确地计算出组件树的变化，减少不必要的更新和重新渲染。这使得在 `<keep-alive>` 缓存的组件在被重新激活时，能够更快速地恢复到之前的状态，从而提高了组件缓存的性能和效率。

2. **缓存组件的实例状态**：
   在 Vue 3 中，缓存的组件实例会被更精确地保存状态，包括组件的数据、状态和事件监听器等。这样，在组件被缓存时，其状态可以完整地保留，当组件被重新激活时，可以直接使用之前保存的状态，而无需重新创建组件实例和重新初始化状态，从而进一步提高了组件缓存的性能。

3. **优化缓存策略**：
   在 Vue 3 中，对于被 `<keep-alive>` 缓存的组件，内部的缓存策略也得到了优化。当组件被缓存时，它的 DOM 结构不会被销毁，而只是被隐藏起来。这样，在组件被重新激活时，无需重新创建 DOM 元素，只需要将之前隐藏的 DOM 元素重新显示出来，从而减少了不必要的 DOM 操作，进一步提高了组件缓存的性能。

总的来说，Vue 3 对 `<keep-alive>` 组件的内部实现进行了一系列优化措施，包括改进了虚拟 DOM 的 Diff 算法、优化了组件实例的状态保存和恢复，以及优化了缓存策略，从而提高了组件缓存的性能和效率。这些优化措施使得在使用 `<keep-alive>` 缓存组件时，能够更快速、高效地管理组件的状态和渲染，从而提升了整体的性能表现。



###  什么是函数式组件？ 他和 React 的 hooks有什么区别？

函数式组件是一种在 Vue 中定义组件的方式，它基于函数而不是基于对象。函数式组件具有以下特点：

1. **无状态：** 函数式组件本身没有状态（data），只接收外部传入的 props，并根据这些 props 渲染 UI。它没有生命周期方法、实例属性等。

2. **无实例：** 函数式组件没有 Vue 组件实例，因此不支持实例属性和实例方法。

3. **更轻量：** 由于没有组件实例，函数式组件的渲染和销毁更加轻量，性能上可能会比普通组件更好。

4. **更易于测试：** 由于函数式组件只依赖传入的 props，测试变得更加简单，不需要考虑组件实例的状态。

5. **适用场景：** 函数式组件适用于只依赖外部 props 进行渲染的简单 UI 组件，例如展示性组件、纯函数组件等。

与 React 的 Hook 相比，Vue 的函数式组件更注重于简化组件的定义和渲染过程，减少不必要的复杂性。React 的 Hook 则是一种更通用的方式，它允许在函数组件中添加状态、副作用等，使函数组件具备类组件的一些能力。

主要的区别包括：

1. **状态管理：** Vue 的函数式组件只接收 props，没有自己的状态，而 React 的 Hook 允许在函数组件中管理状态，如使用 `useState` 来添加本地状态。

2. **生命周期：** Vue 的函数式组件没有生命周期钩子，React 的函数组件可以使用 `useEffect` 来处理组件的副作用。

3. **Hooks 的多样性：** React 的 Hook 提供了一系列的钩子函数，用于处理状态、副作用、上下文等，从而可以实现更复杂的逻辑，而 Vue 的函数式组件则更专注于简单的 UI 渲染。

总的来说，Vue 的函数式组件和 React 的 Hook 都是为了简化组件开发和管理，但它们在实现方式和功能上有一些区别。选择哪种方式取决于你的项目需求和个人喜好。





### Vue3 对于编译做了哪些优化

Vue 3.0 作为 Vue.js 的一次重大升级，其编译器也进行了一些优化，主要包括以下几方面：

- 静态树提升： Vue 3.0 通过重写编译器，实现对静态节点（即不改变的节点）进行编译优化，使用 HoistStatic 功能将静态节点移动到 render 函数外部进行缓存，从而服务端渲染和提高前端渲染的性能。

P- atch Flag：在 Vue 3.0 中，编译的生成 vnode 会根据节点 patch 的标记，只对需要重新渲染的数据进行响应式更新，不需要更新的数据不会重新渲染，从而大大提高了渲染性能。

- 静态属性提升：Vue3 中对不参与更新的元素，会做静态提升，只会被创建一次，在渲染时直接复用。免去了重复的创建操作，优化内存。
  没做静态提升之前，未参与更新的元素也在 render 函数内部，会重复创建阶段。
  做了静态提升后，未参与更新的元素，被放置在 render 函数外，每次渲染的时候只要取出即可。同时该元素会被打上静态标记值为-1，特殊标志是负整数表示永远不会用于 Diff。

- 事件监听缓存：默认情况下绑定事件行为会被视为动态绑定（没开启事件监听器缓存），所以每次都会去追踪它的变化。开启事件侦听器缓存后，没有了静态标记。也就是说下次 diff 算法的时候直接使用。

- 优化 Render function：Vue 3.0 的 compile 优化还包括：Render 函数的换行和缩进、Render 函数的条件折叠、Render 函数的常量折叠等等。

总之，Vue 3.0 通过多方面的编译优化，进一步提高了框架的性能和效率，使得 Vue.js 更加高效和易用。

### Vue3 中的内置组件 Teleport 如何使用

在 Vue 3 中，`Teleport` 是一个内置组件，用于将组件的内容渲染到 DOM 结构中的其他位置，通常用于创建具有特定层叠顺序或父子关系的 UI。Teleport可以将组件的 DOM 插到指定的组件层，而不是默认的父组件层，可以用于在应用中创建模态框、悬浮提示框、通知框等组件。

Teleport 组件可以传递两个属性：

- to (必填)：指定组件需要挂载到的 DOM 节点的 ID，如果使用插槽的方式定义了目标容器也可以传入一个选择器字符串。
- disabled (可选)：一个标志位指示此节点是否应该被瞬移到目标中，一般情况下，这个 props 建议设为一个响应式变量来控制 caption 是否展示。

**虽然 DOM 插头被传送到另一个地方，但它的父组件仍然是当前组件，这一点必须牢记，否则会导致样式、交互等问题。**

- Teleport 组件不仅支持具体的 id/选择器，还可以为 to 属性绑定一个 Vue 组件实例

- Teleport 组件是 Vue3 中新增的一个非常有用的组件，可以方便地实现一些弹出框、提示框等组件的功能，提高了开发效率。

`Teleport` 的使用方法如下：

```vue
<template>
  <div>
    <!-- 在原始位置渲染按钮 -->
    <button @click="showModal">Show Modal</button>

    <!-- 使用 Teleport 渲染模态框 -->
    <teleport to="body">
      <modal v-if="isModalVisible" @close="hideModal" />
    </teleport>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'App',
  components: {
    // 假设 Modal 是一个组件
    Modal: {
      template: `
        <div class="modal">
          <div class="modal-content">
            <button @click="$emit('close')">Close</button>
            <slot></slot>
          </div>
        </div>
      `
    }
  },
  setup() {
    const isModalVisible = ref(false);

    const showModal = () => {
      isModalVisible.value = true;
    };

    const hideModal = () => {
      isModalVisible.value = false;
    };

    return {
      isModalVisible,
      showModal,
      hideModal
    };
  }
};
</script>

<style>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #ccc;
  background-color: white;
  padding: 1rem;
}
</style>
```

在上面的例子中，我们在页面的原始位置渲染了一个按钮，然后使用 `Teleport` 将模态框渲染到 `body` 元素下，从而实现了在不同 DOM 结构中渲染组件。注意，我们使用了一个假设的 `Modal` 组件来演示。实际上，你需要创建一个真正的模态框组件来替代。

`Teleport` 的 `to` 属性指定了目标位置，可以是一个字符串选择器，也可以是一个 DOM 元素。通过将内容渲染到 `body` 或其他的 DOM 元素中，你可以实现更灵活的 UI 布局和层叠效果。

### Vue3 相比较 Vue2 做了哪些升级？ 他为什么比 Vue2 更快？

- 响应式系统优化：
  - Vue3 引入了新的响应式系统，这个系统的设计让 Vue3 的渲染函数可以在编译时生成更少的代码，这也就意味着在运行时需要更少的代码来处理虚拟 DOM。
  - 这个新系统的一个重要改进就是**提供了基于 Proxy 实现的响应式机制**，这种机制为开发人员提供更加高效的 API，也减少了一些运行时代码。

- 编译优化：
  - Vue3 的编译器对代码进行了优化，包括减少了部分注释、空白符和其他非必要字符的编译，同时也对编译后的代码进行了懒加载优化。
  - 更快的虚拟 DOM：Vue3 对虚拟 DOM 进行了优化，使用了跟 React 类似的 Fiber 算法，这样可以更加高效地更新 DOM 节点，提高性能。

- Composition API：
  - Vue3 引入Composition API，这种 API 通过提供逻辑组合和重用的方法来提升代码的可读性和重用性。
  - 这种 API 不仅可以让 Vue3 应用更好地组织和维护业务逻辑，还可以让开发人员更加轻松地实现优化。


### setup 中如何获取组件的实例信息？

可以使用 getCurrentInstance() 方法来获取组件实例。getCurrentInstance() 方法返回一个对象，该对象包含了组件实例以及其他相关信息。

`const instance = getCurrentInstance();`

getCurrentInstance() 方法只能在 setup 函数中使用，而不能在组件的生命周期方法（如 created、mounted 等方法）中使用。另外，需要注意的是，如果在 setup 函数返回之前访问了 instance 对象，那么它可能是 undefined ，因此我们需要对其进行处理。



### Vue3 怎么实现的响应式

Vue 3 在实现响应式系统时，使用了代理对象和 JavaScript 的 `Proxy` 技术来达到更高效的效果。这种方式相对于 Vue 2 的 `Object.defineProperty` 实现，具有更好的性能和更强大的功能。

具体来说，Vue 3 的响应式系统通过以下几点实现了更高效的代理响应式：

1. **Proxy 代理**：**Vue 3 使用了 JavaScript 的 `Proxy` 对象来拦截对象属性的访问和修改，从而实现了对对象属性的动态监测。**这种方式相对于 Vue 2 的 `Object.defineProperty` 更加灵活，能够监听对象新增的属性、数组的索引和长度变化等。

2. **惰性代理**：Vue 3 的代理是惰性的，即只有在访问属性时才会进行代理，这样可以减少不必要的代理操作，提高性能。

3. **代理代替深层递归**：Vue 3 的代理机制可以深度代理嵌套对象，而不需要进行深层递归。这使得处理嵌套对象时性能更好，而且不会有 Vue 2 中的一些限制。

4. **响应式数据转换**：Vue 3 在创建响应式代理对象时，会递归地将对象的属性都转换成响应式，这意味着你无需手动声明嵌套属性为响应式，系统会自动处理。

5. **运行时编译**：Vue 3 在运行时编译过程中，会使用代理对象来处理模板中的数据绑定，这样不仅简化了编译器的实现，还提升了编译速度和运行时性能。

总的来说，Vue 3 的代理响应式系统在性能和功能上都相对于 Vue 2 有了明显的提升。这使得开发者在编写组件时能够更自然地操作数据，而无需过多考虑数据的响应式处理。



### Vue2 和 Vue3的diff算法

当我们谈论 Vue 2 和 Vue 3 的 diff 算法时，实际上是在谈论它们在处理虚拟 DOM 更新时的策略和技术。下面我将更详细地介绍这两个版本的 diff 算法。

Vue 2 的 Diff 算法：
1. **递归遍历旧节点树**：在每次数据变化时，Vue 2 会递归遍历旧的虚拟 DOM 树。这个过程是递归的，意味着它会一直向下遍历所有节点，直到找到需要更新的节点。

2. **比较新旧节点**：对比新旧节点时，Vue 2 会先判断节点的类型是否相同。如果类型相同，则进一步比较节点的属性和子节点。如果属性或子节点有变化，Vue 2 会执行相应的 DOM 操作来更新节点。

3. **复用已有节点**：Vue 2 的 diff 算法会尽量复用已有的节点，以减少 DOM 操作。但是，如果节点的类型不同，就会直接替换整个节点及其子节点。

Vue 3 的 Diff 算法：
1. **Proxy 代理**：Vue 3 使用了 ES6 的 Proxy 对象来实现数据的“响应式”特性。当数据发生变化时，Proxy 可以捕获到对数据的访问，从而知道哪些地方需要更新。

2. **静态标记和 Patch Flag**：在编译阶段，Vue 3 会对模板进行静态标记。这样一来，Vue 3 就知道哪些部分是静态的，哪些部分是动态的。在更新时，Vue 3 使用 Patch Flag 来标记节点的属性，从而确定需要进行的具体操作，比如只更新文本内容、只更新属性等。

3. **快速路径**：如果发现两个节点是相同的（包括标签名、属性和子节点），Vue 3 将会执行一个“快速路径”更新，直接跳过深度比较子节点的过程。

4. **Fragments 和 Teleport**：Vue 3 引入了 Fragments（片段）和 Teleport（传送门）的概念，它们允许你更高效地处理多节点的情况，或者在组件之间移动 DOM 元素而无需重新创建它们。

总体来说，Vue 3 的 diff 算法相对于 Vue 2 来说更加智能和高效。Proxy 的使用使得数据变化可以被直接捕获，避免了不必要的遍历；静态标记和 Patch Flag 可以精确地知道哪些部分需要更新；快速路径减少了无谓的比较操作；新引入的概念如 Fragments 和 Teleport 也带来了更灵活的更新策略。这些优化使得 Vue 3 在性能和效率方面表现得更加出色。

## 🍉 一些常见问题

## 1. 过滤器使用过吗

**过滤器**是 vue2 中的一个特性，作用是用于对文本进行格式化的作用。

过滤器只能应用在两个地方：**`双花括号插值`**和**`v-bind`表达式**。

```js
<!--在双花括号中使用 格式：{{值 | 过滤器的名称}}-->
<div>{{3 | addZero}}</div>
<!--在v-bind中使用 格式：v-bind:id="值 | 过滤器的名称"-->
<div v-bind:id="1 | addZero">11</div>
```

vue3 版本删除了过滤器，因为它和定义一个 method 没有啥本质的区别。

## 2. slot 插槽的使用

插槽分为普通插槽和作用域插槽，它们可以解决不同的场景

**扫盲**

编译是发生在调用 `vm.$mount` 的时候，所以编译的顺序是先编译父组件，再编译子组件。

- 首先编译父组件，在 `parse` 阶段，会执行 `processSlot` 处理 `slot`

  - 当解析到标签上有 `slot` 属性的时候，会给对应的 AST 元素节点添加 `slotTarget` 属性，然后在 `codegen` 阶段，在 `genData` 中会处理 `slotTarget`
  - 会给 `data` 添加一个 `slot` 属性，并指向 `slotTarget`

- 接下来编译子组件，同样在 `parser` 阶段会执行 `processSlot` 处理函数

  - 当遇到 `slot` 标签的时候会给对应的 AST 元素节点添加 `slotName` 属性，然后在 `codegen` 阶段，会判断如果当前 AST 元素节点是 `slot` 标签，则执行 `genSlot` 函数

  - ```js
    function genSlot(el: ASTElement, state: CodegenState): string {
      const slotName = el.slotName || '"default"'
      const children = genChildren(el, state)
      let res = `_t(${slotName}${children ? `,${children}` : ''}`
      const attrs = el.attrs && `{${el.attrs.map((a) => `${camelize(a.name)}:${a.value}`).join(',')}}`
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
    ```

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

## 3. 为什么采用异步渲染？

为了实时更新数据被。

- 当你在 Vue 中更改响应式状态时，最终的 DOM 更新并不是同步生效的，而是由 Vue 将它们缓存在一个队列中，直到下一个“tick”才一起执行。这样是**为了确保每个组件无论发生多少状态改变，都仅执行一次更新**。
- `nextTick()` 可以在状态改变后立即使用，以等待 DOM 更新完成。你可以传递一个回调函数作为参数，或者 await 返回的 Promise。

### nextTick 原理及作用

其实就是为了引出`JavaScript`运行机制，进一步来讲宏任务和微任务。

JS 执行是单线程的，它是基于事件循环的。事件循环大致分为以下几个步骤：

- 所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。
- 主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。
- 一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
- 主线程不断重复上面的第三步。

**主线程的执行过程就是一个 tick，而所有的异步结果都是通过 “任务队列” 来调度。** 

消息队列中存放的是一个个的任务（task）。

task 分为两大类，分别是 macro task 和 micro task，并且每个 macro task 结束后，都要清空所有的 micro task。

在浏览器环境中，常见的 macro task 有 setTimeout、MessageChannel、postMessage、setImmediate；常见的 micro task 有 MutationObsever 和 Promise.then

#### Vue2 版本的实现

- `next-tick.js` 申明了 `microTimerFunc` 和 `macroTimerFunc` 2 个变量，它们分别对应的是 micro task 的函数和 macro task 的函数。
  - 对于 macro task 的实现，优先检测是否支持原生 `setImmediate`，这是一个高版本 IE 和 Edge 才支持的特性，不支持的话再去检测是否支持原生的 `MessageChannel`，如果也不支持的话就会降级为 `setTimeout 0`；
  - 而对于 micro task 的实现，则检测浏览器是否原生支持 Promise，不支持的话直接指向 macro task 的实现。

- `next-tick.js` 对外暴露了 2 个函数，先来看 `nextTick`，这就是执行 `nextTick(flushSchedulerQueue)` 所用到的函数。
  - 它的逻辑也很简单，把传入的回调函数 `cb` 压入 `callbacks` 数组，最后一次性地根据 `useMacroTask` 条件执行 `macroTimerFunc` 或者是 `microTimerFunc`
  - 它们都会在下一个 tick 执行 `flushCallbacks`，`flushCallbacks` 的逻辑非常简单，对 `callbacks` 遍历，然后执行相应的回调函数。

- 使用 `callbacks` 而不是直接在 `nextTick` 中执行回调函数的原因是**保证在同一个 tick 内多次执行 `nextTick`，不会开启多个异步任务，而把这些异步任务都压成一个同步任务，在下一个 tick 执行完毕**。



## 4. Vue2 中如何监听对象或者数组某个值的变化？

在 Vue 2 中，你可以使用“侦听属性”（Watch Property）来监听对象或数组中某个值的变化。通过在组件选项中的`watch`属性中定义需要监听的属性，你可以在属性值发生变化时执行相应的操作。

如果你想监听对象或数组的某个嵌套属性的变化，你可以使用“点符号”来表示嵌套属性的路径。例如，如果你有一个对象属性 `user`，并且想监听其 `name` 属性的变化，可以这样写：

```javascript
watch: {
  'user.name': function(newVal, oldVal) {
    console.log(`Name changed from ${oldVal} to ${newVal}`);
  },
},
```

注意，在 Vue 2 中，监听属性是基于“脏检查”的方式实现的，所以在性能方面可能不如 Vue 3 中的 Composition API 中的 `watch` 更高效。如果你的应用中需要频繁监听属性的变化，你可能会考虑使用 Vue 3 来获得更好的性能和开发体验。

## 5. template 和 jsx 有什么区别？

Vue.js支持两种主要的渲染方式：基于模板的渲染（Template-based Rendering）和基于JSX的渲染（JSX-based Rendering）。这两种方式在语法和使用上有一些区别：

1. **模板渲染（Template-based Rendering）**：
   - 模板渲染是Vue.js的默认渲染方式，也是最常用的方式。
   - 使用HTML模板来定义组件的结构和布局，模板中可以插入动态数据和表达式。
   - 模板语法相对于普通HTML稍有不同，比如使用双大括号`{{ }}`来绑定数据，使用指令（Directives）如`v-if`、`v-for`来实现条件渲染和循环渲染。
   - 模板的语法较为简洁易懂，适合开发者快速上手和维护，特别适用于视图层较为复杂的应用。
2. **JSX渲染（JSX-based Rendering）**：
   - JSX是一种JavaScript的扩展语法，类似于React中使用的语法，可以在JavaScript代码中编写HTML结构。
   - Vue.js也支持使用JSX来渲染组件，这需要借助于Babel插件。
   - 使用JSX可以更自然地嵌套组件、使用JavaScript表达式，并且充分发挥了JavaScript的编程能力。
   - JSX相对于模板更加灵活，允许开发者在一个地方编写组件的结构、数据和逻辑，但可能需要一些熟悉度。

选择使用哪种渲染方式取决于项目的需求和开发团队的偏好。模板渲染适用于大多数情况，特别是当你需要快速构建简单到中等复杂度的视图时。JSX渲染适用于那些希望更紧密地结合JavaScript逻辑和视图的开发者，或者项目需要更高程度的动态性和灵活性。

## 6. 简单说一下 template 到 render 的过程，怎么实现？ 源码 compiler 的原理

`Vue` 只能通过 new 关键字初始化，然后会调用 `this._init` 方法，会初始化一些配置，主要包括

- 合并配置，初始化生命周期，初始化事件中心，初始化渲染
- 初始化 data、props、computed、watcher 等等

`vm.$createElement` 方法定义是在执行 `initRender` 方法的时候，可以看到除了 `vm.$createElement` 方法，还有一个 `vm._c` 方法，它是被模板编译成的 `render` 函数使用，而 `vm.$createElement` 是用户手写 `render` 方法使用的， 这俩个方法支持的参数相同，并且内部都调用了 `createElement` 方法

Vue 中我们是通过 `$mount` 实例方法去挂载 `vm` 的。compiler 里面包括了$mount 重新定义的具体实现。

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

## 7. 虚拟 dom 在 vue 中怎么体现的

Virtual DOM 就是用一个原生的 JS 对象去描述一个 DOM 节点，所以它比创建一个 DOM 的代价要小很多。

- 核心定义无非就几个关键属性，标签名、数据、子节点、键值等，其它属性都是用来扩展 VNode 的灵活性以及实现一些特殊 feature 的。
- Virtual DOM 除了它的数据结构的定义，映射到真实的 DOM 实际上要经历 VNode 的 create、diff、patch 等过程。那么在 Vue.js 中，VNode 的 create 是通过 `createElement` 方法创建的，具体利用 createElement 方法创建 VNode，它定义在 `src/core/vdom/create-element.js` 中。

Virtual DOM 实际上是一个树状结构，每一个 VNode 可能会有若干个子节点，这些子节点应该也是 VNode 的类型。`_createElement` 接收的第 4 个参数 children 是任意类型的，因此我们需要把它们规范成 VNode 类型。

- 规范化 `children` 后，接下来会去创建一个 VNode 的实例。
- 先对 `tag` 做判断
  - 如果是 `string` 类型，则接着判断如果是内置的一些节点，则直接创建一个普通 VNode
  - 如果是为已注册的组件名，则通过 `createComponent` 创建一个组件类型的 VNode
  - 否则创建一个未知的标签的 VNode。
-  如果是 `tag` 一个 `Component` 类型，则直接调用 `createComponent` 创建一个组件类型的 VNode 节点



## 8. 异步组件使用过吗，什么场景使用的？

在大型项目中，我们可能需要拆分应用为更小的块，并仅在需要时再从服务器加载相关组件。

~~~javascript
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...从服务器获取组件
    resolve(/* 获取到的组件 */)
  })
})
// ... 像使用其他一般组件一样使用 `AsyncComp`
~~~



仅在页面需要它渲染时才会调用加载内部实际组件的函数。它会将接收到的 props 和插槽传给内部组件，所以你可以使用这个异步的包装组件无缝地替换原始组件，同时实现延迟加载。

## 9. Vue 挂载过程中执行了哪些操作

Vue 挂载（Mount）过程是指将Vue实例与DOM元素建立联系，使Vue实例能够控制和操作对应的DOM元素。在Vue实例挂载到DOM时，会依次执行以下操作：

1. **实例化Vue对象：** 首先，创建一个Vue实例，这个实例包含了组件的选项、数据、计算属性、方法等。

2. **初始化生命周期钩子函数：** 在实例化过程中，Vue会初始化一系列生命周期钩子函数，如`beforeCreate`、`created`、`beforeMount`等。

3. **编译模板：** 如果Vue实例的`template`选项存在，Vue会将模板编译成渲染函数。

4. **挂载DOM：** 当Vue实例准备就绪时，它会通过`$mount`方法将自身挂载到一个DOM元素上。如果你在实例化时没有提供`el`选项，就需要手动调用`$mount`方法进行挂载。

5. **执行`beforeMount`钩子函数：** 在挂载之前，会执行`beforeMount`钩子函数，允许你在DOM挂载之前进行一些操作。

6. **创建Vue组件的VNode：** Vue会根据模板或渲染函数，生成组件的VNode（虚拟DOM节点）。

7. **将VNode渲染为真实DOM：** Vue会将组件的VNode渲染为真实的DOM节点，并将其插入到挂载的DOM元素中。

8. **执行`mounted`钩子函数：** 在挂载完成后，会执行`mounted`钩子函数，允许你在DOM挂载之后进行一些操作，比如与服务器交互、设置定时器等。

总之，Vue的挂载过程主要包括实例化、生命周期钩子函数的初始化、模板编译、DOM挂载、钩子函数的执行等步骤，最终实现了将Vue实例与DOM元素关联起来，使其能够实时响应数据变化并更新视图。

## 10. Vue 组件 name 属性的作用

`name`属性的作用包括：

1. **在开发工具中显示友好的警告和错误信息：** 当Vue组件在开发过程中出现警告或错误时，Vue会使用`name`属性来提供更具描述性的警告和错误信息。这可以帮助开发者快速定位问题并进行修复。
2. **方便调试：** 当项目变得复杂时，不同的组件可能会相互嵌套，使用`name`属性可以使开发者更容易识别每个组件在开发工具中的名称，从而更方便地进行调试。
3. **优化组件树：** 在一些情况下，Vue会根据组件的`name`属性来优化组件树的更新性能。这涉及到Vue的内部优化策略，它可以根据`name`属性的变化来判断组件是否需要重新渲染。



## 11. 怎么在组件中监听路由参数的变化？

在Vue中，你可以使用Vue Router提供的`$route`对象来监听路由参数的变化。`$route`对象包含了当前路由的信息，包括路由路径、参数、查询字符串等。你可以通过`$watch`或使用Vue的生命周期钩子函数来实现监听路由参数的变化。

以下是在Vue组件中监听路由参数变化的两种常见方式：

1. **使用 `$watch`：**
   在组件的`created`生命周期钩子函数中，使用`$watch`来监听`$route`对象的变化。通过监视路由参数对象的变化，你可以在参数发生变化时执行相应的操作。

   ```vue
   <template>
     <div>
       <!-- 组件内容 -->
     </div>
   </template>
   
   <script>
   export default {
     name: 'MyComponent',
     created() {
       this.$watch('$route', (to, from) => {
         // to 和 from 是 $route 对象，你可以在这里处理参数变化的逻辑
         console.log('路由参数变化:', to.params, from.params);
       });
     }
   }
   </script>
   ```

2. **使用路由参数的钩子函数：**
   Vue Router允许你在路由配置中定义组件级别的路由守卫钩子函数，如`beforeRouteUpdate`，用于在路由参数发生变化时触发相应的操作。

   ```vue
   <template>
     <div>
       <!-- 组件内容 -->
     </div>
   </template>
   
   <script>
   export default {
     name: 'MyComponent',
     beforeRouteUpdate(to, from, next) {
       // to 和 from 是 $route 对象，你可以在这里处理参数变化的逻辑
       console.log('路由参数变化:', to.params, from.params);
       next();
     }
   }
   </script>
   ```

无论使用哪种方式，都可以在组件中监听路由参数的变化并执行相应的逻辑。根据你的需求和代码结构，选择其中一种方式即可。

## 12. Vue 的单项数据流的好处？

Vue 单向数据流的几个好处：

1. **可预测的数据流动：** 在 Vue 中，数据是从父组件流向子组件的，这样的数据流动方向更加清晰和可控。子组件无法直接修改父组件的数据，只能通过 `props` 接收数据，这降低了数据修改的复杂性，有助于提高代码的可预测性和可维护性。
2. **追踪数据变化：** 单向数据流使得数据的变化来源变得明确，当数据发生变化时，我们知道是哪个组件触发了变化。这使得在应用中追踪数据的变化变得更加容易，有助于快速定位和解决问题。
3. **可组合的组件：** Vue 的组件可以更容易地进行组合和嵌套，因为每个组件都是相对独立的，通过 `props` 和自定义事件来传递和通信。这使得构建大型应用程序时，可以将复杂的 UI 拆分成可复用的组件，提高代码的可维护性和可测试性。
4. **更少的副作用：** 单向数据流减少了副作用的可能性。由于数据流动是单向的，我们更容易追踪数据的修改和变化，减少了意外副作用的发生。
5. **更容易调试：** 单向数据流使得应用中的数据流动更加可见和可预测。这对于调试和定位问题非常有帮助，因为你可以更容易地跟踪数据在组件之间的流动。

## 13. Vue在哪些生命周期里面可以直接访问到 dom?

在 Vue 的生命周期中，可以直接访问到 DOM 的阶段主要是在以下几个钩子函数中：

1. **`beforeMount`：** 在实例挂载之前被调用，此时组件的模板已经编译完成，但尚未挂载到 DOM 上。在这个阶段，可以通过 `this.$el` 访问到组件的根 DOM 元素，但此时它还没有被添加到实际的页面 DOM 树中。

2. **`mounted`：** **在实例挂载之后被调用，此时组件已经被添加到 DOM 树中。在这个阶段，可以通过 `this.$el` 访问到组件的根 DOM 元素，并且可以执行 DOM 操作、绑定事件等。**

3. **`beforeUpdate`：** 在数据更新之前被调用，此时组件尚未重新渲染。在这个阶段，可以访问到旧的 DOM 元素和数据，但新的数据尚未应用到组件上。

4. **`updated`：** 在数据更新之后被调用，此时组件已经重新渲染并更新到 DOM 树中。在这个阶段，可以访问到更新后的 DOM 元素和数据，进行一些额外的 DOM 操作。

需要注意的是，在上述生命周期钩子函数中访问到的 DOM 元素是组件根元素，如果需要操作组件内部的其他 DOM 元素，可以结合使用 `ref` 来获取对应的 DOM 引用。

其他生命周期钩子函数如 `created` 和 `beforeDestroy` 等也可以访问到 DOM，但在这些阶段访问到的 DOM 可能还不完全稳定或部分已经被销毁，需要谨慎操作。

### Vue2 和 Vue3 两个版本可以直接访问到 DOM 的阶段有什么区别吗

在 Vue 2 和 Vue 3 的生命周期中，可以直接访问到 DOM 的阶段是基本一致的，但 Vue 3 引入了 Composition API，可能会影响部分生命周期钩子的使用方式。

以下是 Vue 2 和 Vue 3 中可以直接访问到 DOM 的生命周期钩子：

1. **`beforeMount`：** 在实例挂载之前被调用，此时组件的模板已经编译完成，但尚未挂载到 DOM 上。

2. **`mounted`：** 在实例挂载之后被调用，此时组件已经被添加到 DOM 树中。在这个阶段，可以执行 DOM 操作、绑定事件等。

3. **`beforeUpdate`：** 在数据更新之前被调用，此时组件尚未重新渲染。在这个阶段，可以访问到旧的 DOM 元素和数据，但新的数据尚未应用到组件上。

4. **`updated`：** 在数据更新之后被调用，此时组件已经重新渲染并更新到 DOM 树中。在这个阶段，可以访问到更新后的 DOM 元素和数据，进行一些额外的 DOM 操作。

5. **`beforeDestroy`：** 在实例销毁之前被调用，此时组件尚未从 DOM 树中移除。

6. **`destroyed`：** 在实例销毁之后被调用，此时组件已经从 DOM 树中移除。在这个阶段可以执行一些清理操作。

需要注意的是，在 Vue 3 中，由于 Composition API 的引入，组件内部可以使用 `ref` 和 `reactive` 等 API 来进行状态的管理，可能会影响到一些生命周期钩子的使用方式。例如，在 Vue 2 中，可以通过在 `mounted` 钩子中直接操作 DOM 元素，而在 Vue 3 中，你可能会倾向于使用 Composition API 的 `onMounted` 钩子来完成类似的操作。

总的来说，虽然在 Vue 3 中可能会有一些不同的使用模式，但可以直接访问 DOM 的生命周期阶段在两个版本中是基本相同的。



## 14. 页面首次加载的时候，会触发哪些钩子函数？

在 Vue.js 中，页面首次加载时会依次触发以下生命周期钩子函数：

1. **`beforeCreate`：** 组件实例刚在内存中创建，尚未初始化。在这个阶段，组件的数据和事件初始化都尚未开始。

2. **`created`：** 组件实例已经完全创建，包括数据初始化、事件监听等。但是此时组件尚未挂载到 DOM 上。

3. **`beforeMount`：** 在实例挂载之前被调用，此时组件的模板已经编译完成，但尚未挂载到 DOM 上。

4. **`mounted`：** 在实例挂载之后被调用，此时组件已经被添加到 DOM 树中。在这个阶段，可以执行 DOM 操作、绑定事件等。

这些钩子函数会在组件实例化、初始化数据、模板编译和挂载等阶段依次被调用，从而完成页面的首次加载过程。

## 15. Vue 模版样式 scoped 的作用和用法

`scoped` 是 Vue 模板的一个特殊属性，用于给组件的样式添加作用域，以避免样式冲突和污染全局作用域。当在 Vue 组件的 `<style>` 标签中加入 `scoped` 属性时，该样式仅会应用于当前组件的元素，不会影响其他组件或全局样式。

使用 `scoped` 属性的样式将会被自动编译成类似以下的格式：

```css
<style scoped>
  .example[data-v-f3f3eg9] {
    color: red;
  }
</style>
```

在具体的 HTML 元素上，会自动添加一个唯一的 `data-v-*` 特性，以确保样式只作用于该组件内部的元素。

例如，如果有以下组件模板：

```vue
<template>
  <div class="example">This is a scoped example.</div>
</template>

<style scoped>
.example {
  color: red;
}
</style>
```

那么在渲染后的 HTML 中，会变成类似这样：

```html
<div class="example" data-v-f3f3eg9>This is a scoped example.</div>
```

这样做的好处是：

1. **避免样式冲突：** 每个组件的样式都会被限制在各自的作用域内，不会影响其他组件。
2. **模块化开发：** 组件的样式与其模板和逻辑一起被封装在一起，更符合模块化开发的思想。
3. **可维护性：** 易于理解和维护，不用担心全局样式的副作用。

需要注意的是，`scoped` 样式只对组件的根元素及其子元素生效，不包括子组件的根元素。如果要为子组件的根元素应用样式，需要在子组件的 `<style>` 中再次使用 `scoped` 属性。

```vue
<template>
  <div>
    <child-component></child-component>
  </div>
</template>

<style scoped>
/* 这里的样式只对当前组件内的元素生效 */
</style>

<child-component>
  <!-- 这里的样式需要在子组件的 <style> 标签中再次使用 scoped 属性 -->
</child-component>
```

总之，`scoped` 属性是 Vue 中用于实现组件作用域样式的重要特性，可以有效地管理和隔离组件的样式。



#### 样式穿透的写法

在 Vue 中，如果你需要在一个组件的样式中修改或覆盖子组件的样式（即穿透子组件的样式作用域），你可以使用 `>>>` 或 `/deep/` 或 `::v-deep`（Vue 3）选择器来实现。这些选择器会帮助你突破样式的作用域限制，直接影响到子组件的样式。

以下是使用这些选择器的示例：

假设你有一个父组件，其中包含了一个子组件 `<child-component>`，而你希望修改子组件内元素的样式。

**Vue 2 使用 `>>>` 或 `/deep/`：**

```vue
<template>
  <div>
    <child-component></child-component>
  </div>
</template>

<style scoped>
/* 使用 >>> 或 /deep/ 来穿透子组件的样式作用域 */
.parent-container >>> .child-element {
  /* 在这里添加样式 */
}
</style>
```

**Vue 3 使用 `::v-deep`：**

```vue
<template>
  <div>
    <child-component></child-component>
  </div>
</template>

<style scoped>
/* 使用 ::v-deep 来穿透子组件的样式作用域 */
.parent-container ::v-deep .child-element {
  /* 在这里添加样式 */
}
</style>
```

在这些示例中，`.parent-container` 是父组件的选择器，`.child-element` 是子组件内部元素的选择器。通过使用这些特殊选择器，你可以覆盖子组件的样式，即使子组件的样式是在其内部使用了 `scoped` 属性进行限制的。

需要注意的是，虽然这些选择器可以实现样式的穿透，但过度使用样式穿透可能会导致样式的混乱和不易维护。在大多数情况下，建议通过适当的组件设计和样式约定来避免过多使用样式穿透。



## 16. Vue 自带的动画效果

Vue 自带的动画效果是通过 Vue 的过渡系统实现的。过渡系统可以让你在元素进入或离开 DOM 时自动应用动画效果，以及在一些情况下通过触发 CSS 类来实现动画。

以下是实现 Vue 自带的动画效果的一般步骤：

1. **使用 `<transition>` 或 `<transition-group>` 组件包裹需要动画的元素。**

   - `<transition>` 用于单个元素的过渡动画。
   - `<transition-group>` 用于列表或多个元素的过渡动画。

2. **为过渡组件设置属性和事件。**

   - `name` 属性定义过渡的名称，用于自动生成过渡类名，默认为 `"v"`。
   - `appear` 属性用于设置元素初始渲染时是否执行过渡，默认为 `false`。
   - `mode` 属性用于设置过渡模式，可以是 `"in-out"`（新元素先进入，旧元素再离开）或 `"out-in"`（旧元素先离开，新元素再进入），默认为 `"out-in"`。
   - `type` 属性用于设置过渡类型，可以是 `"transition"`（CSS 过渡）或 `"animation"`（CSS 动画），默认为 `"transition"`。

3. **使用钩子函数或 CSS 类来定义动画效果。**

   - `before-enter`、`enter`、`after-enter`、`enter-cancelled` 钩子函数用于定义元素进入时的动画。
   - `before-leave`、`leave`、`after-leave`、`leave-cancelled` 钩子函数用于定义元素离开时的动画。

以下是一个简单的例子，演示了如何在 Vue 中使用过渡来实现动画效果：

```vue
<template>
  <div>
    <button @click="show = !show">Toggle</button>

    <transition name="fade" mode="out-in">
      <p v-if="show" key="text">Hello, Vue Transition!</p>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false
    };
  }
};
</script>

<style>
/* 定义过渡效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
```

在这个例子中，当点击按钮时，`<p>` 元素将以淡入淡出的动画效果显示或隐藏。

需要注意的是，Vue 过渡系统默认使用 CSS 过渡和动画来实现动画效果，但你也可以通过 JavaScript 钩子函数来自定义动画效果。详细的文档和示例可以在 Vue 官方文档中找到：[Vue 过渡 & 动画](https://vuejs.org/v2/guide/transitions.html)。

## 🍓扩展问题

### 简单说一下平时为了提升开发效率封装过哪些组件？



### 

###  接口没出来的时候，做过 mock 吗， 常见的 mock 语法。



### data 属性和 methods 方法可以同名吗

可以，methods 的方法名会被 data 的属性覆盖

