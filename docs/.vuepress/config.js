const sidebar = require('./sidebar');
const IS_DEV = process.env.NODE_ENV === 'development' ? true : false;

module.exports = {
  base: '/',
  title: 'Vue3.0学习教程与实战案例',
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
    ],
    [
      'link',
      {
        rel: 'manifest',
        href: '/manifest.json'
      }
    ],
    [
      'meta',
      {
        name: 'theme-color',
        content: '#3eaf7c'
      }
    ],
    [
      'meta',
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes'
      }
    ],
    [
      'meta',
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black'
      }
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        href: '/icons/apple-touch-icon-152x152.png'
      }
    ],
    [
      'link',
      {
        rel: 'mask-icon',
        href: '/icons/safari-pinned-tab.svg',
        color: '#3eaf7c'
      }
    ],
    [
      'meta',
      {
        name: 'msapplication-TileImage',
        content: '/icons/msapplication-icon-144x144.png'
      }
    ],
    [
      'meta', 
      {
        name: 'msapplication-TileColor',
        content: '#000000'
      }
    ]
  ],
  // host: IS_DEV ? '192.168.0.88' : '',
  port: IS_DEV ? '2000' : '',
  dest: './dist',
  themeConfig: {
    nav: [
      {
        text: '博客首页',
        link: 'https://chengpeiquan.com/'
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
  markdown: {
    extractHeaders: [ 'h2', 'h3', 'h4' ]
  },
  configureWebpack: (config, isServer) => {
    if ( IS_DEV ) {
      return {
        resolve: {
          alias: {
            '@img': '/public/img'
          }
        }
      }
    }
    // 生产环境，部署到cdn
    else {
      return {
        output: {
          publicPath: 'https://cdn.jsdelivr.net/gh/chengpeiquan/learning-vue3@gh-pages/'
        },
        resolve: {
          alias: {
            '@img': '/public/img'
          }
        }
      }
    }
  },
  plugins: [
    'vuepress-plugin-smooth-scroll',
    '@vuepress/back-to-top',
    [
      '@vuepress/pwa', {
        serviceWorker: true,
        updatePopup: true
      }
    ]
  ]
}