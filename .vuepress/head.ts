import type { HeadConfig } from 'vuepress'

export default [
  [
    'link',
    {
      rel: 'icon',
      href: 'https://chengpeiquan.com/favicon.ico',
    },
  ],
  [
    'meta',
    {
      name: 'keywords',
      content:
        'vue 3, vue 3.x, vue 3 入门, vue 3 教程, 学习 vue 3, vue 3 案例, vue 3 教学, vue 3 好用吗',
    },
  ],
  [
    'link',
    {
      rel: 'manifest',
      href: '/manifest.json',
    },
  ],
  [
    'meta',
    {
      name: 'theme-color',
      content: '#3eaf7c',
    },
  ],
  [
    'meta',
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
  ],
  [
    'meta',
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'black',
    },
  ],
  [
    'link',
    {
      rel: 'apple-touch-icon',
      href: '/icons/apple-touch-icon-152x152.png',
    },
  ],
  [
    'link',
    {
      rel: 'mask-icon',
      href: '/icons/safari-pinned-tab.svg',
      color: '#3eaf7c',
    },
  ],
  [
    'meta',
    {
      name: 'msapplication-TileImage',
      content: '/icons/msapplication-icon-144x144.png',
    },
  ],
  [
    'meta',
    {
      name: 'msapplication-TileColor',
      content: '#000000',
    },
  ],
] as HeadConfig[]
