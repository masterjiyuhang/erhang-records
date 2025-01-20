# 常见手写

## debounce 防抖

```js
export const debounce = (fn, delay = 500) => {
  let timer = undefined;
  let active = true;

  const debounced = (...args) => {
    if (active) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        active && fn(...args);
        timer = undefined;
      }, delay);
    } else {
      fn(...args);
    }
  };

  debounced.isPending = () => timer !== undefined;

  debounced.cancel = () => (active = false);

  debounced.flush = (...args) => fn(...args);

  return debounced;
};
```
