import DefaultTheme from 'vitepress/theme'
import GitalkComment from './components/GitalkComment.vue'
import GoogleAdsense from './components/GoogleAdsense.vue'
import ImgWrap from './components/ImgWrap.vue'
import './styles/custom.css'
import type { App } from 'vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    app.component('GitalkComment', GitalkComment)
    app.component('GoogleAdsense', GoogleAdsense)
    app.component('ImgWrap', ImgWrap)
  },
}
