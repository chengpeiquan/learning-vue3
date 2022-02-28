import { path } from '@vuepress/utils'
import { defineUserConfig } from 'vuepress'
import banner from 'vite-plugin-banner'
import head from './.vuepress/head'
import sidebar from './.vuepress/sidebar'
import pkg from './package.json'
import type { DefaultThemeOptions, SiteData } from 'vuepress'

const isDev: boolean = process.env.NODE_ENV === 'development' ? true : false

export default defineUserConfig<DefaultThemeOptions>({
  /**
   * 基础配置
   */
  base: isDev
    ? '/'
    : 'https://cdn.jsdelivr.net/gh/chengpeiquan/learning-vue3@gh-pages/',
  lang: 'zh-CN',
  title: 'Vue3 入门指南与实战案例',
  description:
    '这是一个关于Vue 3 + TypeScript的起步学习教程，适合完全的Vue新手和Vue 2.0的老手，在官方文档的基础上融入自己的一些实践经验。',
  head,

  /**
   * 主题相关
   */
  clientAppEnhanceFiles: path.resolve(
    __dirname,
    './.vuepress/clientAppEnhance.ts'
  ),
  themeConfig: {
    navbar: [
      {
        text: '博客首页',
        link: 'https://chengpeiquan.com/',
      },
      {
        text: '菜谱教程',
        link: 'https://github.com/chengpeiquan/cooking-cookbook',
      },
    ],
    sidebar,
    sidebarDepth: 2,
    smoothScroll: true,
    repo: 'chengpeiquan/learning-vue3',
    docsDir: 'docs',
    docsBranch: 'main',
    lastUpdated: true,
    editLinks: true,
  },

  /**
   * Markdown相关
   */
  markdown: {
    extractHeaders: {
      level: [2, 3, 4],
    },
  },

  /**
   * 开发相关
   */
  port: isDev ? 2000 : 80,
  alias: {
    '@img': path.resolve(__dirname, './public/img'),
  },

  /**
   * 打包相关
   */
  dest: './dist',
  temp: './.temp',
  cache: './.cache',
  public: './public',
  bundler: '@vuepress/bundler-vite',
  bundlerConfig: {
    vuePluginOptions: [
      banner({
        outDir: path.resolve(__dirname, './dist'),
        content: `/**\n * name: ${pkg.name}\n * description: ${pkg.description}\n * author: ${pkg.author}\n * homepage: ${pkg.homepage}\n */`,
      }),
    ],
  },

  /**
   * 插件相关
   */
  plugins: [
    [
      '@vuepress/register-components',
      {
        componentsDir: path.resolve(__dirname, './.vuepress/components'),
      },
    ],
  ],
})
