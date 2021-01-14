# 插件的使用

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

## 插件的安装和引入

我们的脚手架都是基于 `Node.js`，所以提供了多种多样的安装方式。

### 通过 npm 安装

`npm` 是 `Node.js` 自带的一个包管理工具，在前端工程化十分普及的今天，可以说几乎所有你要用到的插件，都可以在npm上搜到。

通过 `npm install` 命令来安装各种npm包（比如 `npm install vue-router`）。

附：[npm 官网](https://www.npmjs.com/)

### 通过 cnpm 安装

但是由于一些不可描述的原因， `npm` 在国内可能访问速度比较慢，你可以通过绑定淘宝镜像，通过 `cnpm` 源来下载包，`cnpm` 是完全同步 `npm` 的。

它的安装命令和 `npm` 非常一致，通过 `cnpm install` 命令来安装（比如 `cnpm install vue-router`）。

在使用它之前，你需要通过 `npm` 命令将其绑定到你的 `node` 上。

```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

附：[cnpm 官网与绑定教程](https://developer.aliyun.com/mirror/NPM)

### 通过 yarn 安装

`yarn` 也是一个常用的包管理工具，和 `npm` 十分相似，`npm` 上的包，也会同步到 `yarn` ，通过 `yarn add` 命令来安装即可（比如 `yarn add vue-router`）。

如果你没有日常翻墙，也可以考虑用 `yarn` 来代替 `npm`，当然，在使用之前，你也必须先安装它才可以，一般情况下，需要添加 `-g` 或者 `--global` 参数来全局安装。

```
npm install -g yarn
```

附：[yarn 官网](https://yarnpkg.com/)

不知道选择哪个？可以戳：[npm和yarn的区别，我们该如何选择?](https://www.jianshu.com/p/254794d5e741)

### 通过 cdn 安装

大部分插件都会提供一个 `cdn` 版本，让你可以在 `html` 通过 `script` 标签引入。

比如：

```html
<script src="https://unpkg.com/vue-router"></script>
```

### 插件的引入

除了 `cdn` 版本是直接可用之外，其他通过 `npm`、`yarn` 等方式安装的插件，都需要在入口文件 `main.js` 或者要用到的 `.vue` 文件里引入，比如：

```ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
```

因为本教程都是基于工程化开发，使用的CLI脚手架，所以这些内容暂时不谈及CDN的使用方式。

通常来说会有细微差别，但影响不大，插件作者也会进行告知。

## Vue 专属插件

这里特指Vue插件，通过 [Vue Plugins 设计规范](https://v3.vuejs.org/guide/plugins.html)开发出来的插件，在npm上通常是以 `vue-xxx` 这样带有vue关键字的格式命名（比如 [vue-baidu-analytics](https://github.com/chengpeiquan/vue-baidu-analytics)）。

专属插件通常分为 **全局插件** 和 **单组件插件**，区别在于，全局版本是在 `main.ts` 引入后 `use`，而单组件版本则通常是作为一个组件在 `.vue` 文件里引入使用。

### 全局插件的使用

在本教程最最前面的时候，我有特地说了一个内容就是 [项目初始化 - 升级与配置](update.md#项目初始化) ，在这里有提到过就是需要通过 `use` 来初始化框架、插件。

全局插件的使用，就是在 `main.ts` 通过 `import` 引入，然后通过 `use` 来启动初始化。

在 `2.x`，全局插件是通过 `Vue.use(xxxxxx)` 来启动，而现在，则需要通过 `createApp` 的 `use`，`use` 方法，既可以单独一行一个use，也可以直接链式use下去。

**参数**

`use` 方法支持两个参数：

参数|类型|作用
:--|:--|:--
plugin|object \| function|插件，一般是你在import时使用的名称
options|object|插件的参数，有些插件在初始化时可以配置一定的选项

基本的写法就是像下面这样：

```ts
// main.ts
import plugin1 from 'plugin1'
import plugin2 from 'plugin2'
import plugin3 from 'plugin3'
import plugin4 from 'plugin4'

createApp(App)
  .use(plugin1)
  .use(plugin2)
  .use(plugin3, {
    // plugin3's options
  })
  .use(plugin4)
  .mount('#app')
```

大部分插件到这里就可以直接启动了，个别插件可能需要通过插件api去手动触发，在 `npm package` 的详情页上，作者一般会告知使用方法，按照说明书操作即可。

### 单组件插件的使用

单组件的插件，通常自己本身也是一个Vue组件（可能会打包为js文件，但本质上是一个component）。

单组件的引入，一般都是在需要用到的 `.vue` 文件里单独 `import` ，然后挂到 `template` 里去渲染。

我放一个我之前打包的单组件插件 [vue-picture-cropper](https://www.npmjs.com/package/vue-picture-cropper) 做案例，理解起来会比较直观：

```vue
<template>
  <!-- 放置组件的渲染标签，用于显示组件 -->
  <vue-picture-cropper
    :boxStyle="{
      width: '100%',
      height: '100%',
      backgroundColor: '#f8f8f8',
      margin: 'auto'
    }"
    :img="pic"
    :options="{
      viewMode: 1,
      dragMode: 'crop',
      aspectRatio: 16 / 9,
    }"
  />
  <!-- 放置组件的渲染标签，用于显示组件 -->
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

// 引入单组件插件
import VuePictureCropper, { cropper } from 'vue-picture-cropper'

export default defineComponent({
  // 挂载组件模板
  components: {
    VuePictureCropper
  },

  // 在这里定义一些组件需要用到的数据和函数
  setup () {
    const pic = ref<string>('');

    onMounted( () => {
      pic.value = require('@/assets/logo.png');
    })

    return {
      pic
    }
  }
})
</script>
```

哈哈哈哈参考上面的代码，还有注释，应该能大概了解如何使用单组件插件了吧！

## 通用 JS 插件

普通插件，通常是指一些无任何框架依赖的library，比如 `axios`、`qrcode`、`md5` 等等，在任何技术栈都可以单独引入使用，非Vue专属。

在2.x，相信大家的开发习惯通常是通过 `prototype` 挂载到原型上使用，但在3.x，不推荐有太多的全局的东西，官方推荐的方式是仅在用到该插件的vue组件里按需导入。

```ts
// xxx.vue
import md5 from 'md5'

const MD5_MSG: string = md5('message');
```

待完善

## 本地的一些 lib

待完善

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

待完善

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

待完善

### 在TS中使用

待完善

## 本节结语

待完善


