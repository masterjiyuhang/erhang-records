## 前端路由怎么实现的？

HTML5 History API 和基于 URL 的哈希值是两种不同的路由实现方式，它们分别用于处理客户端路由，并在单页面应用程序（SPA）中实现页面的导航和状态管理。

1. HTML5 History API

HTML5 History API 是 HTML5 标准中提供的一组用于管理浏览器历史记录的接口，它允许 JavaScript 对浏览器的历史记录栈进行操作，从而实现无刷新页面的状态变化。HTML5 History API 包括以下几个重要的方法和对象：

- **history.pushState(state, title, url)**：向浏览器历史记录栈中添加一条新的历史记录，但不会触发页面的刷新。这个方法可以修改当前 URL，并且可以传递一个状态对象和页面标题。

- **history.replaceState(state, title, url)**：用新的状态信息替换当前的历史记录条目，但不会触发页面的刷新。

- **window.onpopstate**：当用户点击浏览器的前进或后退按钮时，会触发 popstate 事件，可以通过该事件监听历史记录的变化。

HTML5 History API 的优点在于可以操作浏览器历史记录，使得路由更加友好，URL 更加清晰易读。但是需要注意的是，使用 HTML5 History API 时需要服务器端的配合，以便在客户端路由导航时能够正确地渲染对应的页面。

2. 基于 URL 的哈希值

基于 URL 的哈希值路由是在 URL 中使用哈希符号 `#` 来模拟路由的变化，通常被称为哈希路由。在单页面应用中，当 URL 中的哈希值发生变化时，浏览器不会重新加载页面，而是触发 `hashchange` 事件，JavaScript 可以监听该事件来捕获 URL 的变化，并根据变化来更新页面内容。

哈希路由的实现方式非常简单，它不需要修改服务器端的配置，也不会导致页面的刷新。但是相对于 HTML5 History API，哈希路由的 URL 看起来不够友好，而且不利于搜索引擎的索引。

综上所述，HTML5 History API 和基于 URL 的哈希值路由都是用于实现客户端路由的方式，各有优缺点，开发者可以根据具体的需求来选择合适的实现方式。

## vue-router 是什么，有哪些常用的组件和 api

- Vue Router 是 Vue.js 官方的路由管理器。它能够让你构建单页面应用（SPA），并且能够管理应用中的路由，使得用户在浏览器地址栏中的 URL 改变时，能够正确地加载对应的视图组件。

- 常用的 Vue Router 组件和 API 包括：

1. 路由器（Router）：

- VueRouter：Vue Router 的主要类，用于创建路由器实例。通常在 Vue 根实例中使用。
- `<router-view>`：Vue Router 提供的组件，用于渲染匹配当前 URL 的视图组件。
- `<router-link>`：Vue Router 提供的组件，用于生成链接，点击后会根据配置的路由跳转到相应的页面。

2. 路由配置（Route Configuration）：

- routes：用于定义路由的配置数组，包括路径、对应的组件等信息。
- router.beforeEach：全局前置守卫，用于在路由跳转之前进行一些操作，如验证用户身份等。
- router.afterEach：全局后置钩子，用于在路由跳转之后执行一些逻辑。

3. 路由参数（Route Parameters）：

- 动态路由：通过在路由路径中使用冒号来定义动态参数，如 /:id。
- $route.params：用于获取当前路由的参数。

4. 嵌套路由（Nested Routes）：

- 可以在路由配置中定义嵌套路由，实现页面的嵌套结构。

5. 导航守卫（Navigation Guards）：

- beforeEach：用于全局前置守卫。
- beforeResolve：用于全局解析守卫。
- afterEach：用于全局后置钩子。
- beforeEnter：用于路由独享的守卫。

6. 导航（Navigation）：

- router.push：用于编程式导航，可以在 JavaScript 中实现页面跳转。
- router.replace：和 push 类似，但不会留下历史记录。
- router.go：在历史记录中前进或后退特定步数。

7. 其他：

- mode：用于配置路由的模式，包括 hash 和 history 两种模式。
- base：用于配置路由的基路径。
- scrollBehavior：用于配置路由切换时页面滚动的行为。

这些是 Vue Router 中常用的组件和 API，通过它们你可以灵活地管理你的应用路由，实现各种页面间的跳转和导航控制。

## route 和 router 有区别吗

- "Route"（路由）是指 Vue Router 中的路由配置信息，它描述了一个路由的路径、对应的组件以及其他相关信息。
  - 在 Vue Router 中，通过定义路由配置数组来创建不同的路由，每个路由对象包含了路径（path）、组件（component）等信息。
- Router（路由器）：

  - "Router"（路由器）是 Vue Router 的核心概念，它是一个用于管理路由的实例。
    Vue Router 实例化后即成为一个路由器，负责监听浏览器地址栏的变化、匹配路由配置并渲染对应的组件等功能。

- Router 实例通常通过创建一个 VueRouter 对象来实现，它可以通过路由配置（routes）、模式（mode）等参数进行配置，然后被挂载到 Vue 应用的根实例中。

- 因此，"Route" 表示路由的配置信息，描述了不同路径对应的组件，而 "Router" 则是一个实例，用于管理这些路由配置信息，负责实现路由的跳转、渲染组件等功能。

## 如何处理 history 模式下的 404？

- 问题原因
  刷新页面可能会导致出现 404 错误。这是因为 history 模式依赖于浏览器的 history.pushState API 来管理路由状态，而刷新页面时浏览器会向服务器发送请求，服务器无法正确地解析这些路由并返回对应的页面，从而导致 404 错误。
- 处理方式：

  - 配置服务器以支持路由。具体来说，需要在服务器上配置一个重定向规则，将所有路由请求都指向 index.html 文件。
  - 通过下面配置，当用户访问任何不存在的 URL 时，Nginx 会将请求重定向到 Vue 应用的入口页面，然后 Vue Router 会根据路由来渲染相应的组件，避免了出现 404 错误。

```txt
  server {
    listen:80;
    server_name domian.name.com;

    location / {
      root /usr/share/nginx/html; // 指定了静态文件的根目录，这里应该是你Vue应用打包后的文件目录。
      index index.html;
      try_files $uri $uri/ /index.html; // 表示Nginx会依次尝试查找请求的文件或目录，如果找不到则会将请求重定向到index.html，也就是Vue应用的入口页面。
    }
  }
```

## 路由跳转的方式有哪些？

在 Vue Router 中，你可以使用不同的方式进行路由跳转，包括：

1. **使用 `<router-link>` 组件**：
   `<router-link>` 是 Vue Router 提供的用于生成链接的组件。你可以在模板中使用它来创建跳转链接，例如：

   ```html
   <router-link to="/about">About</router-link>
   ```

   这将创建一个带有文本 "About" 的链接，点击该链接将会导航到 `/about` 路径。

2. **编程式导航**：
   你可以在 JavaScript 代码中使用路由器的实例方法来进行编程式导航，常见的方法包括：

   - 使用 `router.push()` 方法：

     ```javascript
     // 字符串路径
     router.push('/about');

     // 对象形式的位置描述
     router.push({ path: '/about' });

     // 命名的路由
     router.push({ name: 'about' });
     ```

   - 使用 `router.replace()` 方法：与 `push` 方法类似，但不会留下历史记录。

   - 使用 `router.go()` 方法：在历史记录中前进或后退特定步数。

3. **命名路由**：
   在路由配置中给路由起一个名字，然后可以通过路由的名称来进行导航，例如：

   ```javascript
   const router = new VueRouter({
     routes: [
       {
         path: '/about',
         name: 'about',
         component: AboutComponent,
       },
     ],
   });

   // 使用命名路由进行导航
   router.push({ name: 'about' });
   ```

4. **动态路径参数**：
   如果你的路由路径中包含动态参数，你可以在导航时传入对应的参数值，例如：

   ```javascript
   // 动态路径参数
   router.push('/users/' + userId);
   ```

   这将会导航到 `/users/:userId` 路径，并将 `userId` 参数传递给路由组件。

这些是在 Vue Router 中常用的路由跳转方式，你可以根据具体的场景和需求选择合适的方式进行导航。

## location.href 和 路由跳转有区别吗？

使用 location.href= /url 来跳转，简单方便，但是刷新了页面；
使用 history.pushState( /url ) ，无刷新页面，静态跳转；
引进 router ，然后使用 router.push( /url ) 来跳转，使用了 diff 算法，实现了按需加载，减少了 dom 的消耗。其实使用 router 跳转和使用 history.pushState() 没什么差别的，因为 vue-router 就是用了 history.pushState() ，尤其是在 history 模式下。

## 如何获取页面的 hash 值变化

在 Vue Router 中，可以使用以下方式进行路由跳转：

1. **声明式导航**：使用`<router-link>`组件来进行路由跳转，它会自动渲染成 `<a>` 标签，通过`to`属性指定跳转的目标路由。

   ```html
   <router-link to="/about">About</router-link>
   ```

2. **编程式导航**：在 JavaScript 代码中使用路由实例的方法来进行跳转，常用的方法有`router.push()`、`router.replace()`和`router.go()`。

   ```javascript
   // 使用路径进行跳转
   router.push('/about');

   // 使用命名路由进行跳转
   router.push({ name: 'about' });

   // 替换当前路由
   router.replace('/about');

   // 后退/前进
   router.go(-1);
   ```

3. **命名路由**：为路由配置提供 `name` 属性，然后可以通过名称进行导航。

   ```javascript
   const router = new VueRouter({
     routes: [
       {
         path: '/user/:id',
         name: 'user',
         component: User,
       },
     ],
   });

   // 通过名称进行导航
   router.push({ name: 'user', params: { id: 123 } });
   ```

4. **重定向和别名**：在路由配置中可以设置重定向和别名，通过这些设置可以实现自动跳转到其他路由或为路由设置别名。

   ```javascript
   const router = new VueRouter({
     routes: [
       { path: '/a', redirect: '/b' }, // 重定向
       { path: '/b', component: B }
     ]
   })

   // 别名
   {
     path: '/c',
     component: C,
     alias: '/d'
   }
   ```

至于如何获取页面的 hash 值变化，你可以监听路由对象的 `hash` 属性或者使用导航守卫中的 `to.hash` 来实现。具体的方法如下：

```javascript
router.beforeEach((to, from, next) => {
  // 获取即将要跳转到的页面的 hash 值
  const toHash = to.hash;
  console.log('目标页面的 hash:', toHash);
  next();
});
```

这样，在页面的路由发生变化时，你就能够获取到新的 hash 值。

## params 和 query 的值有什么区别

在 Vue Router 中，`params` 和 `query` 都是用于在路由之间传递数据的方式，但它们的使用场景和特点有所不同。

1. **Params（路由参数）**：

   - `params` 是路由路径中的一部分，通常用于传递动态路径参数。
   - 在路由配置中，通过在路径中使用冒号来定义动态参数，如 `/:id`，然后通过 `$route.params` 来获取参数值。
   - 使用 `params` 传递的参数在 URL 中是不可见的，因为它们直接作为路径的一部分，例如 `/user/123` 中的 `123` 就是一个路由参数。

   ```javascript
   // 路由配置
   const router = new VueRouter({
     routes: [{ path: '/user/:id', component: User }],
   });

   // 获取参数值
   $route.params.id;
   ```

2. **Query（查询参数）**：

   - `query` 是作为 URL 的查询字符串出现的，通常用于传递可选参数。
   - 在 URL 中，查询参数是以 `key=value` 的形式出现的，例如 `/user?id=123` 中的 `id=123` 就是一个查询参数。
   - 使用 `query` 传递的参数可以通过 `$route.query` 来获取。

   ```javascript
   // 路由配置
   const router = new VueRouter({
     routes: [{ path: '/user', component: User }],
   });

   // 获取参数值
   $route.query.id;
   ```

3. **区别**：
   - **可见性**：`params` 中的参数是直接出现在 URL 中的一部分，而 `query` 中的参数则是作为查询字符串出现在 URL 中的，如果在路由的 `path` 中没有定义 `params` ，那么 params 中的值是不会出现在 URL 中的，它只能在路由组件内部通过 `$route.params` 来获取。只有在路由的 `path` 中定义了动态参数，才能够使用 `params` 来传递数据，并且这些参数才会出现在 URL 中。如果没有定义动态参数，就只能使用 `query` 参数来传递数据。
   - **用途**：`params` 通常用于标识资源的唯一性或特定路径下的内容，而 `query` 则用于传递各种类型的可选参数，比如过滤条件、排序方式等。

总的来说，`params` 和 `query` 在传递数据时有着不同的使用场景和特点，你可以根据具体的需求选择合适的方式来传递数据。
