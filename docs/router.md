---
outline: 'deep'
---

# 路由的使用

在传统的 Web 开发过程中，当需要实现多个站内页面时，以前需要写很多个 html 页面，然后通过 a 标签来实现互相跳转。

在如今 SPA 当道的时代，像 Vue 工程，可以轻松的通过配置一个生态组件，来实现只用一个 html ，却能够完成多个站内页面渲染、跳转的功能。

这个生态组件，就是路由。

:::tip
从这里开始，所有包含到 .vue 文件引入的地方，可能会看到 `@xx/xx.vue` 这样的写法。

`@views` 是 `src/views` 的路径别名，`@cp` 是 `src/components` 的路径别名。

路径别名可以在 `vue.config.js` 里配置 `alias`，点击了解：[添加项目配置](upgrade.md#添加项目配置)
:::

## 路由的目录结构

3.x 引入路由的方式和 2.x 一样，如果也是在创建 Vue 项目的时候选择了带上路由，那么会自动帮在 `src` 文件夹下创建如下的目录结构。

如果创建时没有选择，那么也可以按照这个结构自己创建对应的文件。

```
src
├─router
├───index.ts
├───routes.ts
└─main.ts
```

其中 `index.ts` 是路由的入口文件，系统安装的时候也只有这个文件，`routes.ts` 是笔者加的，主要用于集中管理路由，`index.ts` 只用于编写路由的创建、拦截等逻辑功能。

因为大型项目来说，路由树是很粗壮的，往往需要配置上二级、三级路由，逻辑和配置都放到一个文件的话，太臃肿了。

:::tip
需要注意的是，与 Vue 3 配套的路由版本是 vue-router 4.x 以上，也就是如果一开始创建没有选择路由的话，后续自己安装，需要选择 `vue-router@4` 或者 `vue-router@latest` 才可以正确匹配。
:::

## 在项目里引入路由

不管是 Vue 2 还是 Vue 3 ，引入路由都是在 `index.js` / `index.ts` 文件里，但是版本升级带来的变化很大，由于的 Vue 3.0 是写 TypeScript ，所以这里只做一个 TS 的变化对比。

### 回顾 Vue 2

Vue 2 的引入方式如下（其中 `RouteConfig` 是路由项目的 TS 类型定义）。

```ts
import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  // ...
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
```

里面一些选项的功能说明：

1. `routes` 是路由树的配置，当的路由很粗壮的时候可以集中到 `routes.ts` 管理然后再 `import` 进来（具体的配置请看后面的 [路由配置部分](#路由的基础配置) 说明）。

2. `mode` 决定访问路径模式，可配置为 `hash` 或者 `history`，hash 模式是这种 `http://abc.com/#/home` 这样带 # 号的地址，支持所有浏览器，history 模式是 `http://abc.com/home` 这样不带 # 号，不仅美观，而且体验更好，但需要服务端做一些配置支持，也只对主流浏览器支持。

相关阅读：[后端配置例子 - HTML5 History 模式](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90)

3. `base` 是 history 模式在进行路由切换时的基础路径，默认是 `/` 根目录，如果的项目不是部署在根目录下，而是二级目录、三级目录等多级目录，就必须指定这个 base ，不然路由切换会有问题。

### 了解 Vue 3 ~new

Vue 3 的引入方式如下（其中 `RouteRecordRaw` 是路由项目的 TS 类型定义）。

```ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  // ...
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
```

在 Vue 3 （也就是 vue-router 4.x） 里，路由简化了一些配置项，里面一些选项的功能说明：

1. `routes` 和 2.x 一样，是路由树的配置。

2. `history` 和 2.x 有所不同，在 3.x ，使用 `history` 来代替 2.x 的 `mode` ，但功能是一样的，也是决定访问路径模式是 `hash` 模式 还是 `history` 模式，同时合并了 Vue 2 （也就是 vue-router 3.x） 的 `base` 选项作为模式函数的入参。

:::tip
当然，和在使用 Vue 2 的时候一样，还可以配置一些额外的路由选项。
:::

比如：指定 `router-link` 针对活动路由所匹配的 `className` :

```ts
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkActiveClass: 'cur',
  linkExactActiveClass: 'cur',
  routes,
})
```

更多的配置项可以参考官网： [RouterOptions - Vue Router](https://next.router.vuejs.org/api/#routeroptions)

## 路由树的配置

在 [引入路由](#在项目里引入路由) 部分有说到，当的路由很粗壮的时候，可以集中到 `routes.ts` 管理然后再 `import` 到 `index.ts` 里。

暂且把 `routes.ts` 这个文件称为“路由树”，因为它像一棵大树一样，不仅可以以一级路由为树干去生长，还可以添加二级、三级等多级路由来开枝散叶。

那来看看 `routes.ts` 应该怎么写：

### 基础格式 ~new

在 TS 里，路由文件的基础格式由三个部分组成：

```ts
// TS需要引入每个路由的类型定义
import { RouteRecordRaw } from 'vue-router'

// 定义一个路由数组
const routes: Array<RouteRecordRaw> = [
  // ...
]

// 暴露定义好的路由数据
export default routes
```

之后就可以在 `index.ts` 里导入使用了。

那么里面的路由数组又是怎么写呢？这里就涉及到了 [一级路由](#一级路由) 和 [多级路由](#多级路由) 的编写。

### 公共路径

在配置路由之前，需要先了解公共路径（publicPath）的概念，在 [添加项目配置](upgrade.md#添加项目配置) 部分，里面有一个参数，叫 `publicPath`，其实就是用来控制路由的公共路径，那么它有什么用呢？

`publicPath` 的默认值是 `/`，也就是说，如果不配置它，那么所有的资源文件都是从域名根目录读取，如果的项目部署在域名根目录那当然好，但是如果不是呢？那么就必须来配置它了。

配置很简单，只要把项目要上线的最终地址，去掉域名，剩下的那部分就是 `publicPath` 。

:::tip
如果的路由只有一级，那么 `publicPath` 也可以设置为相对路径 `./`，这样可以把项目部署到任意地方。

如果路由不止一级，那么请准确的指定 `publicPath`，并且保证它是以 `/` 开头， `/` 结尾。
:::

假设的项目是部署在 `https://chengpeiquan.com/vue3/` ，那么 `publicPath` 就可以设置为 `/vue3/`。

通常开发环境，也就是本机 ip 访问的时候，都是基于根目录，但上线后的就不一定是根目录了，那么在 `vue.config.js` 里可以通过环境变量来指定不同环境使用不同的 `publicPath`。

```js
const IS_DEV = process.env.NODE_ENV === 'development' ? true : false

module.exports = {
  publicPath: IS_DEV ? '/' : '/vue3/',
}
```

### 一级路由

一级路由，顾名思义，就是在的项目地址后面，只有一级 path，比如 `https://chengpeiquan.com/home` 这里的 `home` 就是一级路由。

来看一下最基本的路由配置应该包含哪些字段：

```ts
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@views/home.vue'),
  },
]
```

1. `path` 是路由的访问路径，像上面说的，如果的域名是 `https://chengpeiquan.com/`， 配置为 `/home`，那么访问路径就是 `https://chengpeiquan.com/home`

:::tip
一级路由的 path 都必须是以 `/` 开头，比如： `/home`、`/setting`；

如果的项目首页不想带上 `home` 之类的尾巴，只想要 `https://chengpeiquan.com/` 这样的域名直达 ，其实也是配置一级路由，只需要把路由的 `path` 指定为 `/` 即可。
:::

2. `name` 是路由的名称，非必填，但是一般都会配置上去，这样可以很方便的通过 `name` 来代替 `path` 实现路由的跳转，因为像有时候的开发环境和生产环境的路径不一致，或者说路径变更，通过 `name` 无需调整，但如果通过 `path`，可能就要修改很多文件里面的链接跳转目标了。

3. `component` 是路由的模板文件，指向一个 vue 组件，用于指定路由在浏览器端的视图渲染，这里有两种方式来指定使用哪个组件：

#### 同步组件

字段 `component` 接收一个变量，变量的值就是对应的模板组件。

在打包的时候，会把组件的所有代码都打包到一个文件里，对于大项目来说，这种方式的首屏加载是个灾难，要面对文件过大带来等待时间变长的问题。

```ts
import Home from '@/components/home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
]
```

所以现在都推荐使用第二种方式，可以实现 **路由懒加载** 。

#### 异步组件

字段 `component` 接收一个函数，在 return 的时候返回模板组件，同时还可以指定要生成的 chunk，组件里的代码都会生成独立的文件，按需引入。

```ts
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@views/home.vue'),
  },
]
```

关于这部分的更多说明，可以查看 [路由懒加载](#路由懒加载)。

### 多级路由

在 Vue 路由生态里，支持配置二级、三级、四级等多级路由，理论上没有上限，实际业务中用到的级数通常是三级到四级。

比如做一个美食类网站，打算在 “中餐” 大分类下配置一个 “饺子” 栏目，那么地址就是：

```
https://chengpeiquan.com/chinese-food/dumplings
```

这种情况下，中餐 `chinese-food` 就是一级路由，饺子 `dumplings` 就是二级路由。

如果想再细化一下，“饺子” 下面再增加一个 “韭菜” 、“白菜” 等不同馅料的子分类：

```
https://chengpeiquan.com/chinese-food/dumplings/chives
```

这里的韭菜 `chives` 就是饺子 `dumplings` 的子路由，也就是三级路由。

在了解了子路由的概念后，来看一下具体如何配置，以及注意事项。

:::tip
父子路由的关系，都是严格按照 JSON 的层级关系，子路由的信息配置到父级的 `children` 数组里面，孙路由也是按照一样的格式，配置到子路由的 `children` 里。
:::

这是一个简单的子路由示范：

```ts
const routes: Array<RouteRecordRaw> = [
  // 注意：这里是一级路由
  {
    path: '/lv1',
    name: 'lv1',
    component: () => import(/* webpackChunkName: "lv1" */ '@views/lv1.vue'),
    // 注意：这里是二级路由
    children: [
      {
        path: 'lv2',
        name: 'lv2',
        component: () => import(/* webpackChunkName: "lv2" */ '@views/lv2.vue'),
        // 注意：这里是三级路由
        children: [
          {
            path: 'lv3',
            name: 'lv3',
            component: () =>
              import(/* webpackChunkName: "lv3" */ '@views/lv3.vue'),
          },
        ],
      },
    ],
  },
]
```

最终线上的访问地址，比如要访问三级路由：

```
https://chengpeiquan.com/lv1/lv2/lv3
```

### 路由懒加载

在上面提过，路由在配置 [同步组件](#同步组件) 的时候，构建出来的文件都集中在一起，大的项目的文件会变得非常大，影响页面加载。

所以 Vue 在 Webpack 的代码分割功能的基础上，推出了 [异步组件](#异步组件)，可以把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样按需载入，很方便的实现路由组件的懒加载。

在这一段配置里面：

```ts
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@views/home.vue'),
  },
]
```

起到懒加载配置作用的就是 `component` 接收的值：

```ts
;() => import(/* webpackChunkName: "home" */ '@views/home.vue')
```

其中 `@views/home.vue` 不必说，就是路由的组件。

而前面的“注释” `/* webpackChunkName: "home" */` 起到的作用就是为切割后的代码文件命名。

在命令行对项目执行 `npm run build` 打包，构建后，会看到控制台输出的打包结果：

```
File                                        Size                    Gzipped

dist\static\js\chunk-vendors.1fd4afd3.js    137.27 KiB              48.66 KiB
dist\static\js\login.730a2ef8.js            69.65 KiB               23.06 KiB
dist\static\js\app.82ec2bee.js              4.32 KiB                1.94 KiB
dist\static\js\home.5988a746.js             1.00 KiB                0.54 KiB
dist\static\js\about.a73d5b8f.js            0.38 KiB                0.28 KiB
dist\static\css\login.f107fbdb.css          0.33 KiB                0.19 KiB
dist\static\css\home.12026f88.css           0.13 KiB                0.13 KiB
dist\static\css\app.b1cc4f11.css            0.04 KiB                0.06 KiB
```

而如果不使用路由懒加载，build 出来的文件是这样的：

```
File                                        Size                    Gzipped

dist\static\js\chunk-vendors.389391d2.js    203.98 KiB              71.02 KiB
dist\static\js\app.634c584f.js              6.56 KiB                2.40 KiB
dist\static\css\app.beea0177.css            0.41 KiB                0.23 KiB
```

单纯看 js 文件：

使用代码切割，当访问 `home` 路由的时候，分割后首次会加载 `app`、`chunk-vendors`、`home` 这 3 个文件，加起来 142.59k。

而不分割则需要加载 210.54k，整整多出接近 50%的体积，这只是一个非常小的 demo，大型项目会更夸张！

两者哪个更适合大项目，高下立见！！！

## 路由的渲染

所有路由组件，要在访问后进行渲染，都必须在父级组件里带有 `<router-view />` 标签。

`<router-view />` 在哪里，路由组件的代码就渲染在哪个节点上。

一级路由的父级组件，当然就是 `src` 下的 `App.vue`。

**最基础的配置**：

最简单的基础格式，就是 `template` 里面直接就是 `<router-view />` ，整个页面就是路由组件。

```vue
<template>
  <router-view />
</template>
```

**带有全局的公共组件**：

比如有全站统一的页头、页脚，只有中间区域才是路由。

```vue
<template>
  <!-- 全局页头 -->
  <Header />

  <!-- 路由 -->
  <router-view />

  <!-- 全局页脚 -->
  <Footer />
</template>
```

**部分路由全局，部分路由带公共组件**：

比如大部分页面都需要有侧边栏，但登录页、注册页不能带。

```vue
<template>
  <!-- 登录 -->
  <Login v-if="route.name === 'login'" />

  <!-- 注册 -->
  <Register v-else-if="route.name === 'register'" />

  <!-- 带有侧边栏的其他路由 -->
  <div v-else>
    <!-- 固定在左侧的侧边栏 -->
    <Sidebar />

    <!-- 路由 -->
    <router-view />
  </div>
</template>
```

## 使用 route 获取路由信息 ~new

和 2.x 可以直接在组件里使用 `this.$route` 来获取当前路由信息不同，在 3.x 的组件里，Vue 实例既没有了 `this`，也没有了 `$route`。

要牢记一个事情就是，3.x 用啥都要导入，所以，获取当前路由信息的正确用法是：

**1、导入路由组件**

```ts
import { useRoute } from 'vue-router'
```

**2、定义路由变量**

刚刚导入的 `useRoute` 是一个函数，需要在 `setup` 里定义一个变量来获取路由信息。

```ts
const route = useRoute()
```

**3、读取路由信息**

接下来就可以通过定义好的变量 `route` 去获取当前路由信息了。

当然，如果要在 `template` 里使用路由，记得把 `route` 在 `setup` 里 return 出去。

```ts
// 获取路由名称
console.log(route.name)

// 获取路由参数
console.log(route.params.id)
```

3.x 的 `route` 和 2.x 的用法基本一致，日常使用应该很快能上手。

:::warning
但是 3.x 的新路由也有一些小变化，有一些属性是被移除了，比如之前获取父级路由信息，很喜欢用的 `parent` 属性，现在已经没有了 [点击查看原因](https://next.router.vuejs.org/guide/migration/index.html#passing-content-to-route-components-slot) 。
:::

类似被移除的 `parent` ，如果要获取父级路由信息（比如在做面包屑功能的时候），可以改成下面这样，手动指定倒数第二个为父级信息：

```ts
// 获取路由记录
const MATCHED = route.matched

// 获取该记录的路由个数
const LEN = MATCHED.length

// 获取倒数第二个路由（也就是当前路由的父级路由）
const ROUTE_PARENT = MATCHED[LEN - 2]
```

如果有配置父级路由，那么刚刚的 `ROUTE_PARENT` 就是父级路由信息了

## 使用 router 操作路由 ~new

和 `route` 一样，在 3.x 也不再存在 `this.$router` ，也必须通过导入路由组件来使用。

**1、导入路由组件**

```ts
import { useRouter } from 'vue-router'
```

**2、定义路由变量**

和 `useRoute` 一样， `useRouter` 也是一个函数，需要在 `setup` 里定义一个变量来获取路由信息。

```ts
const router = useRouter()
```

**3、操作路由**

接下来就可以通过定义好的变量 `router` 去操作路由了。

```ts
// 跳转首页
router.push({
  name: 'home',
})

// 返回上一页
router.back()
```

## 使用 router-link 标签跳转

`router-link` 是一个路由组件，可直接在 `template` 里使用，基础的用法在 2.x 和 3.x 一样。

默认会被转换为一个 `a` 标签，对比写死的 `<a href="...">` ，使用 `router-link` 会更加灵活。

### 基础跳转

最基础的用法就是把它当成一个 `target="_self"` 的 a 标签使用，但无需重新刷新页面，因为是路由跳转，它的体验和使用 `router` 去进行路由导航的效果完全一样。

```vue
<template>
  <router-link to="/home">首页</router-link>
</template>
```

等价于 `router` 的 `push`：

```ts
router.push({
  name: 'home',
})
```

可以写个 `span` 然后绑定 `click` 事件来达到 `router-link` 的效果（但看是不是麻烦很多 emm…

```vue
<template>
  <span
    class="link"
    @click="
      router.push({
        name: 'home',
      })
    "
  >
    首页
  </span>
</template>
```

### 带参数的跳转

使用 `router` 的时候，可以轻松的带上参数去那些有 id 的内容页、用户资料页、栏目列表页等等。

比如要访问一篇文章 `https://chengpeiquan.com/article/123` ，用 `push` 的写法是：

```ts
router.push({
  name: 'article',
  params: {
    id: 123,
  },
})
```

同理，从基础跳转的写法，很容易就能 get 到在 `router-link` 里应该怎么写：

```vue
<template>
  <router-link
    class="link"
    :to="{
      name: 'article',
      params: {
        id: 123,
      },
    }"
  >
    这是文章的标题
  </router-link>
</template>
```

### 不生成 a 标签 ~new

`router-link` 默认是被转换为一个 `a` 标签，但根据业务场景，也可以把它指定为生成其他标签，比如 `span` 、 `div` 、 `li` 等等，这些标签因为不具备 `href` 属性，所以在跳转时都是通过 `click` 事件去执行。

在 2.x，指定为其他标签只需要一个 `tag` 属性即可：

```vue
<template>
  <router-link tag="span" to="/home">首页</router-link>
</template>
```

但在 3.x ，`tag` 属性已被移除，需要通过 `custom` 和 `v-slot` 的配合来渲染为其他标签。

比如要渲染为一个带有路由导航功能的 `div`：

```vue
<template>
  <router-link to="/home" custom v-slot="{ navigate }">
    <span class="link" @click="navigate"> 首页 </span>
  </router-link>
</template>
```

渲染后就是一个普通的 `span` 标签，当点击的时候，它会通过路由的导航把带到指定的路由页：

```html
<span class="link">首页</span>
```

关于这 2 个属性，他们的参数说明如下：

1. `custom` ，一个布尔值，用于控制是否需要渲染为 `a` 标签，当不包含 `custom` 或者把 `custom` 设置为 `false` 时，则依然使用 `a` 标签渲染。

2. `v-slot` 是一个对象，用来决定标签的行为，它包含了：

| 字段          | 含义                                                                   |
| :------------ | :--------------------------------------------------------------------- |
| href          | 解析后的 URL，将会作为一个 `a` 元素的 `href` 属性                      |
| route         | 解析后的规范化的地址                                                   |
| navigate      | 触发导航的函数，会在必要时自动阻止事件，和 `router-link` 同理          |
| isActive      | 如果需要应用激活的 `class` 则为 `true`，允许应用一个任意的 `class`     |
| isExactActive | 如果需要应用精确激活的 `class` 则为 `true`，允许应用一个任意的 `class` |

一般来说，`v-slot` 必备的只有 `navigate` ，用来绑定元素的点击事件，否则元素点击后不会有任何反应，其他的可以根据实际需求来添加。

:::tip
要渲染为非 `a` 标签，切记两个点：

1. `router-link` 必须带上 `custom` 和 `v-slot` 属性

2. 最终要渲染的标签，写在 `router-link` 里，包括对应的 `className` 和点击事件
   :::

## 在独立 TS/JS 文件里使用路由

除了可以在 `.vue` 文件里使用路由之外，也可以在单独的 `.ts`、`.js` 里使用。

比如要做一个带有用户系统的站点，登录的相关代码除了在 `login.vue` 里运用外，在注册页面 `register.vue`，用户注册成功还要帮用户执行一次自动登录。

登录完成还要记录用户的登录信息、 Token 、过期时间等等，有不少数据要做处理，以及需要帮助用户自动切去登录前的页面等行为，这是两个不同的组件，如果写两次几乎一样的代码，会大大提高维护成本。

这种情况下就可以通过抽离核心代码，封装成一个 `login.ts` 文件，在这个独立的 `ts` 文件里去操作路由。

```ts
// 导入路由
import router from '@/router'

// 执行路由跳转
router.push({
  name: 'home',
})
```

## 路由元信息配置

有时候的项目需要一些个性化配置，比如：

1. 每个路由给予独立的标题；

2. 管理后台的路由，部分页面需要限制一些访问权限；

3. 通过路由来自动生成侧边栏、面包屑；

4. 部分路由的生命周期需要做缓存（keep alive）;

5. and so on……

无需维护很多套配置，**定义路由的时候可以配置 meta 字段**，比如下面就是包含了多种元信息的一个登录路由：

```ts
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@views/login.vue'),
    meta: {
      title: '登录',
      isDisableBreadcrumbLink: true,
      isShowBreadcrumb: false,
      addToSidebar: false,
      sidebarIcon: '',
      sidebarIconAlt: '',
      isNoLogin: true,
    },
  },
]
```

这个是笔者在做后台的时候的一些配置，主要的功能是：

| 字段                    | 类型    | 含义                                                                   |
| :---------------------- | :------ | :--------------------------------------------------------------------- |
| title                   | String  | 用于在渲染的时候配置浏览器标题；                                       |
| isDisableBreadcrumbLink | Boolean | 是否禁用面包屑链接（对一些没有内容的路由可以屏蔽访问）；               |
| isShowBreadcrumb        | Boolean | 是否显示面包屑（此处的登录页不需要面包屑）；                           |
| addToSidebar            | Boolean | 是否加入侧边栏（此处的登录页不需要加入侧边栏）；                       |
| sidebarIcon             | String  | 配置侧边栏的图标 className（默认）；                                   |
| sidebarIconAlt          | String  | 配置侧边栏的图标 className（展开状态）；                               |
| isNoLogin               | Boolean | 是否免登录（设置为 true 后，会校验登录状态，此处的登录页不需要校验）； |

这些功能都是在项目里需要操控到路由的功能，通过这样的一些字段来达到路由的控制。

:::tip
路由 `meta` 字段的内容没有要求，按需配置，一些功能可以配合 [路由拦截](#路由拦截) 一起使用。
:::

类似的，如果有其他需求，比如要增加对不同用户组的权限控制（比如有管理员、普通用户分组，部分页面只有管理员允许访问），都可以通过路由元信息来配置，然后在对应的地方进行读取操作。

## 路由重定向

这个是的老朋友了，路由重定向是使用一个 `redirect` 字段，配置到对应的路由里面去实现跳转。

:::tip
通常来说，配置了 `redirect` 的路由，只需要指定 2 个字段即可，1 个是 `path` 自己的路径，1 个是 `redirect` 目标路由的路径，其他诸如 `name`、`component` 等字段可以忽略，因为根本不会访问到。
:::

`redirect` 字段可以接收三种类型的值：

| 类型     | 填写的值                                                             |
| :------- | :------------------------------------------------------------------- |
| string   | 另外一个路由的 `path`                                                |
| route    | 另外一个路由（类似 `router.push`）                                   |
| function | 可以判断不同情况的重定向目标，最终 `return` 一个 `path` 或者 `route` |

### 业务场景

路由重定向可以避免用户访问到一些无效路由页面：

1. 比如项目上线了一段时间后，有个路由需要改名，或者调整路径层级，可以把旧路由重定向到新的，避免原来的用户从收藏夹等地方进来后找不到

2. 一些容易打错的地址，比如通常个人资料页都是用 `profile`，但是的这个网站是用 `account`，那也可以把 `profile` 重定向到 `account` 去

3. 对于一些有会员体系的站点，可以根据用户权限进行重定向，分别指向他们具备访问权限的页面

4. 官网首页在 PC 端、移动端、游戏内嵌横屏版分别有 3 套页面，但希望能通过主域名来识别不同设备，帮助用户自动切换访问

了解了业务场景，接下来就能比较清晰的了解应该如何配置重定向了。

### 配置为 path

最常用的场景，恐怕就是首页的指向了，比如首页地址是 `https://chengpeiquan.com/home`，但是想让主域名 `https://chengpeiquan.com/` 也能跳转到 `/home`，可以这么配置：

这是最简单的配置方式，把目标路由的 `path` 丢进来就可以了：

```ts
const routes: Array<RouteRecordRaw> = [
  // 重定向到home
  {
    path: '/',
    redirect: '/home',
  },
  // 真正的首页
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@views/home.vue'),
  },
]
```

但缺点也显而易见，只能针对那些不带参数的路由。

### 配置为 route

如果想要重定向后的路由地址带上一些参数，可以配置为 `route`：

```ts
const routes: Array<RouteRecordRaw> = [
  // 重定向到home，并带上一个query
  {
    path: '/',
    redirect: {
      name: 'home',
      query: {
        from: 'redirect',
      },
    },
  },
  // 真正的首页
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@views/home.vue'),
  },
]
```

最终访问的地址就是 `https://chengpeiquan.com/home?from=redirect`， 像这样带有来路参数的，就可以在 “百度统计” 或者 “CNZZ 统计” 之类的统计站点查看来路的流量。

### 配置为 function

结合业务场景来解释是最直观的，比如的网站有 3 个用户组，一个是管理员，一个是普通用户，还有一个是游客（未登录），他们的网站首页是不一样的。

管理员的首页具备各种数据可视化图表、最新的网站数据、一些最新的用户消息等等。

普通用户的首页可能只有一些常用模块的入口链接。

未登录用户则直接跳转到登录页面。

产品需要在访问网站主域名的时候，识别他们的身份来跳转不同的首页，那么就可以来配置的路由重定向了：

```ts
const routes: Array<RouteRecordRaw> = [
  // 访问主域名时，根据用户的登录信息，重定向到不同的页面
  {
    path: '/',
    redirect: () => {
      // LOGIN_INFO是当前用户的登录信息，可以从localStorage或者Vuex读取
      const GROUP_ID: number = LOGIN_INFO.groupId

      // 根据组别id进行跳转
      switch (GROUP_ID) {
        // 管理员，跳去仪表盘
        case 1:
          return '/dashboard'

        // 普通用户，跳去首页
        case 2:
          return '/home'

        // 其他都认为未登录，跳去登录页
        default:
          return '/login'
      }
    },
  },
]
```

## 路由别名配置

根据的业务需求，也可以为路由指定一个别名，与上面的 [路由重定向](#路由重定向) 功能相似，但又有不同：

配置了路由重定向，当用户访问 `/a` 时，URL 将会被替换成 `/b`，然后匹配的实际路由是 `/b` 。

配置了路由别名，`/a` 的别名是 `/b`，当用户访问 `/b` 时，URL 会保持为 `/b`，但是路由匹配则为 `/a`，就像用户访问 `/a` 一样。

**配置方法**

添加一个 `alias` 字段即可轻松实现：

```ts
const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    alias: '/index',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@views/home.vue'),
  },
]
```

如上的配置，即可实现可以通过 `/home` 访问首页，也可以通过 `/index` 访问首页。

## 404 路由页面配置 ~new

可以配置一个 404 路由来代替站内的 404 页面。

**配置方法**

```ts
const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '@views/404.vue'),
  },
]
```

这样配置之后，只要访问到不存在的路由，就会显示为这个 404 模板。

:::warning
新版的路由不再支持直接配置通配符 `*` ，而是必须使用带有自定义正则表达式的参数进行定义。

官方说明：[Removed \* (star or catch all) routes](https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes)
:::

## 导航守卫

和 2.x 时使用的路由一样， 3.x 也支持导航守卫，并且用法基本上是一样的。

导航守卫这个词对初次接触的同学来说应该会有点云里雾里，其实就是几个专属的钩子函数，先来看一下使用场景，大致理解一下这个东西是啥，有什么用。

### 钩子的应用场景

对于导航守卫还不熟悉的同学，可以从一些实际使用场景来加强印象，比如：

1. 前面说的，在渲染的时候配置浏览器标题，Vue 项目只要一个 Html 文件，默认只有一个标题，但想在访问 `home` 的时候标题显示为 “首页”，访问 `about` 的时候标题显示为 “关于”；

2. 部分页面需要管理员才能访问，普通用户不允许进入到该路由页面；

3. Vue 单页面项目，传统的 CNZZ/百度统计等网站统计代码只会在页面加载的时候统计一次，但需要每次切换路由都上报一次 PV 数据

场景，还有很多…

导航守卫支持全局使用，也可以在 `.vue` 文件里单独使用，来看下具体的用法。

### 路由里的全局钩子

顾名思义，是在创建 `router` 的时候进行全局的配置，也就是说，只要配置了钩子，那么所有的路由在调用到的时候，都会触发这些钩子函数。

| 可用钩子      | 含义         | 触发时机                                               |
| :------------ | :----------- | :----------------------------------------------------- |
| beforeEach    | 全局前置守卫 | 在路由跳转前触发                                       |
| beforeResolve | 全局解析守卫 | 在导航被确认前，同时在组件内守卫和异步路由组件被解析后 |
| afterEach     | 全局后置守卫 | 在路由跳转完成后触发                                   |

全局配置非常简单，在 `src/router/index.ts` 里，创建路由之后、在暴露出去之前使用：

```ts
import { createRouter } from 'vue-router'

// 创建路由
const router = createRouter({ ... })

// 在这里调用导航守卫的钩子函数
router.beforeEach((to, from) => {
  // ...
})

// 暴露出去
export default router
```

#### beforeEach ~new

全局前置守卫，这是导航守卫里面运用的最多的一个钩子函数，通常将其称为 “路由拦截”。

拦截这个词，顾名思义，就是在 XXX 目的达到之前，把它拦下来，所以路由的目的就是渲染指定的组件嘛，路由拦截就是在它渲染之前，做一些拦截操作。

**参数**

| 参数 | 作用                   |
| :--- | :--------------------- |
| to   | 即将要进入的路由对象   |
| from | 当前导航正要离开的路由 |

:::tip
和 2.x 不同，2.x 的 `beforeEach` 是默认三个参数，第三个参数是 `next`，用来操作路由接下来的跳转。

但在新版本路由里，已经通过 RFC 将其删除，虽然目前还是作为可选参数使用，但以后不确定是否会移除，不建议继续使用，[点击查看原因](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0037-router-return-guards.md#motivation)。

新版本路由可以通过 `return` 来代替 `next`。
:::

**用法**

比如在进入路由之前，根据 `meta` 信息，设定路由的网页标题：

```ts
router.beforeEach((to, from) => {
  const TITLE: string = to.meta.title
  document.title = TITLE || '默认title'
})
```

或者判断是否需要登录（需要在 [meta 信息](#路由元信息配置) 里配置相关的参数）：

```ts
router.beforeEach((to, from) => {
  if (to.meta && !to.meta.isNoLogin) {
    return '/login'
  }
})
```

或者针对一些需要 id 参数，但参数丢失的路由做拦截：

比如：文章详情页 `https://chengpeiquan/article/123` 这样的地址，是需要带有文章 id 的，如果只访问 `https://chengpeiquan/article` 则需要拦截掉。

这里是关于 `article` 路由的配置，是有要求 params 要带上 id 参数：

```ts
const routes: Array<RouteRecordRaw> = [
  // 这是一个配置了params，访问的时候必须带id的路由
  {
    path: '/article/:id',
    name: 'article',
    component: () =>
      import(/* webpackChunkName: "article" */ '@views/article.vue'),
  },
  // ...
]
```

当路由的 `params` 丢失的时候，路由记录 `matched` 是一个空数组，针对这样的情况，就可以配置一个拦截，丢失参数时返回首页：

```ts
router.beforeEach((to, from) => {
  if (to.matched.length === 0) {
    return '/'
  }
})
```

#### beforeResolve

全局解析守卫，它会在每次导航时触发，但是在所有组件内守卫和异步路由组件被解析之后，将在确认导航之前被调用。

这个钩子用的比较少，因为它和 `beforeEach` 非常相似，相信大部分同学都是会用 `beforeEach` 来代替它。

那么它有什么用？

它通常会用在一些申请权限的环节，比如一些 H5 页面需要申请系统相机权限、一些微信活动需要申请微信的登录信息授权，获得权限之后才允许获取接口数据和给用户更多的操作，使用 `beforeEach` 时机太早，使用 `afterEach` 又有点晚，那么这个钩子的时机就刚刚好。

**参数**

| 参数 | 作用                   |
| :--- | :--------------------- |
| to   | 即将要进入的路由对象   |
| from | 当前导航正要离开的路由 |

**用法**

以官网的一个申请照相机权限的例子来举例（[官网传送门](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%85%A8%E5%B1%80%E8%A7%A3%E6%9E%90%E5%AE%88%E5%8D%AB)）：

```ts
router.beforeResolve(async (to) => {
  // 如果路由配置了必须调用相机权限
  if (to.meta.requiresCamera) {
    // 正常流程，咨询是否允许使用照相机
    try {
      await askForCameraPermission()
    } catch (error) {
      // 容错
      if (error instanceof NotAllowedError) {
        // ... 处理错误，然后取消导航
        return false
      } else {
        // 如果出现意外，则取消导航并抛出错误
        throw error
      }
    }
  }
})
```

#### afterEach

全局后置守卫，这也是导航守卫里面用的比较多的一个钩子函数。

**参数**

| 参数 | 作用                   |
| :--- | :--------------------- |
| to   | 即将要进入的路由对象   |
| from | 当前导航正要离开的路由 |

**用法**

在刚刚的 [钩子的应用场景](#钩子的应用场景) 里面有个例子，就是每次切换路由都上报一次 PV 数据，类似这种每个路由都要执行一次，但又不必在渲染前操作的，都可以放到后置钩子里去执行。

笔者之前写过两个数据统计的插件：[Vue 版 CNZZ 统计](https://www.npmjs.com/package/vue-cnzz-analytics)、[Vue 版百度统计](https://www.npmjs.com/package/vue-baidu-analytics)，就是用的这个后置钩子来实现自动上报数据。

```ts
router.afterEach((to, from) => {
  // 上报流量的操作
  // ...
})
```

### 在组件内使用全局钩子

上面所讲的都是全局钩子，虽然一般都是在路由文件里使用，但如果有需要，也可以在 `.vue` 文件里操作。

:::tip
和路由的渲染不同，渲染是父级路由组件必须带有 `<router-view />` 标签才能渲染，但是使用全局钩子不受此限制。

建议只在一些入口文件里使用，比如 `App.vue` ，或者是一些全局的 `Header.vue`、`Footer.vue` 里使用，方便后续维护。
:::

在 `setup` 里，定义一个 `router` 变量获取路由之后，就可以操作了：

```ts
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    // 定义路由
    const router = useRouter()

    // 调用全局钩子
    router.beforeEach((to, from) => {
      // ...
    })
  },
})
```

### 路由里的独享钩子

介绍完全局钩子，如果只是有个别路由要做处理，可以使用 **路由独享的守卫** ，用来针对个别路由定制一些特殊功能，可以减少在全局钩子里面写一堆判断。

| 可用钩子    | 含义             | 触发时机         |
| :---------- | :--------------- | :--------------- |
| beforeEnter | 路由独享前置守卫 | 在路由跳转前触发 |

注：路由独享的钩子，必须配置在 `routes` 的 JSON 树里面，挂在对应的路由下面（与 `path`、 `name`、`meta` 这些字段同级）。

#### beforeEnter ~new

它和全局钩子 `beforeEach` 的作用相同，都是在进入路由之前触发，触发时机比 `beforeResolve` 要早。

顺序：`beforeEach`（全局） > `beforeEnter`（独享） > `beforeResolve`（全局）。

**参数**

| 参数 | 作用                   |
| :--- | :--------------------- |
| to   | 即将要进入的路由对象   |
| from | 当前导航正要离开的路由 |

:::tip
和 `beforeEach` 一样，也是取消了 `next`，可以通过 `return` 来代替。
:::

**用法**

比如：整个站点的默认标题都是 “项目经验 - 程沛权” 这样，以 “栏目标题” + “全站关键标题” 的格式作为网页的 title，但在首页的时候，想做一些不一样的定制。

```ts
const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@views/home.vue'),
    // 在这里添加单独的路由守卫
    beforeEnter: (to, from) => {
      document.title = '程沛权 - 养了三只猫'
    },
  },
]
```

就可以通过 `beforeEnter` 来实现一些个别路由的单独定制。

:::tip
需要注意的是，只有从不同的路由切换进来，才会触发该钩子。

针对同一个路由，但是不同的 params 或者 query、hash，都不会重复触发该钩子。

比如从 `https://chengpeiquan.com/article/123` 切换到 `https://chengpeiquan.com/article/234` 是不会触发的。
:::

其他的用法和 `beforeEach` 可以说是一样的。

### 组件内单独使用 ~new

组件里除了可以使用全局钩子外，还可以使用组件专属的路由钩子。

| 可用钩子            | 含义             | 触发时机                               |
| :------------------ | :--------------- | :------------------------------------- |
| onBeforeRouteUpdate | 组件内的更新守卫 | 在当前路由改变，但是该组件被复用时调用 |
| onBeforeRouteLeave  | 组件内的离开守卫 | 导航离开该组件的对应路由时调用         |

:::tip
1、组件内钩子的入参，也都是取消了 `next`，可以通过 `return` 来代替。

2、在 `setup` 里使用时，需要遵循 `Vue 3.0` 的规范要求，先 `import` 再操作。
:::

和旧版路由不同，新版的 `composition api` 移除了 `beforeRouteEnter` 这个钩子了（[查看详情](https://next.router.vuejs.org/guide/advanced/composition-api.html#accessing-the-router-and-current-route-inside-setup)）

#### onBeforeRouteUpdate

可以在当前路由改变，但是该组件被复用时，重新调用里面的一些函数用来更新模板数据的渲染。

**参数**

| 参数 | 作用                   |
| :--- | :--------------------- |
| to   | 即将要进入的路由对象   |
| from | 当前导航正要离开的路由 |

**用法**

比如一个内容网站，通常在文章详情页底部会有相关阅读推荐，这个时候就会有一个操作场景是，从文章 A 跳转到文章 B。

比如从 `https://chengpeiquan.com/article/111` 切去 `https://chengpeiquan.com/article/222` ，这种情况就属于 “路由改变，但是组件被复用” 的情况了。

这种情况下，原本放在 `onMounted` 里执行数据请求的函数就不会被调用，可以借助该钩子来实现渲染新的文章内容。

```ts
import { defineComponent, onMounted } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'

export default defineComponent({
  setup() {
    const route = useRoute()

    // 获取文章详情
    const getArticleDetail = (articleId: number): void => {
      // 请求文章内容
      // 此处略...
    }

    // 组件挂载完成后执行文章内容的请求
    onMounted(() => {
      const ARTICLE_ID: number = Number(route.params.id) || 0
      getArticleDetail(ARTICLE_ID)
    })

    // 组件被复用时重新请求新的文章内容（注意：要获取的是to的params）
    onBeforeRouteUpdate((to, from) => {
      const NEW_ARTICLE_ID: number = Number(to.params.id) || 0
      getArticleDetail(NEW_ARTICLE_ID)
    })
  },
})
```

#### onBeforeRouteLeave

可以在离开当前路由之前，实现一些离开前的判断拦截。

**参数**

| 参数 | 作用                   |
| :--- | :--------------------- |
| to   | 即将要进入的路由对象   |
| from | 当前导航正要离开的路由 |

**用法**

这个离开守卫通常用来禁止用户在还未保存修改前突然离开，可以通过 `return false` 来取消用户离开当前路由。

```ts
import { defineComponent } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

export default defineComponent({
  setup() {
    // 调用离开守卫
    onBeforeRouteLeave((to, from) => {
      // 弹出一个确认框
      const CONFIRM_TEXT: string = '确认要离开吗？您的更改尚未保存！'
      const IS_CONFIRM_LEAVE: boolean = window.confirm(CONFIRM_TEXT)

      // 当用户点取消时，不离开路由
      if (!IS_CONFIRM_LEAVE) {
        return false
      }
    })
  },
})
```

## 路由监听 ~new

路由的监听，可以延续以往的 `watch` 大法，也可以用全新的 `watchEffect`。

### watch

在 `Vue 2` 的时候，监听路由变化用的最多的就是 `watch` 了，`Vue 3` 的 `watch` 使用更简单。

**1. 监听整个路由**

可以跟以前一样，直接监听整个路由的变化：

```ts
import { defineComponent, watch } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  setup() {
    const route = useRoute()

    // 监听整个路由
    watch(route, (to, from) => {
      // 处理一些事情
      // ...
    })
  },
})
```

第一个参数传入整个路由；

第二个参数是个 callback，可以获取 to 和 from 来判断路由变化情况。

**2. 监听路由的某个数据**

如果只想监听路由的某个数据变化，比如监听一个 `query`，或者一个 `param`，可以采用这种方式：

```ts
import { defineComponent, watch } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  setup() {
    const route = useRoute()

    // 监听路由参数的变化
    watch(
      () => route.query.id,
      () => {
        console.log('监听到query变化')
      }
    )
  },
})
```

第一个参数传入一个函数，`return` 要监听的值；

第二个参数是个 callback，可以针对参数变化进行一些操作。

### watchEffect

这是 `Vue 3` 新出的一个监听函数，可以简化 `watch` 的行为。

比如定义了一个函数，通过路由的参数来获取文章 id，然后请求文章内容：

```ts
import { defineComponent, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  setup() {
    const route = useRoute()

    // 获取文章详情
    const getArticleDetail = (): void => {
      // 直接通过路由的参数来获取文章id
      const ARTICLE_ID: number = Number(route.params.id) || 0
      console.log('文章id是：', ARTICLE_ID)

      // 请求文章内容
      // 此处略...
    }

    // 直接监听包含路由参数的那个函数
    watchEffect(getArticleDetail)
  },
})
```

对比 `watch` 的使用， `watchEffect` 在操作上更加简单，把包含要被监听数据的函数，当成它的入参丢进去即可。

## 部署问题与服务端配置

通常使用路由的 Hash 模式，部署后有问题的情况很少，但是如果使用 History 模式，可能会遇到这样那样的问题。

### 常见部署问题

这里整理一些常见部署问题的原因分析和解决方案，可作参考。

#### 页面刷新就 404

页面部署到服务端之后，访问首页正常；通过导航上面的链接进行路由跳转，也正常；但是刷新页面就变成 404 了。

##### 问题原因

一般这种情况是路由开启了 History 模式，但是服务端没有配置功能支持。

##### 解决方案

请根据 [服务端配置](#服务端配置) 部分的说明，与的运维同事沟通，让他帮忙修改服务端的配置。

#### 部分路由白屏

如果在项目配置文件里，把里面的 [publicPath](https://cli.vuejs.org/zh/config/#publicpath) （使用 Vue CLI ） 或者 [base](https://cn.vitejs.dev/config/#base) （使用 Vite ） 配置成相对路径 `./` ，但是路由配置了二级或以上，那么就会出现这个问题。

##### 问题原因

原因是打包后的 JS 、 CSS 等静态资源都是存放在项目根目录下，一级路由的 `./` 就是根目录，所以访问正常；而二级路由的 `./` 则不是根目录了，是从当前目录载入的 ，这就导致无法正确载入 JS 文件，从而导致了白屏。

假设项目域名是 `https://example.com` ，那么：

- 一级路由是 `https://example.com/home`
- 二级路由是 `https://example.com/foo/bar`
- 假设打包后的 JS 文件等静态资产存放于 `https://example.com/assets/` 文件夹下

访问一级路由时， `./` 访问到的 JS 文件是 `https://example.com/assets/home.js` ，所以一级路由可以正常访问到。

访问二级路由时， `./` 访问到的 JS 文件是 `https://example.com/foo/assets/bar.js` ，但实际上文件是存放在 `https://example.com/assets/bar.js` ，访问到的 URL 资源不存在，所以白屏了。

##### 解决方案

如果的项目开启了 History 模式，并且配置有二级或者二级以上的路由时，不要使用 `./` 这样的相对路径。

正确的方式应该是修改 [publicPath](https://cli.vuejs.org/zh/config/#publicpath) （使用 Vue CLI ） 或者 [base](https://cn.vitejs.dev/config/#base) （使用 Vite ），如果是部署在域名根目录则写 `/` ，如果是子目录，则按照子目录的格式，将其以 `/` 开头，以 `/` 结尾的形式配置（ e.g. `/hello-world/` ）

### 服务端配置方案

如果使用的是 HTML5 的 History 模式，那么服务端也需要配置对应的支持，否则会出现路由跳转正常，但页面一刷新就 404 的情况。

:::tip
服务端配置后，就不再进入 404 了，需要在项目里手动配置 [404 路由页面](#_404路由页面配置-new) 的路由。
:::

#### Nginx

现在大部分公司的服务程序都在使用 Nginx ，可以将以下代码发给运维工程师参考，调整 Nginx 的配置：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

#### Express

如果是前端工程师使用 Node.js 作服务端，并且使用了 Express 服务端框架，那么操作将变得更简单：

1. 仅需要安装一个中间件

```bash
npm install connect-history-api-fallback
```

2. 在服务启动入口文件里导入该中间件并激活

```js
const express = require('express')
const history = require('connect-history-api-fallback')

// 创建 Express 实例
const app = express()
app
  // 启用 History 中间件
  .use(history())
  // 这里是读取打包后的页面文件目录
  .use('/', express.static(resolve('../dist')))
```

更多用法可以看： [connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback) 的文档。

#### 更多方案

其他的诸如 Apache 、 IIS 、或者原生 Node 等等配置方案， Vue 官方都提供了对应的演示代码，点击查看更多配置方案： [服务器配置示例](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%85%8D%E7%BD%AE%E7%A4%BA%E4%BE%8B) 。

## 本章结语

路由在的实际项目里，是非常重要的一个部分，Vue 3 相对 2.x 来说，新版路由带来的变化不算特别多，但是那些变化足以让人一开始摸不着头脑（比如以前直接通过 `this.$route` 来操作路由，现在必须通过 `useRoute` 等等），还是要慢慢习惯下。

<!-- 谷歌广告 -->
<ClientOnly>
  <GoogleAdsense />
</ClientOnly>
<!-- 谷歌广告 -->

<!-- 评论 -->
<ClientOnly>
  <GitalkComment
    :issueId="47"
  />
</ClientOnly>
<!-- 评论 -->
