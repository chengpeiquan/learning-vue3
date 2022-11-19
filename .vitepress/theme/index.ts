import { inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import GitalkComment from './components/GitalkComment.vue'
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
    app.component('ImgWrap', ImgWrap)

    if (inBrowser) {
      if (isInvalidRoute()) {
        redirect()
      }

      setSymbolStyle()
      siteIds.forEach((id) => registerAnalytics(id))

      window.addEventListener('hashchange', () => {
        const { href: url } = window.location
        siteIds.forEach((id) => trackPageview(id, url))
      })

      router.onAfterRouteChanged = (to) => {
        replaceSymbol()
        siteIds.forEach((id) => trackPageview(id, to))
      }
    }
  },
}

export default theme
