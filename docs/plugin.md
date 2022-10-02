---
outline: 'deep'
---

# 插件的开发和使用

在构建 Vue 项目的过程中，离不开各种开箱即用的插件支持，用以快速完成需求，避免自己造轮子。

在 Vue 项目里，可以使用针对 Vue 定制开发的专属插件，也可以使用无框架依赖的通用 JS 插件，插件的表现形式也是丰富多彩，既可以是功能的实现，也可以是组件的封装，本章将从插件的使用到亲自开发一个小插件的过程，逐一讲解。

## 插件的安装和引入

在 [前端工程化](guide.md#了解前端工程化) 十分普及的今天，可以说几乎所有你要用到的插件，都可以在 [npmjs](https://www.npmjs.com/) 上搜到，除了官方提供的包管理器 npm ，我们也有很多种安装方式选择。

:::tip
如果还不了解什么是包和包管理器，请先阅读 [了解包和插件](guide.md#了解包和插件) 一节的内容。

另外，每个包管理都可以配置镜像源，提升国内的下载速度，对此也可以先阅读 [配置镜像源](guide.md#配置镜像源) 一节了解。
:::

虽然对于个人开发者来说，有一个用的顺手的包管理器就足够日常开发了，但是还是有必要多了解一下不同的包管理器，因为未来可能会面对团队协作开发、为开源项目贡献代码等情况，需要遵循团队要求的包管理机制（例如使用 Monorepo 架构的团队会更青睐于 yarn 或 pnpm 的 Workspace 功能）。

### 通过 npm 安装

[npm](https://github.com/npm/cli) 是 Node.js 自带的包管理器，平时我们通过 `npm install` 命令来安装各种 npm 包（比如 `npm install vue-router` ），就是通过这个包管理器来安装的。

如果包的下载速度太慢，可以通过以下命令管理镜像源：

```bash
# 查看下载源
npm config get registry

# 绑定下载源
npm config set registry https://registry.npmmirror.com

# 删除下载源
npm config rm registry
```

:::tip
npm 的 lock 文件是 `package-lock.json` ，如果你有管理多人协作仓库的需求，可以根据实际情况把它添加至 `.gitignore` 文件，便于统一团队的包管理。
:::

### 通过 cnpm 安装

[cnpm](https://github.com/cnpm/cnpm) 是阿里巴巴推出的包管理工具，安装之后默认会使用 `https://registry.npmmirror.com` 这个镜像源。

它的安装命令和 npm 非常一致，通过 `cnpm install` 命令来安装（比如 `cnpm install vue-router`）。

在使用它之前，你需要通过 npm 命令进行全局安装：

```bash
npm install -g cnpm

# 或者
# npm install -g cnpm --registry=https://registry.npmmirror.com
```

:::tip
cnpm 不生成 lock 文件，也不会识别项目下的 lock 文件，所以还是推荐使用 npm 或者其他包管理工具，通过绑定镜像源的方式来管理你项目的包。
:::

### 通过 yarn 安装

[yarn](https://github.com/yarnpkg/yarn) 也是一个常用的包管理工具，和 npm 十分相似， npmjs 上的包，也会同步到 [yarnpkg](https://yarnpkg.com/) 。

也是需要全局安装才可以使用：

```bash
npm install -g yarn
```

但是安装命令上会有点不同， yarn 是用 `add` 代替 `install` ，用 `remove` 代替 `uninstall` ，例如：

```bash
# 安装单个包
yarn add vue-router

# 安装全局包
yarn global add typescript

# 卸载包
yarn remove vue-router
```

而且在运行脚本的时候，可以直接用 `yarn` 来代替 `npm run` ，例如 `yarn dev` 相当于 `npm run dev` 。

yarn 默认绑定的是 `https://registry.yarnpkg.com` 的下载源，如果包的下载速度太慢，也可以配置镜像源，但是命令有所差异：

```bash
# 查看镜像源
yarn config get registry

# 绑定镜像源
yarn config set registry https://registry.npmmirror.com

# 删除镜像源（注意这里是 delete ）
yarn config delete registry
```

:::tip
yarn 的 lock 文件是 `yarn.lock` ，如果你有管理多人协作仓库的需求，可以根据实际情况把它添加至 `.gitignore` 文件，便于统一团队的包管理。
:::

### 通过 pnpm 安装

[pnpm](https://github.com/pnpm/pnpm) 是包管理工具的一个后起之秀，主打快速的、节省磁盘空间的特色，用法跟其他包管理器很相似，没有太多的学习成本， npm 和 yarn 的命令它都支持。

也是必须先全局安装它才可以使用：

```bash
npm install -g pnpm
```

目前 pnpm 在开源社区的使用率越来越高，包括我们接触最多的 Vue / Vite 团队也在逐步迁移到 pnpm 来管理依赖。

pnpm 的下载源使用的是 npm ，所以如果要绑定镜像源，按照 [npm 的方式](#通过-npm-安装) 处理就可以了。

相关阅读：

- [pnpm 官网](https://pnpm.io/zh/)
- [为什么要使用 pnpm](https://pnpm.io/zh/motivation)
- [为什么 vue 源码以及生态仓库要迁移 pnpm?](https://zhuanlan.zhihu.com/p/441547677)
- [关于现代包管理器的深度思考——为什么现在我更推荐 pnpm 而不是 npm/yarn?](https://zhuanlan.zhihu.com/p/377593512)

:::tip
pnpm 的 lock 文件是 `pnpm-lock.yaml` ，如果你有管理多人协作仓库的需求，可以根据实际情况把它添加至 `.gitignore` 文件，便于统一团队的包管理。
:::

### 通过 CDN 安装

大部分插件都会提供一个 CDN 版本，让你可以在 `.html` 文件里通过 `<script>` 标签引入。

比如：

```html
<script src="https://unpkg.com/vue-router"></script>
```

### 插件的引入

除了 CDN 版本是直接可用之外，其他通过 npm 、 yarn 等方式安装的插件，都需要在入口文件 `main.js` 或者要用到的 `.vue` 文件里引入，比如：

```ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
```

因为本教程都是基于工程化开发，使用的 CLI 脚手架，所以这些内容暂时不谈及 CDN 的使用方式。

通常来说会有细微差别，但影响不大，插件作者也会在插件仓库的 README 或者使用文档里进行告知。

## Vue 专属插件

这里特指 Vue 插件，通过 [Vue Plugins 设计规范](https://cn.vuejs.org/guide/reusability/plugins.html) 开发出来的插件，在 npm 上通常是以 `vue-xxx` 这样带有 vue 关键字的格式命名（比如 [vue-baidu-analytics](https://github.com/chengpeiquan/vue-baidu-analytics)）。

专属插件通常分为 **全局插件** 和 **单组件插件**，区别在于，全局版本是在 `main.ts` 引入后 `use`，而单组件版本则通常是作为一个组件在 `.vue` 文件里引入使用。

### 全局插件的使用{new}

在本教程最最前面的时候，我有特地说了一个内容就是 [项目初始化 - 升级与配置](upgrade.md#项目初始化) ，在这里有提到过就是需要通过 `use` 来初始化框架、插件。

全局插件的使用，就是在 `main.ts` 通过 `import` 引入，然后通过 `use` 来启动初始化。

在 2.x ，全局插件是通过 `Vue.use(xxxxxx)` 来启动，而现在，则需要通过 `createApp` 的 `use`，`use` 方法，既可以单独一行一个 use ，也可以直接链式 use 下去。

**参数**

`use` 方法支持两个参数：

| 参数    | 类型               | 作用                                             |
| :------ | :----------------- | :----------------------------------------------- |
| plugin  | object \| function | 插件，一般是你在 import 时使用的名称             |
| options | object             | 插件的参数，有些插件在初始化时可以配置一定的选项 |

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

大部分插件到这里就可以直接启动了，个别插件可能需要通过插件 API 去手动触发，在 `npm package` 的详情页上，作者一般会告知使用方法，按照说明书操作即可。

### 单组件插件的使用{new}

单组件的插件，通常自己本身也是一个 Vue 组件（大部分情况下都会打包为 JS 文件，但本质上是一个 Vue 的 component ）。

单组件的引入，一般都是在需要用到的 `.vue` 文件里单独 `import` ，然后挂到 `template` 里去渲染。

我放一个我之前打包的单组件插件 [vue-picture-cropper](https://github.com/chengpeiquan/vue-picture-cropper) 做案例，理解起来会比较直观：

```vue
<template>
  <!-- 放置组件的渲染标签，用于显示组件 -->
  <vue-picture-cropper
    :boxStyle="{
      width: '100%',
      height: '100%',
      backgroundColor: '#f8f8f8',
      margin: 'auto',
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
    VuePictureCropper,
  },

  // 在这里定义一些组件需要用到的数据和函数
  setup() {
    const pic = ref<string>('')

    onMounted(() => {
      pic.value = require('@/assets/logo.png')
    })

    return {
      pic,
    }
  },
})
</script>
```

哈哈哈哈参考上面的代码，还有注释，应该能大概了解如何使用单组件插件了吧！

## 通用 JS / TS 插件

也叫普通插件，这个 “普通” 不是指功能平平无奇，而是指它们无需任何框架依赖，可以应用在任意项目中，属于独立的 Library ，比如 [axios](https://github.com/axios/axios) 、 [qrcode](https://github.com/soldair/node-qrcode) 、[md5](https://github.com/pvorb/node-md5) 等等，在任何技术栈都可以单独引入使用，非 Vue 专属。

通用插件的使用非常灵活，既可以全局挂载，也可以在需要用到的组件里单独引入。

组件里单独引入方式：

```ts
import { defineComponent } from 'vue'
import md5 from 'md5'

export default defineComponent({
  setup() {
    const md5Msg: string = md5('message')
  },
})
```

全局挂载方法比较特殊，因为插件本身不是专属 Vue，没有 `install` 接口，无法通过 `use` 方法直接启动，下面有一小节内容单独讲这一块的操作，详见 [全局 API 挂载](#全局-api-挂载)。

## 本地插件{new}

插件也不全是来自于网上，有时候针对自己的业务，涉及到一些经常用到的功能模块，你也可以抽离出来封装成项目专用的插件。

### 封装的目的

举个例子，比如在做一个具备用户系统的网站时，会涉及到手机短信验证码模块，你在开始写代码之前，需要先要考虑到这些问题：

1. 很多操作都涉及到下发验证码的请求，比如 “登录” 、 “注册” 、 “修改手机绑定” 、 “支付验证” 等等，代码雷同，只是接口 URL 或者参数不太一样

2. 都是需要对手机号是否有传入、手机号的格式正确性验证等一些判断

3. 需要对接口请求成功和失败的情况做一些不同的数据返回，但要处理的数据很相似，都是用于告知调用方当前是什么情况

4. 返回一些 Toast 告知用户当前的交互结果

:::tip
如果不把这一块的业务代码抽离出来，你需要在每个用到的地方都写一次，不仅繁琐，而且以后一旦产品需求有改动，维护起来就惨了。
:::

### 常用的封装类型

常用的本地封装方式有两种：一种是以 [通用 JS / TS 插件](#通用-js-ts-插件) 的形式，一种是以 [Vue 专属插件](#vue-专属插件) 的形式。

关于这两者的区别已经在对应的小节有所介绍，接下来我们来看看如何封装它们。

### 开发本地通用 JS / TS 插件

一般情况下会以通用类型比较常见，因为大部分都是一些比较小的功能，而且可以很方便的在不同项目之间进行复用。

:::tip
注：接下来会统一称之为 “通用插件” ，不论是基于 JavaScript 编写的还是 TypeScript 编写的。
:::

#### 项目结构

通常会把这一类文件都归类在 `src` 目录下的 `libs` 文件夹里，代表存放的是 Library 文件（ JS 项目以 `.js` 文件存放， TS 项目以 `.ts` 文件存放）。

```bash{4-7}
vue-demo
│ # 源码文件夹
├─src
│ │ # 本地通用插件
│ └─libs
│   ├─foo.ts
│   └─bar.ts
│
│ # 其他结构这里省略…
│
└─package.json
```

这样在调用的时候，可以通过 `@/libs/foo` 来引入，或者你配置了 alias 别名，也可以使用别名导入，例如 `@libs/foo` 。

#### 设计规范与开发案例

在设计本地通用插件的时候，我们需要遵循 [ES Module 模块设计规范](#用-es-module-设计模块) ，并且做好必要的代码注释（用途、入参、返回值等）。

:::tip
如果还没有了解过 “模块” 的概念的话，可以先阅读 [了解模块化设计](guide.md#了解模块化设计) 一节的内容。
:::

一般来说，会有以下三种情况需要考虑。

##### 只有一个默认功能

如果只有一个默认的功能，那么可以使用 `export default` 来默认导出一个函数。

例如我们需要封装一个打招呼的功能：

```ts
// src/libs/greet.ts

/**
 * 向对方打招呼
 * @param name - 打招呼的目标人名
 * @returns 向传进来的人名返回一句欢迎语
 */
export default function greet(name: string): string {
  return `Welcome, ${name}!`
}
```

在 Vue 组件里就可以这样使用：

```vue{3-4,8-10}
<script lang="ts">
import { defineComponent } from 'vue'
// 导入本地插件
import greet from '@libs/greet'

export default defineComponent({
  setup() {
    // 导入的名称就是这个工具的方法名，可以直接调用
    const message = greet('Petter')
    console.log(message) // Welcome, Petter!
  },
})
</script>
```

##### 是一个小工具合集

如果有很多个作用相似的函数，那么建议放在一个文件里作为一个工具合集统一管理，使用 `export` 来导出里面的每个函数。

例如我们需要封装几个通过 [正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions) 判断表单的输入内容是否符合要求的函数：

```ts
// src/libs/regexp.ts

/**
 * 手机号校验
 * @param phoneNumber - 手机号
 * @returns true=是手机号，false=不是手机号
 */
export function isMob(phoneNumber: number | string): boolean {
  return /^1[3456789]\d{9}$/.test(String(phoneNumber))
}

/**
 * 邮箱校验
 * @param email - 邮箱地址
 * @returns true=是邮箱地址，false=不是邮箱地址
 */
export function isEmail(email: string): boolean {
  return /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(
    email
  )
}
```

在 Vue 组件里就可以这样使用：

```vue{3-4,8-14}
<script lang="ts">
import { defineComponent } from 'vue'
// 需要用花括号 {} 来按照命名导出时的名称导入
import { isMob, isEmail } from '@libs/regexp'

export default defineComponent({
  setup() {
    // 判断是否是手机号
    console.log(isMob('13800138000')) // true
    console.log(isMob('123456')) // false

    // 判断是否是邮箱地址
    console.log(isEmail('example@example.com')) // true
    console.log(isEmail('example')) // false
  },
})
</script>
```

:::tip
类似这种情况，就没有必要为 `isMob` 、 `isEmail` 每个方法都单独保存一个文件了，只需要统一放在 `regexp.ts` 正则文件里维护。
:::

##### 包含工具及辅助函数

如果主要提供一个独立功能，但还需要提供一些额外的变量或者辅助函数用于特殊的业务场景，那么可以用 `export default` 导出主功能，用 `export` 导出其他变量或者辅助函数。

我们在 [只有一个默认功能](#只有一个默认功能) 这个打招呼例子的基础上修改一下，默认提供的是 “打招呼” 的功能，偶尔需要更热情的赞美一下，那么这个 “赞美” 行为就可以用这个方式来放到这个文件里一起维护。

```ts{3-10}
// src/libs/greet.ts

/**
 * 称赞对方
 * @param name - 要称赞的目标人名
 * @returns 向传进来的人名发出一句赞美的话
 */
export function praise(name: string): string {
  return `Oh! ${name}! It's so kind of you!`
}

/**
 * 向对方打招呼
 * @param name - 打招呼的目标人名
 * @returns 向传进来的人名发出一句欢迎语
 */
export default function greet(name: string): string {
  return `Welcome, ${name}!`
}
```

在 Vue 组件里就可以这样使用：

```vue{3-4,12-14}
<script lang="ts">
import { defineComponent } from 'vue'
// 两者可以同时导入使用
import greet, { praise } from '@libs/greet'

export default defineComponent({
  setup() {
    // 使用默认的打招呼
    const message = greet('Petter')
    console.log(message) // Welcome, Petter!

    // 使用命名导出的赞美
    const praiseMessage = praise('Petter')
    console.log(praiseMessage) // Oh! Petter! It's so kind of you!
  },
})
</script>
```

### 开发本地 Vue 专属插件

在 [Vue 专属插件](#vue-专属插件) 部分已介绍过，这一类的插件只能给 Vue 使用，有时候自己的业务比较特殊，无法找到完全适用的 npm 包，那么就可以自己写一个！

#### 项目结构

通常会把这一类文件都归类在 `src` 目录下的 `plugins` 文件夹里，代表存放的是 Plugin 文件（ JS 项目以 `.js` 文件存放， TS 项目以 `.ts` 文件存放）。

```bash{4-7}
vue-demo
│ # 源码文件夹
├─src
│ │ # 本地 Vue 插件
│ └─plugins
│   ├─foo.ts
│   └─bar.ts
│
│ # 其他结构这里省略…
│
└─package.json
```

这样在调用的时候，可以通过 `@/plugins/foo` 来引入，或者你配置了 alias 别名，也可以使用别名导入，例如 `@plugins/foo` 。

#### 设计规范

在设计本地 Vue 插件的时候，需要遵循 Vue 官方撰写的 [Vue Plugins 设计规范](https://cn.vuejs.org/guide/reusability/plugins.html) ，并且做好必要的代码注释，除了标明插件 API 的 “用途、入参、返回值” 之外，最好在注释内补充一个 Example 或者 Tips 说明，功能丰富的插件最好直接写个 README 文档。

#### 开发案例

全局插件开发并启用后，只需要在 `main.ts` 里导入并 `use` 一次，即可在所有的组件内使用插件的功能。

下面对全局插件进行一个开发示范，希望能给大家以后需要的时候提供思路参考。

:::tip
单组件插件一般作为 npm 包发布，会借助 Webpack 、 Vite 或者 Rollup 单独构建，本地直接放到 components 文件夹下作为组件管理即可。
:::

##### 基本结构

插件支持导出两种格式的：一种是函数，一种是对象。

1. 当导出为一个函数时， Vue 会直接调用这个函数，此时插件内部是这样子：

```ts
export default function (app, options) {
  // 逻辑代码...
}
```

2. 当导出为一个对象时，对象上面需要有一个 `install` 方法给 Vue ， Vue 通过调用这个方法来启用插件，此时插件内部是这样子：

```ts
export default {
  install: (app, options) => {
    // 逻辑代码...
  },
}
```

不论哪种方式，入口函数都会接受两个入参：

|  参数   |          作用          | 类型                                                   |
| :-----: | :--------------------: | :----------------------------------------------------- |
|   app   | `createApp` 生成的实例 | `App` （从 'vue' 里导入该类型），见下方的案例演示      |
| options |   插件初始化时的选项   | `undefined` 或一个对象，对象的 TS 类型由插件的选项决定 |

如果需要在插件初始化时传入一些必要的选项，可以定义一个对象作为 options ，这样只要在 `main.ts` 里 `use` 插件时传入第二个参数，插件就可以拿到它们：

```ts{3-7}
// src/main.ts
createApp(App)
  // 注意这里的第二个参数就是插件选项
  .use(customPlugin, {
    foo: 1,
    bar: 2,
  })
  .mount('#app')
```

##### 编写插件

这里以一个 [自定义指令](component.md#自定义指令) 为例，写一个用于管理自定义指令的插件，其中包含两个自定义指令：一个是判断是否有权限，一个是给文本高亮，文本高亮还支持一个插件选项。

```ts{2,4-11,18}
// src/plugins/directive.ts
import type { App } from 'vue'

// 插件选项的类型
interface Options {
  // 文本高亮选项
  highlight?: {
    // 默认背景色
    backgroundColor: string
  }
}

/**
 * 自定义指令
 * @description 保证插件单一职责，当前插件只用于添加自定义指令
 */
export default {
  install: (app: App, options?: Options) => {
    /**
     * 权限控制
     * @description 用于在功能按钮上绑定权限，没权限时会销毁或隐藏对应 DOM 节点
     * @tips 指令传入的值是管理员的组别 id
     * @example <div v-permission="1" />
     */
    app.directive('permission', (el, binding) => {
      // 假设 1 是管理员组别的 id ，则无需处理
      if (binding.value === 1) return

      // 其他情况认为没有权限，需要隐藏掉界面上的 DOM 元素
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      } else {
        el.style.display = 'none'
      }
    })

    /**
     * 文本高亮
     * @description 用于给指定的 DOM 节点添加背景色，搭配文本内容形成高亮效果
     * @tips 指令传入的值需要是合法的 CSS 颜色名称或者 Hex 值
     * @example <div v-highlight="`cyan`" />
     */
    app.directive('highlight', (el, binding) => {
      // 获取默认颜色
      let defaultColor = 'unset'
      if (
        Object.prototype.toString.call(options) === '[object Object]' &&
        options?.highlight?.backgroundColor
      ) {
        defaultColor = options.highlight.backgroundColor
      }

      // 设置背景色
      el.style.backgroundColor =
        typeof binding.value === 'string' ? binding.value : defaultColor
    })
  },
}

```

##### 启用插件

在 `main.ts` 全局启用插件，在启用的时候我们传入了第二个参数 “插件的选项” ，这里配置了个高亮指令的默认背景颜色：

```ts{4,7-12}
// src/main.ts
import { createApp } from 'vue'
import App from '@/App.vue'
import directive from '@/plugins/directive' // 导入插件

createApp(App)
   // 自定义插件
  .use(directive, {
    highlight: {
      backgroundColor: '#ddd',
    },
  })
  .mount('#app')
```

##### 使用插件

在 Vue 组件里使用：

```vue
<template>
  <!-- 测试 permission 指令 -->
  <div>根据 permission 指令的判断规则：</div>
  <div v-permission="1">这个可以显示</div>
  <div v-permission="2">这个没有权限，会被隐藏</div>
  <!-- 测试 permission 指令 -->

  <!-- 测试 highlight 指令 -->
  <div>根据 highlight 指令的判断规则：</div>
  <div v-highlight="`cyan`">这个是青色高亮</div>
  <div v-highlight="`yellow`">这个是黄色高亮</div>
  <div v-highlight="`red`">这个是红色高亮</div>
  <div v-highlight>这个是使用插件初始化时设置的灰色</div>
  <!-- 测试 highlight 指令 -->
</template>
```

## 全局 API 挂载

对于一些使用频率比较高的插件方法，如果你觉得在每个组件里单独导入再用很麻烦，你也可以考虑将其挂载到 Vue 上，使其成为 Vue 的全局变量。

**注：接下来的全局变量，都是指 Vue 环境里的全局变量，非 Window 下的全局变量。**

### 回顾 Vue 2

在 2.x ，可以通过 `prototype` 的方式来挂载全局变量，然后通过 `this` 关键字来从 Vue 原型上调用该方法。

我以 `md5` 插件为例，在 `main.ts` 里进行全局 `import`，然后通过 `prototype` 去挂到 Vue 上。

```ts
import Vue from 'vue'
import md5 from 'md5'

Vue.prototype.$md5 = md5
```

之后在 `.vue` 文件里，你就可以这样去使用 `md5`。

```ts
const md5Msg: string = this.$md5('message')
```

### 了解 Vue 3{new}

在 3.x ，已经不再支持 `prototype` 这样使用了，在 `main.ts` 里没有了 `Vue`，在组件的生命周期里也没有了 `this`。

如果你依然想要挂载全局变量，需要通过全新的 [globalProperties](https://cn.vuejs.org/api/application.html#app-config-globalproperties) 来实现，在使用该方式之前，可以把 `createApp` 定义为一个变量再执行挂载。

### 定义全局 API{new}

如上，在配置全局变量之前，你可以把初始化时的 `createApp` 定义为一个变量（假设为 `app` ），然后把需要设置为全局可用的变量或方法，挂载到 `app` 的 `config.globalProperties` 上面。

```ts
import md5 from 'md5'

// 创建 Vue 实例
const app = createApp(App)

// 把插件的 API 挂载全局变量到实例上
app.config.globalProperties.$md5 = md5

// 你也可以自己写一些全局函数去挂载
app.config.globalProperties.$log = (text: string): void => {
  console.log(text)
}

app.mount('#app')
```

<!-- 待完善

 ### 使用全局 API{new}

要在 Vue 组件里使用，因为 3.x 的 [生命周期](component.md#组件的生命周期-new) 无法取得实例的 `this` 来操作，需要通过全新的 [getCurrentInstance](https://v3.cn.vuejs.org/api/composition-api.html#getcurrentinstance) 组件来进行处理。

```ts
// 导入 getCurrentInstance 组件
import { defineComponent, getCurrentInstance } from 'vue'

export default defineComponent({
  setup () {
    // 获取当前实例
    const app = getCurrentInstance();

    // 增加这层判断的原因见下方说明
    if ( app ) {

      // 调用全局的 MD5 API 进行加密
      const MD5_STR: string = app.appContext.config.globalProperties.$md5('Hello World!');
      console.log(MD5_STR);

      // 调用刚刚挂载的打印函数
      app.appContext.config.globalProperties.$log('Hello World!');

    }
  }
})
```

由于使用了 [defineComponent](component.md#defineComponent-的作用) ，它会帮我们自动推导 `getCurrentInstance()` 的类型为 `ComponentInternalInstance` 或 `null` 。

所以如果你的项目下的 TS 开启了 `--strictNullChecks` 选项，需要对实例变量做一层判断才能正确运行程序（可参考 [DOM 元素与子组件](component.md#dom-元素与子组件) 一节）。

:::tip
需要注意的是， `getCurrentInstance` 只能在 [setup](component.md#全新的-setup-函数-new) 函数或者 Vue 3.0 的 [生命周期](component.md#组件的生命周期-new) 钩子中调用。

如需在 `setup` 或生命周期钩子外使用，需要先在 `setup` 中调用 `const app = getCurrentInstance();` 获取实例变量，然后再通过 `app` 变量去使用。
::: -->

### 全局 API 的替代方案

在 Vue 3 实际上并不是特别推荐使用全局变量，3.x 比较推荐按需引入使用（从使用方式上也可以看得出，这类全局 API 的用法还真的挺麻烦的…）。

特别是针对 TypeScript ，尤大对于全局 API 的相关 PR 说明： [Global API updates](https://github.com/vuejs/rfcs/pull/117)，也是不建议在 TS 里使用。

那么确实是需要用到一些全局 API 怎么办？

对于一般的数据和方法，建议采用 [provide / inject](communication.md#provide-inject) 方案，在根组件（通常是 App.vue ）把需要作为全局使用的数据 / 方法 provide 下去，在需要用到的组件里通过 inject 即可获取到，或者使用 [EventBus](communication.md#eventbus-new) / [Vuex](communication.md#vuex-new) / [Pinia](pinia.md) 等全局通信方案来处理。

## npm 包的开发与发布

相信很多开发者都想发布一个属于自己的 npm 包，在实际的工作中，也会有一些公司出于开发上的便利，也会将一些常用的业务功能抽离为独立的 npm 包，提前掌握包的开发也是非常重要的能力，接下来将介绍如何从 0 到 1 开发一个 npm 包，并将其发布到 [npmjs](https://www.npmjs.com) 上可供其他项目安装使用。

:::tip
在开始本节内容之前，请先阅读或回顾以下两部分内容：

1. 阅读 [了解 package.json](guide.md#了解-package-json) 一节，了解或重温 npm 包清单文件的作用
2. 阅读 [学习模块化设计](guide.md#学习模块化设计) 一节，了解或重温模块化开发的知识

:::

### 常用的构建工具

平时项目里用到的 npm 包，也可以理解为是一种项目插件，一些很简单的包，其实就和编写 [本地插件](#本地插件) 一样，假设包的入口文件是 `index.js` ，那么可以直接在 `index.js` 里编写代码，再进行模块化导出。

其他项目里安装这个包之后就可以直接使用里面的方法了，这种方式适合非常非常简单的包，很多独立的工具函数包就是使用这种方式来编写包的源代码。

例如 [is-number](https://www.npmjs.com/package/is-number) 这个包，每周下载量超过 6800 万次，它的源代码非常少：

```js
/**
 * 摘自 is-number 的入口文件
 * @see https://github.com/jonschlinkert/is-number/blob/master/index.js
 */
module.exports = function (num) {
  if (typeof num === 'number') {
    return num - num === 0
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num)
  }
  return false
}
```

再如 [slash](https://www.npmjs.com/package/slash) 这个包，每周下载量超过 5200 万次，它的源代码也是只有几行：

```js
/**
 * 摘自 slash 的入口文件
 * @see https://github.com/sindresorhus/slash/blob/main/index.js
 */
export default function slash(path) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path)

  if (isExtendedLengthPath) {
    return path
  }

  return path.replace(/\\/g, '/')
}
```

但这一类包通常是提供很基础的功能实现，更多时候我们需要自己开发的包更倾向于和框架、和业务挂钩，涉及到非 JavaScript 代码，例如 Vue 组件的编译、 Less 等 CSS 预处理器编译、 TypeScript 的编译等等，如果我们不通过构建工具来处理，那么发布后这个包的使用就会有诸多限制，需要满足和开发这个包时一样的开发环境才能使用，这对于使用者来说非常不友好。

因此大部分 npm 包的开发也需要用到构建工具来转换项目源代码，统一输出为一个兼容性更好、适用性更广的 JavaScript 文件，配合 `.d.ts` 文件的类型声明，使用者可以不需要特地配置就可以开箱即用，非常方便，非常友好。

传统的 [Webpack](https://github.com/webpack/webpack) 可以用来构建 npm 包文件，但按照目前更主流的技术选项，编译结果更干净更迷你的当属 [Rollup](https://github.com/rollup/rollup) ，但 Rollup 需要配置很多插件功能，这对于刚接触包开发的开发者来说学习成本比较高，而 [Vite](https://github.com/vitejs/vite) 的出现则解决了这个难题，因为 Vite 的底层是基于 Rollup 来完成构建，上层则简化了很多配置上的问题，因此接下来将使用 Vite 来带领开发者入门 npm 包的开发。

### 项目结构与入口文件

在动手开发具体功能之前，先把项目框架搭起来，熟悉常用的项目结构，以及如何配置项目清单信息。

#### 初始化项目

首先需要初始化一个 Node 项目，打开命令行工具，先使用 `cd` 命令进入平时存放项目的目录，再通过 `mkdir` 命令创建一个项目文件夹，这里我们起名为 `hello-lib` ：

```bash
# 创建一个项目文件夹
mkdir hello-lib
```

创建了项目文件夹之后，使用 `cd` 命令进入项目，执行 Node 的项目初始化命令：

```bash
# 进入项目文件夹
cd hello-lib

# 执行初始化，使其成为一个 Node 项目
npm init -y
```

此时 hello-lib 目录下会生成一个 package.json 文件，由于后面还需要手动调整该文件的信息，所以初始化的时候可以添加 `-y` 参数使用默认的初始化数据直接生成该文件，跳过答题环节。

#### 配置包信息

对一个 npm 包来说，最重要的文件莫过于 package.json 项目清单，其中有三个字段是必填的：

| <span style="display: inline-block; width: 80px;">字段</span> | <span style="display: inline-block; width: 80px;">是否必填</span> | 作用                                                                                                                                                                                                                                                                                                                  |
| :-----------------------------------------------------------: | :---------------------------------------------------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                             name                              |                               必填                                | npm 包的名称，遵循 [项目名称的规则](guide.md#项目名称规则)                                                                                                                                                                                                                                                            |
|                            version                            |                               必填                                | npm 包的版本号，遵循 [语义化版本号的规则](guide.md#语义化版本号管理)                                                                                                                                                                                                                                                  |
|                             main                              |                               必填                                | 项目的入口文件，通常指向构建产物所在目录的某个文件，该文件通常包含了所有模块的导出。<br><br>如果只指定了 `main` 字段，则使用 `require` 和 `import` 以及浏览器访问 npm 包的 CDN 时，都将默认调用该字段指定的入口文件。<br><br>如果有指定 `module` 和 `browser` 字段，则通常对应 `cjs` 格式的文件，对应 CommonJS 规范。 |
|                            module                             |                                否                                 | 当项目使用 `import` 引入 npm 包时对应的入口文件，通常指向一个 `es` 格式的文件，对应 ES Module 规范。                                                                                                                                                                                                                  |
|                            browser                            |                                否                                 | 当项目使用了 npm 包的 CDN 链接，在浏览器访问页面时的入口文件，通常指向一个 `umd` 格式的文件，对应 UMD 规范。                                                                                                                                                                                                          |
|                             types                             |                                否                                 | 一个 `.d.ts` 类型声明文件，包含了入口文件导出的方法 / 变量的类型声明，如果项目有自带类型文件，那么在使用者在使用 TypeScript 开发的项目里，可以得到友好的类型提示                                                                                                                                                      |
|                             files                             |                                否                                 | 指定发布到 npm 上的文件范围，格式为 `string[]` 支持配置多个文件名或者文件夹名称。<br><br>通常可以只指定构建的输出目录，例如 `dist` 文件夹，如果不指定，则发布的时候会把所有源代码一同发布。                                                                                                                           |

其中 `main` 、 `module` 和 `browser` 三个入口文件对应的文件格式和规范，通常都是交给构建工具处理，无需手动编写，开发者只需要维护一份源码即可编译出不同规范的 JS 文件， `types` 对应的类型声明文件也是由工具来输出，无需手动维护。

而其他的字段可以根据项目的性质决定是否补充，以下是 hello-lib 的基础信息示例：

```json
{
  "name": "@learning-vue3/lib",
  "version": "0.1.0",
  "description": "A library demo for learning-vue3.",
  "author": "chengpeiquan <chengpeiquan@chengpeiquan.com>",
  "license": "MIT",
  "files": ["dist"],
  "main": "dist/index.cjs",
  "module": "dist/index.mjs",
  "browser": "dist/index.min.js",
  "types": "dist/index.d.ts",
  "keywords": ["library", "demo", "example"],
  "scripts": {
    "build": "vite build"
  }
}
```

此时 `main` 、 `module` 、 `browser` 和 `types` 字段对应的文件还不存在，它们将在项目执行 `npm run build` 构建之后才会产生。

另外，入口文件使用了不同规范对应的文件扩展名，也可以统一使用 `.js` 扩展名，通过文件名来区分，例如 `es` 格式使用 `index.es.js` 。

而 `scripts` 字段则配置了一个 `build` 命令，这里使用了 Vite 的构建命令来打包项目，这个过程会读取 Vite 的配置文件 `vite.config.ts` ，关于该文件的配置内容将在下文继续介绍。

#### 安装开发依赖

本次的 npm 包将使用 Vite 进行构建，使用 TypeScript 编写源代码，由于 Vite 本身对 TypeScript 进行了支持，因此只需要将 Vite 安装到开发依赖：

```bash
# 添加 -D 选项将其安装到 devDependencies
npm i -D vite
```

#### 添加配置文件

在 [配置包信息](#配置包信息) 的时候已提前配置了一个 `npm run build` 的命令，它将运行 Vite 来构建 npm 包的入口文件。

由于 Vite 默认是构建入口文件为 HTML 的网页应用，而开发 npm 包时入口文件是 JS / TS 文件，因此需要添加一份配置文件来指定构建的选项。

以下是本次的基础配置，可以完成最基本的打包，它将输出三个不同格式的入口文件，分别对应 CommonJS 、 ES Module 和 UMD 规范，分别对应 package.json 里 `main` 、 `module` 和 `browser` 字段指定的文件。

```ts
// vite.config.ts
import { defineConfig } from 'vite'

// https://cn.vitejs.dev/config/
export default defineConfig({
  build: {
    // 输出目录
    outDir: 'dist',
    // 构建 npm 包时需要开启 “库模式”
    lib: {
      // 指定入口文件
      entry: 'src/main.ts',
      // 输出 UMD 格式时，需要指定一个全局变量的名称
      name: 'hello',
      // 最终输出的格式，这里指定了三种
      formats: ['es', 'cjs', 'umd'],
      // 针对不同输出格式对应的文件名
      fileName: (format) => {
        switch (format) {
          // ES Module 格式的文件名
          case 'es':
            return 'index.mjs'
          // CommonJS 格式的文件名
          case 'cjs':
            return 'index.cjs'
          // UMD 格式的文件名
          default:
            return 'index.min.js'
        }
      },
    },
    // 压缩混淆构建后的文件代码
    minify: true,
  },
})
```

#### 添加入口文件

来到这里，最基础的准备工作已完成，接下来添加入口文件并尝试编译。

在 [添加配置文件](#添加配置文件) 时已指定了入口文件为 `src/main.ts` ，因此需要对应的创建该文件，并写入一个简单的方法，将用它来测试打包结果：

```ts
// src/main.ts
export default function hello(name: string) {
  console.log(`Hello ${name}`)
}
```

在命令行执行 `npm run build` 命令，可以看到项目下生成了 dist 文件夹，以及三个 JavaScript 文件，此时目录结构如下：

```bash
hello-lib
│ # 构建产物的输出文件夹
├─dist
│ ├─index.cjs
│ ├─index.min.js
│ └─index.mjs
│ # 依赖文件夹
├─node_modules
│ # 源码文件夹
├─src
│ │ # 入口文件
│ └─main.ts
│ # 项目清单信息
├─package-lock.json
├─package.json
│ # Vite 配置文件
└─vite.config.ts
```

虽然源码是使用 TypeScript 编写的，但最终输出的内容是按照指定的格式转换为 JavaScript 并且被执行了压缩和混淆，在这里将它们重新格式化，来看看转换后的结果。

这是 `index.cjs` 的文件内容，源码被转换为 CommonJS 风格的代码：

```js
'use strict'
function l(o) {
  console.log(`Hello ${o}`)
}
module.exports = l
```

这是 `index.mjs` 的内容，源码被转换为 ES Module 风格的代码：

```js
function o(l) {
  console.log(`Hello ${l}`)
}
export { o as default }
```

这是 `index.min.js` 的内容，源码被转换为 UMD 风格的代码：

```js
;(function (e, n) {
  typeof exports == 'object' && typeof module < 'u'
    ? (module.exports = n())
    : typeof define == 'function' && define.amd
    ? define(n)
    : ((e = typeof globalThis < 'u' ? globalThis : e || self), (e.hello = n()))
})(this, function () {
  'use strict'
  function e(n) {
    console.log(`Hello ${n}`)
  }
  return e
})
```

来到这里，准备工作已就绪，下一步将开始进入工具包和组件包的开发。

### 开发工具包和组件包

> 待完善

我们会先从最简单的函数库开始入门包的开发，

### 编译打包与类型声明

> 待完善

### 发布 npm 包

> 待完善

```bash
npm publish
```

```bash
npm publish --tag alpha
```

```bash
npm publish --access public
```

```bash
npm publish --access public --tag alpha
```

## 本章结语

插件的使用基本上就涉及到这些点了，很多同学之所以还不敢在业务中使用 Vue 3.0，应该也是顾虑于 3.0 是不是有很多插件不能用，影响业务的开发效率（之前有问过不同公司的一些朋友，大部分都是出于这个考虑）。

相信经过这一章的说明，心里应该有底了，在缺少针对性的 Vue 专属插件的情况下，不妨也试一下通用的原生 JS Library 。

<!-- 谷歌广告 -->
<ClientOnly>
  <GoogleAdsense />
</ClientOnly>
<!-- 谷歌广告 -->

<!-- 评论 -->
<ClientOnly>
  <GitalkComment
    :issueId="48"
  />
</ClientOnly>
<!-- 评论 -->
