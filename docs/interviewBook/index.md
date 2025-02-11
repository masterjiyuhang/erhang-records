- [高频基础面试题](/interviewBook/fundamental)
- [高频手写面试题](/interviewBook/write)
- [高频框架面试题](/interviewBook/framework)
- [高频CSS面试题](/interviewBook/css)

以下是一份针对5-10年经验Vue技术栈开发者的深度面试题面经，涵盖前端核心知识体系与框架设计原理，重点考察对底层机制的理解和架构设计能力：

---

### **一、W3C规范与浏览器原理**

1. **事件循环深度解析**

   - 如何解释宏任务/微任务的执行优先级？
   - 为什么`MutationObserver`属于微任务？
   - 举例说明`requestIdleCallback`与`requestAnimationFrame`的差异及应用场景

2. **渲染流水线优化**

   - 从DOM修改到像素渲染的完整流程解析
   - 如何通过`will-change`触发GPU加速？列举使用注意事项
   - 解释CSS层叠上下文对渲染性能的影响

3. **Web Components标准**
   - Shadow DOM的样式隔离原理
   - 如何实现Custom Element与Vue组件的互操作性？
   - 对比Web Components与Vue框架的设计哲学差异

---

### **二、HTTP协议进阶**

1. **HTTP/2特性实践**

   - 如何通过Server Push优化Vue应用的资源加载？
   - 多路复用如何解决队头阻塞问题？
   - 解释HPACK头部压缩算法的工作原理

2. **缓存策略设计**

   - 设计动态SPA应用的缓存策略（结合Vue Router）
   - 如何通过`ETag`实现精确缓存验证？
   - Service Worker在PWA中的缓存更新策略

3. **安全防护机制**
   - CSP策略如何防止Vue应用的XSS攻击？
   - 如何通过`Subresource Integrity`确保第三方资源安全？
   - OAuth2.0在SPA中的安全实践方案

---

### **三、CSS工程化与架构**

1. **现代布局系统**

   - 如何用Grid布局实现响应式设计系统？
   - 解释CSS Container Queries的设计理念
   - 分析`content-visibility`对渲染性能的影响

2. **样式隔离方案对比**

   - Shadow DOM vs CSS Modules vs Scoped CSS
   - 如何解决Vue Scoped CSS的深度选择器问题？
   - 动态主题切换的工程化实现方案

3. **动画性能优化**
   - 比较`requestAnimationFrame`与CSS动画的性能差异
   - 如何通过FLIP技术优化列表动画？
   - 解释合成层（Composite Layer）的创建条件

---

### **四、Vue框架深度原理**

1. **响应式系统**

   - 源码层面解析Vue3的Proxy实现与依赖收集机制
   - 对比Vue2/3的数组响应式处理差异
   - 如何实现自定义Reactive对象？

2. **编译器原理**

   - 解析模板编译的完整流程（AST -> Render函数）
   - 静态节点提升（Static Hoisting）的优化原理
   - 如何扩展自定义指令的编译逻辑？

3. **虚拟DOM优化**
   - 详解diff算法的双端对比策略
   - 如何通过`key`策略优化列表渲染性能？
   - 手动编写render函数的最佳实践

---

### **五、架构设计与工程化**

1. **状态管理进阶**

   - 如何实现Vuex模块的动态注册？
   - 对比Pinia与Vuex的核心设计差异
   - 设计支持时间旅行（Time Travel）的状态管理方案

2. **性能优化体系**

   - 首屏加载性能优化全链路方案
   - Webpack拆包策略与预加载机制
   - 如何通过Performance API构建监控系统？

3. **微前端架构**
   - 实现Vue微应用的沙箱隔离方案
   - 如何解决样式污染与全局变量冲突？
   - 对比qiankun与Module Federation的实现差异

---

### **六、浏览器兼容性处理**

1. **渐进增强策略**

   - 如何为Vue应用设计降级方案（ES6+ -> ES5）
   - 处理IE浏览器的事件代理兼容性问题
   - 动态加载Polyfill的最佳实践

2. **特性检测方案**
   - 如何实现CSS
