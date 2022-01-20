# 拓展阅读

存档一些会用到的链接，以及本文档的更新记录，方便读者阅读新内容。

## 官方文档

只罗列 Vue 3.0 相关的官网，有中文版的优先都放中文版。


[Vue 3.x 官网](https://v3.cn.vuejs.org/)

[Vue Composition Api](https://v3.cn.vuejs.org/guide/composition-api-introduction.html)

[Vue CLI](https://next.cli.vuejs.org/zh/)

[Vue Router](https://next.router.vuejs.org/zh/)

[Vuex](https://next.vuex.vuejs.org/zh/)

## 教程工具

可能会用到的一些教程或者工具。

### 常用的 Web API 类型查询

在 [DOM 元素与子组件](component.md#dom-元素与子组件) 一节有提及到如何对 DOM 元素定义 TS 类型，拿出来放这里更方便查阅。

点击阅读：[文档对象模型](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model)

当然其实不止于 DOM，所有的 Web API 都有自己的类型接口，可以通过 MDN 文档查阅。

点击阅读：[Web API](https://developer.mozilla.org/zh-CN/docs/Web/API)

### TypeScript入门教程

最近发现的一本好书，从 JavaScript 程序员的角度总结思考，循序渐进的理解 TypeScript ，可以帮你更快熟悉 TS 开发。

点击阅读：[TypeScript 入门教程](http://ts.xcatliu.com/)

### 深入理解TypeScript

一本挺不错的 TS 学习书籍，我自己是在京东打折的时候买的纸质书，不过也有个在线版，可以进行在线阅读，也可以去购买纸质版支持下作者 / 译者。

点击阅读：[深入理解TypeScript](https://jkchao.github.io/typescript-book-chinese/)

### 翻墙梯子Shadowfly

虽然是个付费梯子，不过我用了 2 年多了，很稳定，年卡折合下来每个月大概 10 块钱，一杯奶茶钱，如果遇到速度慢了就在客户端上更新一下配置就恢复了，目前没出现过故障。

有 Windows / MacOS / Linux / iOS / Android 多平台的客户端支持。

官网注册：[点击注册](https://shadow-flys.us/auth/register?code=Rl7L)，注册登录后可以下载客户端和一键同步配置。

## 更新记录

由于平时也比较忙，都是利用碎片时间整理的文档，习惯勤备份，因此 commit 记录比较多，而且有些提交记录跟内容也无关，比如之前为了提高访问速度而更新的 CDN 配置。

考虑到后面还会不定期更新内容，所以我翻了一下之前跟朋友的微信聊天记录，在这里简单记录一下大版本的更新节点，当文档有再次更新的时候，方便读者们查阅。

### 2022-01-20

1. 更新了 [CNPM](plugin.md#通过-cnpm-安装) 的用法，原因是旧的 CNPM 源即将下线，需要使用新的域名啦！（感谢 [@alleluya-young](https://github.com/alleluya-young) 在 [#135](https://github.com/chengpeiquan/learning-vue3/issues/135) 的反馈！）

2. 添加了 [PNPM](plugin.md#通过-pnpm-安装) 的用法说明，目前开源社区越来越流行使用 PNPM ，对大型项目管理也有好处，值得了解和体验。

### 2021-12-05

由于离第一次执笔到现在有了差不多一年的时间，当时的前言信息有些陈旧，重新写了一下 [前言](README.md) 。

另外经过 2021 年的开发实践，很多地方我又有了新的认知，打算在接下来的时间里，我会再继续抽空把各部分的内容再精细化一下，把以前可能写的比较简单的部分，或者没有写进来的一些功能点，都再做一次完善。

### 2021-11-16

重写了 [数据的计算](component.md#数据的计算-new) 一节，之前对于计算数据的介绍，描述上确实有点难以理解，而且有点简单带过，所以重新写了这部分内容，感谢读者 [@superficial](https://www.zhihu.com/people/superficial-14-33) 的反馈！

### 2021-10-07

补充了 [全局编译器宏](efficient.md#全局编译器宏) 的配置说明，本来很久前就想写的，一直偷懒，国庆结束前补充进来啦！

### 2021-08-17

更新了 `3.2.0` 版本新增的一些知识点： 

1. 增加了 [使用 v-bind 动态修改 style](component.md#使用-v-bind-动态修改-style-new) 功能说明，同时结合上下文知识点补充了 [动态绑定 CSS](component.md#动态绑定-css) 一节

2. 增加了 [CSS Modules](component.html#style-module-new) 一节的内容

3. 增加了 [useCssModule](component.md#usecssmodule-new) 一节的内容

### 2021-08-16

1. 更新了 [深度操作符](component.html#深度操作符-new) 的内容，原有的 API 已被废弃，请注意使用新写法

2. 补充了几个拓展阅读链接到 [教程工具](#教程工具) 里

### 2021-07-28

迎接 Vue `3.2.0` 的新版本内容，对 [script-setup](efficient.md#script-setup-new) 做了较多的调整。

目前 3.2 还处于 Beta 阶段，不过从这个版本开始，script-setup 脱离实验性阶段，正式进入 Vue 3.0 的队伍，本次的更新内容较多，很多测试阶段的 API 被移除或者修改，如果之前有用过 script-setup ，建议先简单看我之前的博客，了解本次的一些变更：

[Vue3.0最新动态：script-setup定稿 部分实验性API将弃用](https://chengpeiquan.com/article/vue3-script-setup-finalization.html)

### 2021-03-31

1. 调整了 [使用全局 API](plugin.md#使用全局-api-new) 一节的内容

原因是原来推荐的 `const { proxy } = getCurrentInstance()` 的方案，在 TS 新版本校验下，使用成本非常高，原来的代码不做多层判断的情况下已经无法正常运行，所以按照目前的 “最佳实践” 重新更新了这一节。

2. 新增了一节 [全局 API 的替代方案](plugin.md#全局-api-的替代方案) 

由于 Vue 3.0 的有意为之，这个 “最佳实践” 实际上用起来也挺繁琐（在官网和 GitHub 对此都有说明，不推荐使用），所以补充了这一节内容。

### 2021-03-23

对 [DOM 元素与子组件](component.md#dom-元素与子组件) 一节增加了 TS 类型的定义说明，以及编译失败的原因说明及解决方案补充，非常感谢 [@aierong](https://github.com/aierong) 的反馈和支持。

### 2021-03-21

增加了 [高效开发](efficient.md) 一章，将记录一些提高 Vue 3.0 开发效率的内容，面像对 Vue 3.0 已上手，想提高开发效率的同学。

本次更新了 [script-setup](efficient.md#script-setup-new) 一节的内容。

### 2021-01-21

增加了 [组件之间的通信](communication.md) 一章的内容。

### 2020-12-18

本文档的第一个版本上线，完成了 [升级与配置](update.md) 、 [单组件的编写](component.md) 、 [路由的使用](router.md) 、 [插件的使用](plugin.md) 等章节的编写。

### 2020-10-01

国庆期间开始开荒 Vue 3.0，陆陆续续打了不少笔记，业余时间着手整理成文档。

<!-- 谷歌广告 -->
<ClientOnly>
  <google-adsense />
</ClientOnly>
<!-- 谷歌广告 -->
