import { resolve } from 'path'
import { defineConfig } from 'vitepress'
import banner from 'vite-plugin-banner'
import { head } from './head'
import { nav } from './nav'
import { sidebar } from './sidebar'
import pkg from '../package.json'

export default defineConfig({
  srcDir: 'docs',
  outDir: 'dist',
  lang: 'zh-CN',
  title: 'Vue3 入门指南与实战案例',
  description:
    '这是一个关于 Vue 3 + TypeScript 的起步学习教程，适合完全的Vue新手和Vue 2.0的老手，在官方文档的基础上融入自己的一些实践经验。',
  head,
  markdown: {
    lineNumbers: false,
  },
  themeConfig: {
    // logo: '/logo.svg',
    nav,
    sidebar,
    outlineTitle: '本页导航',
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/chengpeiquan/learning-vue3',
      },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-PRESENT 程沛权',
    },
  },
  vite: {
    server: {
      port: 2000,
    },
    plugins: [
      banner({
        content: `/**\n * name: ${pkg.name}\n * version: v${pkg.version}\n * description: ${pkg.description}\n * author: ${pkg.author}\n * homepage: ${pkg.homepage}\n */`,
        outDir: resolve(__dirname, '../dist'),
        debug: false,
      }),
    ],
  },
})
