# 项目初始化

在上一步，脚手架已经帮我们搭好了一个可直接运行的基础项目，但在实际开发过程中，我们还会用到各种npm包，像UI框架、插件的引入都是需要在初始化阶段处理。

有时候还要脱离脚手架，采用CDN引入的方式来开发，所以开始写组件之前，我们还需要了解一下3.x项目在初始化阶段的一些变化。

## 入口文件

3.x的目录结构对比2.x没变化，入口文件依然还是 `main.ts` ，但其中在初始化的时候，做了不少的调整，可以说是面目全非。

但是这个改动我认为是好的，因为统一了各种插件的使用方式，不再跟2.x那样很杂。

### 回顾2.x

先回顾下2.x是怎么初始化的：

```ts
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

### 了解3.x

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

createApp(App).use(store).use(router).mount('#app')
```