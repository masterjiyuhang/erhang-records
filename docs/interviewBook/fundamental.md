## 作用域

程序中的一段源代码在执行之前会经历三个步骤，统称为“编译”。

- 分词/词法分析(`Tokenizing/Lexing`)
- 解析/语法分析(`Parsing`)
  - 将词法单元流(数组)转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树。这个树被称为“抽象语法树”(`Abstract Syntax Tree, AST`)。
- 代码生成
  - 将 `AST` 转换为可执行代码的过程称被称为代码生成。这个过程与语言、目标平台等息 息相关。

### 概念

作用域是一套规则，用于确定在何处以及如何查找变量。
如果查找的目的是对变量进行赋值操作，那么就会使用 `LHS` 查询。
如果目的是获取变量的值，就会使用 `RHS` 查询。

### 变量的赋值操作

- 变量的赋值操作会执行两个动作，首先编译器会在当前作用域中声明一个变量(如 果之前没有声明过)，然后在运行时引擎会在作用域中查找该变量，如果能够找到就会对它赋值。
- 当变量出现在赋值操作的左侧时进行 `LHS` 查询，出现在右侧时进行 `RHS` 查询。

  - `RHS` 查询与简单地查找某个变量的值一样
  - 而 `LHS` 查询则是试图找到变量的容器本身

- `LHS` 和 `RHS` 查询都会在当前执行作用域中开始，如果有需要(也就是说它们没有找到所需的标识符)，就会向上级作用域继续查找目标标识符，这样每次上升一级作用域(一层 楼)，最后抵达全局作用域(顶层)，无论找到或没找到都将停止。
- 不成功的 `RHS` 引用会导致抛出 `ReferenceError` 异常。不成功的 `LHS` 引用会导致自动隐式 地创建一个全局变量(非严格模式下)，该变量使用 `LHS` 引用的目标作为标识符，或者抛出 `ReferenceError` 异常(严格模式下)。

### 作用域嵌套

作用域是根据名称查找变量的一套规则。实际情况中，通常需要同时顾及几个作用域。
当一个块或函数嵌套在另一个块或函数中时，就发生了作用域的嵌套。
在当前作用域中无法找到某个变量时，引擎就会在外层嵌套的作用域中继续查找，直到找到该变量， 或抵达最外层的作用域(也就是全局作用域)为止。

### 词法作用域

- 词法作用域就是定义在词法阶段的作用域。换句话说，词法作用域是由你在写代码时将**变量和块作用域写在哪里**来决定的，因此当词法分析器处理代码时会保持作用域不变(大部分情况下是这样的)。
- 大部分标准语言编译器的第一个工作阶段叫作词法化(也叫单词化)。回忆一下，词法化的过程会对源代码中的字符进行检查，如果是有状态的解析过程，还会赋予单词语义。

### 函数作用域

函数作用域的含义是指，属于`这个函数的全部变量`都可以`在整个函数的范围内使用及复用`(事实上在嵌套的作用域中也可以使用)。
函数是 JavaScript 中最常见的作用域单元。本质上，声明在一个函数内部的变量或函数会在所处的作用域中“隐藏”起来，这是有意为之的良好软件的设计原则。
函数声明和函数表达式之间最重要的区别是它们的名称标识符将会绑定在何处。
区分函数声明和表达式最简单的方法是看 `function` 关键字出现在声明中的位置(不仅仅是一行代码，而是整个声明中的位置)。如果 `function` 是声明中的第一个词，那么就是一个函数声明，否则就是一个函数表达式。

### 块作用域

块作用域指的是变量和函数不仅可以属于所处的作用域，
也可以属于某个代码块(通常指 { .. } 内部)。
块作用域是一个用来对之前的最小授权原则进行扩展的工具，将代码从在函数中隐藏信息扩展为在块中隐藏信息。

## 闭包 🌟

闭包是指一个函数，其内部包含其外层函数的变量。
它可以访问其自身作用域及其所有父级作用域（包括外部函数作用域）中的变量，即使在其父级函数已经执行完毕（返回）后，这些变量仍然可以被访问。

### 举个 🌰

把内部函数 `baz` 传递给 `bar` ，当调用这个内部函数时(现在叫作 `fn`)，它涵盖的` foo()` 内部
作用域的闭包就可以观察到了，因为它能够访问 `a`。

```js{9}
function foo() {
  var a = 2;
  function baz() {
    console.log( a ); // 2
  }
  bar( baz );
}
function bar(fn) {
  fn(); // 妈妈快看呀，这就是闭包!
}

```

::: tip 注意
无论通过何种手段将内部函数传递到所在的词法作用域以外，它**都会持有对原始定义作用域的引用**，无论在何处执行这个函数都会使用闭包。
:::

```js{10}
var fn;
function foo() {
  var a = 2;
  function baz() {
    console.log(a);
  }
  fn = baz; // 将 baz 分配给全局变量
}
function bar() {
  fn(); // 妈妈快看呀，这就是闭包!
}

foo();
bar(); // 2
```

### 什么是闭包

闭包是指在程序中，一个函数可以访问其自身范围之外的变量，即使该函数在其定义的词法作用域之外被调用时仍然有效。这意味着函数可以“捕获”并保持对其外部环境的状态。闭包通常由一个函数和在该函数内定义的引用外部变量的环境组成。

### 闭包的产生

当一个内部函数（定义在另一个函数内部的函数）被其外部函数返回或者作为参数传递给外部作用域，并在外部作用域中被执行时，就形成了闭包。这是因为内部函数携带了对外部函数作用域的引用，使得即使外部函数执行完毕（其作用域本应被销毁），内部函数仍能通过这个引用访问到外部函数作用域中的变量。

### 闭包的作用

- 封装私有变量和方法：通过闭包可以创建私有变量和方法，使得只有内部函数可以访问它们，从而实现封装和隐藏。
- 模块化开发：闭包可以用于创建模块，将相关的函数和数据封装在闭包内部，并且只暴露必要的接口给外部。
- 保存状态：闭包可以用于保存函数的状态，使得函数可以记住之前的操作和状态。
- 回调函数：闭包可以用作回调函数，使得回调函数可以访问其定义时的环境。

### 使用闭包可能造成的影响

- 内存泄漏：如果闭包持有对外部变量的引用，并且这些变量不再被需要，可能导致内存泄漏问题。
- 性能问题：闭包会占用内存，并且可能会导致性能下降，特别是在创建大量闭包时。
- 代码可读性和维护性下降：过度使用闭包可能会导致代码结构复杂，降低代码的可读性和可维护性。
- 变量共享问题：闭包可能导致外部变量被多个闭包共享，使得对变量的修改会影响其他闭包。

### 如何避免闭包造成的问题

- 合理管理闭包内部的引用：确保闭包内部只引用必要的外部变量，避免引用不必要的变量。
- 避免循环引用：确保闭包不会导致循环引用，即闭包不引用外部函数中会持有闭包的对象。
- 及时释放不再需要的闭包：在不需要闭包时，及时将闭包设置为 null，以释放对外部变量的引用。
- 注意闭包的性能影响：避免在性能敏感的代码中滥用闭包，确保合理使用闭包以避免性能问题。
- 避免过度使用闭包：尽量避免过度使用闭包，特别是在大型应用程序中，以减少代码复杂性和维护成本。
