import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Sidebar = [
  {
    text: '作者的话',
    items: [
      { text: '出版说明', link: '/' },
      { text: '前言', link: '/preface' },
    ],
  },
  {
    text: '前端工程化入门教程',
    items: [
      { text: '了解前端工程化', link: '/engineering' },
      { text: '工程化的前期准备', link: '/guide' },
      { text: '快速上手 TypeScript', link: '/typescript' },
    ],
  },
  {
    text: 'Vue3 入门教程',
    items: [
      { text: '脚手架的升级与配置', link: '/upgrade' },
      { text: '单组件的编写', link: '/component' },
      { text: '路由的使用', link: '/router' },
      { text: '插件的开发和使用', link: '/plugin' },
      { text: '组件之间的通信', link: '/communication' },
      { text: '全局状态的管理', link: '/pinia' },
      { text: '高效开发', link: '/efficient' },
    ],
  },
  {
    text: '扩展阅读',
    items: [
      { text: '常用文档', link: '/links' },
      { text: '更新记录', link: '/changelog' },
    ],
  },
]
