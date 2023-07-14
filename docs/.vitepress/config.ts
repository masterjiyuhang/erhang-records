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
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          { text: 'Generate A React Template', link: '/study-react' }
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
            text: 'Browser Related Knowledge',
            items: [
              { text: 'Rendering Process', link: '/browser/l1' },
              { text: 'Rendering Optimization', link: '/browser/l2' }
            ]
          },
          {
            text: '框架篇',
            items: [{ text: 'Vue', link: '/framework/vue' }]
          }
        ]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }]
  }
})
