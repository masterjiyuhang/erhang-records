import{_ as e,o as a,c as t,O as o}from"./chunks/framework.2cb66d06.js";const v=JSON.parse('{"title":"Vue3 相关","description":"","frontmatter":{},"headers":[],"relativePath":"framework/vue.md","filePath":"framework/vue.md"}'),l={name:"framework/vue.md"},r=o('<h2 id="_1-vue2-和-vue3-有什么区别" tabindex="-1">1. vue2 和 vue3 有什么区别？ <a class="header-anchor" href="#_1-vue2-和-vue3-有什么区别" aria-label="Permalink to &quot;1. vue2 和 vue3 有什么区别？&quot;">​</a></h2><h3 id="_1-1-proxy-怎么解决的-define-property-的缺点" tabindex="-1">1.1 proxy 怎么解决的 define property 的缺点？ <a class="header-anchor" href="#_1-1-proxy-怎么解决的-define-property-的缺点" aria-label="Permalink to &quot;1.1 proxy 怎么解决的 define property 的缺点？&quot;">​</a></h3><p>Proxy 是 ES6 引入的一个功能强大的内置对象，用于创建一个代理对象，可以拦截并改变底层对象的默认行为。通过使用 Proxy，我们可以解决 Object.defineProperty 的一些限制和缺点。</p><p>下面是一些 Proxy 的特点和如何解决 defineProperty 的缺点：</p><p>更全面的拦截操作：Proxy 提供了一系列拦截操作，比如 get、set、deleteProperty、apply 等。这使得我们可以拦截更多类型的操作，而不仅限于属性的读取和修改。</p><p>动态属性拦截：使用 Proxy 可以动态地拦截属性的读取和设置，而不需要事先定义属性。这与 defineProperty 不同，后者需要在对象创建时定义属性。</p><p>简化属性访问：通过使用 Proxy，我们可以通过在代理对象上直接访问属性，而无需通过特殊的 get 和 set 方法。这使得代码更简洁、易读。</p><p>更好的性能：相比于 defineProperty，Proxy 的性能更好。这是因为 Proxy 在底层实现上更加优化，拦截操作更高效。</p><p>需要注意的是，Proxy 是 ES6 引入的新特性，不支持老版本的浏览器。在使用 Proxy 时，需要确保目标环境支持它，或者使用相应的 polyfill 进行兼容处理。</p><p>综上所述，Proxy 提供了更灵活和强大的对象拦截功能，可以解决 defineProperty 的一些限制，并提供了更好的性能和简化的语法。</p><h3 id="_1-2-vue3-相比较-vue2-的-diff-算法有哪些优化" tabindex="-1">1.2 vue3 相比较 vue2 的 diff 算法有哪些优化 <a class="header-anchor" href="#_1-2-vue3-相比较-vue2-的-diff-算法有哪些优化" aria-label="Permalink to &quot;1.2 vue3 相比较 vue2 的 diff 算法有哪些优化&quot;">​</a></h3><h3 id="_1-3-setup-语法糖-setup-函数相当于-vue2-里面的什么呢" tabindex="-1">1.3 setup 语法糖， setup 函数相当于 vue2 里面的什么呢？ <a class="header-anchor" href="#_1-3-setup-语法糖-setup-函数相当于-vue2-里面的什么呢" aria-label="Permalink to &quot;1.3 setup 语法糖， setup 函数相当于 vue2 里面的什么呢？&quot;">​</a></h3><h4 id="_1-3-1-setup-中怎么设置组件-name" tabindex="-1">1.3.1 setup 中怎么设置组件 name? <a class="header-anchor" href="#_1-3-1-setup-中怎么设置组件-name" aria-label="Permalink to &quot;1.3.1 setup 中怎么设置组件 name?&quot;">​</a></h4><h3 id="_1-4-reactive-和-shallow-reactive-有什么区别" tabindex="-1">1.4 reactive 和 shallow Reactive 有什么区别？ <a class="header-anchor" href="#_1-4-reactive-和-shallow-reactive-有什么区别" aria-label="Permalink to &quot;1.4 reactive 和 shallow Reactive 有什么区别？&quot;">​</a></h3><h3 id="_1-5-ref-torefs-isref-怎么使用" tabindex="-1">1.5 ref toRefs isRef 怎么使用? <a class="header-anchor" href="#_1-5-ref-torefs-isref-怎么使用" aria-label="Permalink to &quot;1.5 ref toRefs isRef 怎么使用?&quot;">​</a></h3><h3 id="_1-6-readonly-isreadonly-shallowreadonly-怎么使用" tabindex="-1">1.6 readonly isReadOnly shallowReadonly 怎么使用? <a class="header-anchor" href="#_1-6-readonly-isreadonly-shallowreadonly-怎么使用" aria-label="Permalink to &quot;1.6 readonly isReadOnly shallowReadonly 怎么使用?&quot;">​</a></h3><h4 id="_1-6-1-readonly-和-const-有什么区别" tabindex="-1">1.6.1 readonly 和 const 有什么区别？ <a class="header-anchor" href="#_1-6-1-readonly-和-const-有什么区别" aria-label="Permalink to &quot;1.6.1 readonly 和 const 有什么区别？&quot;">​</a></h4><p>const 是赋值保护，使用 const 定义的变量，该变量不能重新赋值。但如果 const 赋值的是对象，那么对象里面的东西是可以改的。原因是 const 定义的变量不能改说的是，对象对应的那个地址不能改变 而 readonly 是属性保护，不能给属性重新赋值</p><h3 id="_1-7-vue3-生命周期的变化" tabindex="-1">1.7 vue3 生命周期的变化？ <a class="header-anchor" href="#_1-7-vue3-生命周期的变化" aria-label="Permalink to &quot;1.7 vue3 生命周期的变化？&quot;">​</a></h3><h3 id="_1-8-组合式-api-和-选项式-api-的区别有哪些" tabindex="-1">1.8 组合式 api 和 选项式 api 的区别有哪些？ <a class="header-anchor" href="#_1-8-组合式-api-和-选项式-api-的区别有哪些" aria-label="Permalink to &quot;1.8 组合式 api 和 选项式 api 的区别有哪些？&quot;">​</a></h3><h3 id="_1-9-vue3-里面的-v-model-语法怎么实现。-对比-vue2-有区别吗" tabindex="-1">1.9 vue3 里面的 v-model 语法怎么实现。 对比 vue2 有区别吗？ <a class="header-anchor" href="#_1-9-vue3-里面的-v-model-语法怎么实现。-对比-vue2-有区别吗" aria-label="Permalink to &quot;1.9 vue3 里面的 v-model 语法怎么实现。 对比 vue2 有区别吗？&quot;">​</a></h3><h3 id="_1-10-组件通信的方式有哪些-两个版本有什么变化吗" tabindex="-1">1.10 组件通信的方式有哪些？ 两个版本有什么变化吗？ <a class="header-anchor" href="#_1-10-组件通信的方式有哪些-两个版本有什么变化吗" aria-label="Permalink to &quot;1.10 组件通信的方式有哪些？ 两个版本有什么变化吗？&quot;">​</a></h3><h3 id="_1-11-vue3-中父子传值-用-ts-怎么写-怎么设置默认值" tabindex="-1">1.11 Vue3 中父子传值 , 用 TS 怎么写，怎么设置默认值 <a class="header-anchor" href="#_1-11-vue3-中父子传值-用-ts-怎么写-怎么设置默认值" aria-label="Permalink to &quot;1.11 Vue3 中父子传值 , 用 TS 怎么写，怎么设置默认值&quot;">​</a></h3><h2 id="_2-watch-和-watcheffect-的区别" tabindex="-1">2. watch 和 watchEffect 的区别 <a class="header-anchor" href="#_2-watch-和-watcheffect-的区别" aria-label="Permalink to &quot;2. watch 和 watchEffect 的区别&quot;">​</a></h2><p>watch 和 watchEffect 都是监听器，watchEffect 是一个副作用函数。</p><ul><li><p>watch ：既要指明监视的数据源，也要指明监视的回调。 而 watchEffect 可以自动监听数据源作为依赖。不用指明监视哪个数据，监视的回调中用到哪个数据，那就监视哪个数据。</p></li><li><p>watch 可以访问改变之前和之后的值，watchEffect 只能获取改变后的值。</p></li><li><p>watch 运行的时候不会立即执行，值改变后才会执行，而 watchEffect 运行后可立即执行。这一点可以通过 watch 的配置项 immediate 改变。</p></li><li><p>watchEffect 有点像 computed ：</p><ul><li>但 computed 注重的计算出来的值（回调函数的返回值）， 所以必须要写返回值。</li><li>而 watcheffect 注重的是过程（回调函数的函数体），所以不用写返回值。</li></ul></li><li><p>watch 与 vue2.x 中 watch 配置功能一致，但也有两个小坑</p><ul><li>监视 reactive 定义的响应式数据时，oldValue 无法正确获取，强制开启了深度监视（deep 配置失效）</li><li>监视 reactive 定义的响应式数据中某个属性时，deep 配置有效。</li></ul></li></ul><h2 id="_3-computed-和-watch-的区别" tabindex="-1">3. computed 和 watch 的区别 <a class="header-anchor" href="#_3-computed-和-watch-的区别" aria-label="Permalink to &quot;3. computed 和 watch 的区别&quot;">​</a></h2><h3 id="vue2" tabindex="-1">vue2 <a class="header-anchor" href="#vue2" aria-label="Permalink to &quot;vue2&quot;">​</a></h3><p>computed：</p><ul><li>computed 属性是一种依赖收集的属性，它根据其依赖的响应式数据进行计算，并返回计算结果。</li><li>computed 属性是基于它的依赖进行缓存的，只有依赖的响应式数据发生变化时，才会重新计算。computed 属性可以被当作普通的属性来使用。</li></ul><p>watch：</p><ul><li>watch 选项允许我们观察一个特定的数据源，并在数据发生变化时执行回调函数。</li><li>它可以用于监听单个数据的变化或监听多个数据的变化。</li><li>watch 选项通常用于监听数据的变化并执行一些异步或开销较大的操作。</li></ul><h3 id="vue3" tabindex="-1">vue3 <a class="header-anchor" href="#vue3" aria-label="Permalink to &quot;vue3&quot;">​</a></h3><p>computed：</p><ul><li>在 Vue 3 中，computed 属性的用法和 Vue 2 基本相同。</li><li>但是，Vue 3 对 computed 属性进行了一些性能优化，使得在某些情况下，computed 属性的计算速度更快。</li></ul><p>watch：</p><ul><li>Vue 3 中引入了一个新的 API，称为 watch 函数。</li><li>watch 函数提供了更灵活的监听选项，并可以使用函数式编程的方式进行处理。</li><li>它可以监听多个数据源的变化，并在数据发生变化时执行回调函数。</li><li>watch 函数还可以处理异步任务和批量更新的情况。</li></ul><h3 id="vue3-的-compute-相比较-vue2-做了哪些优化" tabindex="-1">vue3 的 compute 相比较 vue2 做了哪些优化 <a class="header-anchor" href="#vue3-的-compute-相比较-vue2-做了哪些优化" aria-label="Permalink to &quot;vue3 的 compute 相比较 vue2 做了哪些优化&quot;">​</a></h3><ul><li><p>缓存机制优化</p><ul><li>vue2 中 compute 无论依赖的值是否发生变化， 每次访问 computed 属性都会重新计算。 vue3 缓存机制进行了优化，只有当依赖发生变化的时候，才会进行重新浸酸。 否则会直接返回缓存结果。提高了性能，减少了不必要的计算。</li></ul></li><li><p>惰性求值</p><ul><li>vue3 中的 compute 采用了惰性求值策略。即只有在实际访问 computed 属性时，才会执行计算函数。这意味着在初始化阶段不会进行计算，只有当实际需要获取计算结果时才会进行计算。这样可以减少初始渲染的计算开销。</li></ul></li><li><p>Composition API 支持</p><ul><li>Vue 3 的 computed 属性与 Composition API 紧密集成。在 Vue 3 中，可以使用 computed 函数来定义 computed 属性，而不仅限于使用对象字面量的形式。这使得在组合式 API 中编写和组织 computed 逻辑更加灵活和可维护。</li></ul></li><li><p>更好的类型推导</p><ul><li>Vue 3 通过 TypeScript 的改进提供了更好的类型推导支持。在 Vue 3 中，根据依赖关系的变化，能够更准确地推导出 computed 属性的类型，并提供更好的类型检查和智能提示。</li></ul></li></ul><h2 id="_4-生命周期" tabindex="-1">4. 生命周期 <a class="header-anchor" href="#_4-生命周期" aria-label="Permalink to &quot;4. 生命周期&quot;">​</a></h2><h3 id="_4-1-vue-父组件能够监听到的子组件的生命周期有哪些" tabindex="-1">4.1 vue 父组件能够监听到的子组件的生命周期有哪些？ <a class="header-anchor" href="#_4-1-vue-父组件能够监听到的子组件的生命周期有哪些" aria-label="Permalink to &quot;4.1 vue 父组件能够监听到的子组件的生命周期有哪些？&quot;">​</a></h3><h2 id="_5-组件缓存-keep-alive-怎么做的" tabindex="-1">5. 组件缓存 keep-alive 怎么做的？ <a class="header-anchor" href="#_5-组件缓存-keep-alive-怎么做的" aria-label="Permalink to &quot;5. 组件缓存 keep-alive 怎么做的？&quot;">​</a></h2><h2 id="_6-过滤器使用过吗" tabindex="-1">6. 过滤器使用过吗 <a class="header-anchor" href="#_6-过滤器使用过吗" aria-label="Permalink to &quot;6. 过滤器使用过吗&quot;">​</a></h2><h2 id="_7-slot-插槽的使用" tabindex="-1">7. slot 插槽的使用 <a class="header-anchor" href="#_7-slot-插槽的使用" aria-label="Permalink to &quot;7. slot 插槽的使用&quot;">​</a></h2><h2 id="_8-为什么采用异步渲染" tabindex="-1">8. 为什么采用异步渲染？ <a class="header-anchor" href="#_8-为什么采用异步渲染" aria-label="Permalink to &quot;8. 为什么采用异步渲染？&quot;">​</a></h2><h3 id="_8-1-nexttick-原理及作用" tabindex="-1">8.1 nextTick 原理及作用 <a class="header-anchor" href="#_8-1-nexttick-原理及作用" aria-label="Permalink to &quot;8.1 nextTick 原理及作用&quot;">​</a></h3><h2 id="_9-如何动态的给-vue2-的-data-添加属性值" tabindex="-1">9. 如何动态的给 vue2 的 data 添加属性值？ <a class="header-anchor" href="#_9-如何动态的给-vue2-的-data-添加属性值" aria-label="Permalink to &quot;9. 如何动态的给 vue2 的 data 添加属性值？&quot;">​</a></h2><h3 id="_9-1-如何解决数据更新了-页面没有更新的问题" tabindex="-1">9.1 如何解决数据更新了，页面没有更新的问题 <a class="header-anchor" href="#_9-1-如何解决数据更新了-页面没有更新的问题" aria-label="Permalink to &quot;9.1 如何解决数据更新了，页面没有更新的问题&quot;">​</a></h3><h3 id="_9-2-vue2-data-中的某一个属性发生变化-页面视图会立即执行重新渲染吗" tabindex="-1">9.2 vue2 data 中的某一个属性发生变化，页面视图会立即执行重新渲染吗？ <a class="header-anchor" href="#_9-2-vue2-data-中的某一个属性发生变化-页面视图会立即执行重新渲染吗" aria-label="Permalink to &quot;9.2 vue2 data 中的某一个属性发生变化，页面视图会立即执行重新渲染吗？&quot;">​</a></h3><h2 id="_10-vue2-中如何监听对象或者数组某个值的变化" tabindex="-1">10. vue2 中如何监听对象或者数组某个值的变化？ <a class="header-anchor" href="#_10-vue2-中如何监听对象或者数组某个值的变化" aria-label="Permalink to &quot;10. vue2 中如何监听对象或者数组某个值的变化？&quot;">​</a></h2><h2 id="_11-说一下-template-的实现原理" tabindex="-1">11. 说一下 template 的实现原理 <a class="header-anchor" href="#_11-说一下-template-的实现原理" aria-label="Permalink to &quot;11. 说一下 template 的实现原理&quot;">​</a></h2><h3 id="_11-1-模版编译原理" tabindex="-1">11.1 模版编译原理 <a class="header-anchor" href="#_11-1-模版编译原理" aria-label="Permalink to &quot;11.1 模版编译原理&quot;">​</a></h3><h3 id="_11-2-template-和-jsx-有什么区别" tabindex="-1">11.2 template 和 jsx 有什么区别？ <a class="header-anchor" href="#_11-2-template-和-jsx-有什么区别" aria-label="Permalink to &quot;11.2 template 和 jsx 有什么区别？&quot;">​</a></h3><h3 id="_11-3-什么是-jsx" tabindex="-1">11.3 什么是 jsx? <a class="header-anchor" href="#_11-3-什么是-jsx" aria-label="Permalink to &quot;11.3 什么是 jsx?&quot;">​</a></h3><h2 id="_12-简单说一下-template-到-render-的过程-怎么实现-源码-compiler-的原理" tabindex="-1">12. 简单说一下 template 到 render 的过程，怎么实现？ 源码 compiler 的原理 <a class="header-anchor" href="#_12-简单说一下-template-到-render-的过程-怎么实现-源码-compiler-的原理" aria-label="Permalink to &quot;12. 简单说一下 template 到 render 的过程，怎么实现？ 源码 compiler 的原理&quot;">​</a></h2><h2 id="_13-听过虚拟-dom-吗-在-vue-中怎么体现的" tabindex="-1">13. 听过虚拟 dom 吗 在 vue 中怎么体现的 <a class="header-anchor" href="#_13-听过虚拟-dom-吗-在-vue-中怎么体现的" aria-label="Permalink to &quot;13. 听过虚拟 dom 吗 在 vue 中怎么体现的&quot;">​</a></h2><h2 id="_14-简单说一下-vue-的-diff-算法" tabindex="-1">14. 简单说一下 vue 的 diff 算法 <a class="header-anchor" href="#_14-简单说一下-vue-的-diff-算法" aria-label="Permalink to &quot;14. 简单说一下 vue 的 diff 算法&quot;">​</a></h2><h2 id="_15-异步组件使用过吗-什么场景使用的" tabindex="-1">15. 异步组件使用过吗，什么场景使用的？ <a class="header-anchor" href="#_15-异步组件使用过吗-什么场景使用的" aria-label="Permalink to &quot;15. 异步组件使用过吗，什么场景使用的？&quot;">​</a></h2><h2 id="_16-vue-挂载过程中执行了哪些操作" tabindex="-1">16. vue 挂载过程中执行了哪些操作 <a class="header-anchor" href="#_16-vue-挂载过程中执行了哪些操作" aria-label="Permalink to &quot;16. vue 挂载过程中执行了哪些操作&quot;">​</a></h2><h2 id="_17-vue-组件的-name-属性有什么作用" tabindex="-1">17. vue 组件的 name 属性有什么作用 <a class="header-anchor" href="#_17-vue-组件的-name-属性有什么作用" aria-label="Permalink to &quot;17. vue 组件的 name 属性有什么作用&quot;">​</a></h2><h2 id="_18-怎么在组件中监听路由参数的变化" tabindex="-1">18. 怎么在组件中监听路由参数的变化？ <a class="header-anchor" href="#_18-怎么在组件中监听路由参数的变化" aria-label="Permalink to &quot;18. 怎么在组件中监听路由参数的变化？&quot;">​</a></h2><h2 id="_19-vue-的单项数据流的好处" tabindex="-1">19. vue 的单项数据流的好处？ <a class="header-anchor" href="#_19-vue-的单项数据流的好处" aria-label="Permalink to &quot;19. vue 的单项数据流的好处？&quot;">​</a></h2><h2 id="_20-在哪些生命周期里面可以直接访问到-dom" tabindex="-1">20. 在哪些生命周期里面可以直接访问到 dom? <a class="header-anchor" href="#_20-在哪些生命周期里面可以直接访问到-dom" aria-label="Permalink to &quot;20. 在哪些生命周期里面可以直接访问到 dom?&quot;">​</a></h2><p>在钩子函数 mounted 被调用前，Vue 已经将编译好的模板挂载到页面上，所以在 mounted 中可以访问操作 DOM。</p><h3 id="_20-1-vue3-中什么时候可以访问到-dom-呢" tabindex="-1">20.1 vue3 中什么时候可以访问到 dom 呢 <a class="header-anchor" href="#_20-1-vue3-中什么时候可以访问到-dom-呢" aria-label="Permalink to &quot;20.1 vue3 中什么时候可以访问到 dom 呢&quot;">​</a></h3><h2 id="_21-简单说一下平时为了提升开发效率封装过哪些组件" tabindex="-1">21. 简单说一下平时为了提升开发效率封装过哪些组件？ <a class="header-anchor" href="#_21-简单说一下平时为了提升开发效率封装过哪些组件" aria-label="Permalink to &quot;21. 简单说一下平时为了提升开发效率封装过哪些组件？&quot;">​</a></h2><h2 id="_22-页面首次加载的时候-会触发哪些钩子函数" tabindex="-1">22. 页面首次加载的时候，会触发哪些钩子函数？ <a class="header-anchor" href="#_22-页面首次加载的时候-会触发哪些钩子函数" aria-label="Permalink to &quot;22. 页面首次加载的时候，会触发哪些钩子函数？&quot;">​</a></h2><h2 id="_23-vue-模版样式-scoped-的作用和用法" tabindex="-1">23. vue 模版样式 scoped 的作用和用法 <a class="header-anchor" href="#_23-vue-模版样式-scoped-的作用和用法" aria-label="Permalink to &quot;23. vue 模版样式 scoped 的作用和用法&quot;">​</a></h2><h3 id="_23-1-vue-里面样式穿透的写法" tabindex="-1">23.1 vue 里面样式穿透的写法 <a class="header-anchor" href="#_23-1-vue-里面样式穿透的写法" aria-label="Permalink to &quot;23.1 vue 里面样式穿透的写法&quot;">​</a></h3><h2 id="_24-接口没出来的时候-做过-mock-吗-常见的-mock-语法。" tabindex="-1">24. 接口没出来的时候，做过 mock 吗， 常见的 mock 语法。 <a class="header-anchor" href="#_24-接口没出来的时候-做过-mock-吗-常见的-mock-语法。" aria-label="Permalink to &quot;24. 接口没出来的时候，做过 mock 吗， 常见的 mock 语法。&quot;">​</a></h2><h2 id="_25-vue-自带的动画效果怎么实现的" tabindex="-1">25. vue 自带的动画效果怎么实现的 <a class="header-anchor" href="#_25-vue-自带的动画效果怎么实现的" aria-label="Permalink to &quot;25. vue 自带的动画效果怎么实现的&quot;">​</a></h2><h2 id="_26-data-属性和-methods-方法可以同名吗" tabindex="-1">26. data 属性和 methods 方法可以同名吗 <a class="header-anchor" href="#_26-data-属性和-methods-方法可以同名吗" aria-label="Permalink to &quot;26. data 属性和 methods 方法可以同名吗&quot;">​</a></h2><p>methods 的方法名会被 data 的属性覆盖</p><h2 id="_27-什么是函数式组件-他和-react-的-hook-有什么区别" tabindex="-1">27. 什么是函数式组件？ 他和 react 的 hook 有什么区别？ <a class="header-anchor" href="#_27-什么是函数式组件-他和-react-的-hook-有什么区别" aria-label="Permalink to &quot;27. 什么是函数式组件？ 他和 react 的 hook 有什么区别？&quot;">​</a></h2><h1 id="vue3-相关" tabindex="-1">Vue3 相关 <a class="header-anchor" href="#vue3-相关" aria-label="Permalink to &quot;Vue3 相关&quot;">​</a></h1><h2 id="vue3-怎么实现的响应式" tabindex="-1">vue3 怎么实现的响应式 <a class="header-anchor" href="#vue3-怎么实现的响应式" aria-label="Permalink to &quot;vue3 怎么实现的响应式&quot;">​</a></h2><h2 id="vue3-对于编译做了哪些优化" tabindex="-1">vue3 对于编译做了哪些优化 <a class="header-anchor" href="#vue3-对于编译做了哪些优化" aria-label="Permalink to &quot;vue3 对于编译做了哪些优化&quot;">​</a></h2><p>Vue 3.0 作为 Vue.js 的一次重大升级，其编译器也进行了一些优化，主要包括以下几方面：</p><ul><li>静态树提升： Vue 3.0 通过重写编译器，实现对静态节点（即不改变的节点）进行编译优化，使用 HoistStatic 功能将静态节点移动到 render 函数外部进行缓存，从而服务端渲染和提高前端渲染的性能。</li></ul><p>P- atch Flag：在 Vue 3.0 中，编译的生成 vnode 会根据节点 patch 的标记，只对需要重新渲染的数据进行响应式更新，不需要更新的数据不会重新渲染，从而大大提高了渲染性能。</p><ul><li><p>静态属性提升：Vue3 中对不参与更新的元素，会做静态提升，只会被创建一次，在渲染时直接复用。免去了重复的创建操作，优化内存。 没做静态提升之前，未参与更新的元素也在 render 函数内部，会重复创建阶段。 做了静态提升后，未参与更新的元素，被放置在 render 函数外，每次渲染的时候只要取出即可。同时该元素会被打上静态标记值为-1，特殊标志是负整数表示永远不会用于 Diff。</p></li><li><p>事件监听缓存：默认情况下绑定事件行为会被视为动态绑定（没开启事件监听器缓存），所以每次都会去追踪它的变化。开启事件侦听器缓存后，没有了静态标记。也就是说下次 diff 算法的时候直接使用。</p></li><li><p>优化 Render function：Vue 3.0 的 compile 优化还包括：Render 函数的换行和缩进、Render 函数的条件折叠、Render 函数的常量折叠等等。</p></li></ul><p>总之，Vue 3.0 通过多方面的编译优化，进一步提高了框架的性能和效率，使得 Vue.js 更加高效和易用。</p><h2 id="vue3-中的内置组件-teleport-如何使用" tabindex="-1">vue3 中的内置组件 Teleport 如何使用 <a class="header-anchor" href="#vue3-中的内置组件-teleport-如何使用" aria-label="Permalink to &quot;vue3 中的内置组件 Teleport 如何使用&quot;">​</a></h2><p>Teleport（瞬移）组件，可以将组件的 DOM 插到指定的组件层，而不是默认的父组件层，可以用于在应用中创建模态框、悬浮提示框、通知框等组件。 Teleport 组件可以传递两个属性：</p><ul><li>to (必填)：指定组件需要挂载到的 DOM 节点的 ID，如果使用插槽的方式定义了目标容器也可以传入一个选择器字符串。</li><li>disabled (可选)：一个标志位指示此节点是否应该被瞬移到目标中，一般情况下，这个 props 建议设为一个响应式变量来控制 caption 是否展示。</li></ul><p>虽然 DOM 插头被传送到另一个地方，但它的父组件仍然是当前组件，这一点必须牢记，否则会导致样式、交互等问题。</p><p>Teleport 组件不仅支持具体的 id/选择器，还可以为 to 属性绑定一个 Vue 组件实例</p><p>Teleport 组件是 Vue3 中新增的一个非常有用的组件，可以方便地实现一些弹出框、提示框等组件的功能，提高了开发效率。</p><h2 id="vue3-相比较-vue2-做了哪些升级-他为什么比-vue2-更快" tabindex="-1">vue3 相比较 vue2 做了哪些升级？ 他为什么比 vue2 更快？ <a class="header-anchor" href="#vue3-相比较-vue2-做了哪些升级-他为什么比-vue2-更快" aria-label="Permalink to &quot;vue3 相比较 vue2 做了哪些升级？ 他为什么比 vue2 更快？&quot;">​</a></h2><ul><li>响应式系统优化：Vue3 引入了新的响应式系统，这个系统的设计让 Vue3 的渲染函数可以在编译时生成更少的代码，这也就意味着在运行时需要更少的代码来处理虚拟 DOM。这个新系统的一个重要改进就是提供了一种基于 Proxy 实现的响应式机制，这种机制为开发人员提供更加高效的 API，也减少了一些运行时代码。</li><li>编译优化：Vue3 的编译器对代码进行了优化，包括减少了部分注释、空白符和其他非必要字符的编译，同时也对编译后的代码进行了懒加载优化。</li><li>更快的虚拟 DOM：Vue3 对虚拟 DOM 进行了优化，使用了跟 React 类似的 Fiber 算法，这样可以更加高效地更新 DOM 节点，提高性能。</li><li>Composition API：Vue3 引入了 Composition API，这种 API 通过提供逻辑组合和重用的方法来提升代码的可读性和重用性。这种 API 不仅可以让 Vue3 应用更好地组织和维护业务逻辑，还可以让开发人员更加轻松地实现优化。</li></ul><h2 id="setup-中如何获取组件的实例信息" tabindex="-1">setup 中如何获取组件的实例信息？ <a class="header-anchor" href="#setup-中如何获取组件的实例信息" aria-label="Permalink to &quot;setup 中如何获取组件的实例信息？&quot;">​</a></h2><p>可以使用 getCurrentInstance() 方法来获取组件实例。getCurrentInstance() 方法返回一个对象，该对象包含了组件实例以及其他相关信息。</p><p><code>const instance = getCurrentInstance();</code></p><p>getCurrentInstance() 方法只能在 setup 函数中使用，而不能在组件的生命周期方法（如 created、mounted 等方法）中使用。另外，需要注意的是，如果在 setup 函数返回之前访问了 instance 对象，那么它可能是 undefined ，因此我们需要对其进行处理。</p>',94),i=[r];function u(h,d,n,c,s,p){return a(),t("div",null,i)}const f=e(l,[["render",u]]);export{v as __pageData,f as default};
