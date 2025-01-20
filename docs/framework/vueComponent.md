## 组件通信

当谈到 Vue 3 中组件通信的方式时，我们可以对每种方式进行更详细的解释，并提供具体的示例。

### Props 和 Events

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

### Provide 和 Inject

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

### Composition API

Composition API 是 Vue 3 引入的一种新的组件通信方式。通过封装相关的逻辑在可重用的函数中，然后在组件中使用这些函数来实现通信和逻辑共享。

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
import { useMessage } from './Composition/useMessage'
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
import { useMessage } from './Composition/useMessage'

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
<!-- Composition/useMessage.js -->
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

在 Vue 3 中，以上几种通信方式都是可用的，但由于组合式 API 的引入，使得 Composition 变得更加强大和灵活，可以更好地实现组件之间的通信和逻辑共享。而 Teleport 则是一个全新的特性，可以用于在 DOM 树中不同位置渲染组件内容，从而实现更灵活的布局和通信。总的来说，Vue 3 提供了更多的选择和更灵活的方式来进行组件通信。

### Slots

- 默认插槽

  - 在外部没有提供任何内容的情况下，可以为插槽指定默认内容。
  - ```javascript
    <button type="submit">
      <slot></slot>
    </button>
    ```

- 具名插槽

  - 有时在一个组件中包含多个插槽出口是很有用的。
  - slot 元素可以有一个特殊的 attribute name，用来给各个插槽分配唯一的 ID，以确定每一处要渲染的内容。
  - 示例代码

    - 定义

    ```javascript
    <div class="container">
      <header>
        <slot name="header"></slot>
      </header>
      <main>
        <slot></slot>
      </main>
      <footer>
        <slot name="footer"></slot>
      </footer>
    </div>
    ```

    - 具体使用

    ```javascript
    <BaseLayout>
        <template #header>
            <h1>Here might be a page title</h1>
        </template>

        <template #default>
            <p>A paragraph for the main content.</p>
            <p>And another one.</p>
        </template>

        <template #footer>
            <p>Here's some contact info</p>
        </template>
    </BaseLayout>
    ```

- 动态插槽

  ```javascript
  <template v-slot:[dynamicSlotName]>
      ...
  </template>
  ```

- 作用域插槽

  - 在某些场景下插槽的内容可能想要同时使用父组件域内和子组件域内的数据。
  - 要做到这一点，我们需要一种方法来让子组件在渲染时将一部分数据提供给插槽。

    - 可以像对组件传递 props 那样，向一个插槽的出口上传递 attributes：
    - ```javascript
        <!-- <MyComponent> 的模板 -->
        <div>
            <slot :text="greetingMessage" :count="1"></slot>
        </div>

        <MyComponent v-slot="slotProps">
            {{ slotProps.text }} {{ slotProps.count }}
        </MyComponent>

        <MyComponent v-slot="{ text, count }">
            {{ text }} {{ count }}
        </MyComponent>
      ```

- 具名作用域插槽

  - 使用

    ```javascript
    <template #header="headerProps">
        {{ headerProps }}
    </template>

    <template #default="defaultProps">
        {{ defaultProps }}
    </template>

    <template #footer="footerProps">
        {{ footerProps }}
    </template>
    ```

  - 注意
    - 插槽上的 name 是一个 Vue 特别保留的 attribute，不会作为 props 传递给插槽。
    - 如果你同时使用了具名插槽与默认插槽，则需要为默认插槽使用显式的`<template>` 标签。

### 透传 Attributes

“透传 attribute”指的是传递给一个组件，却没有被该组件声明为 props 或 emits 的 attribute 或者 v-on 事件监听器。最常见的例子就是 class、style 和 id。

#### 基础透传

- 如果一个子组件的根元素已经有了 class 或 style attribute，它会和从父组件上继承的值合并。

#### 深层组件继承

- 透传的 attribute 不会包含 `<MyButton>` 上声明过的 props 或是针对 emits 声明事件的 v-on 侦听函数，换句话说，声明过的 props 和侦听函数被 `<MyButton>`“消费”了。
- 透传的 attribute 若符合声明，也可以作为 props 传入 `<BaseButton>`。

#### 禁用继承

- 如果你不想要一个组件自动地继承 attribute，你可以在组件选项中设置 `inheritAttrs: false`。

#### 多根节点的 Attributes 继承 ​

- 和单根节点组件有所不同，有着多个根节点的组件没有自动 attribute 透传行为。如果 $attrs 没有被显式绑定，将会抛出一个运行时警告
- 如果 $attrs 被显式绑定，则不会有警告：

```javascript
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```
