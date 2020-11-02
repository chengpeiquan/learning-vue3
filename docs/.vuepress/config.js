const sidebar = require('./sidebar');
const isPro = process.env.NODE_ENV === 'production' ? true : false;

module.exports = {
  base: '/',
  title: '前端资料库',
  description: '一个关于Vue 3.0 + TypeScript的起步教程。',
  head: [
    [
      'link', 
      {
        rel: 'icon',
        href: 'https://chengpeiquan.com/favicon.ico'
      }
    ]
  ],
  host: isPro ? '' : '192.168.0.2',
  port: isPro ? '' : '2000',
  dest: './dist',
  themeConfig: {
    nav: [
      {
        text: 'GitHub',
        link: 'https://github.com/chengpeiquan/chengpeiquan',
        ref: 'nofollow'
      },
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
    repo: 'chengpeiquan/chengpeiquan',
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
  }
}