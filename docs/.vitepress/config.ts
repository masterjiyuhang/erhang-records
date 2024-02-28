import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/erhang-records/',
  title: 'ErHang Records',
  description: 'A VitePress Site',

  head: [['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }]],
  themeConfig: {
    logo: '/logo.png',
    search: {
      provider: 'local'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/JavaScript/l1' }
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

              { text: 'Vue 组件通信', link: '/framework/vue-component' },
              { text: 'Vue 生命周期', link: '/framework/vue-life' },

              { text: 'Vue2 源码', link: '/framework/vue2Source', items: [{ text: '响应式', link: '/framework/Vue2/reactive' }] },
              {
                text: 'Vue3 源码',
                link: '/framework/vue3Source',
                items: [{ text: '第5章', link: '/Vue3/lesson5' }]
              },

              { text: 'React', link: '/framework/react' },

              { text: 'Koa', link: '/framework/koa' },
              {
                text: 'Vue生态工具篇',
                items: [
                  { text: 'Vue-Router', link: '/framework/vue-router' },
                  { text: 'Vuex', link: '/framework/vuex' },
                  { text: 'Pinia', link: '/framework/pinia' }
                ]
              },
              {
                text: 'React生态工具篇',
                items: [
                  { text: 'React-Router', link: '/framework/react-router' },
                  { text: 'Redux', link: '/framework/redux' }
                ]
              }
            ]
          },
          {
            text: '打包工具篇',
            items: [{ text: 'Vite Webpack', link: '/framework/vite-webpack' }]
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
          },
          {
            text: 'NestJS',
            items: [
              {
                text: '概述',
                link: '/nodejs/nestjs/overview'
              }
            ]
          }
        ]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/masterjiyuhang' }]
  },
  lastUpdated: true
})
