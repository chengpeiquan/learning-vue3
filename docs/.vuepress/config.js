const sidebar = require('./sidebar');
const isPro = process.env.NODE_ENV === 'production' ? true : false;

module.exports = {
  base: '/',
  title: 'Vue3.0学习教程与案例',
  description: '这是一个关于Vue 3.0 + TypeScript的起步学习教程，适合完全的Vue新手和Vue 2.0的老手，在官方文档的基础上融入自己的一些实践经验。',
  head: [
    [
      'link', 
      {
        rel: 'icon',
        href: 'https://chengpeiquan.com/favicon.ico'
      }
    ],
    [
      'meta', 
      {
        name: 'keywords',
        content: 'vue 3.0, vue 3.x, vue 3.0 教程, 学习 vue 3.0, vue 3.0 案例, vue 3.0 教学, vue 3.0 好用吗'
      }
    ]
  ],
  // host: isPro ? '' : '192.168.0.88',
  port: isPro ? '' : '2000',
  dest: './dist',
  themeConfig: {
    nav: [
      {
        text: '返回博客',
        items: [
          {
            text: '博客首页',
            link: 'https://chengpeiquan.com/'
          },
          {
            text: '项目经验',
            link: 'https://chengpeiquan.com/tech/exp/'
          },
          {
            text: '踩坑心得',
            link: 'https://chengpeiquan.com/tech/bug/'
          },
          {
            text: '杂事笔记',
            link: 'https://chengpeiquan.com/tech/note/'
          }
        ]
      }
    ],
    sidebar: sidebar,
    sidebarDepth: 2,
    smoothScroll: true,
    repo: 'chengpeiquan/learning-vue3',
    docsDir: 'docs',
    docsBranch: 'main',
    lastUpdated: true,
    editLinks: true
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@img': '/public/img'
      }
    }
  },
  plugins: [
    // 'vuepress-plugin-mermaidjs',
    'vuepress-plugin-flowchart'
  ]
}