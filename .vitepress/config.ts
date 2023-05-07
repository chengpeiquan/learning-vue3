import { resolve } from 'path'
import { defineConfig } from 'vitepress'
import banner from 'vite-plugin-banner'
import { head } from './head'
import { nav } from './nav'
import { sidebar } from './sidebar'
import pkg from '../package.json'

export default defineConfig({
  appearance: 'dark',
  srcDir: 'docs',
  outDir: 'dist',
  lang: 'zh-CN',
  title: 'Vue3 入门指南与实战案例',
  description:
    '这是一个关于 Vue 3 + TypeScript 的起步学习教程，适合完全的 Vue 新手和 Vue 2.0 的老手，在官方文档的基础上融入自己的一些实践经验。',
  head,
  markdown: {
    lineNumbers: false,
  },
  themeConfig: {
    // logo: '/logo.svg',
    nav,
    sidebar,
    outline: 3,
    outlineTitle: '目录',
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/chengpeiquan/learning-vue3',
      },
    ],
    editLink: {
      pattern:
        'https://github.com/chengpeiquan/learning-vue3/edit/main/docs/:path',
      text: '在 GitHub 上编辑本章内容',
    },
    docFooter: {
      prev: '上一章',
      next: '下一章',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-PRESENT 程沛权',
    },
    algolia: {
      appId: '5LYK75VPNC',
      apiKey: '1d995a4b40491d50f3e8d607e5667017',
      indexName: 'chengpeiquan',
      placeholder: '请输入关键词',
    },
  },
  vite: {
    server: {
      port: 2000,
    },
    plugins: [
      banner({
        content: [
          `/**`,
          ` * name: ${pkg.name}`,
          ` * version: v${pkg.version}`,
          ` * description: ${pkg.description}`,
          ` * author: ${pkg.author}`,
          ` * homepage: ${pkg.homepage}`,
          ` */`,
        ].join('\n'),
        outDir: resolve(__dirname, '../dist'),
        debug: false,
      }),
    ],
  },
})
