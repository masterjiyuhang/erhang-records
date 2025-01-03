# :tada: CSS Module
一些css样式集合。

:boom:

## Button Demo
---
hello: world
---

<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

## Markdown Content

The count is: {{ count }}

<button :class="$style.button" @click="count++">Increment</button>

<style module>
.button {
  color: red;
  border: 1px solid red;
  border-radius: 4px;
  padding: 20px;
  font-weight: bold;
}
</style>