import{_ as a,o as l,c as o,z as e,a as t,O as r}from"./chunks/framework.2cb66d06.js";const V=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"framework/vue-life.md","filePath":"framework/vue-life.md"}'),i={name:"framework/vue-life.md"},n=e("h2",{id:"生命周期",tabindex:"-1"},[t("生命周期 "),e("a",{class:"header-anchor",href:"#生命周期","aria-label":'Permalink to "生命周期"'},"​")],-1),s=e("h3",{id:"vue3-生命周期",tabindex:"-1"},[t("Vue3 生命周期 "),e("a",{class:"header-anchor",href:"#vue3-生命周期","aria-label":'Permalink to "Vue3 生命周期"'},"​")],-1),d=["src"],u=r('<h3 id="vue-父组件能够监听到的子组件的生命周期有哪些" tabindex="-1">Vue 父组件能够监听到的子组件的生命周期有哪些？ <a class="header-anchor" href="#vue-父组件能够监听到的子组件的生命周期有哪些" aria-label="Permalink to &quot;Vue 父组件能够监听到的子组件的生命周期有哪些？&quot;">​</a></h3><ul><li>在 Vue 2 中，可以监听到的子组件的生命周期钩子函数有： <ul><li>beforeCreate：在实例初始化之后，数据观测(data observer) 和 event/watcher 事件配置之前被调用。</li><li>created：实例创建完成后被立即调用。 <ul><li>在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。</li></ul></li><li>beforeMount：在挂载开始之前被调用：相关的 render 函数首次被调用。</li><li>mounted：el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。</li><li>beforeUpdate：数据更新时调用，发生在虚拟 DOM 打补丁之前。</li><li>updated：由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。</li><li>beforeDestroy：实例销毁之前调用。在这一步，实例仍然完全可用。</li><li>destroyed：实例销毁后调用。调用后，所有的事件监听器会被移除，所有的子实例也会被销毁。</li><li></li></ul></li><li>在 Vue 3 中，组合式 API 的引入带来了一些变化。可以监听到的子组件的生命周期钩子函数有： <ul><li>onBeforeMount：在挂载开始之前被调用。</li><li>onMounted：在挂载完成后被调用。</li><li>onBeforeUpdate：在更新开始之前被调用。</li><li>onUpdated：在更新完成后被调用。</li><li>onBeforeUnmount：在卸载开始之前被调用。</li><li>onUnmounted：在卸载完成后被调用。</li></ul></li></ul><p>值得注意的是，在 Vue 3 中，beforeCreate 和 created 钩子函数不再被支持，取而代之的是 setup 函数，它在组件实例创建之前被调用，因此在 setup 函数中可以执行类似 beforeCreate 和 created 阶段的操作。此外，beforeDestroy 和 destroyed 钩子函数也被重命名为 onBeforeUnmount 和 onUnmounted。</p>',3);function c(_,f,h,m,p,v){return l(),o("div",null,[n,s,e("img",{src:"https://cn.vuejs.org/assets/lifecycle.16e4c08e.png"},null,8,d),u])}const k=a(i,[["render",c]]);export{V as __pageData,k as default};
