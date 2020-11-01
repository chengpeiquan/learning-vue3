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
        link: 'https://github.com/chengpeiquan/learning-vue3',
        ref: 'nofollow'
      },
      {
        text: '3.0官方文档',
        items: [
          {
            text: 'Vue 3.x',
            link: 'https://v3.vuejs.org/',
            ref: 'nofollow'
          },
          {
            text: 'Vue Composition Api',
            link: 'http://composition-api.vuejs.org/zh/',
            ref: 'nofollow'
          },
          {
            text: 'Vue CLI',
            link: 'https://next.cli.vuejs.org/',
            ref: 'nofollow'
          },
          {
            text: 'Vue Router',
            link: 'https://next.router.vuejs.org/',
            ref: 'nofollow'
          },
          {
            text: 'Vuex',
            link: 'https://next.vuex.vuejs.org/',
            ref: 'nofollow'
          }
        ]
      },
      {
        text: '返回博客',
        link: 'https://chengpeiquan.com/',
      }
    ],
    // sidebar: [
    //   '/',
    //   'update',
    //   'component'
    // ],
    sidebar: sidebar,
    sidebarDepth: 2,
    smoothScroll: true
  },
  lastUpdated: true,
  repo: 'chengpeiquan/learning-vue3',
  editLinks: true,
  docsDir: 'docs',
  configureWebpack: {
    resolve: {
      alias: {
        '@img': '/public/img'
      }
    }
  }
}