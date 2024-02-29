# 一些基础的问题

## 基础类型

包括值类型(基本对象类型)和引用类型(复杂对象类型)

基本类型(值类型)： Number(数字),String(字符串),Boolean(布尔),Symbol(符号),null(空),undefined(未定义)在内存中占据固定大小，保存在栈内存中

引用类型(复杂数据类型)： Object(对象)、Function(函数)。其他还有 Array(数组)、Date(日期)、RegExp(正则表达式)、特殊的基本包装类型(String、Number、Boolean) 以及单体内置对象(Global、Math)等 引用类型的值是对象 保存在堆内存中，栈内存存储的是对象的变量标识符以及对象在堆内存中的存储地址。

使用场景：

Symbol：使用 Symbol 来作为对象属性名(key) 利用该特性，把一些不需要对外操作和访问的属性使用 Symbol 来定义

BigInt：由于在 Number 与 BigInt 之间进行转换会损失精度，因而建议仅在值可能大于 253 时使用 BigInt 类型，并且不在两种类型之间进行相互转换。
