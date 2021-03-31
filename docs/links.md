# 拓展阅读

存档一些会用到的链接，以及本文档的更新记录，方便读者阅读新内容。

## 官方文档

只罗列 Vue 3.0 相关的官网，有中文版的优先都放中文版。


[Vue 3.x 官网](https://v3.cn.vuejs.org/)

[Vue Composition Api](https://v3.cn.vuejs.org/guide/composition-api-introduction.html)

[Vue CLI](https://next.cli.vuejs.org/zh/)

[Vue Router](https://next.router.vuejs.org/zh/)

[Vuex](https://next.vuex.vuejs.org/)

## 教程工具

可能会用到的一些教程或者工具。

#### 深入理解TypeScript

一本挺不错的 TS 学习书籍，我自己是在京东打折的时候买的纸质书，不过也有个在线版，可以进行在线阅读，也可以去购买纸质版支持下作者 / 译者。

点击阅读：[深入理解TypeScript](https://jkchao.github.io/typescript-book-chinese/)

#### 翻墙梯子Shadowfly

虽然是个付费梯子，不过我用了 2 年多了，很稳定，年卡折合下来每个月大概 10 块钱，一杯奶茶钱，如果遇到速度慢了就在客户端上更新一下配置就恢复了，目前没出现过故障。

有 Windows / MacOS / Linux / iOS / Android 多平台的客户端支持。

官网注册：[点击注册](https://shadow-flys.us/auth/register?code=iSGi)，注册登录后可以下载客户端和一键同步配置。

## 更新记录

由于平时也比较忙，都是利用碎片时间整理的文档，习惯勤备份，因此 commit 记录比较多，而且有些提交记录跟内容也无关，比如之前为了提高访问速度而更新的 CDN 配置。

考虑到后面还会不定期更新内容，所以我翻了一下之前跟朋友的微信聊天记录，在这里简单记录一下大版本的更新节点，当文档有再次更新的时候，方便读者们查阅。

#### 2021-03-31

1. 调整了 [使用全局 API](plugin.md#使用全局-api-new) 一节的内容

原因是原来推荐的 `const { proxy } = getCurrentInstance()` 的方案，在 TS 的 `strictNullChecks` 选项校验下，使用成本非常高，原来的代码不做多层判断的情况下已经无法正常运行，所以按照目前的 “最佳实践” 重新更新了这一节。

2. 新增了一节 [全局 API 的替代方案](plugin.md#全局-api-的替代方案) 

由于 Vue 3.0 的有意为之，这个 “最佳实践” 实际上用起来也挺繁琐（在官网和 GitHub 对此都有说明，不推荐使用），所以补充了这一节内容。

#### 2021-03-23

对 [DOM 元素与子组件](component.md#dom-元素与子组件) 一节增加了 TS 类型的定义说明，以及编译失败的原因说明及解决方案补充，非常感谢 [@aierong](https://github.com/aierong) 的反馈和支持。

#### 2021-03-21

增加了 [高效开发](efficient.md) 一章，将记录一些提高 Vue 3.0 开发效率的内容，面像对 Vue 3.0 已上手，想提高开发效率的同学。

本次更新了 [script-setup](efficient.md#script-setup-new) 一节的内容。

#### 2021-01-21

增加了 [组件之间的通信](communication.md) 一章的内容。

#### 2020-12-18

本文档的第一个版本上线，完成了 [升级与配置](update.md) 、 [单组件的编写](component.md) 、 [路由的使用](router.md) 、 [插件的使用](plugin.md) 等章节的编写。

#### 2020-10-01

国庆期间开始开荒 Vue 3.0，陆陆续续打了不少笔记，业余时间着手整理成文档。

<!-- 谷歌广告 -->
<ClientOnly>
  <google-adsense />
</ClientOnly>
<!-- 谷歌广告 -->