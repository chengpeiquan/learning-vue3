# 路由的使用

在传统的web开发过程中，当你需要实现多个站内页面时，以前你需要写很多个html页面，然后通过a标签来实现互相跳转。

在如今SPA当道的时代，像Vue工程，可以轻松的通过配置一个生态组件，来实现只用一个html，却能够完成多个站内页面渲染、跳转的功能。

这个生态组件，就是路由。

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

1. `routes`：

是路由树的配置，当你的路由很粗壮的时候你可以集中到 `routes.ts` 管理然后再 `import` 进来（具体的配置请看后面的路由配置部分说明）。

2. `mode`：

决定访问路径模式，可配置为 `hash` 或者 `history`，hash模式是这种 `http://abc.com/#/home` 这样带#号的地址，支持所有浏览器，history模式是 `http://abc.com/home` 这样不带#号，不仅美观，而且体验更好，但需要服务端做一些配置支持，也只对主流浏览器支持。

相关阅读：[后端配置例子 - HTML5 History 模式](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90)

3. `base`：

是history模式在进行路由切换时的基础路径，默认是 '/' 根目录，如果你的项目不是部署在根目录下，而是二级目录、三级目录等多级目录，就必须指定这个base，不然子路由会读取不到项目资源。

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

1. `routes`：

和2.x一样，是路由树的配置。

2. `history`：

在 3.x ，使用 `history` 来代替 2.x 的`mode` ，但功能是一样的，也是决定访问路径模式是 `hash`模式 还是 `history`模式，同时合并了 2.x 的 `base` 选项作为模式函数的入参。

## 路由的基础配置

```ts
import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  // ...
];

export default routes;
```

## 一级路由的配置

待完善

## 多级路由的配置

待完善

## 在 Vue 组件内使用路由

待完善

## 在独立 JS 文件里使用路由

待完善

## 路由拦截

待完善

## 路由监听

待完善

## 本节结语

待完善