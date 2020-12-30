# 路由的使用

在传统的web开发过程中，当你需要实现多个站内页面时，以前你需要写很多个html页面，然后通过a标签来实现互相跳转。

在如今SPA当道的时代，像Vue工程，可以轻松的通过配置一个生态组件，来实现只用一个html，却能够完成多个站内页面渲染、跳转的功能。

这个生态组件，就是路由。

:::tip
从这里开始，所有包含到vue文件引入的地方，可能会看到 `@xx/xx.vue` 这样的写法。

`@views` 是 `src/views` 的路径别名，`@cp` 是 `src/components` 的路径别名。

路径别名可以在 `vue.config.js` 里配置 `alias`，点击了解：[添加项目配置](update.md#添加项目配置)
:::

## 路由的目录结构

`3.x` 引入路由的方式和 `2.x` 一样，如果你也是在创建Vue项目的时候选择了带上路由，那么会自动帮你在 `src` 文件夹下创建如下的目录结构。

如果创建时没有选择，那么也可以按照这个结构自己创建对应的文件。

```
src
├─router
├───index.ts
├───routes.ts
└─main.ts
```

其中 `index.ts` 是路由的入口文件，系统安装的时候也只有这个文件，`routes.ts` 是我自己加的，主要用于集中管理路由，`index.ts` 只用于编写路由的创建、拦截等逻辑功能。

因为大型项目来说，路由树是很粗壮的，往往需要配置上二级、三级路由，逻辑和配置都放到一个文件的话，太臃肿了。

## 在项目里引入路由

不管是2还是3，引入路由都是在 `index.js` / `index.ts` 文件里，但是版本升级带来的变化很大，由于我们的Vue 3.0是写 `TypeScript` ，所以这里只做一个TS的变化对比。

### 回顾 2.x

`2.x` 的引入方式如下（其中 `RouteConfig` 是路由项目的TS类型定义）。

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
  routes
})

export default router
```

里面一些选项的功能说明：

1. `routes` 是路由树的配置，当你的路由很粗壮的时候你可以集中到 `routes.ts` 管理然后再 `import` 进来（具体的配置请看后面的 [路由配置部分](#路由的基础配置) 说明）。

2. `mode` 决定访问路径模式，可配置为 `hash` 或者 `history`，hash模式是这种 `http://abc.com/#/home` 这样带#号的地址，支持所有浏览器，history模式是 `http://abc.com/home` 这样不带#号，不仅美观，而且体验更好，但需要服务端做一些配置支持，也只对主流浏览器支持。

相关阅读：[后端配置例子 - HTML5 History 模式](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90)

3. `base` 是history模式在进行路由切换时的基础路径，默认是 '/' 根目录，如果你的项目不是部署在根目录下，而是二级目录、三级目录等多级目录，就必须指定这个base，不然子路由会读取不到项目资源。

### 了解 3.x

`3.x` 的引入方式如下（其中 `RouteRecordRaw` 是路由项目的TS类型定义）。

```ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  // ...
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
```

`3.x` 简化了一些配置项，里面一些选项的功能说明：

1. `routes` 和 2.x 一样，是路由树的配置。

2. `history` 和 2.x 有所不同，在 3.x ，使用 `history` 来代替 2.x 的`mode` ，但功能是一样的，也是决定访问路径模式是 `hash`模式 还是 `history`模式，同时合并了 2.x 的 `base` 选项作为模式函数的入参。

## 路由树的配置

在 [引入路由](#在项目里引入路由) 部分有说到，当你的路由很粗壮的时候，你可以集中到 `routes.ts` 管理然后再 `import` 到 `index.ts` 里。

我们暂且把 `routes.ts` 这个文件称为“路由树”，因为它像一棵大树一样，不仅可以以一级路由为树干去生长，还可以添加二级、三级等多级路由来开枝散叶。

那我们来看看 `routes.ts` 应该怎么写：

### 基础格式

在TS里，路由文件的基础格式由三个部分组成：

```ts
// TS需要引入每个路由的类型定义
import { RouteRecordRaw } from 'vue-router'

// 定义一个路由数组
const routes: Array<RouteRecordRaw> = [
  // ...
];

// 暴露定义好的路由数据
export default routes;
```

之后就可以在 `index.ts` 里导入使用了。

那么里面的路由数组又是怎么写呢？这里就涉及到了 [一级路由](#一级路由) 和 [多级路由](#多级路由) 的编写。

### 公共路径

在配置路由之前，需要先了解公共路径（publicPath）的概念，在 [添加项目配置](update.md#添加项目配置) 部分，我们里面有一个参数，叫 `publicPath`，其实就是用来控制路由的公共路径，那么它有什么用呢？

`publicPath` 的默认值是 `/`，也就是说，如果你不配置它，那么所有的资源文件都是从域名根目录读取，如果你的项目部署在域名根目录那当然好，但是如果不是呢？那么就必须来配置它了。

配置很简单，只要把项目要上线的最终地址，去掉域名，剩下的那部分就是 `publicPath` 。

:::tip
如果你的路由只有一级，那么 `publicPath` 也可以设置为相对路径 `./`，这样你可以把项目部署到任意地方。

如果路由不止一级，那么请准确的指定 `publicPath`，并且保证它是以 `/` 开头， `/` 结尾。
:::

假设你的项目是部署在 `https://xxx.com/vue3/` ，那么 `publicPath` 就可以设置为 `/vue3/`。

通常我们开发环境，也就是本机ip访问的时候，都是基于根目录，但上线后的就不一定是根目录了，那么你在 `vue.config.js` 里可以通过环境变量来指定不同环境使用不同的 `publicPath`。

```js
const IS_DEV = process.env.NODE_ENV === 'development' ? true : false;

module.exports = {
  publicPath: IS_DEV ? '/' : '/vue3/'
}
```

### 一级路由

一级路由，顾名思义，就是在我们的项目地址后面，只有一级path，比如 `https://xxx.com/home` 这里的 `home` 就是一级路由。

我们来看一下最基本的路由配置应该包含哪些字段：

```ts
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@views/home.vue')
  }
];
```

1. `path` 是路由的访问路径，像上面说的，如果你的域名是 `https://xxx.com/`， 配置为 `/home`，那么访问路径就是 `https://xxx.com/home`

:::tip
一级路由的path都必须是以 `/` 开头，比如： `/home`、`/setting`；

如果你的项目首页不想带上 `home` 之类的尾巴，只想要 `https://xxx.com/` 这样的域名直达 ，其实也是配置一级路由，只需要把路由的 `path` 指定为 `/` 即可。
:::

2. `name` 是路由的名称，非必填，但是一般都会配置上去，这样可以很方便的通过 `name` 来代替 `path` 实现路由的跳转，因为像有时候你的开发环境和生产环境的路径不一致，或者说路径变更，通过 `name` 无需调整，但如果通过 `path`，可能就要修改很多文件里面的链接跳转目标了。

3. `component` 是路由的模板文件，指向一个vue组件，用于指定路由在浏览器端的视图渲染，这里有两种方式来指定使用哪个组件：

#### 同步组件

字段 `component` 接收一个变量，变量的值就是对应的模板组件。

在打包的时候，会把组件的所有代码都打包到一个文件里，对于大项目来说，这种方式的首屏加载是个灾难，要面对文件过大带来等待时间变长的问题。

```ts
import Home from '@/components/home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home
  }
];
```

所以现在都推荐使用第二种方式，可以实现 **路由懒加载** 。

#### 异步组件

字段 `component` 接收一个函数，在return的时候返回模板组件，同时还可以指定要生成的chunk，组件里的代码都会生成独立的文件，按需引入。

```ts
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@views/home.vue')
  }
];
```

关于这部分的更多说明，可以查看 [路由懒加载](#路由懒加载)。


### 多级路由

在Vue路由生态里，支持配置二级、三级、四级等多级路由，理论上没有上限，实际业务中用到的级数通常是三级到四级。

比如你做一个美食类网站，打算在 “中餐” 大分类下配置一个 “饺子” 栏目，那么地址就是：

```
https://xxx.com/chinese-food/dumplings
```

这种情况下，中餐 `chinese-food` 就是一级路由，饺子 `dumplings` 就是二级路由。

如果你想再细化一下，“饺子” 下面再增加一个 “韭菜” 、“白菜” 等不同馅料的子分类：

```
https://xxx.com/chinese-food/dumplings/chives
```

这里的韭菜 `chives` 就是饺子 `dumplings` 的子路由，也就是三级路由。

在了解了子路由的概念后，来看一下具体如何配置，以及注意事项。

:::tip
父子路由的关系，都是严格按照JSON的层级关系，子路由的信息配置到父级的 `children` 数组里面，孙路由也是按照一样的格式，配置到子路由的 `children` 里。
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
            component: () => import(/* webpackChunkName: "lv3" */ '@views/lv3.vue')
          }
        ]
      }
    ]
  }
];
```

最终线上的访问地址，比如要访问三级路由：

```
https://xxx.com/lv1/lv2/lv3
```

### 路由懒加载

在上面我们提过，路由在配置 [同步组件](#同步组件) 的时候，构建出来的文件都集中在一起，大的项目的文件会变得非常大，影响页面加载。

所以Vue在Webpack的代码分割功能的基础上，推出了 [异步组件](#异步组件)，可以把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样按需载入，很方便的实现路由组件的懒加载。

在这一段配置里面：

```ts
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@views/home.vue')
  }
];
```

起到懒加载配置作用的就是 `component` 接收的值：

```ts
() => import(/* webpackChunkName: "home" */ '@views/home.vue')
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

而如果你不使用路由懒加载，build出来的文件是这样的：

```
File                                        Size                    Gzipped

dist\static\js\chunk-vendors.389391d2.js    203.98 KiB              71.02 KiB
dist\static\js\app.634c584f.js              6.56 KiB                2.40 KiB
dist\static\css\app.beea0177.css            0.41 KiB                0.23 KiB
```

单纯看js文件：

使用代码切割，当你访问 `home` 路由的时候，分割后你首次会加载 `app`、`chunk-vendors`、`home` 这3个文件，加起来142.59k。

而不分割则需要加载210.54k，整整多出接近50%的体积，这只是一个非常小的demo，大型项目会更夸张！

两者哪个更适合大项目，高下立见！！！

## 在 Vue 组件内使用路由

截止到这里，前面说的都是如何配置路由，那么配置完就直接可以用了吗？

答案当然是…no……

### 路由的渲染

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

待完善

## 在独立 JS 文件里使用路由

待完善

## 路由元信息配置

有时候你的项目需要一些个性化配置，比如：

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
      isNoLogin: true
    }
  }
];
```

这个是我在做后台的时候的一些配置，主要的功能是：

`title` 用于在渲染的时候配置浏览器标题；

`isDisableBreadcrumbLink` 是否禁用面包屑链接（对一些没有内容的路由可以屏蔽访问）；

`isShowBreadcrumb` 是否显示面包屑（此处的登录页不需要面包屑）；

`addToSidebar` 是否加入侧边栏（此处的登录页不需要加入侧边栏）；

`sidebarIcon` 配置侧边栏的图标className（默认）；

`sidebarIconAlt` 配置侧边栏的图标className（展开状态）；

`isNoLogin` 是否免登录（设置为true后，会校验登录状态，此处的登录页不需要校验）；

这些功能都是我在项目里需要操控到路由的功能，通过这样的一些字段来达到路由的控制。

:::tip
路由 `meta` 字段的内容没有要求，按需配置，一些功能可以配合 [路由拦截](#路由拦截) 一起使用。
:::

类似的，你如果有其他需求，都可以通过路由元信息来配置，然后在对应的地方进行读取操作。

## 导航守卫

和 `2.x` 时使用的路由一样， `3.x` 也支持导航守卫，并且用法是一样的。

对于导航守卫还不熟悉的同学，可以从一些实际使用场景来加强印象，比如：

1. 前面说的，在渲染的时候配置浏览器标题，Vue项目只要一个Html文件，默认只有一个标题，但你想在访问 `home` 的时候标题显示为 “首页”，访问 `about` 的时候标题显示为 “关于我们”；

2. 部分页面需要管理员才能访问，普通用户不允许进入到该路由页面；

3. Vue单页面项目，传统的CNZZ/百度统计等网站统计代码只会在页面加载的时候统计一次，但你需要每次切换路由都上报一次PV数据

场景，还有很多…

### 路由拦截

拦截这个词，顾名思义，就是在XXX目的达到之前，把它拦下来，所以路由的目的就是渲染指定的组件嘛，路由拦截就是在它渲染之前，做一些拦截操作。

## 路由监听

待完善

## 本节结语

待完善