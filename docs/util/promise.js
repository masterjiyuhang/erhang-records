/***
 * then 必须返回一个新的 Promise（链式调用）
 * then 的回调必须异步执行（不能同步）
 * 如果 then 返回的是一个 Promise，要等它完成后再决定下一个状态
 * 错误必须被捕获（try/catch + reject）
 */
class myPromise {
  constructor(exec) {
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined

    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      if (this.state !== 'pending') {
        return
      }
      this.state = 'fulfilled'
      this.value = value
      queueMicrotask(() => {
        this.onFulfilledCallbacks.forEach((fn) => fn(value))
      })
    }

    const reject = (reason) => {
      if (this.state !== 'pending') return
      this.state = 'rejected'
      this.reason = reason
      queueMicrotask(() => {
        this.onRejectedCallbacks.forEach((cb) => cb(reason))
      })
    }

    try {
      exec(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    return new myPromise((resolveNext, rejectNext) => {
      const fulfilledWrapper = () => {
        try {
          if (typeof onFulfilled === 'function') {
            const fn = onFulfilled(this.value)
            if (fn instanceof myPromise) {
              fn.then(resolveNext, rejectNext)
            } else {
              resolveNext(fn)
            }
          } else {
            resolveNext(this.value)
          }
        } catch (error) {
          rejectNext(error)
        }
      }
      const rejectedWrapper = () => {
        try {
          if (typeof onRejected === 'function') {
            const fn = onRejected(this.reason)
            if (fn instanceof myPromise) {
              fn.then(resolveNext, rejectNext)
            } else {
              rejectNext(fn)
            }
          } else {
            rejectNext(this.reason)
          }
        } catch (error) {
          rejectNext(error)
        }
      }
      if (this.state === 'fulfilled') {
        queueMicrotask(() => fulfilledWrapper())
      } else if (this.state === 'rejected') {
        queueMicrotask(() => rejectedWrapper())
      } else {
        this.onFulfilledCallbacks.push(() => queueMicrotask(fulfilledWrapper))
        this.onRejectedCallbacks.push(() => queueMicrotask(rejectedWrapper))
      }
    })
  }
}

/** 执行顺序
 * 同步代码先执行：1 → 5（new Promise 里的 executor 是同步执行的）→ 7
 * 当前宏任务结束 → 执行所有微任务：3（Promise.then）→ 4（queueMicrotask）→ 6（另一个 then）
 * 微任务清空 → 执行下一个宏任务：2（setTimeout）
 */

console.log('1')

setTimeout(() => console.log('2'), 0)

Promise.resolve().then(() => console.log('3'))

queueMicrotask(() => console.log('4'))

new Promise((resolve) => {
  console.log('5')
  resolve()
}).then(() => console.log('6'))

console.log('7')

// 输出顺序：1 5 7 3 4 6 2

setTimeout(() => console.log(1))

Promise.resolve()
  .then(() => {
    console.log(2)
    Promise.resolve().then(() => console.log(3))
  })
  .then(() => console.log(4))

setTimeout(() => console.log(5))

// 输出：2 3 4 1 5
