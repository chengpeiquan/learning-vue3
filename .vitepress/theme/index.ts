import { inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import GitalkComment from './components/GitalkComment.vue'
import GoogleAdsense from './components/GoogleAdsense.vue'
import ImgWrap from './components/ImgWrap.vue'
import { setSymbolStyle, replaceSymbol } from './plugins/symbol'
import { registerAnalytics, trackPageview } from './plugins/analytics'
import './styles/custom.css'
import type { Theme } from 'vitepress'

const siteIds = [
  '8dca8e2532df48ea7f1b15c714588691', // 主站
  '025e7d9acbc7359afa71bdae5aa03f33', // 本站
]

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ app, router }) {
    app.component('GitalkComment', GitalkComment)
    app.component('GoogleAdsense', GoogleAdsense)
    app.component('ImgWrap', ImgWrap)

    if (inBrowser) {
      setSymbolStyle()
      siteIds.forEach((id) => registerAnalytics(id))

      router.onAfterRouteChanged = (to) => {
        replaceSymbol()
        siteIds.forEach((id) => trackPageview(id, to))
      }
    }
  },
}

export default theme
