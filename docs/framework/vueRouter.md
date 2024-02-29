## 前端路由怎么实现的？

## vue-router 是什么，有哪些常用的组件和 api

## route 和 router 有区别吗

## 如何处理 history 模式下的 404？

## 路由跳转的方式有哪些？

## location.href 和 路由跳转有区别吗？

使用 location.href= /url 来跳转，简单方便，但是刷新了页面；
使用 history.pushState( /url ) ，无刷新页面，静态跳转；
引进 router ，然后使用 router.push( /url ) 来跳转，使用了 diff 算法，实现了按需加载，减少了 dom 的消耗。其实使用 router 跳转和使用 history.pushState() 没什么差别的，因为 vue-router 就是用了 history.pushState() ，尤其是在 history 模式下。

## 如何获取页面的 hash 值变化

## params 和 query 的值有什么区别

## vue-router 常见路由守卫有哪些？
