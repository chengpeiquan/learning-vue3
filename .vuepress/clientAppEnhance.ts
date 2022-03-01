import { defineClientAppEnhance } from '@vuepress/client'
import baiduAnalytics from 'vue-baidu-analytics'
import SetSidebarIcon from './libs/setSidebarIcon'
import './styles/index.css'

// https://v2.vuepress.vuejs.org/zh/advanced/cookbook/usage-of-client-app-enhance.html
export default defineClientAppEnhance(({ app, router, siteData }) => {
  // 启动百度统计插件
  app.use(baiduAnalytics, {
    router: router,
    siteIdList: [
      // 主站
      '8dca8e2532df48ea7f1b15c714588691',
      // 本站
      '025e7d9acbc7359afa71bdae5aa03f33',
    ],
    isDebug: false,
  })

  if (!__VUEPRESS_SSR__) {
    const setSidebarIcon = new SetSidebarIcon(router)
    setSidebarIcon.init()
  }
})
