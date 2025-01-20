# Nuxt 项目搭建

## 初始化项目

```bash
pnpm dlx nuxi@latest init <project-name>



## 初始化目录结构
mkdir assets components composables layouts middleware modules pages plugins public server stores utils
```

### 静态资源 Assets

Nuxt 使用两个目录来处理样式表、字体或图像等资源。

- public/ 目录内容按原样在服务器根目录中提供。
  - public/ 目录用作公共服务器，用于在应用程序的定义 URL 上公开提供静态资源。
  - 您可以从应用程序代码或通过浏览器通过根 URL / 获取 public/ 目录中的文件。
- assets/ 目录包含您希望构建工具（Vite 或 webpack）处理的所有资源。
  - Nuxt 默认使用 Vite 处理其他类型的资源，例如样式表、字体或 SVG。
    - 主要出于性能或缓存目的（例如样式表缩小或浏览器缓存失效）而转换原始文件。
    - Nuxt 使用 assets/ 目录来存储这些文件，但该目录没有自动扫描功能，您可以使用任何其他名称。
  - 在应用程序的代码中，您可以使用 ~/assets/ 路径引用位于 assets/ 目录中的文件。

#### 全局样式资源

要在 Nuxt 组件样式中全局插入语句，您可以在 nuxt.config 文件中使用 Vite 选项。

`/assets/_colors.scss`

```scss
$primary: #49240f;
$secondary: #e4a79d;
```

`nuxt.config`

```ts
export default defineNuxtConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/_colors.scss" as *;',
        },
      },
    },
  },
});
```

### 组件 Components

Components/ 目录是放置所有 Vue 组件的位置。

Nuxt 自动导入此目录中的任何组件（以及您可能正在使用的任何模块注册的组件）。

目录结构

```bash
| components/
--| AppHeader.vue
--| AppFooter.vue
```

app.vue

```vue
<template>
  <div>
    <AppHeader />
    <NuxtPage />
    <AppFooter />
  </div>
</template>
```

### 组合式选项 composables

使用 composables/ 目录将 Vue **组合项**自动导入到您的应用程序中。

```js
export const useFoo = () => {
  return useState("foo", () => "bar");
};
```

### 布局 layout

Nuxt 提供了一个布局框架，用于将常见的 UI 模式提取到可重用的布局中。

- 布局名称标准化为短横线大小写，因此 someLayout 变为 some-layout
- 如果没有指定布局，将使用 layouts/default.vue。
- 与其他组件不同，您的布局必须有一个根元素，以允许 Nuxt 在布局更改之间应用转换 - 并且此根元素不能是 `<slot />`。

```tsx
// app.vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

添加 ~/layouts/default.vue`:

layouts/default.vue

```vue
<template>
  <div>
    <p>Some default layout content shared across all pages</p>
    <slot />
  </div>
</template>
```

在布局文件中，页面的内容将显示在 `<slot />` 组件中。

### 中间件 middleware

Nuxt 提供中间件来在导航到特定路线之前运行代码。

Nuxt 提供了一个可在整个应用程序中使用的可自定义路由中间件框架，非常适合在导航到特定路由之前提取要运行的代码。

路由中间件是接收当前路由和下一个路由作为参数的导航守卫。

Nuxt 提供了两个全局可用的帮助程序，可以直接从中间件返回。

- navigatorTo - 重定向到给定的路线
- abortNavigation - 中止导航，并带有可选的错误消息。

```ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (to.params.id === "1") {
    return;
    abortNavigation();
  }
  // In a real app you would probably not redirect every route to `/`
  // however it is important to check `to.path` before redirecting or you
  // might get an infinite redirect loop
  if (to.path !== "/") {
    return;
    navigateTo("/");
  }
});
```

### 路由 Route

Nuxt 文件系统路由为 pages/目录中的每个文件创建一个路由。

Nuxt 的一项核心功能是文件系统路由器。 pages/ 目录中的每个 Vue 文件都会创建一个相应的 URL（或路由）来显示文件的内容。通过对每个页面使用动态导入，Nuxt 利用代码分割为请求的路由提供最少量的 JavaScript 代码。

该文件系统路由使用命名约定来创建动态和嵌套路由：

```bash
| pages/
---| about.vue
---| index.vue
---| posts/
-----| [id].vue

## ==>
{
  "routes": [
    {
      "path": "/about",
      "component": "pages/about.vue"
    },
    {
      "path": "/",
      "component": "pages/index.vue"
    },
    {
      "path": "/posts/:id",
      "component": "pages/posts/[id].vue"
    }
  ]
}
```

#### 路由跳转

- ​ `<NuxtLink>`
  - 它呈现一个 `<a> `标签，并将 href 属性设置为页面的路由
  - 当`<NuxtLink>`进入客户端的视口时，Nuxt 将自动提前预取链接页面的组件和有效负载（生成的页面），从而实现更快的导航

pages/app.vue

```vue
<template>
  <header>
    <nav>
      <ul>
        <li><NuxtLink to="/about">About</NuxtLink></li>
        <li><NuxtLink to="/posts/1">Post 1</NuxtLink></li>
        <li><NuxtLink to="/posts/2">Post 2</NuxtLink></li>
      </ul>
    </nav>
  </header>
</template>
```

#### 路由参数

```vue
<script setup lang="ts">
const route = useRoute();

// When accessing /posts/1, route.params.id will be 1
console.log(route.params.id);
</script>
```

#### 路由中间件

Nuxt 提供了一个可在整个应用程序中使用的可自定义路由中间件，非常适合在导航到特定路由之前提取要运行的代码。

- 匿名（或内联）路由中间件，直接在使用它们的页面中定义。
- 命名路由中间件，放置在 middleware/ 目录下，在页面使用时会通过异步导入的方式自动加载。
  - 路由中间件名称标准化为短横线大小写，因此 someMiddleware 变为 some-middleware
- 全局路由中间件，放置在 middleware/ 目录中（带有 .global 后缀），并且会在每次路由更改时自动运行。

```ts
export default defineNuxtRouteMiddleware((to, from) => {
  // isAuthenticated() is an example method verifying if a user is authenticated
  if (isAuthenticated() === false) {
    return navigateTo("/login");
  }
});
```

#### 路由验证

Nuxt 通过每个页面的`definePageMeta()`中的`validate`属性提供路由验证。

validate 属性接受路由`route`作为参数。您可以返回一个布尔值来确定这是否是要在此页面中呈现的有效路由。

- 如果返回 false，并且找不到另一个匹配项，这将导致 404 错误。
- 也可以直接返回带有 statusCode/statusMessage 的对象来立即响应错误（其他匹配不会被检查）

```vue
<script setup lang="ts">
definePageMeta({
  validate: async (route) => {
    // Check if the id is made up of digits
    return typeof route.params.id === "string" && /^\d+$/.test(route.params.id);
  },
});
</script>
```

### 状态管理

Nuxt 提供了强大的状态管理库和 useState 可组合项来创建反应式且 SSR 友好的共享状态。

Nuxt 提供了 useState 可组合项来创建跨组件的响应式且 SSR 友好的共享状态。

useState 是 SSR 友好的 ref 替代品。

它的值将在服务器端渲染后保留，并使用唯一密钥在所有组件之间共享。

**注意**：

- 切勿在` <script setup>` 或`setup()`函数之外定义 `const state = ref()`。 这种状态将在访问您网站的所有用户之间共享，并可能导致内存泄漏！
- 而是使用` const useX = () => useState('x')`

#### pinia

利用 Pinia 模块创建一个全局 store 并在整个应用程序中使用它

确保使用 `npx nuxi@latest module add pinia` 安装 Pinia 模块或遵循模块的安装步骤。

```ts
export const useWebsiteStore = defineStore("websiteStore", {
  state: () => ({
    name: "",
    description: "",
  }),
  actions: {
    async fetch() {
      const infos = await $fetch("https://api.nuxt.com/modules/pinia");

      this.name = infos.name;
      this.description = infos.description;
    },
  },
});
```

app.vue

```vue
<script setup lang="ts">
const website = useWebsiteStore();

await callOnce(website.fetch);
</script>

<template>
  <main>
    <h1>{{ website.name }}</h1>
    <p>{{ website.description }}</p>
  </main>
</template>
```

## Nuxt 模块安装

### eslint

#### 安装依赖

```bash
pnpm add -D eslint @nuxtjs/eslint-module

pnpm add -D @nuxtjs/eslint-module

export default defineNuxtConfig({
  modules: [
    // Simple usage
    '@nuxtjs/eslint-module',

    // With options
    ['@nuxtjs/eslint-module', { /* module options */ }]
  ]
})
```

#### 配置 eslint

```bash
pnpm add -D @erhang/eslint-config
touch .eslintrc.cjs .eslintignore
```

::: details
`.eslintrc.cjs`

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["@erhang/eslint-config/nuxt"],
};
```

:::

### pinia

`pnpm add @pinia/nuxt`

```ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/eslint-module", "@pinia/nuxt"], // add moudles
});
```

`mkidir stores` =>` cd stores` => `touch user.ts`

```ts
import { defineStore } from "pinia";

export const useMyUserStore = defineStore({
  id: "myUserStore",
  state: () => ({
    userInfo: {
      name: "qe",
      token: "",
    },
  }),
  actions: {},
});
```

### tailwindcss

安装对应依赖

`pnpm add --save-dev @nuxtjs/tailwindcss`

```ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/eslint-module", "@pinia/nuxt", "@nuxtjs/tailwindcss"], // add moudles
});
```

初始化配置

`npx tailwindcss init` or

`~/assets/css/tailwind.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

更新` next.config.ts`

```ts
export default {
  // Defaults options
  tailwindcss: {
    cssPath: ["~/assets/css/tailwind.css", { injectPosition: "first" }],
    configPath: "tailwind.config",
    exposeConfig: {
      level: 2,
    },
    config: {},
    viewer: true,
  },
};
```

创建 tailwind.config.ts

```ts
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```
