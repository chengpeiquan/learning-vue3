import { inBrowser } from 'vitepress'
import defaultTheme from 'vitepress/theme'
import { createVitePressBaiduAnalytics } from '@web-analytics/vue'
import GitalkComment from './components/GitalkComment.vue'
import ImgWrap from './components/ImgWrap.vue'
import { setSymbolStyle, replaceSymbol } from './plugins/symbol'
import { isInvalidRoute, redirect } from './plugins/redirect'
import './styles/custom.css'
import type { Theme } from 'vitepress'

const { baiduAnalytics, registerBaiduAnalytics } =
  createVitePressBaiduAnalytics()

const theme: Theme = {
  ...defaultTheme,
  enhanceApp({ app, router }) {
    app.component('GitalkComment', GitalkComment)
    app.component('ImgWrap', ImgWrap)

    if (inBrowser) {
      if (isInvalidRoute()) {
        redirect()
      }

      setSymbolStyle()
      registerBaiduAnalytics(app, {
        websiteIds: [
          '8dca8e2532df48ea7f1b15c714588691', // 主站
          '025e7d9acbc7359afa71bdae5aa03f33', // 本站
        ],
      })

      window.addEventListener('hashchange', () => {
        baiduAnalytics.trackPageview({
          pageUrl: window.location.href,
        })
      })

      router.onAfterRouteChanged = (to) => {
        replaceSymbol()
        baiduAnalytics.trackPageview({
          pageUrl: to,
        })
      }
    }
  },
}

export default theme
