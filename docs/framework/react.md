## react hook 有哪些？

## useCallback 和 useMemo 有什么区别？

都属于 React hooks 中的性能优化工具，避免不必要的重新计算和重新创建。

`useCallback`
记忆一个回调函数，返回的是一个记忆化后的回调函数，主要作用是在依赖变化时，返回的函数不会重新创建，减少不必要的函数创建和传递。
接受两个参数 回调函数和依赖项数组。
当依赖项数组中的任一依赖项发生变化的时候，`useCallback`会返回一个新的回调函数，否则返回上一次记忆化的回调函数。
主要用于防治子组件在每次渲染的时候重新创建回调函数，适用于将回到函数传递给子组件或使用在`useEffect`中的回调函数。

```javascript
const memoizedCallback = useCallback(() => {
  console.log('callback run...')
}, [counter, list])
```

`useMemo`
用于记忆化计算的结果，返回的是一个记忆化之后的值。
在依赖变化时，返回的值不会重新计算，从而减少不必要的计算开销。

```javascript
const memoizedValue = useMemo(() => {
  return 'some value'
}, [dependency1, dependency2])
```

useMemo 接收两个参数：计算函数和依赖项数组。
当依赖项数组中的任何一个依赖项发生变化时，useMemo 会重新计算并返回新的值，否则返回上一次的记忆化值。
主要用于防止在每次渲染时重新计算昂贵的计算结果，适用于计算操作的结果。

### 区别

useCallback 适用于记忆化回调函数，主要用于优化回调函数的传递和避免子组件重新渲染。
useCallback 的第一个参数是回调函数，第二个参数是依赖项数组。
useCallback 返回一个记忆化后的回调函数。

useMemo 适用于记忆化计算的结果，主要用于优化计算操作的结果。
useMemo 的第一个参数是计算函数，第二个参数是依赖项数组。
useMemo 返回一个记忆化后的值。

##
