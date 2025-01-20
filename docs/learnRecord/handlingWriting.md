# 常见手写

## 深拷贝

```js
/**
 * 判断是否是基本数据类型
 * @param value
 */
function isPrimitive(value) {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "symbol" ||
    typeof value === "boolean"
  );
}

/**
 * 判断是否是一个js对象
 * @param value
 */
function isObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

/**
 * 深拷贝一个值
 * @param value
 */
function cloneDeep(value) {
  // 记录被拷贝的值，避免循环引用的出现
  let memo = {};

  function baseClone(value) {
    let res;
    // 如果是基本数据类型，则直接返回
    if (isPrimitive(value)) {
      return value;
      // 如果是引用数据类型，我们浅拷贝一个新值来代替原来的值
    } else if (Array.isArray(value)) {
      res = [...value];
    } else if (isObject(value)) {
      res = { ...value };
    }

    // 检测我们浅拷贝的这个对象的属性值有没有是引用数据类型。如果是，则递归拷贝
    Reflect.ownKeys(res).forEach((key) => {
      if (typeof res[key] === "object" && res[key] !== null) {
        //此处我们用memo来记录已经被拷贝过的引用地址。以此来解决循环引用的问题
        if (memo[res[key]]) {
          res[key] = memo[res[key]];
        } else {
          memo[res[key]] = res[key];
          res[key] = baseClone(res[key]);
        }
      }
    });
    return res;
  }

  return baseClone(value);
}
```

## 手写 instanceof

### 具体使用

instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
判断一个实例是否是其父类或者祖先类型的实例。

```js
var simpleStr = "This is a simple string";
var myString = new String();
var newStr = new String("String created with constructor");
var myDate = new Date();
var myObj = {};
var myNonObj = Object.create(null);

simpleStr instanceof String; // 返回 false，非对象实例，因此返回 false
myString instanceof String; // 返回 true
newStr instanceof String; // 返回 true
myString instanceof Object; // 返回 true

myObj instanceof Object; // 返回 true，尽管原型没有定义
({}) instanceof Object; // 返回 true，同上
myNonObj instanceof Object; // 返回 false，一种创建非 Object 实例的对象的方法

myString instanceof Date; //返回 false

myDate instanceof Date; // 返回 true
myDate instanceof Object; // 返回 true
myDate instanceof String; // 返回 false
```

### 具体实现

```js
function instanceOf(target, type) {
  while (target) {
    if (Object.getPrototypeOf(target) === type.prototype) {
      return true;
    }
    target = Object.getPrototypeOf(target);
  }
  return false;
}
```

## 数组的 map 方法

### 实现

```js
Array.prototype.map = function (fn, value) {
  let res = [];
  value = value || window;

  let arr = this;
  for (let i in arr) {
    if (arr.hasOwnProperty(i)) {
      res.push(fn.call(value, arr[i], i, arr));
    }
  }
  return res;
};

Array.prototype.myMap = function (fn, thisValue) {
  var res = [];
  thisValue = thisValue || [];
  this.reduce(function (pre, cur, index, arr) {
    return res.push(fn.call(thisValue, cur, index, arr));
  }, []);
  return res;
};
```

## 手写 reduce

### 实现

```js
Array.prototype.myReduce = function (cb, initValue) {
  let _arr = this;
  let num = initValue == undefined ? _arr[0] : initValue;
  let i = initValue == undefined ? 1 : 0;
  for (i; i < _arr.length; i++) {
    num = cb(num, _arr[i], i, _arr);
  }
  return num;
};
let arr = [1, 2, 3, 4];
arr.myReduce(function (num, item, index, arr) {
  return num + item;
});
```
