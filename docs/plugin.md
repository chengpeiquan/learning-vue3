---
outline: 'deep'
---

# 插件的开发和使用

在构建 Vue 项目的过程中，离不开各种开箱即用的插件支持，用以快速完成需求，避免自己造轮子。

在 Vue 项目里，可以使用针对 Vue 定制开发的专属插件，也可以使用无框架依赖的通用 JS 插件，插件的表现形式也是丰富多彩，既可以是功能的实现，也可以是组件的封装，本章将从插件的使用到亲自开发一个小插件的过程，逐一讲解。

## 插件的安装和引入

在 [前端工程化](guide.md#了解前端工程化) 十分普及的今天，可以说几乎所有要用到的插件，都可以在 [npmjs](https://www.npmjs.com/) 上搜到，除了官方提供的包管理器 npm ，也有很多种安装方式选择。

:::tip
如果还不了解什么是包和包管理器，请先阅读 [了解包和插件](guide.md#了解包和插件) 一节的内容。

另外，每个包管理都可以配置镜像源，提升国内的下载速度，对此也可以先阅读 [配置镜像源](guide.md#配置镜像源) 一节了解。
:::

虽然对于个人开发者来说，有一个用的顺手的包管理器就足够日常开发了，但是还是有必要多了解一下不同的包管理器，因为未来可能会面对团队协作开发、为开源项目贡献代码等情况，需要遵循团队要求的包管理机制（例如使用 Monorepo 架构的团队会更青睐于 yarn 或 pnpm 的 Workspace 功能）。

### 通过 npm 安装

[npm](https://github.com/npm/cli) 是 Node.js 自带的包管理器，平时通过 `npm install` 命令来安装各种 npm 包（比如 `npm install vue-router` ），就是通过这个包管理器来安装的。

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
npm 的 lock 文件是 `package-lock.json` ，如果有管理多人协作仓库的需求，可以根据实际情况把它添加至 `.gitignore` 文件，便于统一团队的包管理。
:::

### 通过 cnpm 安装

[cnpm](https://github.com/cnpm/cnpm) 是阿里巴巴推出的包管理工具，安装之后默认会使用 `https://registry.npmmirror.com` 这个镜像源。

它的安装命令和 npm 非常一致，通过 `cnpm install` 命令来安装（比如 `cnpm install vue-router`）。

在使用它之前，需要通过 npm 命令进行全局安装：

```bash
npm install -g cnpm

# 或者
# npm install -g cnpm --registry=https://registry.npmmirror.com
```

:::tip
cnpm 不生成 lock 文件，也不会识别项目下的 lock 文件，所以还是推荐使用 npm 或者其他包管理工具，通过绑定镜像源的方式来管理项目的包。
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
yarn 的 lock 文件是 `yarn.lock` ，如果有管理多人协作仓库的需求，可以根据实际情况把它添加至 `.gitignore` 文件，便于统一团队的包管理。
:::

### 通过 pnpm 安装

[pnpm](https://github.com/pnpm/pnpm) 是包管理工具的一个后起之秀，主打快速的、节省磁盘空间的特色，用法跟其他包管理器很相似，没有太多的学习成本， npm 和 yarn 的命令它都支持。

也是必须先全局安装它才可以使用：

```bash
npm install -g pnpm
```

目前 pnpm 在开源社区的使用率越来越高，包括接触最多的 Vue / Vite 团队也在逐步迁移到 pnpm 来管理依赖。

pnpm 的下载源使用的是 npm ，所以如果要绑定镜像源，按照 [npm 的方式](#通过-npm-安装) 处理就可以了。

相关阅读：

- [pnpm 官网](https://pnpm.io/zh/)
- [为什么要使用 pnpm](https://pnpm.io/zh/motivation)
- [为什么 vue 源码以及生态仓库要迁移 pnpm?](https://zhuanlan.zhihu.com/p/441547677)
- [关于现代包管理器的深度思考 —— 为什么现在我更推荐 pnpm 而不是 npm/yarn?](https://zhuanlan.zhihu.com/p/377593512)

:::tip
pnpm 的 lock 文件是 `pnpm-lock.yaml` ，如果有管理多人协作仓库的需求，可以根据实际情况把它添加至 `.gitignore` 文件，便于统一团队的包管理。
:::

### 通过 CDN 安装

大部分插件都会提供一个 CDN 版本，让可以在 `.html` 文件里通过 `<script>` 标签引入。

比如：

```html
<script src="https://unpkg.com/vue-router"></script>
```

### 插件的引入

除了 CDN 版本是直接可用之外，其他通过 npm 、 yarn 等方式安装的插件，都需要在入口文件 `main.ts` 或者要用到的 `.vue` 文件里引入，比如：

```ts
import { createRouter, createWebHistory } from 'vue-router'
```

因为本教程都是基于工程化开发，使用的 CLI 脚手架，所以这些内容暂时不谈及 CDN 的使用方式。

通常来说会有细微差别，但影响不大，插件作者也会在插件仓库的 README 或者使用文档里进行告知。

## Vue 专属插件

这里特指 Vue 插件，通过 [Vue Plugins 设计规范](https://cn.vuejs.org/guide/reusability/plugins.html) 开发出来的插件，在 npm 上通常是以 `vue-xxx` 这样带有 vue 关键字的格式命名（比如 [vue-baidu-analytics](https://github.com/chengpeiquan/vue-baidu-analytics)）。

专属插件通常分为 **全局插件** 和 **单组件插件**，区别在于，全局版本是在 `main.ts` 引入后 `use`，而单组件版本则通常是作为一个组件在 `.vue` 文件里引入使用。

### 全局插件的使用 ~new

在本教程最最前面的时候，特地说了一个内容就是 [项目初始化](upgrade.md#项目初始化) ，在这里有提到过就是需要通过 `use` 来初始化框架、插件。

全局插件的使用，就是在 `main.ts` 通过 `import` 引入，然后通过 `use` 来启动初始化。

在 Vue 2 ，全局插件是通过 `Vue.use(xxx)` 来启动，而现在，则需要通过 `createApp` 的 `use`，既可以单独一行一个 use ，也可以直接链式 use 下去。

**参数**

`use` 方法支持两个参数：

| 参数    | 类型               | 作用                                             |
| :------ | :----------------- | :----------------------------------------------- |
| plugin  | object \| function | 插件，一般是在 import 时使用的名称             |
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

大部分插件到这里就可以直接启动了，个别插件可能需要通过插件 API 去手动触发，在 npm 包的详情页或者 GitHub 仓库文档上，作者一般会告知使用方法，按照说明书操作即可。

### 单组件插件的使用 ~new

单组件的插件，通常自己本身也是一个 Vue 组件（大部分情况下都会打包为 JS 文件，但本质上是一个 Vue 的 Component ）。

单组件的引入，一般都是在需要用到的 `.vue` 文件里单独 `import` ，然后挂到 `<template />` 里去渲染，下面是一段模拟代码，理解起来会比较直观：

```vue{2-3,10-11,14-17}
<template>
  <!-- 放置组件的渲染标签，用于显示组件 -->
  <ComponentExample />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import logo from '@/assets/logo.png'

// 引入单组件插件
import ComponentExample from 'a-component-example'

export default defineComponent({
  // 挂载组件模板
  components: {
    ComponentExample,
  },
})
</script>
```

参考上面的代码还有注释，应该能大概了解如何使用单组件插件了吧！

## 通用 JS / TS 插件

也叫普通插件，这个 “普通” 不是指功能平平无奇，而是指它们无需任何框架依赖，可以应用在任意项目中，属于独立的 Library ，比如 [axios](https://github.com/axios/axios) 、 [qrcode](https://github.com/soldair/node-qrcode) 、[md5](https://github.com/pvorb/node-md5) 等等，在任何技术栈都可以单独引入使用，非 Vue 专属。

通用插件的使用非常灵活，既可以全局挂载，也可以在需要用到的组件里单独引入。

组件里单独引入方式：

```ts
import { defineComponent } from 'vue'
import md5 from '@withtypes/md5'

export default defineComponent({
  setup() {
    const md5Msg = md5('message')
  },
})
```

全局挂载方法比较特殊，因为插件本身不是专属 Vue，没有 `install` 接口，无法通过 `use` 方法直接启动，下面有一小节内容单独讲这一块的操作，详见 [全局 API 挂载](#全局-api-挂载)。

## 本地插件 ~new

插件也不全是来自于网上，有时候针对自己的业务，涉及到一些经常用到的功能模块，也可以抽离出来封装成项目专用的插件。

### 封装的目的

举个例子，比如在做一个具备用户系统的网站时，会涉及到手机短信验证码模块，在开始写代码之前，需要先要考虑到这些问题：

1. 很多操作都涉及到下发验证码的请求，比如 “登录” 、 “注册” 、 “修改手机绑定” 、 “支付验证” 等等，代码雷同，只是接口 URL 或者参数不太一样

2. 都是需要对手机号是否有传入、手机号的格式正确性验证等一些判断

3. 需要对接口请求成功和失败的情况做一些不同的数据返回，但要处理的数据很相似，都是用于告知调用方当前是什么情况

4. 返回一些 Toast 告知用户当前的交互结果

:::tip
如果不把这一块的业务代码抽离出来，需要在每个用到的地方都写一次，不仅繁琐，而且以后一旦产品需求有改动，维护起来就惨了。
:::

### 常用的封装类型

常用的本地封装方式有两种：一种是以 [通用 JS / TS 插件](#通用-js-ts-插件) 的形式，一种是以 [Vue 专属插件](#vue-专属插件) 的形式。

关于这两者的区别已经在对应的小节有所介绍，接下来来看看如何封装它们。

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

这样在调用的时候，可以通过 `@/libs/foo` 来引入，或者配置了 alias 别名，也可以使用别名导入，例如 `@libs/foo` 。

#### 设计规范与开发案例

在设计本地通用插件的时候，需要遵循 [ES Module 模块设计规范](#用-es-module-设计模块) ，并且做好必要的代码注释（用途、入参、返回值等）。

:::tip
如果还没有了解过 “模块” 的概念的话，可以先阅读 [了解模块化设计](guide.md#了解模块化设计) 一节的内容。
:::

一般来说，会有以下三种情况需要考虑。

##### 只有一个默认功能

如果只有一个默认的功能，那么可以使用 `export default` 来默认导出一个函数。

例如需要封装一个打招呼的功能：

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

例如需要封装几个通过 [正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions) 判断表单的输入内容是否符合要求的函数：

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

在 [只有一个默认功能](#只有一个默认功能) 这个打招呼例子的基础上修改一下，默认提供的是 “打招呼” 的功能，偶尔需要更热情的赞美一下，那么这个 “赞美” 行为就可以用这个方式来放到这个文件里一起维护。

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

这样在调用的时候，可以通过 `@/plugins/foo` 来引入，或者配置了 alias 别名，也可以使用别名导入，例如 `@plugins/foo` 。

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

在 `main.ts` 全局启用插件，在启用的时候传入了第二个参数 “插件的选项” ，这里配置了个高亮指令的默认背景颜色：

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

  <!-- 测试 highlight 指令 -->
  <div>根据 highlight 指令的判断规则：</div>
  <div v-highlight="`cyan`">这个是青色高亮</div>
  <div v-highlight="`yellow`">这个是黄色高亮</div>
  <div v-highlight="`red`">这个是红色高亮</div>
  <div v-highlight>这个是使用插件初始化时设置的灰色</div>
</template>
```

## 全局 API 挂载

对于一些使用频率比较高的插件方法，如果觉得在每个组件里单独导入再用很麻烦，也可以考虑将其挂载到 Vue 上，使其成为 Vue 的全局变量。

**注：接下来的全局变量，都是指 Vue 环境里的全局变量，非 Window 下的全局变量。**

### 回顾 Vue 2

在 Vue 2 ，可以通过 `prototype` 的方式来挂载全局变量，然后通过 `this` 关键字来从 Vue 原型上调用该方法。

以 `md5` 插件为例，在 `main.ts` 里进行全局 `import`，然后通过 `prototype` 去挂到 Vue 上。

```ts
import Vue from 'vue'
import md5 from 'md5'

Vue.prototype.$md5 = md5
```

之后在 `.vue` 文件里，就可以这样去使用 `md5`。

```ts
const md5Msg = this.$md5('message')
```

### 了解 Vue 3 ~new

在 Vue 3 ，已经不再支持 `prototype` 这样使用了，在 `main.ts` 里没有了 `Vue`，在组件的生命周期里也没有了 `this`。

如果依然想要挂载全局变量，需要通过全新的 [globalProperties](https://cn.vuejs.org/api/application.html#app-config-globalproperties) 来实现，在使用该方式之前，可以把 `createApp` 定义为一个变量再执行挂载。

### 定义全局 API ~new

如上，在配置全局变量之前，可以把初始化时的 `createApp` 定义为一个变量（假设为 `app` ），然后把需要设置为全局可用的变量或方法，挂载到 `app` 的 `config.globalProperties` 上面。

```ts
import md5 from 'md5'

// 创建 Vue 实例
const app = createApp(App)

// 把插件的 API 挂载全局变量到实例上
app.config.globalProperties.$md5 = md5

// 也可以自己写一些全局函数去挂载
app.config.globalProperties.$log = (text: string): void => {
  console.log(text)
}

app.mount('#app')
```

### 全局 API 的替代方案

在 Vue 3 实际上并不是特别推荐使用全局变量，Vue 3 比较推荐按需引入使用，这也是在构建过程中可以更好的做到代码优化。

特别是针对 TypeScript ， Vue 作者尤雨溪先生对于全局 API 的相关 PR 说明： [Global API updates](https://github.com/vuejs/rfcs/pull/117) ，也是不建议在 TS 里使用。

那么确实是需要用到一些全局 API 怎么办？

对于一般的数据和方法，建议采用 [Provide / Inject](communication.md#provide-inject) 方案，在根组件（通常是 App.vue ）把需要作为全局使用的数据或方法 Provide 下去，在需要用到的组件里通过 Inject 即可获取到，或者使用 [EventBus](communication.md#eventbus-new) / [Vuex](communication.md#vuex-new) / [Pinia](pinia.md) 等全局通信方案来处理。

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

但这一类包通常是提供很基础的功能实现，更多时候需要自己开发的包更倾向于和框架、和业务挂钩，涉及到非 JavaScript 代码，例如 Vue 组件的编译、 Less 等 CSS 预处理器编译、 TypeScript 的编译等等，如果不通过构建工具来处理，那么发布后这个包的使用就会有诸多限制，需要满足和开发这个包时一样的开发环境才能使用，这对于使用者来说非常不友好。

因此大部分 npm 包的开发也需要用到构建工具来转换项目源代码，统一输出为一个兼容性更好、适用性更广的 JavaScript 文件，配合 `.d.ts` 文件的类型声明，使用者可以不需要特地配置就可以开箱即用，非常方便，非常友好。

传统的 [Webpack](https://github.com/webpack/webpack) 可以用来构建 npm 包文件，但按照目前更主流的技术选项，编译结果更干净更迷的当属 [Rollup](https://github.com/rollup/rollup) ，但 Rollup 需要配置很多插件功能，这对于刚接触包开发的开发者来说学习成本比较高，而 [Vite](https://github.com/vitejs/vite) 的出现则解决了这个难题，因为 Vite 的底层是基于 Rollup 来完成构建，上层则简化了很多配置上的问题，因此接下来将使用 Vite 来带领开发者入门 npm 包的开发。

:::tip
在开始使用构建工具之前，请先在命令行使用 `node -v` 命令检查当前的 Node.js 版本号是否在构建工具的支持范围内，避免无法正常使用构建工具。

通常可以在构建工具的官网查询到其支持的 Node 版本，以 Vite 为例，可以在 Vite 官网的 [Node 支持](https://cn.vitejs.dev/guide/migration.html#node-support) 一节了解到当前只能在 Node 14.18+ / 16+ 版本上使用 Vite 。

当构建工具所支持的 Node 版本和常用的 Node 版本出现严重冲突时，推荐使用 [nvm](https://github.com/nvm-sh/nvm) / [nvm-windows](https://github.com/coreybutler/nvm-windows) 或者 [n](https://github.com/tj/n) 等 Node 版本管理工具安装多个不同版本的 Node ，即可根据开发需求很方便的切换不同版本的 Node 进行开发。
:::

### 项目结构与入口文件

在动手开发具体功能之前，先把项目框架搭起来，熟悉常用的项目结构，以及如何配置项目清单信息。

:::tip
当前文档所演示的 hello-lib 项目已托管至 [learning-vue3/hello-lib](https://github.com/learning-vue3/hello-lib) 仓库，可使用 Git 克隆命令拉取至本地：

```bash
# 从 GitHub 克隆
git clone https://github.com/learning-vue3/hello-lib.git

# 如果 GitHub 访问失败，可以从 Gitee 克隆
git clone https://gitee.com/learning-vue3/hello-lib.git
```

成品项目可作为学习过程中的代码参考，但更建议按照教程的讲解步骤，从零开始亲手搭建一个新项目并完成 npm 包的开发流程，可以更有效的提升学习效果。
:::

#### 初始化项目

首先需要初始化一个 Node 项目，打开命令行工具，先使用 `cd` 命令进入平时存放项目的目录，再通过 `mkdir` 命令创建一个项目文件夹，这里起名为 `hello-lib` ：

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
  "version": "1.0.0",
  "description": "A library demo for learning-vue3.",
  "author": "chengpeiquan <chengpeiquan@chengpeiquan.com>",
  "homepage": "https://github.com/learning-vue3/hello-lib",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/learning-vue3/hello-lib.git"
  },
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
      entry: 'src/index.ts',
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

在 [添加配置文件](#添加配置文件) 时已指定了入口文件为 src/index.ts ，因此需要对应的创建该文件，并写入一个简单的方法，将用它来测试打包结果：

```ts
// src/index.ts
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
│ └─index.ts
│ # 项目清单信息
├─package-lock.json
├─package.json
│ # Vite 配置文件
└─vite.config.ts
```

打开 dist 目录下的文件内容，可以看到虽然源码是使用 TypeScript 编写的，但最终输出的内容是按照指定的格式转换为 JavaScript 并且被执行了压缩和混淆，在这里将它们重新格式化，来看看转换后的结果。

这是 index.cjs 的文件内容，源码被转换为 CommonJS 风格的代码：

```js
// dist/index.cjs
'use strict'
function l(o) {
  console.log(`Hello ${o}`)
}
module.exports = l
```

这是 index.mjs 的内容，源码被转换为 ES Module 风格的代码：

```js
// dist/index.mjs
function o(l) {
  console.log(`Hello ${l}`)
}
export { o as default }
```

这是 index.min.js 的内容，源码被转换为 UMD 风格的代码：

```js
// dist/index.min.js
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

### 开发 npm 包

这里先从最简单的函数库开始入门包的开发，为什么说它简单呢？因为只需要编写 JavaScript 或 TypeScript 就可以很好的完成开发工作。

在理解了包的开发流程之后，如果要涉及 Vue 组件包的开发，则安装相关的 Vue 的相关依赖、 Less 等 CSS 预处理器依赖，只要满足了编译条件，就可以正常构建和发布，它们的开发流程是一样的。

#### 编写 npm 包代码

在开发的过程中，需要遵循模块化开发的要求，当前这个演示包使用 TypeScript 编码，就需要 [使用 ES Module 来设计模块](guide.md#用-es-module-设计模块) ，如果对模块化设计还没有足够的了解，请先回顾相关的内容。

先在 src 目录下创建一个名为 utils.ts 的文件，写入以下内容：

```ts
// src/utils.ts

/**
 * 生成随机数
 * @param min - 最小值
 * @param max - 最大值
 * @param roundingType - 四舍五入类型
 * @returns 范围内的随机数
 */
export function getRandomNumber(
  min: number = 0,
  max: number = 100,
  roundingType: 'round' | 'ceil' | 'floor' = 'round'
) {
  return Math[roundingType](Math.random() * (max - min) + min)
}

/**
 * 生成随机布尔值
 */
export function getRandomBoolean() {
  const index = getRandomNumber(0, 1)
  return [true, false][index]
}
```

这里导出了两个随机方法，其中 `getRandomNumber` 提供了随机数值的返回，而 `getRandomBoolean` 提供了随机布尔值的返回，在源代码方面， `getRandomBoolean` 调用了 `getRandomNumber` 获取随机索引。

这是一个很常见的 npm 工具包的开发思路，包里的函数都使用了细粒度的编程设计，每一个函数都是独立的功能，在必要的情况下，函数 B 可以调用函数 A 来减少代码的重复编写。

在这里， utils.ts 文件已开发完毕，接下来需要将它导出的方法提供给包的使用者，请删除入口文件 src/index.ts 原来的测试内容，并输入以下新代码：

```ts
// src/index.ts
export * from './utils'
```

这代表将 utils.ts 文件里导出的所有方法或者变量，再次导出去，如果有很多个 utils.ts 这样的文件， index.ts 将作为一个统一的入口，统一的导出给构建工具去编译输出。

接下来在命令行执行 `npm run build` ，再分别看看 dist 目录下的文件变化：

此时的 index.cjs 文件，已经按照 CommonJS 规范转换了源代码：

```js
// dist/index.cjs
'use strict'
Object.defineProperties(exports, {
  __esModule: { value: !0 },
  [Symbol.toStringTag]: { value: 'Module' },
})
function t(e = 0, o = 100, n = 'round') {
  return Math[n](Math.random() * (o - e) + e)
}
function r() {
  const e = t(0, 1)
  return [!0, !1][e]
}
exports.getRandomBoolean = r
exports.getRandomNumber = t
```

index.mjs 也按照 ES Module 规范进行了转换：

```js
// dist/index.mjs
function o(n = 0, t = 100, e = 'round') {
  return Math[e](Math.random() * (t - n) + n)
}
function r() {
  const n = o(0, 1)
  return [!0, !1][n]
}
export { r as getRandomBoolean, o as getRandomNumber }
```

index.min.js 同样正常按照 UMD 风格转换成了 JavaScript 代码：

```js
// dist/index.min.js
;(function (e, n) {
  typeof exports == 'object' && typeof module < 'u'
    ? n(exports)
    : typeof define == 'function' && define.amd
    ? define(['exports'], n)
    : ((e = typeof globalThis < 'u' ? globalThis : e || self),
      n((e.hello = {})))
})(this, function (e) {
  'use strict'
  function n(o = 0, u = 100, d = 'round') {
    return Math[d](Math.random() * (u - o) + o)
  }
  function t() {
    const o = n(0, 1)
    return [!0, !1][o]
  }
  ;(e.getRandomBoolean = t),
    (e.getRandomNumber = n),
    Object.defineProperties(e, {
      __esModule: { value: !0 },
      [Symbol.toStringTag]: { value: 'Module' },
    })
})
```

#### 对 npm 包进行本地调试

开发或者迭代了一个 npm 包之后，不建议直接发布，可以在本地进行测试，直到没有问题了再发布到 npmjs 上供其他人使用。

npm 提供了一个 `npm link` 命令供开发者本地联调，假设 `path/to/my-library` 是一个 npm 包的项目路径， `path/to/my-project` 是一个调试项目的所在路径，那么通过以下步骤可以在 `my-project` 里本地调试 `my-library` 包：

##### 创建本地软链接

先在 `my-library` npm 包项目里执行 `npm link` 命令，创建 npm 包的本地软链接：

```bash
# 进入 npm 包项目所在的目录
cd path/to/my-library

# 创建 npm 包的本地软链接
npm link
```

运行了以上命令之后，意味着刚刚开发好的 npm 包，已经被成功添加到了 Node 的全局安装目录下，可以在命令行运行以下命令查看全局安装目录的位置：

```bash
npm prefix -g
```

假设 `{prefix}` 是全局安装目录，刚刚这个包在 package.json 里的包名称是 `my-library` ，那么在 `{prefix}/node_modules/my-library` 这个目录下可以看到被软链接了一份项目代码。

:::tip
软链接（ Symbolic Link / Symlink / Soft Link ），是指通过指定路径来指向文件或目录，操作系统会自动将其解释为另一个文件或目录的路径，因此软链接被删除或修改不会影响源文件，而源文件的移动或者删除，不会自动更新软链接，这一点和快捷方式的作用比较类似。
:::

自此已经对这个 npm 包完成了一次 “本地发布” ，接下来就要在调试项目里进行本地关联。

##### 关联本地软链接

在 `my-project` 调试项目里执行语法为 `npm link [<package-spec>]` 的 link 命令，关联 npm 包的本地软链接。

:::tip
这里的 `[<package-spec>]` 参数，可以是包名称，也可以是 npm 包项目所在的路径。
:::

```bash
# 进入调试项目所在的目录
cd path/to/my-project

# 通过 npm 包的包名称关联本地软链接
npm link my-library
```

如果通过 npm 包名称关联失败，例如返回了如下信息：

```bash
❯ npm link my-library
npm ERR! code E404
npm ERR! 404 Not Found - GET https://registry.npmjs.org/my-library - Not found
npm ERR! 404
npm ERR! 404  'my-library@*' is not in this registry.
npm ERR! 404
npm ERR! 404 Note that you can also install from a
npm ERR! 404 tarball, folder, http url, or git url.
```

这种情况通常出现于本地 npm 包还没有在 npmjs 上进行过任意版本的发布，而包管理器又找不到本地全局安装目录的软链接，就会去 npm 源找，都找不到就会返回 404 的报错，针对这种情况，也可以使用 npm 包项目的路径进行关联：

```bash
# 进入调试项目所在的目录
cd path/to/my-project

# 通过 npm 包的项目路径关联本地软链接
npm link path/to/my-library
```

至此，就完成了调试项目对该 npm 包在本地的 “安装” ，此时在 `my-project` 这个调试项目的 node_modules 目录下也会创建一个软链接，指向 `my-library` 所在的目录。

回归当前的演示包项目，先创建一个基于 TypeScript 的 Vue 新项目作为调试项目，在关联了本地 npm 包之后，就可以在调试项目里编写如下代码，测试 npm 包里的方法是否可以正常使用：

```ts
// 请将 `@learning-vue3/lib` 更换为实际的包名称
import { getRandomNumber } from '@learning-vue3/lib'

const num = getRandomNumber()
console.log(num)
```

启动 `npm run dev` 的调试命令并打开本地调试页面，就可以在浏览器控制台正确的打印出了随机结果。

因为本包还支持 UMD 规范，所以也可以在 HTML 页面通过普通的 `<script />` 标签直接引入 dist 目录下的文件测试将来引入 CDN 时的效果，可以在 npm 包项目下创建一个 demo 目录，并添加一个 index.html 文件到该目录下，并写入以下内容：

```html
<!-- demo/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Library Demo</title>
  </head>
  <body>
    <!-- 这里引入的是 UMD 规范的文件 -->
    <script src="../dist/index.min.js"></script>
    <script>
      /**
       * UMD 规范的文件会有一个全局变量
       * 由 vite.config.ts 的 `build.lib.name` 决定
       */
      console.log(hello)

      /**
       * 所有的方法会挂在这个全局变量上
       * 类似于 jQuery 的 $.xxx() 那样使用
       */
      const num = hello.getRandomNumber()
      console.log(num)
    </script>
  </body>
</html>
```

在浏览器打开该 HTML 文件并唤起控制台，一样可以看到随机结果的打印记录。

#### 添加版权注释

很多知名项目在 Library 文件的开头都会有一段版权注释，它的作用除了声明版权归属之外，还会告知使用者关于项目的主页地址、版本号、发布日期、 BUG 反馈渠道等信息。

例如很多开发者入门前端时使用过的经典类库 jQuery :

```js{3-15}
// https://cdn.jsdelivr.net/npm/jquery@3.6.1/dist/jquery.js

/*!
 * jQuery JavaScript Library v3.6.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2022-08-26T17:52Z
 */
( function( global, factory ) {
// ...
```

又如流行的 JavaScript 工具库 Lodash :

```js{3-10}
// https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js

/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
(function(){
// ...
```

还有每次做轮播图一定会想到它的 Swiper ：

```js{3-14}
// https://cdn.jsdelivr.net/npm/swiper@8.4.3/swiper-bundle.js

/**
 * Swiper 8.4.3
 * Most modern mobile touch slider and framework
 * with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2022 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: October 6, 2022
 */
(function (global, factory) {
// ...
```

聪明的开发者肯定已经猜到了，这些版权注释肯定不是手动添加的，那么它们是如何自动生成的呢？

npm 社区提供了非常多开箱即用的注入插件，通常可以通过 “当前使用的构建工具名称” 加上 “plugin banner” 这样的关键字，在 npmjs 网站上搜索是否有相关的插件，以当前使用的 Vite 为例，可以通过 [vite-plugin-banner](https://www.npmjs.com/package/vite-plugin-banner) 实现版权注释的自动注入。

回到 hello-lib 项目，安装该插件到 devDependencies ：

```bash
npm i -D vite-plugin-banner
```

根据插件的文档建议，打开 vite.config.ts 文件，将其导入，并通过读取 package.json 的信息来生成常用的版权注释信息：

```ts{3-6,12-17}
// vite.config.ts
import { defineConfig } from 'vite'
// 导入版权注释插件
import banner from 'vite-plugin-banner'
// 导入 npm 包信息
import pkg from './package.json'

// https://cn.vitejs.dev/config/
export default defineConfig({
  // 其他选项保持不变
  // ...
  plugins: [
    // 新增 banner 插件的启用，传入 package.json 的字段信息
    banner(
      `/**\n * name: ${pkg.name}\n * version: v${pkg.version}\n * description: ${pkg.description}\n * author: ${pkg.author}\n * homepage: ${pkg.homepage}\n */`
    ),
  ],
})
```

再次运行 `npm run build` 命令，打开 dist 目录下的 Library 文件，可以看到都成功添加了一段版权注释：

```js{3-9}
// dist/index.mjs

/**
 * name: @learning-vue3/lib
 * version: v1.0.0
 * description: A library demo for learning-vue3.
 * author: chengpeiquan <chengpeiquan@chengpeiquan.com>
 * homepage: https://github.com/learning-vue3/hello-lib
 */
function o(n = 0, t = 100, e = 'round') {
  return Math[e](Math.random() * (t - n) + n)
}
function r() {
  const n = o(0, 1)
  return [!0, !1][n]
}
export { r as getRandomBoolean, o as getRandomNumber }
```

这样其他开发者如果在使用过程中遇到了问题，就可以轻松找到插件作者的联系方式了！

:::tip
请根据实际的 package.json 存在的字段信息调整 banner 内容。
:::

### 生成 npm 包的类型声明

虽然到这里已经得到一个可以运行的 JavaScript Library 文件，在 JavaScript 项目里使用是完全没有问题的，但还不建议直接发布到 npmjs 上，因为目前的情况下在 TypeScript 项目并不能完全兼容，还需要生成一份 npm 包的类型声明文件。

#### 为什么需要类型声明

如果在上一小节 [关联本地软链接](#关联本地软链接) 创建 Vue 调试项目时，也是使用了 TypeScript 版本的 Vue 项目，会遇到 VSCode 在下面这句代码上：

```ts
import { getRandomNumber } from '@learning-vue3/lib'
```

在包名称 `'@learning-vue3/lib'` 的位置提示了一个红色波浪线，把鼠标移上去会显示这么一段话：

> 无法找到模块 “@learning-vue3/lib” 的声明文件。 “D:/Project/demo/hello-lib/dist/index.cjs” 隐式拥有 "any" 类型。<br>
> 尝试使用 `npm i --save-dev @types/learning-vue3__lib` (如果存在)，或者添加一个包含 `declare module '@learning-vue3/lib';` 的新声明 (.d.ts) 文件 ts(7016)

此时在命令行运行 Vue 调试项目的打包命令 `npm run build` ，也会遇到打包失败的报错，控制台同样反馈了这个问题：缺少声明文件。

```bash
❯ npm run build

> hello-vue3@0.0.0 build
> vue-tsc --noEmit && vite build

src/App.vue:8:30 - error TS7016: Could not find a declaration file for module '@learning-vue3/lib'. 'D:/Project/demo/hello-lib/dist/index.cjs' implicitly has an 'any' type.
  Try `npm i --save-dev @types/learning-vue3__lib` if it exists or add a new declaration (.d.ts) file containing `declare module '@learning-vue3/lib';`

8 import { getRandomNumber } from '@learning-vue3/lib'
                               ~~~~~~~~~~~~~~~~~~~~


Found 1 error in src/App.vue:8
```

虽然使用者可以按照报错提示，在调试项目下创建一个 `d.ts` 文件并写入以下内容来声明该 npm 包：

```ts
declare module '@learning-vue3/lib'
```

但这需要每个使用者，或者说每个使用到这个包的项目都声明一次，对于使用者来说非常不友好， `declare module` 之后虽然不会报错了，但也无法获得 VSCode 对 npm 包提供的 API 进行 TS 类型的自动推导与类型提示、代码补全等功能支持。

#### 主流的做法

细心的开发者在 npmjs 网站上搜索 npm 包时，会发现很多 npm 包在详情页的包名后面，跟随有一个蓝色的 TS 图标，鼠标移上去时，还会显示一句提示语：

> This package contains built-in TypeScript declarations

<ClientOnly>
  <ImgWrap
    src="/assets/img/npm-detail-ts-icon.jpg"
    alt="注意 npm 包名称后面的 TS 图标"
  />
</ClientOnly>

例如上图的 [@vue/reactivity](https://www.npmjs.com/package/@vue/reactivity) ， Vue 3 的响应式 API 包，就带有这个图标。

这表示带有这个图标的 npm 包，已包含内置的 TypeScript 声明，可以获得完善的 TS 类型推导和提示支持，开发过程中也可以获得完善的代码补全功能支持，提高开发效率，在 TypeScript 项目执行 `npm run build` 的时候也能够被成功打包。

以 @vue/reactivity 这个包为例，如果项目下安装有这个 npm 包，可以在

```bash
# 基于项目根目录
./node_modules/@vue/reactivity/dist/reactivity.d.ts
```

这个文件里查看 Vue 3 响应式 API 的类型声明，也可以通过该文件的 CDN 地址访问到其内容：

```bash
https://cdn.jsdelivr.net/npm/@vue/reactivity@3.2.40/dist/reactivity.d.ts
```

#### 生成 DTS 文件

有在 “快速上手 TypeScript ” 一章阅读过 [了解 tsconfig.json](typescript.md#了解-tsconfig-json) 这节内容的开发者，应该对该文件有了一定的了解，如果还没有阅读过也没关系，可以先按照下方的步骤操作，接下来将分布说明如何生成 npm 包的 DTS 类型声明文件（以 `.d.ts` 为扩展名的文件）。

请先全局安装 [typescript](https://www.npmjs.com/package/typescript) 这个包：

```bash
npm install -g typescript
```

依然是在在命令行界面，回到 hello-lib 这个 npm 包项目的根目录，执行以下命令生成 tsconfig.json 文件：

```bash
tsc --init
```

打开 tsconfig.json 文件，生成的文件里会有很多默认被注释掉的选项，请将以下几个选项取消注释，同时在 `compilerOptions` 字段的同级新增 `include` 字段，这几个选项都修改为如下配置：

```json{3-5,7}
{
  "compilerOptions": {
    "declaration": true,
    "emitDeclarationOnly": true,
    "declarationDir": "./dist"
  },
  "include": ["./src"]
}
```

其中 `compilerOptions` 三个选项的意思是： `.ts` 源文件不编译为 `.js` 文件，只生成 `.d.ts` 文件并输出到 dist 目录； `include` 选项则告诉 TypeScript 编译器，只处理 src 目录下的 TS 文件。

修改完毕后，在命令行执行以下命令，它将根据 tsconfig.json 的配置对项目进行编译：

```bash
tsc
```

可以看到现在的 dist 目录下多了 2 份 `.d.ts` 文件： index.d.ts 和 utils.d.ts 。

```bash{4,7}
hello-lib
└─dist
  ├─index.cjs
  ├─index.d.ts
  ├─index.min.js
  ├─index.mjs
  └─utils.d.ts
```

打开 dist/index.d.ts ，可以看到它的内容和 src/index.ts 是一样的，因为作为入口文件，只提供了模块的导出：

```ts
// dist/index.d.ts
export * from './utils'
```

再打开 dist/utils.d.ts ，可以看到它的内容如下，对比 src/utils.ts 的文件内容，它去掉了具体的功能实现，并且根据代码逻辑，转换成了 TypeScript 的类型声明：

```ts
// dist/utils.d.ts
/**
 * 生成随机数
 * @param min - 最小值
 * @param max - 最大值
 * @param roundingType - 四舍五入类型
 * @returns 范围内的随机数
 */
export declare function getRandomNumber(
  min?: number,
  max?: number,
  roundingType?: 'round' | 'ceil' | 'floor'
): number
/**
 * 生成随机布尔值
 */
export declare function getRandomBoolean(): boolean
```

由于 hello-lib 项目的 package.json 已提前指定了类型声明文件指向：

```json
{
  "types": "dist/index.d.ts"
}
```

因此可以直接回到调试 npm 包的 Vue 项目，此时 VSCode 对那句 import 语句的红色波浪线报错信息已消失不见，鼠标移到 `getRandomNumber` 这个方法上，也可以看到 VSCode 出现了该方法的类型提示，非常方便。

:::tip
如果 VSCode 未能及时更新该包的类型，依然提示红色波浪线，可以重启 VSCode 再次查看。
:::

再次运行 `npm run build` 命令构建调试项目，这一次顺利通过编译：

```bash
❯ npm run build

> hello-vue3@0.0.0 build
> vue-tsc --noEmit && vite build

vite v2.9.15 building for production...
✓ 42 modules transformed.
dist/assets/logo.03d6d6da.png             6.69 KiB
dist/index.html                           0.42 KiB
dist/assets/home.9a123f29.js              2.01 KiB / gzip: 1.01 KiB
dist/assets/logo.db8b6a93.js              0.12 KiB / gzip: 0.13 KiB
dist/assets/TransferStation.25db7d3e.js   0.29 KiB / gzip: 0.22 KiB
dist/assets/bar.0e9da4c4.js               0.53 KiB / gzip: 0.37 KiB
dist/assets/bar.09e673fa.css              0.22 KiB / gzip: 0.18 KiB
dist/assets/home.6bd02f2a.css             0.62 KiB / gzip: 0.33 KiB
dist/assets/index.60726771.css            0.47 KiB / gzip: 0.29 KiB
dist/assets/index.aebbe022.js             79.87 KiB / gzip: 31.80 KiB
```

#### 生成 DTS Bundle

从 [初始化项目](#初始化项目) 到 [生成 DTS 文件](#生成-dts-文件) ，其实已经走完一个 npm 包的完整开发流程了，是可以提交发布了，但在发布之前，先介绍另外一个生成 DTS 文件的方式，可以根据实际情况选择使用。

请注意这里使用了 DTS Bundle 来称呼类型声明文件，这是因为直接使用 tsc 命令生成的 DTS 文件，是和源码目录的文件数量挂钩的，可以留意到在上一小节使用 tsc 命令生成声明文件后，在 hello-lib 项目中：

- src 源码目录有 index.ts 和 utils.ts 两个文件
- dist 输出目录也对应生成了 index.d.ts 和 utils.d.ts 两个文件

在一个大型项目里，源码的目录和文件非常多，意味着 DTS 文件也是非常多，这样的输出结构并不是特别友好。

在讲 npm 包对类型声明 [主流的做法](#主流的做法) 的时候，提到了 Vue 响应式 API 的 npm 包是提供了一个完整的 DTS 文件，它包含了所有 API 的类型声明信息：

```bash
./node_modules/@vue/reactivity/dist/reactivity.d.ts
```

这种将多个模块的文件内容合并为一个完整文件的行为通常称之为 Bundle ，本小节将介绍如何生成这种 DTS Bundle 文件。

继续回到 hello-lib 这个 npm 包项目，由于 tsc 本身不提供类型文件的合并，所以需要借助第三方依赖来实现，比较流行的第三方包有： [dts-bundle-generator](https://github.com/timocov/dts-bundle-generator) 、 [npm-dts](https://github.com/vytenisu/npm-dts) 、 [dts-bundle](https://github.com/TypeStrong/dts-bundle) 、 [dts-generator](https://github.com/SitePen/dts-generator) 等等。

之前笔者在为公司开发 npm 工具包的时候都对它们进行了一轮体验，鉴于实际开发过程中遇到的一些编译问题，在这里选用问题最少的 dts-bundle-generator 进行开发演示，请先安装到 hello-lib 项目的 devDependencies ：

```bash
npm i -D dts-bundle-generator
```

dts-bundle-generator 支持在 package.json 里配置一个 script ，通过命令的形式在命令行生成 DTS Bundle ，也支持通过 JavaScript / TypeScript 编写函数来执行文件的生成，鉴于实际开发过程中使用函数生成 DTS Bundle 的场景比较多（例如 Monorepo 会有生成多个 Bundle 的使用场景），因此这里以函数的方式进行演示。

:::tip
在使用 Git 等版本控制系统时，如果多个独立项目之间有关联，会把这些项目的代码都存储在同一个代码仓库集中管理，此时这个大型代码仓库就被称之为 Monorepo （其中 Mono 表示单一， Repo 是存储库 Repository 的缩写），当下许多大型项目都基于这种方法管理代码， [Vue 3](https://github.com/vuejs/core) 在 GitHub 的代码仓库也是一个 Monorepo 。
:::

请在 hello-lib 的根目录下，创建一个与 src 源码目录同级的 scripts 目录，用来存储源码之外的脚本函数。

将以下代码保存到 scripts 目录下，命名为 buildTypes.mjs ：

```js
// scripts/buildTypes.mjs
import { writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { generateDtsBundle } from 'dts-bundle-generator'

async function run() {
  // 默认情况下 `.mjs` 文件需要自己声明 __dirname 变量
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  // 获取项目的根目录路径
  const rootPath = resolve(__dirname, '..')

  // 添加构建选项
  // 插件要求是一个数组选项，支持多个入口文件
  const options = [
    {
      filePath: resolve(rootPath, `./src/index.ts`),
      output: {
        noBanner: true,
      },
    },
  ]

  // 生成 DTS 文件内容
  // 插件返回一个数组，返回的文件内容顺序同选项顺序
  const dtses = generateDtsBundle(options, {
    preferredConfigPath: resolve(rootPath, `./tsconfig.json`),
  })
  if (!Array.isArray(dtses) || !dtses.length) return

  // 将 DTS Bundle 的内容输出成 `.d.ts` 文件保存到 dist 目录下
  // 当前只有一个文件要保存，所以只取第一个下标的数据
  const dts = dtses[0]
  const output = resolve(rootPath, `./dist/index.d.ts`)
  writeFileSync(output, dts)
}
run().catch((e) => {
  console.log(e)
})
```

接下来打开 hello-lib 的 package.json 文件，添加一个 `build:types` 的 script ，并在 `build` 命令中通过 `&&` 符号设置为继发执行任务，当前所有的 scripts 如下：

```json
{
  "scripts": {
    "build": "vite build && npm run build:types",
    "build:types": "node scripts/buildTypes.mjs"
  }
}
```

:::tip
继发执行：只有前一个任务执行成功，才继续执行下一个任务，任务与任务之间使用 `&&` 符号连接。
:::

接下来再运行 `npm run build` 命令，将在执行完 Vite 的 build 任务之后，再继续执行 DTS Bundle 的文件生成，可以看到现在的 dist 目录变成了如下，只会生成一个 `.d.ts` 文件：

```bash{4}
hello-lib
└─dist
  ├─index.cjs
  ├─index.d.ts
  ├─index.min.js
  └─index.mjs
```

现在 index.d.ts 文件已经集合了源码目录下所有的 TS 类型，变成了如下内容：

```ts
// dist/index.d.ts
/**
 * 生成随机数
 * @param min - 最小值
 * @param max - 最大值
 * @param roundingType - 四舍五入类型
 * @returns 范围内的随机数
 */
export declare function getRandomNumber(
  min?: number,
  max?: number,
  roundingType?: 'round' | 'ceil' | 'floor'
): number
/**
 * 生成随机布尔值
 */
export declare function getRandomBoolean(): boolean

export {}
```

对于大型项目，将 DTS 文件集合为 Bundle 输出是一种主流的管理方式，非常建议使用这种方式来为 npm 包生成类型文件。

### 添加说明文档

作为一个完整的 npm 包，应该配备一份操作说明给使用者阅读，复杂的文档可以使用 VitePress 等文档程序独立部署，而简单的项目则只需要完善一份 README 即可。

请创建一个名为 README\.md 的 Markdown 文件在项目根目录下，与 src 源码目录同级，该文件的文件名 README 推荐使用全大写，这是开源社区主流的命名方式，全大写的原因是为了与代码文件进行直观的区分。

编写 README 使用的 Markdown 是一种轻量级标记语言，可以使用易读易写的纯文本格式编写文档，以 `.md` 作为文件扩展名，当代码托管到 GitHub 仓库或者发布到 npmjs 等平台时， README 文件会作为项目的主页内容呈现。

为了方便学习，这里将一些常用的 Markdown 语法与 HTML 代码对比如下，可以看到书写方面非常的简洁：

|           Markdown 代码           |                     HTML 代码                      |
| :-------------------------------: | :------------------------------------------------: |
|           `# 一级标题`            |                `<h1>一级标题</h1>`                 |
|           `## 二级标题`           |                `<h2>二级标题</h2>`                 |
|          `### 三级标题`           |                `<h3>三级标题</h3>`                 |
|          `**加粗文本**`           | `<span style="font-weight: bold;">加粗文本</span>` |
| `[链接文本](https://example.com)` |    `<a href="https://example.com">链接文本</a>`    |

更多的 Markdown 语法建议在 [Markdown 教程网站](https://markdown.com.cn) 上学习。

下面附上一份常用的 README 模板：

```md
# 项目名称

写上项目用途的一句话简介。

## 功能介绍

1. 功能 1 一句话介绍
2. 功能 2 一句话介绍
3. 功能 3 一句话介绍

## 在线演示

如果有部署在线 demo ，可放上 demo 的访问地址。

## 安装方法

使用 npm ： `npm install package-name`

使用 CDN ： `https://example.com/package-name`

## 用法

告诉使用者如何使用 npm 包。

## 插件选项

如果 npm 包是一个插件，并支持传递插件选项，在这里可以使用表格介绍选项的作用。

| 选项名称 |  类型  |    作用    |
| :------: | :----: | :--------: |
|   foo    | string | 一句话介绍 |
|   bar    | number | 一句话介绍 |

更多内容请根据实际情况补充。
```

拥有完善的使用说明文档，会让 npm 包更受欢迎！

### 发布 npm 包

一个 npm 包开发完毕后，就可以进入发布阶段了，这一小节将讲解如何注册 npm 账号并发布到 npmjs 平台上供其他开发者下载使用。

:::tip
在操作 npm 包发布之前，请先运行 `npm config rm registry` 命令取消 npm 镜像源的绑定，否则会发布失败，在 npm 包发布后，可以再重新 [配置镜像源](guide.md#配置镜像源) 。
:::

#### 注册 npm 账号

在发布 npm 包之前，请先在 npm 官网上注册一个账号：[点击注册](https://www.npmjs.com/signup) 。

接下来需要在命令行上登录该账号以操作发布命令，打开命令行工具，输入以下命令进行登录：

```bash
npm login
```

按照命令行的提示输入在 npmjs 网站上注册的账号和密码即可完成登录，可以通过以下命令查看当前登录的账号名称，验证是否登录成功：

```bash
npm whoami
```

在登录成功之后，命令行会记住账号的登录状态，以后的操作就无需每次都执行登录命令了。

:::tip
以上操作也可以实用 `npm adduser` 命令代替，直接在命令行完成注册和登录。
:::

#### 将包发布到 npmjs

在 npm 上发布私有包需要进行付费，因此这里只使用公共包的发布作为演示和讲解，如果开发的是公司内部使用的 npm 包，只要源代码是私有仓库，也可以使用这种方式来发布，当前在这样做之前请先获得公司的同意。

对于一个普通命名的包，要发布到 npmjs 上非常简单，只需要执行 npm 包管理器自带的一个命令即可：

```bash
npm publish
```

它默认会将这个包作为一个公共包发布，如果包名称合法并且没有冲突，则发布成功，可以在 [npmjs](https://www.npmjs.com) 查询到，否则会返回错误信息告知原因，如果因为包名冲突导致的失败，可以尝试修改别的名称再次发布。

如果打算使用像 [@vue/cli](https://www.npmjs.com/package/@vue/cli) 、 [@vue/compiler-sfc](https://www.npmjs.com/package/@vue/compiler-sfc) 这样带有 @scope 前缀的作用域包名，需要先在 npmjs 的 [创建新组织](https://www.npmjs.com/org/create) 页面创建一个组织，或者确保自己拥有 @scope 对应的组织发布权限。

@scope 作用域包默认会作为私有包发布，因此在执行发布命令的时候还需要加上一个 `--access` 选项，将其指定为 `public` 允许公开访问才可以发布成功：

```bash
npm publish --access public
```

当前的 hello-lib 项目已发布到 npmjs ，可以查看该包的主页 [@learning-vue3/lib](https://www.npmjs.com/package/@learning-vue3/lib) ，也可以通过 npm 安装到项目里使用了：

```bash
npm i @learning-vue3/lib
```

并且发布到 npmjs 上的包，都同时获得热门 CDN 服务的自动同步，可以通过包名称获取到 CDN 链接并通过 `<script />` 标签引入到 HTML 页面里：

```bash
# 使用 jsDelivr CDN
https://cdn.jsdelivr.net/npm/@learning-vue3/lib

# 使用 UNPKG CDN
https://unpkg.com/@learning-vue3/lib
```

此时 CDN 地址对应的 npm 包文件内容，就如前文所述，调用了 package.json 里 browser 字段指定的 UMD 规范文件 `dist/index.min.js` 。

#### 给 npm 包打 Tag

细心的开发者还会留意到，例如像 Vue 这样的包，在 npmjs 上的 [版本列表](https://www.npmjs.com/package/vue?activeTab=versions) 里有 Current Tags 和 Version History 的版本分类，其中 Version History 是默认的版本发布历史列表，而 Current Tags 则是在发布 npm 包的时候指定打的标签。

<ClientOnly>
  <ImgWrap
    src="/assets/img/vue-versions-on-npmjs.jpg"
    alt="Vue 在 npmjs 上的版本列表"
  />
</ClientOnly>

标签的好处是可以让使用者无需记住对应的版本号，而是使用一些更具备语义化的单词来安装指定版本，例如：

```bash
# 安装最新版的 Vue 3 ，即截图里对应的 3.2.40 版本
npm i vue@latest

# 安装最新版的 Vue 2 ，即截图里对应的 2.7.10 版本
npm i vue@v2-latest

# 如果后续有功能更新的测试版，也可以通过标签安装
npm i vue@beta
```

除了减少寻找版本号的麻烦外，一旦后续有版本更新，再次使用相同的标签安装，可以重新安装到该标签对应的最新版本，例如从 `1.0.0-beta.1` 升级到 `1.0.0-beta.2` ，可以使用 `@beta` 标签再次安装来达到升级的目的。

在标签列表里，有一个 `latest` 的标签是发布 npm 包时自带的，对应该包最新的正式版本，安装 npm 包时如果不指定标签，则默认使用 `latest` 标签，以下两个安装操作是等价的：

```bash
# 隐式安装 latest 标签对应的版本
npm i vue

# 显式安装 latest 标签对应的版本
npm i vue@latest
```

同样的，当发布 npm 包时不指定标签，则该版本也会在发布后作为 `@latest` 标签对应的版本号。

其他标签则需要在发布时配合发布命令，使用 `--tag` 作为选项手动指定，以下命令将为普通包打上名为 `alpha` 的 Tag ：

```bash
npm publish --tag alpha
```

同理，如果是 @scope 作用域包也是在使用 `--access` 选项的情况下，继续追加一条 `--tag` 选项指定包的标签。

```bash
npm publish --access public --tag alpha
```

:::tip
请注意，如果是 Alpha 或者 Beta 版本，通常会在版本号上增加 `-alpha.0` 、 `-alpha.1` 这样的 [版本标识符](guide.md#版本标识符)，以便在发布正式版本的时候可以使用无标识符的相同版本号，以保证版本号在遵循 [升级规则](guide.md#基本格式与升级规则) 下的连续性。
:::

<!-- 评论 -->
<ClientOnly>
  <GitalkComment
    :issueId="48"
  />
</ClientOnly>
<!-- 评论 -->
