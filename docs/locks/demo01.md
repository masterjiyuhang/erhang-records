---
hello: world
---

<style module>
.button {
  color: red;
  font-weight: bold;
}
</style>

<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

## Markdown Content

 <PasswordProtect>
   The count is: {{ count }}

<button :class="$style.button" @click="count++">Increment</button>
<h1>受保护的页面</h1>
<p>这是只有在输入正确密码后才能看到的内容。</p>
</PasswordProtect>
