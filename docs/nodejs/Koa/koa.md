## Koa 原理

Koa 是一个基于 Node.js 的轻量级 web 框架，它由 Express 的原作者设计并开发。Koa 的设计目标是更简洁、更表达力强、更健壮。以下是 Koa 的一些主要原理和特点：

1. 中间件架构： Koa 使用了中间件（Middleware）的概念，每个中间件是一个函数，可以处理请求和响应。中间件可以按照顺序执行，每个中间件可以对请求或响应进行修改，或者将控制传递给下一个中间件。

2. 异步流程控制： Koa 利用了 async/await 特性，使得编写异步代码更为简洁。中间件函数可以是异步函数，而 Koa 会负责处理它们的执行顺序。

3. Context 对象： Koa 的中间件函数接收一个 context 对象作为参数，这个对象包含了请求和响应的相关信息。通过 context 对象，中间件可以访问请求头、请求体、响应头等信息，并可以将数据传递给下一个中间件。

4. 洋葱模型： Koa 的中间件执行顺序遵循洋葱模型，即请求经过一系列中间件的处理，然后再经过相同的中间件执行顺序处理响应。这种模型使得请求和响应的处理更为清晰和可控。

5. 轻量级： Koa 本身的代码量相对较小，它并没有集成像 Express 那样的大量功能，而是鼓励使用中间件进行定制。这使得开发者可以根据项目的需求选择性地添加功能，保持应用的轻量性。

```javascript
const Koa = require("koa");
const app = new Koa();

// 中间件1
app.use(async (ctx, next) => {
  console.log("Middleware 1 - Before");
  await next();
  console.log("Middleware 1 - After");
});

// 中间件2
app.use(async (ctx, next) => {
  console.log("Middleware 2 - Before");
  await next();
  console.log("Middleware 2 - After");
  ctx.response.body = "Hello, Koa!";
});

app.listen(3000);
```

### 自己实现过中间件吗？
