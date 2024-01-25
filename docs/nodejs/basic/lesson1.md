# 基础部分

## 微任务与 JavaScript 运行时环境

JavaScript 是单线程语言。自从定时器（setTimeout() 和 setInterval()）加入到 Web API 后，浏览器提供的 JavaScript 环境就已经逐渐发展到包含任务调度、多线程应用开发等强大的特性。

### 执行上下文

当一段代码运行的时候，它实际上是运行在执行上下文中。下面 3 种类型的代码会创建一个新的执行上下文：

- 全局上下文是为运行代码主体而创建的执行上下文，也就是说，它是为那些存在于 JavaScript 函数之外的任何代码而创建的。
- 每个函数会在执行的时候创建自己的执行上下文。这个上下文就是通常说的“本地上下文”。
- 使用 eval() 函数也会创建一个新的执行上下文。

每个上下文创建的时候会被推入执行上下文栈。当退出的时候，它会从上下文栈中移除。

每个程序和函数都能够拥有自己的变量和其他对象。

每个上下文还能够额外的跟踪程序中下一行需要执行的代码以及一些对上下文非常重要的信息。

通过这种方式来使用上下文和上下文栈，我们可以对程序运行的一些基础部分进行管理，包括局部和全局变量、函数的调用与返回等。

::: tip
关于递归函数，当它多次调用自身的时候。每次递归调用都会创建一个新的上下文，这使得 JavaScript 运行时能够追踪 递归的层级以及从递归中的返回的值，同时也意味着每次递归时都会消耗内存来创建新的上下文。
:::

### JavaScript 运行时

JavaScript 运行时实际上维护了一组用于执行 JavaScript 代码的代理。

每个代理由一组执行上下文的集合、执行上下文栈、主线程、一组可能创建用于执行 worker 的额外的线程集合、一个任务队列以及一个微任务队列构成。

除了主线程之外，其他组成部分对于代理来说都是唯一的。

#### 事件循环

每个代理都是由事件循环（**Event Loop**） 驱动的。
事件循环负责收集事件（包括用户事件，其他非用户事件等）、对任务进行排队以便在合适的时候执行回调。
然后他执行所有处于等待中的 JavaScript 任务，然后是微任务，然后再开始下一次循环之前进行一些必要的渲染和绘制操作。

::: tip
网页或者 app 的代码和浏览器本身的用户界面程序运行在相同的**线程**中，共享相同的事件循环。

该线程就是主线程，他除了运行网页本身的代码之外，还负责收集和派发用户和其他事件，以及渲染和绘制网页内容等。
:::

事件循环可以分为如下三种：

1. Window 事件循环
   该循环驱动所有共享同源的窗口。

2. Worker 事件循环
   worker 事件循环驱动 worker 的事件循环。 包括所有形式的 worker， 如基本的 web worker、 shared worker 和 service worker。 worker 被保存在一个或多个主代码分开的代理中。
   浏览器可以对所有特定类型的工作者使用一个事件循环，也可以使用多个事件循环来处理他们。

3. Worklet 事件循环
   worklet (en-US) 事件循环驱动运行 worklet 的代理。这包含了 Worklet (en-US)、AudioWorklet (en-US) 以及 PaintWorklet (en-US)。

## 任务 vs 微任务

一个任务就是由执行诸如从头执行一段程序、执行一个事件回调或一个 interval/timeout 被触发之类的标准机制而被调度的任意 JavaScript 代码。这些都在任务队列（task queue）上被调度。

一个任务就是指计划由标准机制来执行的任何 JavaScript，如程序的初始化、事件触发的回调等。除了使用事件，你还可以使用 setTimeout() 或者 setInterval() 来添加任务。

事件循环驱动你的代码按照这些任务排队的顺序，一个接一个地处理它们。在当前迭代轮次中，只有那些当事件循环过程开始时 已经处于任务队列中 的任务会被执行。其余的任务不得不等待到下一次迭代。

:::tip
任务队列和微任务队列的区别很简单，但却很重要：

- 当执行来自任务队列中的任务时，在每一次新的事件循环开始迭代的时候运行时都会执行队列中的每个任务。

  - 在每次迭代开始之后加入到队列中的任务需要在下一次迭代开始之后才会被执行。(**栈存储**)

- 每次当一个任务退出且执行上下文栈为空的时候，微任务队列中的每一个微任务会依次被执行。**这句话的意思就是当一个任务执行完了之后，与它关联的微任务会被执行，微任务执行也是按顺序执行的。（_队列执行_）**
  - 任务会等到微任务队列为空才会停止执行——即使中途有微任务加入。
  - 换句话说，微任务可以添加新的微任务到队列中，这些新的微任务将在下一个任务开始运行之前，在当前事件循环迭代结束之前执行。

:::

由于代码和浏览器的用户界面运行在同一个线程中，共享同一个事件循环，如果代码阻塞了或者进入了无限循环，则浏览器会卡死。

无论是由于 bug 引起的还是代码中进行复杂运算导致的性能降低，都会影响用户的体验。

当来自多个程序的多个代码对象尝试同时运行的时候，一切都可能变得很慢甚至被阻塞，更不要说浏览器还需要时间来渲染和绘制网站和 UI、处理用户事件等。

**如何解决上述问题**

- 使用 web worker 可以让主线程另起新的线程来运行脚本，这能够缓解上面的情况。一个设计良好的网站或应用会把一些复杂的或者耗时的操作交给 worker 去做，这样可以让主线程除了更新、布局和渲染网页之外，尽可能少的去做其他事情。

- 通过使用像 promise 这样的异步 JavaScript 技术可以使得主线程在等待请求返回结果的同时继续往下执行，这能够更进一步减轻上面提到的情况。然而，一些更接近于基础功能的代码——比如一些框架代码，可能更需要将代码安排在主线程上一个安全的时间来运行，它与任何请求的结果或者任务无关。

- 微任务是另一种解决该问题的方案，通过将代码安排在下一次事件循环开始之前运行而不是必须要等到下一次开始之后才执行，这样可以提供一个更好的访问级别。

## 常见的微任务

起初微任务和任务之间的差异看起来不大。它们很相似；都由位于某个队列的 JavaScript 代码组成并在合适的时候运行。
但是，只有在迭代开始时队列中存在的任务才会被事件循环一个接一个地运行，这和处理微任务队列是殊为不同的。

- promise 的后执行操作

  - then
  - catch
  - finally
  - ...

- queueMicrotask() 创建一个微任务队列。

- MutationObserver Api
  - MutationObserver()
    - 创建并返回一个新的 MutationObserver 它会在指定的 DOM 发生变化时被调用。
    - disconnect()
      - 阻止 MutationObserver 实例继续接收的通知，直到再次调用其 observe() 方法，该观察者对象包含的回调函数都不会再被调用。
    - observe()
      - 配置 MutationObserver 在 DOM 更改匹配给定选项时，通过其回调函数开始接收通知。
    - takeRecords()
      - 从 MutationObserver 的通知队列中删除所有待处理的通知，并将它们返回到 MutationRecord 对象的新 Array 中。

在多个实例，浏览器和 JavaScript 运行时中，标准化的微队列机制意味着这些微任务将以相同的顺序可靠的运行，避免潜在的难以发现的错误。

### 通过 queueMicrotask 使用微任务

- 一个微任务（microtask）就是一个简短的函数，当创建该微任务的函数执行之后，并且只有当 Javascript 调用栈为空，而控制权尚未返还给被用户代理用来驱动脚本执行环境的事件循环之前，该微任务才会被执行。

- 事件循环既可能是浏览器的主事件循环也可能是被一个 web worker 所驱动的事件循环。

- 这使得给定的函数在没有其他脚本执行干扰的情况下运行，也保证了微任务能在用户代理有机会对该微任务带来的行为做出反应之前运行。

#### queueMicrotask 具体使用

```javascript
queueMicrotask(() => {
  /* 微任务中将运行的代码 */
})
```

### 微任务的使用场景

我们来看看微任务特别有用的场景。通常，这些场景关乎捕捉或检查结果、执行清理等；其时机晚于一段 JavaScript 执行上下文主体的退出，但早于任何事件处理函数、timeouts 或 intervals 及其他回调被执行。

::: tip

何时是那种有用的时候？

使用微任务的最主要原因简单归纳为：确保任务顺序的一致性，即便当结果或数据是同步可用的，也要同时减少操作中用户可感知到的延迟而带来的风险。
:::

```javascript
let callback = () => console.log('Regular timeout callback has run')

let urgentCallback = () => console.log('*** Oh noes! An urgent callback has run!')

console.log('Main program started')
setTimeout(callback, 0)
queueMicrotask(urgentCallback)
console.log('Main program exiting')

/**
 * 运行结果：
 * Main program started
 * Main program exiting
 * *** Oh noes! An urgent callback has run!
 * Regular timeout callback has run
 *
 * 这是因为当处理主程序运行的任务退出后，微任务队列先于 timeout 回调所在的任务队列被处理。
 *
 * 要记住任务和微任务是保持各自独立的队列的，且微任务先执行有助于保持这一点。
 */
```