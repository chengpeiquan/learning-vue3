import { inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import GitalkComment from './components/GitalkComment.vue'
import GoogleAdsense from './components/GoogleAdsense.vue'
import ImgWrap from './components/ImgWrap.vue'
import { setSymbolStyle, replaceSymbol } from './plugins/symbol'
import { siteIds, registerAnalytics, trackPageview } from './plugins/analytics'
import { isInvalidRoute, redirect } from './plugins/redirect'
import './styles/custom.css'
import type { Theme } from 'vitepress'

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ app, router }) {
    app.component('GitalkComment', GitalkComment)
    app.component('GoogleAdsense', GoogleAdsense)
    app.component('ImgWrap', ImgWrap)

    if (inBrowser) {
      if (isInvalidRoute()) {
        redirect()
      }

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
