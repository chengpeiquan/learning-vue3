# 插件的使用和开发

在构建Vue项目的过程中，离不开各种开箱即用的插件支持，用以快速完成需求，避免自己造轮子。

## 关于插件

关于插件的定义，摘选一段 [官方plugins文档](https://v3.vuejs.org/guide/plugins.html) 的描述：

:::tip
插件是自包含的代码，通常向 Vue 添加全局级功能。它可以是一个带有公开 `install()` 方法的 `object`，也可以是 一个`function`

插件的功能范围没有严格的限制，一般有下面几种：

添加全局方法或者 `property`。如：[vue-custom-element](https://github.com/karol-f/vue-custom-element)

添加全局资源：指令/过滤器/过渡等，例如：[vue-touch](https://github.com/vuejs/vue-touch)

通过全局混入来添加一些组件选项，例如：[vue-router](https://github.com/vuejs/vue-router)

添加全局实例方法，通过把它们添加到 `config.globalProperties` 上实现。

一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 [vue-router](https://github.com/vuejs/vue-router)
:::

不同的实现方法，也会有不同的使用方式，下面按照使用方式的不同，把插件按照三类划分，单独讲解他们之间的区别和如何使用。

## Vue插件的引入

这里特指Vue插件，通过 `Vue plugin` 设计规范开发出来的插件（点击了解：[Vue Plugins](https://v3.vuejs.org/guide/plugins.html)），在npm上通常是以 `vue-xxx` 这样带有vue关键字的格式命名（比如 [vue-baidu-analytics](https://github.com/chengpeiquan/vue-baidu-analytics)）。

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

## 普通插件的引入

普通插件，通常是指一些无任何框架依赖的library，比如 `axios`、`qrcode`、`md5` 等等，在任何技术栈都可以单独引入使用，非Vue专属。

在2.x，相信大家的开发习惯通常是通过 `prototype` 挂载到原型上使用，但在3.x，不推荐有太多的全局的东西，官方推荐的方式是仅在用到该插件的vue组件里按需导入。

```ts
// xxx.vue
import md5 from 'md5'

const MD5_MSG: string = md5('message');
```

## 全局变量式挂载

刚刚说到，在2.x，会通过 `prototype` 的方式来挂载全局变量，然后通过 `this` 关键字来从Vue原型上调用该方法。

先回顾一下，但3.x不再支持这样使用。

```ts
// main.ts in 2.x
import md5 from 'md5'
Vue.prototype.$md5 = md5;

// xxx.vue in 2.x
const MD5_MSG: string = this.$md5('message');
```

如果你依然想要挂载全局变量，需要通过全新的 `config.globalProperties` 来实现，在使用该方式之前，你需要把Vue定义为一个变量再执行挂载。

### 基础语法

你需要把初始化时的 `createApp` 定义为一个变量，然后把这些全局变量挂载到上面。

```ts
// 导入npm包
import md5 from 'md5'

// 创建Vue实例
const app = createApp(App)

// 挂载全局变量到实例上
app.config.globalProperties.$md5 = md5

// 初始化
app.mount('#app')
```

如果你需要use一些Vue插件，可以在 `mount` 之前，跟原来一样添加 `use` 方法来激活插件初始化。

### 在TS中使用

但是

## 本节结语


