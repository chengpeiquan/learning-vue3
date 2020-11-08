# 项目初始化

在上一步，脚手架已经帮我们搭好了一个可直接运行的基础项目，但在实际开发过程中，我们还会用到各种npm包，像UI框架、插件的引入都是需要在初始化阶段处理。

有时候还要脱离脚手架，采用CDN引入的方式来开发，所以开始写组件之前，我们还需要了解一下3.x项目在初始化阶段的一些变化。

## 基础的入口文件

3.x的目录结构对比2.x没变化，入口文件依然还是 `main.ts` ，但其中在初始化的时候，做了不少的调整，可以说是面目全非，但是这次改动我认为是好的，因为统一了使用方式，不再跟2.x那样很杂。

### 回顾 2.x

先回顾一下2.x，在2.x，在导入各种依赖之后，通过 `new Vue` 来执行vue的初始化；相关的Vue生态和插件，有的使用 `Vue.use` 来进行初始化，有的是作为 `new Vue` 的入参。

```ts
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import xxx from 'xxx'

Vue.use(xxx);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

### 了解 3.x

在3.x，是通过 `createApp` 来执行vue的初始化，另外不管是Vue生态里的东西，还是外部插件、UI框架，统一都是由 `use` 来激活初始化，非常统一和简洁。

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import xxx from 'xxx'

createApp(App).use(store).use(router).use(xxx).mount('#app')
```

## 插件的使用

在构建Vue项目的过程中，离不开各种开箱即用的插件支持，用以快速完成需求，避免自己造轮子。

关于插件的定义，摘选一段 [官方plugins文档](https://v3.vuejs.org/guide/plugins.html) 的描述：

:::tip
插件是自包含的代码，通常向 Vue 添加全局级功能。它可以是公开 `install()` 方法的 `object`，也可以是 `function`

插件的功能范围没有严格的限制，一般有下面几种：

添加全局方法或者 `property`。如：[vue-custom-element](https://github.com/karol-f/vue-custom-element)

添加全局资源：指令/过滤器/过渡等，例如：[vue-touch](https://github.com/vuejs/vue-touch)

通过全局混入来添加一些组件选项，例如：[vue-router](https://github.com/vuejs/vue-router)

添加全局实例方法，通过把它们添加到 `config.globalProperties` 上实现。

一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 [vue-router](https://github.com/vuejs/vue-router)
:::

不同的实现方法，也会有不同的使用方式，下面按照使用方式的不同，把插件按照三类划分，单独讲解他们之间的区别和如何使用。

### Vue插件的引入

这里特指Vue插件，通过 `Vue plugin` 设计规范开发出来的插件（点击了解：[Vue Plugins](https://v3.vuejs.org/guide/plugins.html)），在npm上通常是以 `vue-xxx` 这样带有vue关键字的格式命名（比如 `vue-baidu-analytics`）。

接上面，我们已经知道在3.x，插件都是通过 `use` 来挂载和初始化的，而 `use` 方法，既可以单独一行一个use，也可以像上面一样，直接链式use下去。

如果插件需要传入一些额外的参数，跟2.x的操作是一样的。

```ts
// main.ts
import aaa from 'aaa'
import bbb from 'bbb'
import ccc from 'ccc'
import ddd from 'ddd'

createApp(App)
  .use(aaa)
  .use(bbb)
  .use(ccc)
  .use(ddd, {
    // options
  })
  .mount('#app')
```


### 普通插件的引入

普通插件，通常是指一些无任何框架依赖的library，比如 `axios`、`qrcode`、`md5` 等等，在任何技术栈都可以单独引入使用，非Vue专属。

在2.x，相信大家的开发习惯通常是通过 `prototype` 挂载到原型上使用，但在3.x，不推荐有太多的全局的东西，官方推荐的方式是仅在用到该插件的vue组件里按需导入。

```ts
// xxx.vue
import md5 from 'md5'

const MD5_MSG: string = md5('message');
```

### 原型的挂载

刚刚说到，在2.x，会通过 `prototype` 的方式来挂载全局变量。

```ts
// main.ts in 2.x
import md5 from 'md5'
Vue.prototype.$md5 = md5;

// xxx.vue in 2.x
const MD5_MSG: string = this.$md5('message');
```

## 本节结语


