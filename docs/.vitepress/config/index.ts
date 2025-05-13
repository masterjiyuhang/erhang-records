import { defineConfig } from 'vitepress'
import { getSidebarConfig } from '../../util/index'

const rControl = /[\u0000-\u001f]/g
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g
const rCombining = /[\u0300-\u036F]/g

/**
 * Default slugification function
 */
export const slugify = (str: string): string =>
  str
    .normalize('NFKD')
    // Remove accents
    .replace(rCombining, '')
    // Remove control characters
    .replace(rControl, '')
    // Replace special characters
    .replace(rSpecial, '-')
    // ensure it doesn't start with a number
    .replace(/^(\d)/, '_$1')

const dir = process.env.NUTTER === 'cch' ? '/' : '/erhang-records/'
console.log('🍉 ~ index.ts:24 ~ dir:', dir)

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: dir,
  title: 'ErHang Records',
  description: 'A VitePress Site',
  appearance: 'dark',
  markdown: {
    theme: {
      dark: 'dracula-soft',
      light: 'vitesse-light',
    },

    attrs: {
      leftDelimiter: '%{',
      rightDelimiter: '}%',
    },

    anchor: {
      slugify,
    },
  },
  head: [
    [
      'script',
      { type: 'text/javascript' },
      ` (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "lnisp1k6mx");`,
    ],
    ['link', { rel: 'icon', type: 'image/png', href: `${dir}logo.png` }],
  ],
  themeConfig: {
    logo: '/logo.png',
    // search: {
    //   provider: 'local'
    // },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      {
        text: '学习笔记',
        link: '/learnRecord/',
        activeMatch: '^/learnRecord/',
      },
      {
        text: '面试手册',
        link: '/interviewBook/',
        activeMatch: '^/interviewBook/',
      },
      {
        text: '看看文采哇',
        link: '/titles/',
        activeMatch: '^/titles/',
      },
    ],
    outline: {
      level: [2, 3],
      label: '本页内容',
    },
    sidebar: {
      '/titles/': [
        { text: '概述', link: '/titles/' },
        getSidebarConfig('/titles/2025'),
        getSidebarConfig('/titles/2025/25副省'),
        getSidebarConfig('/titles/热评总结'),
        getSidebarConfig('/titles/类型'),
        getSidebarConfig('/titles/资料分析'),
        getSidebarConfig('/titles/常见成语'),
        getSidebarConfig('/titles/规范词'),
        getSidebarConfig('/titles/单一题'),
      ],
      '/interviewBook/': [
        {
          items: [
            {
              text: '面试手册',
              link: '/interviewBook/',
              items: [
                {
                  text: '高频基础面试题',
                  link: '/interviewBook/fundamental',
                },
                {
                  text: '高频手写面试题',
                  link: '/interviewBook/write',
                },
                {
                  text: '高频框架面试题',
                  link: '/interviewBook/framework',
                },
                {
                  text: '高频CSS面试题',
                  link: '/interviewBook/css',
                },
                {
                  text: '面试',
                  link: '/interviewBook/面试',
                },
              ],
            },
          ],
        },
      ],
      '/': [
        {
          text: 'Examples',
          items: [
            { text: 'Markdown Examples', link: '/markdownExamples' },
            { text: 'Runtime API Examples', link: '/apiExamples' },
            { text: 'React Template', link: '/studyReact' },
          ],
        },
        {
          text: 'Locks',
          items: [{ text: 'Lock Comp Examples', link: '/locks/demo01' }],
        },
        {
          text: '软考',
          items: [
            {
              text: '上午',
              items: [
                { text: '知识版权相关', link: '/software/am/知识版权相关' },
                { text: '数据库相关', link: '/software/am/数据库相关' },
                { text: 'UML图相关', link: '/software/am/UML图相关' },
              ],
            },
            {
              text: '下午',
              items: [{ text: '下午第一题', link: '/software/pm/1' }],
            },
          ],
        },
        {
          text: 'MySQL',
          items: [
            { text: '基础入门', link: '/sql/1' },
            { text: '语法展示', link: '/sql/2' },
            { text: '运算符', link: '/sql/3' },
            { text: '常见操作', link: '/sql/4' },
          ],
        },
        {
          text: '学习笔记',
          link: '/learnRecord/',
          items: [
            {
              text: '基础篇',
              items: [
                { text: '模块化知识', link: '/learnRecord/l1' },
                { text: '基础知识', link: '/learnRecord/basic' },
                { text: '常见手写', link: '/learnRecord/handlingWriting' },
              ],
            },
            {
              text: '浏览器相关知识',
              items: [
                { text: '渲染流程', link: '/browser/l1' },
                { text: '渲染优化', link: '/browser/l2' },
              ],
            },
            {
              text: '框架篇',
              items: [
                {
                  text: 'Vue',
                  link: '/framework/vue',
                  items: [
                    { text: 'Vue 组件通信', link: '/framework/vueComponent' },
                    { text: 'Vue 生命周期', link: '/framework/vueLifestyle' },
                    {
                      text: 'Vue生态工具篇',
                      items: [
                        { text: 'Vue-Router', link: '/framework/vueRouter' },
                        { text: 'Vuex', link: '/framework/vuex' },
                        { text: 'Pinia', link: '/framework/pinia' },
                      ],
                    },
                    {
                      text: 'Vue2 源码',
                      link: '/framework/vue2Source',
                      items: [
                        { text: '数据挂载', link: '/framework/Vue2/vue2data' },
                        {
                          text: '组件化基础',
                          link: '/framework/Vue2/component',
                        },
                        { text: '响应式', link: '/framework/Vue2/reactive' },
                      ],
                    },
                    {
                      text: 'Vue3 源码',
                      link: '/framework/vue3Source',
                      items: [{ text: '第5章', link: '/Vue3/lesson5' }],
                    },
                  ],
                },
                {
                  text: 'Nuxt',
                  items: [
                    {
                      text: '项目初始化',
                      link: '/framework/Nuxt/Nuxt项目初始化.md',
                    },
                  ],
                },
                {
                  text: 'React',
                  link: '/framework/react',
                  items: [
                    {
                      text: 'React生态工具篇',
                      items: [
                        {
                          text: 'React-Router',
                          link: '/framework/reactRouter',
                        },
                        { text: 'Redux', link: '/framework/redux' },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              text: '打包工具篇',
              items: [
                { text: 'Vite Webpack', link: '/framework/ViteAndWebpack' },
              ],
            },
          ],
        },

        {
          text: 'Node学习',
          items: [
            {
              text: '基础部分',
              link: '/nodejs/basic/lesson1',
            },
            {
              text: '进阶部分',
              link: '/nodejs/other/lesson1',
            },
            { text: 'Koa', link: '/nodejs/Koa/koa' },
            {
              text: 'NestJS',
              items: [
                {
                  text: '概述',
                  link: '/nodejs/nestjs/overview',
                },
                {
                  text: '创建一个NestJS应用',
                  link: '/nodejs/nestjs/record',
                },
              ],
            },
          ],
        },
      ],
    },
    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' },
    //       { text: 'React Template', link: '/study-react' }
    //     ]
    //   },
    //   {
    //     text: 'Interview-related',
    //     items: [
    //       {
    //         text: '基础篇',
    //         items: [{ text: '模块化', link: '/JavaScript/l1' }]
    //       },
    //       {
    //         text: '浏览器相关知识',
    //         // text: 'Browser Related Knowledge',
    //         items: [
    //           { text: '渲染流程', link: '/browser/l1' },
    //           // { text: 'Rendering Process', link: '/browser/l1' },
    //           { text: '渲染优化', link: '/browser/l2' }
    //           // { text: 'Rendering Optimization', link: '/browser/l2' }
    //         ]
    //       },
    //       {
    //         text: '框架篇',
    //         items: [
    //           { text: 'Vue', link: '/framework/vue' },

    //           { text: 'Vue 组件通信', link: '/framework/vue-component' },
    //           { text: 'Vue 生命周期', link: '/framework/vue-life' },

    //           { text: 'Vue2 源码', link: '/framework/vue2Source', items: [{ text: '响应式', link: '/framework/Vue2/reactive' }] },
    //           {
    //             text: 'Vue3 源码',
    //             link: '/framework/vue3Source',
    //             items: [{ text: '第5章', link: '/Vue3/lesson5' }]
    //           },

    //           { text: 'React', link: '/framework/react' },

    //           { text: 'Koa', link: '/framework/koa' },
    //           {
    //             text: 'Vue生态工具篇',
    //             items: [
    //               { text: 'Vue-Router', link: '/framework/vue-router' },
    //               { text: 'Vuex', link: '/framework/vuex' },
    //               { text: 'Pinia', link: '/framework/pinia' }
    //             ]
    //           },
    //           {
    //             text: 'React生态工具篇',
    //             items: [
    //               { text: 'React-Router', link: '/framework/react-router' },
    //               { text: 'Redux', link: '/framework/redux' }
    //             ]
    //           }
    //         ]
    //       },
    //       {
    //         text: '打包工具篇',
    //         items: [{ text: 'Vite Webpack', link: '/framework/vite-webpack' }]
    //       }
    //     ]
    //   },

    //   {
    //     text: 'Node-Learn',
    //     items: [
    //       {
    //         text: 'NodeJs基础',
    //         items: [
    //           {
    //             text: '第一课',
    //             link: '/nodejs/basic/lesson1'
    //           }
    //         ]
    //       },
    //       {
    //         text: 'NodeJs进阶',
    //         items: [
    //           {
    //             text: '第一课',
    //             link: '/nodejs/other/lesson1'
    //           }
    //         ]
    //       },
    //       {
    //         text: 'NestJS',
    //         items: [
    //           {
    //             text: '概述',
    //             link: '/nodejs/nestjs/overview'
    //           }
    //         ]
    //       }
    //     ]
    //   }
    // ],
    footer: {
      copyright: 'Copyright © 2019-present ErHang',
      message:
        ' <a href="https://beian.miit.gov.cn/" target="_blank">辽ICP备2023008348号-3 </a>',
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/masterjiyuhang' },
    ],
  },
  lastUpdated: true,
})
