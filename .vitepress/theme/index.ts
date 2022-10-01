import { inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import GitalkComment from './components/GitalkComment.vue'
import GoogleAdsense from './components/GoogleAdsense.vue'
import ImgWrap from './components/ImgWrap.vue'
import './styles/custom.css'
import type { Theme } from 'vitepress'

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ app, router }) {
    app.component('GitalkComment', GitalkComment)
    app.component('GoogleAdsense', GoogleAdsense)
    app.component('ImgWrap', ImgWrap)

    if (inBrowser) {
      router.onBeforeRouteChange = () => {
        console.log('onBeforeRouteChange')
      }
      router.onAfterRouteChanged = () => {
        console.log('onAfterRouteChanged')
      }
    }
  },
}

export default theme
