import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/erhang-records/',
  title: 'ErHang Records',
  description: 'A VitePress Site',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Records', link: '/JavaScript/l1' }
    ],
    outline: 'deep',
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          { text: 'React Template', link: '/study-react' }
        ]
      },
      {
        text: 'Interview-related',
        items: [
          {
            text: '基础篇',
            items: [{ text: '模块化', link: '/JavaScript/l1' }]
          },
          {
            text: '浏览器相关知识',
            // text: 'Browser Related Knowledge',
            items: [
              { text: '渲染流程', link: '/browser/l1' },
              // { text: 'Rendering Process', link: '/browser/l1' },
              { text: '渲染优化', link: '/browser/l2' }
              // { text: 'Rendering Optimization', link: '/browser/l2' }
            ]
          },
          {
            text: '框架篇',
            items: [
              { text: 'Vue', link: '/framework/vue' },
              { text: 'Vue-Router', link: '/framework/vue-router' },
              { text: 'Vuex', link: '/framework/vuex' },

              { text: 'Vue 组件通信', link: '/framework/vue-component' },
              { text: 'Vue 生命周期', link: '/framework/vue-life' },

              { text: 'Vue2 源码', link: '/framework/vue2Source' },
              { text: 'Vue3 源码', link: '/framework/vue3Source' },

              { text: 'React', link: '/framework/react' },
              { text: 'React-Router', link: '/framework/react-router' },
              { text: 'Redux', link: '/framework/redux' },
              { text: 'Koa', link: '/framework/koa' },
              { text: 'Vite Webpack', link: '/framework/vite-webpack' }
            ]
          }
        ]
      },

      {
        text: 'Node-Learn',
        items: [
          {
            text: 'NodeJs基础',
            items: [
              {
                text: '第一课',
                link: '/nodejs/basic/lesson1'
              }
            ]
          },
          {
            text: 'NodeJs进阶',
            items: [
              {
                text: '第一课',
                link: '/nodejs/other/lesson1'
              }
            ]
          }
        ]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }]
  }
})
