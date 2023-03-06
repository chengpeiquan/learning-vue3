---
outline: 'deep'
---

# 了解前端工程化

现在前端的工作与以前的前端开发已经完全不同了。

刚接触前端的时候，做一个页面，是先创建 HTML 页面文件写页面结构，再在里面写 CSS 代码美化页面，再根据需要写一些 JavaScript 代码增加交互功能，需要几个页面就创建几个页面，相信大家的前端起步都是从这个模式开始的。

而实际上的前端开发工作，早已进入了前端工程化开发的时代，已经充满了各种现代化框架、预处理器、代码编译…

最终的产物也不再单纯是多个 HTML 页面，经常能看到 SPA / SSR / SSG 等词汇的身影。

:::tip
在 [现代化的开发概念](#现代化的开发概念) 一节会介绍这些词汇的含义。
:::

## 传统开发的弊端

在了解什么是前端工程化之前，先回顾一下传统开发存在的一些弊端，这样更能知道为什么需要它。

在传统的前端开发模式下，前端工程师大部分只需要单纯的写写页面，都是在 HTML 文件里直接编写代码，所需要的 JavaScript 代码是通过 `script` 标签以内联或者文件引用的形式放到 HTML 代码里的，当然 CSS 代码也是一样的处理方式。

例如这样：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <!-- 引入 JS 文件 -->
    <script src="./js/lib-1.js"></script>
    <script src="./js/lib-2.js"></script>
    <!-- 引入 JS 文件 -->
  </body>
</html>
```

如演示代码，虽然可以把代码分成多个文件来维护，这样可以有效降低代码维护成本，但在实际开发过程中，还是会存在代码运行时的一些问题。

### 一个常见的案例

继续用上面的演示代码，来看一个最简单的一个例子。

先在 `lib-1.js` 文件里，声明一个变量：

```js
var foo = 1
```

再在 `lib-2.js` 文件里，也声明一个变量（没错，也是 `foo` ）：

```js
var foo = 2
```

然后在 HTML 代码里追加一个 `script` ，打印这个值：

```html{16-20}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>

  <!-- 引入 JS 文件 -->
  <script src="./js/lib-1.js"></script>
  <script src="./js/lib-2.js"></script>
  <!-- 引入 JS 文件 -->

  <!-- 假设这里是实际的业务代码 -->
  <script>
    console.log(foo)
  </script>
  <!-- 假设这里是实际的业务代码 -->

</body>
</html>
```

先猜猜会输出什么？ —— 答案是 `2` 。

如果在开发的过程中，不知道在 `lib-2.js` 文件里也声明了一个 `foo` 变量，一旦在后面的代码里预期了 `foo + 2 === 3` ，那么这样就得不到想要的结果（因为 `lib-1.js` 里的 `foo` 是 `1` ， `1 + 2` 等于 `3` ） 。

原因是 JavaScript 的加载顺序是从上到下，当使用 `var` 声明变量时，如果命名有重复，那么后加载的变量会覆盖掉先加载的变量。

这是使用 `var` 声明的情况，它允许使用相同的名称来重复声明，那么换成 `let` 或者 `const` 呢？

虽然不会出现重复声明的情况，但同样会收到一段报错：

```bash
Uncaught SyntaxError: Identifier 'foo' has already been declared (at lib-2.js:1:1)
```

这次程序直接崩溃了，因为 `let` 和 `const` 无法重复声明，从而抛出这个错误，程序依然无法正确运行。

### 更多问题

以上只是一个最简单的案例，就暴露出了传统开发很大的弊端，然而并不止于此，实际上，存在了诸如以下这些的问题：

1. 如本案例，可能存在同名的变量声明，引起变量冲突
2. 引入多个资源文件时，比如有多个 JS 文件，在其中一个 JS 文件里面使用了在别处声明的变量，无法快速找到是在哪里声明的，大型项目难以维护
3. 类似第 1 、 2 点提到的问题无法轻松预先感知，很依赖开发人员人工定位原因
4. 大部分代码缺乏分割，比如一个工具函数库，很多时候需要整包引入到 HTML 里，文件很大，然而实际上只需要用到其中一两个方法
5. 由第 4 点大文件延伸出的问题， `script` 的加载从上到下，容易阻塞页面渲染
6. 不同页面的资源引用都需要手动管理，容易造成依赖混乱，难以维护
7. 如果要压缩 CSS 、混淆 JS 代码，也是要人力操作使用工具去一个个处理后替换，容易出错

当然，实际上还会有更多的问题会遇到。

## 工程化带来的优势

为了解决传统开发的弊端，前端也开始引入工程化开发的概念，借助工具来解决人工层面的烦琐事情。

### 开发层面的优势

在 [传统开发的弊端](#传统开发的弊端) 里，主要列举的是开发层面的问题，工程化首要解决的当然也是在开发层面遇到的问题。

在开发层面，前端工程化有以下这些好处：

1. 引入了模块化和包的概念，作用域隔离，解决了代码冲突的问题
2. 按需导出和导入机制，让编码过程更容易定位问题
3. 自动化的代码检测流程，有问题的代码在开发过程中就可以被发现
4. 编译打包机制可以让使用开发效率更高的编码方式，比如 Vue 组件、 CSS 的各种预处理器
5. 引入了代码兼容处理的方案（ e.g. Babel ），可以让自由使用更先进的 JavaScript 语句，而无需顾忌浏览器兼容性，因为最终会帮转换为浏览器兼容的实现版本
6. 引入了 Tree Shaking 机制，清理没有用到的代码，减少项目构建后的体积

还有非常多的体验提升，列举不完。而对应的工具，根据用途也会有非常多的选择，在后面的学习过程中，会一步一步体验到工程化带来的好处。

### 团队协作的优势

除了对开发者有更好的开发体验和效率提升，对于团队协作，前端工程化也带来了更多的便利，例如下面这些场景：

#### 统一的项目结构

以前的项目结构比较看写代码的人的喜好，虽然一般在研发部门里都有 “团队规范” 这种东西，但靠自觉性去配合的事情，还是比较难做到统一，特别是项目很赶的时候。

工程化后的项目结构非常清晰和统一，以 Vue 项目来说，通过脚手架创建一个新项目之后，它除了提供能直接运行 Hello World 的基础代码之外，还具备了如下的统一目录结构：

- `src` 是源码目录
- `src/main.ts` 是入口文件
- `src/views` 是路由组件目录
- `src/components` 是子组件目录
- `src/router` 是路由目录

虽然也可以自行调整成别的结构，但根据笔者在多年的工作实际接触下来，以及从很多开源项目的代码里看到的，都是沿用脚手架创建的项目结构（不同脚手架创建的结构会有所不同，但基于同一技术栈的项目基本上都具备相同的结构）。

:::tip
在 [脚手架的升级与配置](upgrade.md) 一章可以学习如何使用脚手架创建 Vue 3 项目。
:::

#### 统一的代码风格

不管是接手其他人的代码或者是修改自己不同时期的代码，可能都会遇到这样的情况，例如一个模板语句，上面包含了很多属性，有的人喜欢写成一行，属性多了维护起来很麻烦，需要花费较多时间辨认：

```vue{4-5}
<template>
  <div class="list">
    <!-- 这个循环模板有很多属性 -->
    <div class="item" :class="{ `top-${index + 1}`: index < 3 }" v-for="(item, index)
    in list" :key="item.id" @click="handleClick(item.id)">
      <span>{{ item.text }}</span>
    </div>
    <!-- 这个循环模板有很多属性 -->
  </div>
</template>
```

而工程化配合统一的代码格式化规范，可以让不同人维护的代码，最终提交到 Git 上的时候，风格都保持一致，并且类似这种很多属性的地方，都会自动帮格式化为一个属性一行，维护起来就很方便：

```vue{5-9}
<template>
  <div class="list">
    <!-- 这个循环模板有很多属性 -->
    <div
      class="item"
      :class="{ `top-${index + 1}`: index < 3 }"
      v-for="(item, index) in list"
      :key="item.id"
      @click="handleClick(item.id)"
    >
      <span>{{ item.text }}</span>
    </div>
    <!-- 这个循环模板有很多属性 -->
  </div>
</template>
```

同样的，写 JavaScript 时也会有诸如字符串用双引号还是单引号，缩进是 Tab 还是空格，如果用空格到底是要 4 个空格还是 2 个空格等一堆 “没有什么实际意义” 、但是不统一的话协作起来又很难受的问题……

在工程化项目这些问题都可以交给程序去处理，在书写代码的时候，开发者可以先按照自己的习惯书写，然后再执行命令进行格式化，或者是在提交代码的时候配合 Git Hooks 自动格式化，都可以做到统一风格。

:::tip
在 [添加协作规范](upgrade.md#添加协作规范) 一节可以学习如何给项目添加统一的协作规范。
:::

#### 可复用的模块和组件

传统项目比较容易被复用的只有 JavaScript 代码和 CSS 代码，会抽离公共函数文件上传到 CDN ，然后在 HTML 页面里引入这些远程资源， HTML 代码部分通常只有由 JS 创建的比较小段的 DOM 结构。

并且通过 CDN 引入的资源，很多时候都是完整引入，可能有时候只需要用到里面的一两个功能，却要把很大的完整文件都引用进来。

这种情况下，在前端工程化里，就可以抽离成一个开箱即用的 npm 组件包，并且很多包都提供了模块化导出，配合构建工具的 Tree Shaking ，可以抽离用到的代码，没有用到的其他功能都会被抛弃，不会一起发布到生产环境。

:::tip
在 [依赖包和插件](guide.md#依赖包和插件) 一节可以学习如何查找和使用开箱即用的 npm 包。
:::

#### 代码健壮性有保障

传统的开发模式里，只能够写 JavaScript ，而在工程项目里，可以在开发环境编写带有类型系统的 TypeScript ，然后再编译为浏览器能认识的 JavaScript 。

在开发过程中，编译器会检查代码是否有问题，比如在 TypeScript 里声明了一个布尔值的变量，然后不小心将它赋值为数值：

```ts
// 声明一个布尔值变量
let bool: boolean = true

// 在 TypeScript ，不允许随意改变类型，这里会报错
bool = 3
```

编译器检测到这个行为的时候就会抛出错误：

```bash
# ...
return new TSError(diagnosticText, diagnosticCodes);
           ^
TSError: ⨯ Unable to compile TypeScript:
src/index.ts:2:1 - error TS2322: Type 'number' is not assignable to type 'boolean'.

2 bool = 3
  ~~~~
# ...
```

从而得以及时发现问题并修复，减少线上事故的发生。

#### 团队开发效率高

在前后端合作环节，可以提前 Mock 接口与后端工程师同步开发，如果遇到跨域等安全限制，也可以进行本地代理，不受跨域困扰。

前端工程在开发过程中，还有很多可以交给程序处理的环节，像前面提到的代码格式化、代码检查，还有在部署上线的时候也可以配合 CI/CD 完成自动化流水线，不像以前改个字都要找服务端工程师去更新，可以把非常多的人力操作剥离出来交给程序。

### 求职竞争上的优势

近几年前端开发领域的相关岗位，都会在招聘详情里出现类似的描述：

> 熟悉 Vue / React 等主流框架，对前端组件化和模块化有深入的理解和实践<br />
> 熟悉面向组件的开发模式，熟悉 Webpack / Vite 等构建工具<br />
> 熟练掌握微信小程序开发，熟悉 Taro 框架或 uni-app 框架优先<br />
> 熟悉 Scss / Less / Stylus 等预处理器的使用<br />
> 熟练掌握 TypeScript 者优先<br />
> 有良好的代码风格，结构设计与程序架构者优先<br />
> 了解或熟悉后端开发者优先（如 Java / Go / Node.js ）<br />

知名企业对 1-3 年工作经验的初中级工程师，更是明确要求具备前端工程化开发的能力：

<ClientOnly>
  <ImgWrap
    src="/assets/img/job-details.png"
    dark="/assets/img/job-details-dark.png"
    alt="知名企业对 1-3 年经验的前端工程师招聘要求"
  />
</ClientOnly>

组件化开发、模块化开发、 Webpack / Vite 构建工具、 Node.js 开发… 这些技能都属于前端工程化开发的知识范畴，不仅在面试的时候会提问，入职后新人接触的项目通常也是直接指派前端工程化项目，如果能够提前掌握相关的知识点，对求职也是非常有帮助的！

## Vue.js 与工程化

在上一节提到了前端工程化 [在求职竞争上的优势](#求职竞争上的优势) ，里面列出的招聘要求例子都提及到了 Vue 和 React 这些主流的前端框架，前端框架是前端工程化开发里面不可或缺的成员。

框架能够充分的利用前端工程化相关的领先技术，不仅在开发层面降低开发者的上手难度、提升项目开发效率，在构建出来的项目成果上也有着远比传统开发更优秀的用户体验。

本书结合 Vue.js 框架 3.0 系列的全新版本，将从项目开发的角度，在帮助开发者入门前端工程化的同时，更快速的掌握一个流行框架的学习和使用。

### 了解 Vue.js 与全新的 3.0 版本

Vue.js（发音为 `/vjuː/` ，类似 `view` ）是一个易学易用，性能出色，适用场景丰富的 Web 前端框架，从 2015 年发布 1.0 版本以来，受到了全世界范围的前端开发者喜爱，已成为当下最受欢迎的前端框架之一。

<ClientOnly>
  <ImgWrap
    src="/logo.png"
    alt="Vue.js Logo"
    :maxWidth="240"
  />
</ClientOnly>

Vue 一直紧跟广大开发者的需求迭代发展，保持着它活跃的生命力。

2020 年 9 月 18 日， Vue.js 发布了 3.0 正式版，在大量开发者长达约一年半的使用和功能改进反馈之后， Vue 又于 2022 年 2 月 7 日发布了 3.2 版本，同一天， [Vue 3 成为 Vue.js 框架全新的默认版本](https://zhuanlan.zhihu.com/p/460055155) （在此之前，通过 `npm install vue` 的默认版本还是 Vue 2 ）。

也就是在未来的日子里， Vue 3 将随着时间的推移，逐步成为 Vue 生态的主流版本，是时候学习 Vue 3 了！

如果还没有体验过 Vue ，可以把以下代码复制到的代码编辑器，保存成一个 HTML 文件（例如： `hello.html` ），并在浏览器里打开访问，同时请唤起浏览器的控制台面板（例如 Chrome 浏览器是按 `F12` 或者鼠标右键点 “检查” ），在 Console 面板查看 Log 的打印。

```html
<!-- 这是使用 Vue 实现的 demo -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hello Vue</title>
    <script src="https://unpkg.com/vue@3"></script>
  </head>
  <body>
    <div id="app">
      <!-- 通过 `{{ 变量名 }}` 语法渲染响应式变量 -->
      <p>Hello {{ name }}!</p>

      <!-- 通过 `v-model` 双向绑定响应式变量 -->
      <!-- 通过 `@input` 给输入框绑定输入事件 -->
      <input
        type="text"
        v-model="name"
        placeholder="输入名称打招呼"
        @input="printLog"
      />

      <!-- 通过 `@click` 给按钮绑定点击事件 -->
      <button @click="reset">重置</button>
    </div>

    <script>
      const { createApp, ref } = Vue
      createApp({
        // `setup` 是一个生命周期钩子
        setup() {
          // 默认值
          const DEFAULT_NAME = 'World'

          // 用于双向绑定的响应式变量
          const name = ref(DEFAULT_NAME)

          // 打印响应式变量的值到控制台
          function printLog() {
            // `ref` 变量需要通过 `.value` 操作值
            console.log(name.value)
          }

          // 重置响应式变量为默认值
          function reset() {
            name.value = DEFAULT_NAME
            printLog()
          }

          // 需要 `return` 出去才可以被模板使用
          return { name, printLog, reset }
        },
      }).mount('#app')
    </script>
  </body>
</html>
```

这是一个基于 Vue 3 组合式 API 语法的 demo ，它包含了两个主要功能：

1. 可以在输入框修改输入内容，上方的 `Hello World!` 以及浏览器控制台的 Log 输出，都会随着输入框内容的变更而变化
2. 可以点击 “重置” 按钮，响应式变量被重新赋值的时候，输入框的内容也会一起变化为新的值

这是 Vue 的特色之一：数据的双向绑定。

对比普通的 HTML 文件需要通过输入框的 `oninput` 事件手动编写视图的更新逻辑， Vue 的双向绑定功能大幅度减少了开发过程的编码量。

在未接触 Vue 这种编程方式之前，相信大部分人首先想到的是直接操作 DOM 来实现需求，为了更好的进行对比，接下来用原生 JavaScript 实现一次相同的功能：

```html
<!-- 这是使用原生 JavaScript 实现的 demo -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hello World</title>
  </head>
  <body>
    <div id="app">
      <!-- 通过一个 `span` 标签来指定要渲染数据的位置 -->
      <p>Hello <span id="name"></span>!</p>

      <!-- 通过 `oninput` 给输入框绑定输入事件 -->
      <input
        id="input"
        type="text"
        placeholder="输入名称打招呼"
        oninput="handleInput()"
      />

      <!-- 通过 `onclick` 给按钮绑定点击事件 -->
      <button onclick="reset()">重置</button>
    </div>

    <script>
      // 默认值
      const DEFAULT_NAME = 'World'

      // 要操作的 DOM 元素
      const nameElement = document.querySelector('#name')
      const inputElement = document.querySelector('#input')

      // 处理输入
      function handleInput() {
        const name = inputElement.value
        nameElement.innerText = name
        printLog()
      }

      // 打印输入框的值到控制台
      function printLog() {
        const name = inputElement.value
        console.log(name)
      }

      // 重置 DOM 元素的文本和输入框的值
      function reset() {
        nameElement.innerText = DEFAULT_NAME
        inputElement.value = DEFAULT_NAME
        printLog()
      }

      // 执行一次初始化，赋予 DOM 元素默认文本和输入框的默认值
      window.addEventListener('load', reset)
    </script>
  </body>
</html>
```

虽然两个方案总的代码量相差不大，但可以看到两者的明显区别：

1. Vue 只需要对一个 `name` 变量的进行赋值操作，就可以轻松实现视图的同步更新
2. 使用原生 JavaScript 则需要频繁的操作 DOM 才能达到输入内容即时体现在文本 DOM 上面，并且还要考虑 DOM 是否已渲染完毕，否则操作会出错

Vue 的这种编程方式，称之为 “数据驱动” 编程。

如果在一个页面上频繁且大量的操作真实 DOM ，频繁的触发浏览器回流（ Reflow ）与重绘（ Repaint ），会带来很大的性能开销，从而造成页面卡顿，在大型项目的性能上很是致命。

而 Vue 则是通过操作虚拟 DOM （ Virtual DOM ，简称 VDOM ），每一次数据更新都通过 Diff 算法找出需要更新的节点，只更新对应的虚拟 DOM ，再去映射到真实 DOM 上面渲染，以此避免频繁或大量的操作真实 DOM 。

:::tip
虚拟 DOM 是一种编程概念，是指将原本应该是真实 DOM 元素的 UI 界面，用数据结构来组织起完整的 DOM 结构，再同步给真实 DOM 渲染，减少浏览器的回流与重绘。

在 JavaScript 里，虚拟 DOM 的表现是一个 Object 对象，其中需要包含指定的属性（例如 Vue 的虚拟 DOM 需要用 `type` 来指定当前标签是一个 `<div />` 还是 `<span />` ），然后框架会根据对象的属性去转换为 DOM 结构并最终完成内容的显示。

更多关于 Vue 虚拟 DOM 和性能优化可以查看官网的 [渲染机制](https://cn.vuejs.org/guide/extras/rendering-mechanism.html) 一章进行了解。
:::

Vue 3.0 版本还引入了组合式 API 的概念，更符合软件工程 “高内聚，低耦合” 的思想，让开发者可以更灵活的管理自己的逻辑代码，更方便的进行抽离封装再复用，不管是大型项目还是流水线业务，开箱即用的逻辑代码都是提升开发效率的利器。

### Vue 与工程化之间的关联

在已经对 Vue 做了初步了解之后，可能有读者会问：“既然 Vue 的使用方式也非常简单，可以像 jQuery 这些经典类库一样在 HTML 引入使用，那么 Vue 和工程化有什么关联呢？”

Vue.js 是一个框架，框架除了简化编码过程中的复杂度之外，面对不同的业务需求还提供了通用的解决方案，而这些解决方案，通常是将前端工程化里的很多种技术栈组合起来串成一条条技术链，一环扣一环，串起来就是一个完整的工程化项目。

举一个常见的例子，比如上一节内容 [了解 Vue.js 与全新的 3.0 版本](#了解-vue-js-与全新的-3-0-版本) 里的 demo 是一个简单的 HTML 页面，如果业务稍微复杂一点，比如区分了 “首页” 、 “列表页” 、 “内容页” 这样涉及到多个页面，传统的开发方案是通过 A 标签跳转到另外一个页面，在跳转期间会产生 “新页面需要重新加载资源、会有短暂白屏” 等情况，用户体验不太好。

Vue 提供了 Vue Router 实现路由功能，利用 [History API](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API) 实现单页面模式（可在 [现代化的开发概念](#现代化的开发概念) 部分了解区别），在一个 HTML 页面里也可以体验 “页面跳转” 这样的体验，但如果页面很多，所有代码都堆积在一个 HTML 页面里，就很难维护。

借助前端工程化的构建工具，开发者可以编写 `.vue` 单组件文件，将多个页面的代码根据其功能模块进行划分，可拆分到多个单组件文件里维护并进行合理复用，最终通过构建工具编译再合并，最终生成浏览器能访问的 HTML / CSS / JS 文件，这样的开发过程，用户体验没有影响，但开发体验大大提升。

类似这样一个个业务场景会积少成多，把 Vue 和工程化结合起来，处理问题更高效更简单。

### 选择 Vue 入门工程化的理由

虽然前端的流行框架有主流的 Angular 、 React 和 Vue ，也有新兴的 Svelte 等等，每一个框架都有自己的特色，那为什么建议选择 Vue 来入门工程化呢？

最主要的两个原因是：

1. 职场对 Vue 技术栈的需求量大，容易找工作
2. 上手门槛低，会一些基础的 HTML / CSS / JavaScript 语法知识，就能够轻松上手 Vue 的组件开发

第一个原因在 [求职竞争上的优势](#求职竞争上的优势) 已有进行过说明，掌握一门流行框架已经是前端岗位必备的技能，几乎所有公司在招聘前端工程师的时候都要求会 Vue 。

这里主要讲讲第二个原因，在 [Vue 与工程化之间的关联](#vue-与工程化之间的关联) 里提到了开发者可以编写 `.vue` 文件，这是一个 Vue 专属的文件扩展名，官方名称是 Single-File Component ，简称 SFC ，也就是单文件组件。

`.vue` 文件最大的特色就是支持像编写 `.html` 文件一样，在文件里写 HTML / CSS / JS 代码，不仅结构相似，在代码书写上，两者的语法也是十分接近：

|     `.vue` 文件     |  `.html` 文件   |
| :-----------------: | :-------------: |
| `<template />` 部分 |    HTML 代码    |
|  `<style />` 部分   |    CSS 代码     |
|  `<script />` 部分  | JavaScript 代码 |

下面就是一个最基础的 Vue 组件结构，可以看到和 HTML 文件是非常的相似：

```vue
<!-- `template` 对应 HTML 代码 -->
<template>
  <div>
    <!-- 一些 HTML  -->
  </div>
</template>

<!-- `script` 部分对应 JavaScript 代码 -->
<!-- 还支持其他语言，例如 `lang="ts"` 代表当前使用 TypeScript 编写 -->
<script>
export default {
  // 这里是变量、函数等逻辑代码
}
</script>

<!-- `style` 部分对应 CSS 代码 -->
<!-- 还支持开启 `scoped` 标识，让 CSS 代码仅对当前组件生效，不会全局污染 -->
<style scoped>
/* 一些 CSS 代码 */
</style>
```

Vue 组件不仅支持这些语言的所有基础用法，还增加了非常多更高效的功能，在后面 Vue3 教程的 [单组件的编写](component.md) 一章会有详细的介绍。

## 现代化的开发概念

在本章最开始的时候提到了 SPA / SSR / SSG 等词汇，这些词汇是一些现代前端工程化开发的概念名词缩写，代表着不同的开发模式和用户体验。

当下主流的前端框架都提供了这些开发模式的支持，因此在学习前端工程化和 Vue 开发的过程中，会不定期的看到这一类词汇，在实际工作业务的技术选型时，面对不同的业务场景也要考虑好需要使用什么样的开发模式，提前了解这些概念，对以后的工作也会很有帮助。

### MPA 与 SPA

首先来看 MPA 与 SPA ，这代表着两个完全相反的开发模式和用户体验，它们的全称和中文含义如下：

| 名词 |          全称           |    中文    |
| :--: | :---------------------: | :--------: |
| MPA  | Multi-Page Application  | 多页面应用 |
| SPA  | Single-Page Application | 单页面应用 |

#### 多页面应用

MPA 多页面应用是最传统的网站体验，当一个网站有多个页面时，会对应有多个实际存在的 HTML 文件，访问每一个页面都需要经历一次完整的页面请求过程：

```bash
# 传统的页面跳转过程

从用户点击跳转开始：
---> 浏览器打开新的页面
---> 请求【所有】资源
---> 加载 HTML 、CSS 、 JS 、 图片等资源
---> 完成新页面的渲染
```

##### MPA 的优点

作为最传统也是最被广泛运用的模式，自然有它的优势存在：

- 首屏加载速度快

因为 MPA 的页面源码都是实实在在的写在 HTML 文件里，所以当 HTML 文件被访问成功，内容也就随即呈现（在不考虑额外的 CSS 、 图片加载速度的情况下，这种模式的内容呈现速度是最快的）。

- SEO 友好，容易被搜索引擎收录

如果读者有稍微了解过一些 SEO 知识，会知道除了网页的 TKD 三要素之外，网页的内容也影响收录的关键因素，传统的多页面应用，网页的内容都是直接位于 HTML 文件内，例如下面这个有很多内容的网页：

<ClientOnly>
  <ImgWrap
    src="/assets/img/seo-page.jpg"
    dark="/assets/img/seo-page-dark.jpg"
    alt="网页呈现的内容"
  />
</ClientOnly>

右键查看该网页的源代码，可以看到网页内容对应的 HTML 结构也是包含在 `.html` 文件里。

<ClientOnly>
  <ImgWrap
    src="/assets/img/seo-page-code.jpg"
    dark="/assets/img/seo-page-code-dark.jpg"
    alt="网页内容对应的 HTML 源码"
  />
</ClientOnly>

:::tip
网页的 TKD 三要素是指一个网页的三个关键信息，含义如下：

T ，指 Title ，网站的标题，即网页的 `<title>网站的标题</title>` 标签。

K ，指 Keywords ，网站的关键词，即网页的 `<meta name="Keywords" content="关键词1,关键词2,关键词3" />` 标签。

D ，指 Description ，网站的描述，即网页的 `<meta name="description" content="网站的描述" />` 标签。

这三个要素标签都位于 HTML 文件的 `<head />` 标签内。
:::

- 容易与服务端语言结合

由于传统的页面都是由服务端直出，所以可以使用 PHP 、 JSP 、 ASP 、 Python 等非前端语言或技术栈来编写页面模板，最终输出 HTML 页面到浏览器访问。

##### MPA 的缺点

说完 MPA 的优点，再来看看它的缺点，正因为有这些缺点的存在，才会催生出其他更优秀的开发模式出现。

- 页面之间的跳转访问速度慢

正如它的访问流程，每一次页面访问都需要完整的经历一次渲染过程，哪怕从详情页 A 的 “相关阅读” 跳转到详情页 B ，这种网页结构一样，只有内容不同的两个页面，也需要经历这样的过程。

- 用户体验不够友好

如果网页上的资源较多或者网速不好，这个过程就会有明显的卡顿或者布局错乱，影响用户体验。

- 开发成本高

传统的多页面模式缺少前端工程化的很多优秀技术栈支持，前端开发者在刀耕火种的开发过程中效率低下。如果是基于 PHP 等非前端语言开发，工作量通常更是压在一名开发者身上，无法做到前后端分离来利用好跨岗位协作。

:::tip
此处列举的多页面应用问题均指传统开发模式下的多页面，之所以特地说明，是因为后文还会有新的技术栈来实现多页面应用，但实现原理和体验并不一样。
:::

#### 单页面应用

正因为传统的多页面应用存在了很多无法解决的开发问题和用户体验问题，催生了现代化的 SPA 单页面应用技术的诞生。

SPA 单页面应用是现代化的网站体验，与 MPA 相反，不论站点内有多少个页面，在 SPA 项目实际上只有一个 HTML 文件，也就是 `index.html` 首页文件。

它只有第一次访问的时候才需要经历一次完整的页面请求过程，之后的每个内部跳转或者数据更新操作，都是通过 AJAX 技术来获取需要呈现的内容并只更新指定的网页位置。

:::tip
AJAX 技术（ Asynchronous JavaScript and XML ）是指在不离开页面的情况下，通过 JavaScript 发出 HTTP 请求，让网页通过增量更新的方式呈现给用户界面，而不需要刷新整个页面来重新加载，是一种 “无刷体验” 。
:::

SPA 在页面跳转的时候，地址栏也会发生变化，主要有以下两种方式：

1. 通过修改 [Location:hash](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/hash) 修改 URL 的 Hash 值（也就是 `#` 号后面部分），例如从 `https://example.com/#/foo` 变成 `https://example.com/#/bar`
2. 通过 History API 的 [pushState](https://developer.mozilla.org/zh-CN/docs/Web/API/History/pushState) 方法更新 URL ，例如从 `https://example.com/foo` 变成 `https://example.com/bar`

这两个方式的共同特点是更新地址栏 URL 的时候，均不会刷新页面，只是单纯的变更地址栏的访问地址，而网页的内容则通过 AJAX 更新，配合起来就形成了一种网页的 “前进 / 后退” 等行为效果。

:::tip
Vue Router 默认提供了这两种 URL 改变方式的支持，分别是 `createWebHashHistory` 的 Hash 模式和 `createWebHistory` 对应的 History 模式，在 [路由的使用](router.md) 一章可以学习更多 Vue 路由的使用。
:::

理解了实现原理之后，可以把 SPA 的请求过程简化为如下步骤：

```bash
# SPA 页面跳转过程

从用户点击跳转开始：
---> 浏览器通过 `pushState` 等方法更新 URL
---> 请求接口数据（如果有涉及到前后端交互）
---> 通过 JavaScript 处理数据，拼接 HTML 片段
---> 把 HTML 片段渲染到指定位置，完成页面的 “刷新”
```

##### SPA 的优点

从上面的实现原理已经能总结出它的优势了：

- 只有一次完全请求的等待时间（首屏加载）
- 用户体验好，内部跳转的时候可以实现 “无刷切换”
- 因为不需要重新请求整个页面，所以切换页面的时候速度更快
- 因为没有脱离当前页面，所以 “页” 与 “页” 之间在切换过程中支持动画效果
- 脱离了页面跳页面的框架，让整个网站形成一个 Web App ，更接近原生 App 的访问体验
- 开发效率高，前后端分离，后端负责 API 接口，前端负责界面和联调，同步进行缩短工期

这也是为什么短短几年时间， SPA 的体验模式成为前端领域的主流。

##### SPA 的缺点

虽然 SPA 应用在使用过程中的用户体验非常好，但也有自身的缺点存在：

- 首屏加载相对较慢

由于 SPA 应用的路由是由前端控制， SPA 在打开首页后，还要根据当前的路由再执行一次内容渲染，相对于 MPA 应用从服务端直出 HTML ，首屏渲染所花费的时间会更长。

- 不利于 SEO 优化

由于 SPA 应用全程是由 JavaScript 控制内容的渲染，因此唯一的一个 HTML 页面 `index.html` 通常是一个空的页面，只有最基础的 HTML 结构，不仅无法设置每个路由页面的 TDK ，页面内容也无法呈现在 HTML 代码里，因此对搜索引擎来说，网站的内容再丰富，依然只是一个 “空壳” ，无法让搜索引擎进行内容爬取。

<ClientOnly>
  <ImgWrap
    src="/assets/img/seo-spa-page-code.jpg"
    dark="/assets/img/seo-spa-page-code-dark.jpg"
    alt="单页面应用的网页内容只有一个空的 HTML 结构"
  />
</ClientOnly>

为了减少用户等待过程中的焦虑感，可以通过增加 Loading 过程，或者 Skeleton 骨架屏等优化方案，但其实也是治标不治本，因此为了结合 SPA 和 MPA 的优点，又进一步催生出了更多实用的技术方案以适配更多的业务场景，在后面的小节将逐一介绍。

### CSR 与 SSR

在了解了 MPA 与 SPA 之后，先了解另外两个有相关联的名词： CSR 与 SSR ，同样的，这一对也是代表着相反的开发模式和用户体验，它们的全称和中文含义如下：

| 名词 |         全称          |    中文    |
| :--: | :-------------------: | :--------: |
| CSR  | Client-Side Rendering | 客户端渲染 |
| SSR  | Server-Side Rendering | 服务端渲染 |

正如它们的名称，这两者代表的是渲染网页过程中使用到的技术栈。

#### 客户端渲染

在 [MPA 多页面应用与 SPA 单页面应用](#mpa-与-spa) 部分的介绍过的 SPA 单页面应用，正是基于 CSR 客户端渲染实现的（因此大部分情况下， CSR 等同于 SPA ，包括实现原理和优势），这是一种利用 AJAX 技术，把渲染工作从服务端转移到客户端完成，不仅客户端的用户体验更好，前后端分离的开发模式更加高效。

但随之而来的首屏加载较慢、不利于 SEO 优化等缺点，而 SPA 的这几个缺点，却是传统 MPA 多页面应用所具备的优势，但同样的， MPA 也有着自己开发成本高、用户体验差等问题。

既然原来的技术方案无法完美满足项目需求，因此在结合 MPA 的优点和 SPA 的优点之后，一种新的技术随之诞生，这就是 SSR 服务端渲染。

#### 服务端渲染

和传统的 MPA 使用 PHP / JSP 等技术栈做服务端渲染不同，现代前端工程化里的 SSR 通常是指使用 Node.js 作为服务端技术栈。

:::tip
在 [工程化神器 Node.js](#工程化神器-node-js) 一节会介绍 Node ，以及它对前端工程化带来的重大变化，现代前端工程化发展离不开它的存在。
:::

传统的服务端渲染通常由后端开发者一起维护前后端代码，需要写后端语言支持的模板、 JavaScript 代码维护成本也比较高；而 SSR 服务端渲染则是交给前端开发者来维护，利用 Node 提供的能力进行同构渲染，由于本身前后端都使用 JavaScript 编写，维护成本也大大的降低。

SSR 技术利用的同构渲染方案（ Isomorphic Rendering ），指的是一套代码不仅可以在客户端运行，也可以在服务端运行，在一些合适的时机先由服务端完成渲染（ Server-Side Rendering ）再直出给客户端激活（ Client-Side Hydration ），这种开发模式带来了：

- 更好的 SEO 支持，解决了 SPA 单页面应用的痛点
- 更快的首屏加载速度，保持了 MPA 多页面应用的优点
- 和 SPA 一样支持前后端分离，开发效率依然很高
- 有更好的客户端体验，当用户完全打开页面后，本地访问过程中也可以保持 SPA 单页面应用的体验
- 统一的心智模型，由于支持同构，因此没有额外的心智负担

那么，使用 Vue 开发项目时，应该如何实现 SSR 呢？

Vue 的 SSR 支持非常好， Vue 官方不仅提供了一个 [Vue.js 服务器端渲染指南](https://cn.vuejs.org/guide/scaling-up/ssr.html) 介绍了基于 Vue 的 SSR 入门实践，还有基于 Vue 的 [Nuxt.js](https://github.com/nuxt/framework) 、 [Quasar](https://github.com/quasarframework/quasar) 框架帮助开发者更简单的落地 SSR 开发，构建工具 Vite 也有内置的 [Vue SSR](https://cn.vitejs.dev/guide/ssr.html) 支持。

### Pre-Rendering 与 SSG

在介绍了 SSR 服务端渲染技术后，读者可能会想到一个问题，就是 SSR 的开发成本总归比较高，如果本身项目比较简单，例如一个静态博客，或者静态官网、落地页等内容不多，仅需要简单的 SEO 支持的项目需求，是否有更简便的方案呢？

以下两种方案正是用于满足这类需求的技术：

|     名词      |          全称          |     中文     |
| :-----------: | :--------------------: | :----------: |
| Pre-Rendering |     Pre-Rendering      |    预渲染    |
|      SSG      | Static-Site Generation | 静态站点生成 |

#### 预渲染

预渲染也是一种可以让 [SPA 单页面应用](#单页面应用) 解决 SEO 问题的技术手段。

预渲染的原理是在构建的时候启动无头浏览器（ Headless Browser ），加载页面的路由并将访问结果按照路由的路径保存到静态 HTML 文件里，这样部署到服务端的页面，不再是一个空的 HTML 页面，而是有真实内容的存在，但由于只在构建时运行，因此用户每次访问的时候 HTML 里的内容不会产生变化，直到下一次构建。

:::tip
无头浏览器（ Headless Browser ），指没有 GUI 界面的浏览器，使用代码通过编程接口来控制浏览器的行为，常用于网络爬虫、自动化测试等场景，预渲染也使用它来完成页面的渲染，以获取渲染后的代码来填充 HTML 文件。
:::

预渲染和 [服务端渲染](#服务端渲染) 最大的区别在于，预渲染只在构建的时候就完成了页面内容的输出（发生在用户请求前），因此构建后不论用户何时访问， HTML 文件里的内容都是构建的时候的那份内容，所以预渲染适合一些简单的、有一定的 SEO 要求但对内容更新频率没有太高要求、内容多为静态展示的页面。

例如企业用于宣传的官网页面、营销活动的推广落地页都非常适合使用预渲染技术，现代的构建工具都提供了预渲染的内置实现，例如这个教程： [用 Vite 更简单的解决 Vue3 项目的预渲染问题](https://github.com/chengpeiquan/vite-vue3-prerender-demo) ，就是通过 Vite 的内置功能来实现预渲染，最终也运用到了公司的业务上。

#### 静态站点生成

SSG 静态站点生成是基于预渲染技术，通过开放简单的 API 和配置文件，就让开发者可以实现一个预渲染静态站点的技术方案。

它可以让开发者定制站点的个性化渲染方案，但更多情况下，通常是作为一些开箱即用的技术产品来简化开发过程中的繁琐步骤，这一类技术产品通常称之为静态站点生成器（ Static-Site Generator ，也是简称 SSG ）。

常见的 SSG 静态站点生成器有：基于 Vue 技术的 [VuePress](https://github.com/vuejs/vuepress) 和 [VitePress](https://github.com/vuejs/vitepress) ，自带了 Vue 组件的支持，还有基于 React 的 [Docusaurus](https://github.com/facebook/docusaurus) ，以及很多各有特色的生成器，例如 [Jekyll](https://github.com/jekyll/jekyll) 、 [Hugo](https://github.com/gohugoio/hugo) 等等。

如果有写技术文档或者博客等内容创作需求，使用静态站点生成器是一个非常方便的选择，通常这一类产品还有非常多的个性化主题可以使用。

### ISR 与 DPR

在现代化的开发概念这一节，从 [MPA 多页面应用到 SPA 单页面应用](#mpa-与-spa) ，再到 [CSR 客户端渲染和 SSR 服务端渲染](#csr-与-ssr) ，以及 [Pre-Rendering 预渲染与 SSG 静态站点生成](#pre-rendering-与-ssg) ，似乎已经把所有常见的开发场景覆盖完了。

那接下来要讲的 ISR 和 DPR 又是什么用途的技术方案呢？先看看它们的全称和中文含义：

| 名词 |               全称               |       中文       |
| :--: | :------------------------------: | :--------------: |
| ISR  |    Incremental Site Rendering    | 增量式的网站渲染 |
| DPR  | Distributed Persistent Rendering | 分布式的持续渲染 |

当网站的内容体量达到一定程度的时候，从头开始构建进行预渲染所花费的时间会非常久，而实际上并不是所有页面的内容都需要更新，这两项技术的推出是为了提升大型项目的渲染效率。

ISR 增量式的网站渲染，通过区分 “关键页面” 和 “非关键页面” 进行构建，优先预渲染 “关键页面” 以保证内容的最新和正确，同时缓存到 CDN ，而 “非关键页面” 则交给用户访问的时候再执行 CSR 客户端渲染，并触发异步的预渲染缓存到 CDN 。

这样做的好处是，大幅度的提升了每次构建的时间，但由于只保证部分 “关键页面” 的构建和内容正确，所以访问 “非关键页面” 的时候，有可能先看到旧的内容，再由 CSR 刷新为新的内容，会丢失一部分用户体验。

更多 ISR 技术细节可以阅读 Netlify 的开发者体验总监 Cassidy Williams 的一篇文章： [Incremental Static Regeneration: Its Benefits and Its Flaws](https://www.netlify.com/blog/2021/03/08/incremental-static-regeneration-its-benefits-and-its-flaws/) 。

DPR 分布式的持续渲染则是为了解决 ISR 方案下可能访问到旧内容的问题，这也是由 Cassidy Williams 发起的一个提案，详情可在 GitHub 查看：[Distributed Persistent Rendering (DPR)](https://github.com/jamstack/jamstack.org/discussions/549) 。

由于目前这两项技术还在发展初期，能够支持的框架和服务还比较少，在这里建议作为一种技术知识储备提前了解，在未来的某一天有业务需要的时候，也可以知道有这样的方案可以解决问题。

## 工程化不止于前端

在 [现代化的开发概念](#现代化的开发概念) 部分所讲述的都是关于网页开发的变化，当然，前端这个岗位本身就是从页面开发发展起来的，自然还是离不开网页这个老本行。

但随着前端工程化的发展，前端越来越不止于写前端，已经有很多前端工程师利用前端工程化带来的优势，不仅仅只是做一个 Web 前端，开始逐步发展为一个全栈工程师，在企业内部承担起了更多的岗位职责，包括作者笔者也是。

之所以能做这么多事情，得益于 Node.js 在前端开发带来的翻天覆地的变化，可以在保持原有的 JavaScript 和 TypeScript 基础上，几乎没有过多的学习成本就可以过度到其他端的开发。

在了解 Node.js 之前，先来看看现在的前端开发工程师除了写 Web 前端，还可以做到哪些岗位的工作。

### 服务端开发

在传统的认知里，如果一个前端工程师想自己搭建一个服务端项目，需要学习 Java 、 PHP 、 Go 等后端语言，还需要学习 Nginx 、 Apache 等 Web Server 程序的使用，并使用这些技术来开发并部署一个项目的服务端。

现在的前端工程师可以利用 Node.js ，单纯使用 JavaScript 或者 TypeScript 来开发一个基于 Node 的服务端项目。

Node 本身是一个 JavaScript 的运行时，还提供了 [HTTP 模块](https://nodejs.org/api/http.html) 可以启动一个本地 HTTP 服务，如果把 Node 项目部署到服务器上，就可以运行一个可对外访问的公网服务。

但 Node 的原生服务端开发成本比较高，因此在 GitHub 开源社区也诞生了很多更方便的、开箱即用、功能全面的服务端框架，根据它们的特点，可以简单归类如下：

以 [Express](https://github.com/expressjs/express) 、 [Koa](https://github.com/koajs/koa) 、 [Fastify](https://github.com/fastify/fastify) 为代表的轻量级服务端框架，这一类框架的特点是 “短平快” ，对于服务端需求不高，只是跑一些小项目的话，开箱即用非常的方便，比如 Build 了一个 Vue 项目，然后提供一个读取静态目录的服务来访问它。

但是 “短平快” 框架带来了一些团队协作上的弊端，如果缺少一些架构设计的能力，很容易把一个服务端搭的很乱以至于难以维护，比如项目的目录结构、代码的分层设计等等，每个创建项目的人都有自己的想法和个人喜好，就很难做到统一管理。

因此在这些框架的基础上，又诞生了以 [Nest](https://github.com/nestjs/nest) （底层基于 Express ，可切换为 Fastify ）、 [Egg](https://github.com/eggjs/egg) （基于 Koa ）为代表的基于 MVC 架构的企业级服务端框架，这一类框架的特点是基于底层服务进行了更进一步的架构设计并实现了代码分层，还自带了很多开箱即用的 Building Blocks ，例如 TypeORM 、WebSockets 、Swagger 等等，同样也是开箱即用，对大型项目的开发更加友好。

:::tip
当然， Node.js 所做的事情是解决服务端程序部分的工作，如果涉及到数据存储的需求，学习 MySQL 和 Redis 的技术知识还是必不可少的！
:::

### App 开发

常规的 Native App 原生开发需要配备两条技术线的支持：使用 Java / Kotlin 语言开发 Android 版本，使用 Objective-C / Swift 语言开发 iOS 版本，这对于创业团队或者个人开发者来说都是一个比较高的开发成本。

前端开发者在项目组里对 App 的作用通常是做一些活动页面、工具页面内嵌到 App 的 WebView 里，如果是在一些产品比较少的团队里，例如只有一个 App 产品，那么前端的存在感会比较低。

而 Hybrid App 的出现，使得前端开发者也可以使用 JavaScript / TypeScript 来编写混合 App ，只需要了解简单的打包知识，就可以参与到一个 App 的开发工作中。

开发 Hybrid App 的过程通常称为混合开发，最大的特色就是一套代码可以运行到多个平台，这是因为整个 App 只有一个基座，里面的 App 页面都是使用 UI WebView 来渲染的 Web 界面，因此混合开发的开发成本相对于原生开发是非常低的，通常只需要一个人 / 一个小团队就可以输出双平台的 App ，并且整个 App 的开发周期也会更短。

在用户体验方面， Hybrid App 相对于 Native App ，一样可以做到：

- 双平台的体验一致性
- 支持热更新，无需用户重新下载整个 App
- 内置的 WebView 在交互体验上也可以做到和系统交互，比如读取 / 存储照片、通讯录，获取定位等等
- 支持 App Push 系统通知推送
- 还有很多 Native App 具备的功能

基本上 Native App 的常见功能，在 Hybrid App 都能满足。

而且大部分情况下，在构建 Hybrid App 的时候还可以顺带输出一个 Web App 版本，也就是让这个 App 在被用户下载前，也有一模一样的网页版可以体验，这对于吸引新用户是非常有用的。

在混合开发的过程中，通常是由前端开发者来负责 App 项目从 “开发” 到 “打包” 再到 “发版” 的整个流程，在开发的过程中是使用常见的前端技术栈，例如目前主流的有基于 Vue 的 [uni-app](https://github.com/dcloudio/uni-app) 、基于 React 的 [React Native](https://github.com/facebook/react-native) 等等，这些 Hybrid 框架都具备了 “学习成本低、开发成本低、一套代码编译多个平台” 的特点。

在 App 开发完毕后，使用 Hybrid 框架提供的 CLI 工具编译出 App 资源包，再根据框架提供的原生基座打包教程去完成 Android / iOS 的安装包构建，这个环节会涉及到原生开发的知识，例如 Andorid 包的构建会使用到 Android Studio ，但整个过程使用到原生开发的环节非常少，几乎没有太高的学习门槛。

### 桌面程序开发

放在以前要开发一个 Windows 桌面程序，需要用上 QT / WPF / WinForm 等技术栈，还要学习 C++ / C# 之类的语言，对于只想在业余写几个小工具的开发者来说，上手难度和学习成本都很高，但在前端工程化的时代里，使用 JavaScript 或 TypeScript 也可以满足程序开发的需要。

这得益于 [Electron](https://github.com/electron/electron) / [Tauri](https://github.com/tauri-apps/tauri) 等技术栈的出现，其中 Electron 的成熟度最高、生态最完善、最被广泛使用，除了可以构建 Windows 平台支持的 `.exe` 文件之外，对 macOS 和 Linux 平台也提供了对应的文件构建支持。

广大前端开发者每天都在使用的 [Visual Studio Code](https://code.visualstudio.com) 以及知名的 HTTP 网络测试工具 [Postman](https://www.postman.com) 都是使用 Electron 开发的。

<ClientOnly>
  <ImgWrap
    src="/assets/img/screenshot-vscode.jpg"
    dark="/assets/img/screenshot-vscode-dark.jpg"
    alt="Visual Studio Code 界面截图"
  />
</ClientOnly>

<ClientOnly>
  <ImgWrap
    src="/assets/img/screenshot-postman.jpg"
    dark="/assets/img/screenshot-postman-dark.jpg"
    alt="Postman 界面截图"
  />
</ClientOnly>

笔者也通过 Electron 构建了多个给公司内部使用的界面化工具客户端，这一类技术栈对于前端开发者来说，真的非常方便！在这里以 Electron 为例，简单讲解下它的工作原理，以了解为什么程序开发可以如此简单。

Electron 的底层是基于 Chromium 和 Node.js ，它提供了两个进程供开发者使用：

1. 主进程：它是整个应用的入口点，主进程运行在 Node 环境中，可以使用所有的 Node API ，程序也因此具备了和系统进行交互的能力，例如文件的读写操作。

2. 渲染进程：负责与用户交互的 GUI 界面，基于 Chromium 运行，所以开发者得以使用 HTML / CSS / JavaScript 像编写网页一样来编写程序的 GUI 界面。

一个程序应用只会有一个主进程，而渲染进程则可以根据实际需求创建多个，渲染进程如果需要和系统交互，则必须与主进程通信，借助主进程的能力来实现。

在构建的时候， Electron 会把 Node 和 Chromium 一起打包为一个诸如 `.exe` 这样的安装文件（或者是包含了两者的免安装版本），这样用户不需要 Node 环境也可以运行桌面程序。

### 应用脚本开发

在 [桌面程序开发](#桌面程序开发) 部分讲的是构建一种拥有可视化 GUI 界面的程序，但有时候并不需要复杂的 GUI ，可能只想提供一个双击运行的脚本类程序给用户，现在的前端工程化也支持使用 JavaScript 构建一个无界面的应用脚本。

假如某一天公司的运营小姐姐希望能做一个自动化的脚本减轻她们的机械操作，或者是自己工作过程中发现一些日常工作可以交付给脚本解决的情况，就可以使用这种方式来输出一个脚本程序，使用的时候双击运行非常方便。

笔者之前为了让团队的工程师减少写日报的心智负担，也是使用了这个方式编写了一个 [git-commit-analytics](https://github.com/analyticsjs/git-commit-analytics) 工具，部门里的工程师可以通过规范化 commit 来生成每天的工作日报，每天双击一下就可以生成一份报告，很受团队的喜欢。

<ClientOnly>
  <ImgWrap
    src="/assets/img/screenshot-pkg.jpg"
    dark="/assets/img/screenshot-pkg-dark.jpg"
    alt="使用 Pkg 构建后的程序运行截图"
  />
</ClientOnly>

在这里推荐一个工具 [Pkg](https://github.com/vercel/pkg) ，它可以把 Node 项目打包为一个可执行文件，支持 Windows 、 macOS 、 Linux 等多个平台，它的打包机制和 Electron 打包的思路类似，也是通过把 Node 一起打包，让用户可以在不安装 Node 环境的情况下也可以直接运行脚本程序。

## 实践工程化的流程

基于 Vue 3 的项目，最主流的工程化组合拳有以下两种：

| 常用方案 | Runtime | 构建工具 | 前端框架 |
| :------: | :-----: | :------: | :------: |
|  方案一  |  Node   | Webpack  |   Vue    |
|  方案二  |  Node   |   Vite   |   Vue    |

方案一是比较传统并且过去项目使用最多的方案组合，但从 2021 年初随着 Vite 2.0 的发布，伴随着更快的开发体验和日渐丰富的社区生态，新项目很多都开始迁移到方案二，因此本书秉着面向当下与未来的原则，会侧重 Vite 的使用来开展讲解，包括一些 demo 的创建等等。

当技术成熟的时候，还可以选择更喜欢的方案自行组合，例如用 Deno 来代替 Node ，但前期还是按照主流的方案来进入工程化的学习。

下面的内容将根据 Vue 3 的工程化开发，逐一讲解涉及到常用的工具，了解它们的用途和用法。

## 工程化神器 Node.js

只要在近几年有接触过前端开发，哪怕没有实际使用过，也应该有听说过 Node.js ，那么它是一个什么样的存在？

### 什么是 Node.js

Node.js （简称 Node ） 是一个基于 Chrome V8 引擎构建的 JS 运行时（ JavaScript Runtime ）。

它让 JavaScript 代码不再局限于网页上，还可以跑在客户端、服务端等场景，极大的推动了前端开发的发展，现代的前端开发几乎都离不开 Node 。

### 什么是 Runtime

Runtime ，可以叫它 “运行时” 或者 “运行时环境” ，这个概念是指，项目的代码在哪里运行，哪里就是运行时。

传统的 JavaScript 只能跑在浏览器上，每个浏览器都为 JS 提供了一个运行时环境，可以简单的把浏览器当成一个 Runtime ，明白了这一点，相信就能明白什么是 Node 。

Node 就是一个让 JS 可以脱离浏览器运行的环境，当然，这里并不是说 Node 就是浏览器。

### Node 和浏览器的区别

虽然 Node 也是基于 Chrome V8 引擎构建，但它并不是一个浏览器，它提供了一个完全不一样的运行时环境，没有 Window 、没有 Document 、没有 DOM 、没有 Web API ，没有 UI 界面…

但它提供了很多浏览器做不到的能力，比如和操作系统的交互，例如 “文件读写” 这样的操作在浏览器有诸多的限制，而在 Node 则轻轻松松。

对于前端开发者来说， Node 的巨大优势在于，使用一种语言就可以编写所有东西（前端和后端），不再花费很多精力去学习各种各样的开发语言。

哪怕仅仅只做 Web 开发，也不再需要顾虑新的语言特性在浏览器上的兼容性（ e.g. ES6 、 ES7 、 ES8 、 ES9 …）， Node 配合构建工具，以及诸如 Babel 这样的代码编译器，可以帮转换为浏览器兼容性最高的 ES5 。

当然还有很多工程化方面的好处，总之一句话，使用 Node ，的开发体验会非常好。

在 [工程化的入门准备](guide.md) 一章中，会对 Node 开发做进一步的讲解，下面先继续顺着 Node 的工具链，了解与日常开发息息相关的前端构建工具。

## 工程化的构建工具

在前端开发领域，构建工具已经成为现在必不可少的开发工具了，很多刚接触前端工程化的开发者可能会有疑惑，为什么以前的前端页面直接编写代码就可以在浏览器访问，现在却还要进行构建编译，是否 “多此一举” ？

要消除这些困惑，就需要了解一下为什么要使用构建工具，知道构建工具在开发上能够给带来什么好处。

### 为什么要使用构建工具

目前已经有很多流行的构建工具，例如： [Grunt](https://github.com/gruntjs/grunt) 、 [Gulp](https://github.com/gulpjs/gulp) 、 [Webpack](https://github.com/webpack/webpack) 、 [Snowpack](https://github.com/FredKSchott/snowpack) 、 [Parcel](https://github.com/parcel-bundler/parcel) 、 [Rollup](https://github.com/rollup/rollup) 、 [Vite](https://github.com/vitejs/vite) … 每一个工具都有自己的特色。

如上面列举的构建工具，虽然具体到某一个工具的时候，是 “一个” 工具，但实际上可以理解为是 “一套” 工具链、工具集，构建工具通常集 “语言转换 / 编译” 、 “资源解析” 、 “代码分析” 、 “错误检查” 、 “任务队列” 等非常多的功能于一身。

构建工具可以帮解决很多问题，先看看最基础的一个功能支持： “语言转换 / 编译” 。

且不说构建工具让可以自由自在的在项目里使用 TypeScript 这些新兴的语言，单纯看历史悠久的 JavaScript ，从 2015 年开始，每年也都会有新的版本发布（例如 ES6 对应 ES2015 、 ES7 对应 ES2016 、 ES8 对应 ES2017 等等）。

虽然新版本的 JS API 更便捷更好用，但浏览器可能还没有完全支持，这种情况下可以通过构建工具去转换成兼容度更高的低版本 JS 代码。

举个很常用到的例子，现在判断一个数组是否包含某个值，通常会这么写：

```js{5}
// 声明一个数组
const arr = ['foo', 'bar', 'baz']

// 当数组包含 foo 这个值时，处理一些逻辑
if (arr.includes('foo')) {
  // do something…
}
```

通过 `Array.prototype.includes()` 这个实例方法返回的布尔值，判断数组是否包含目标值，而这个方法是从 ES6 开始支持的，对于不支持 ES6 的古董浏览器，只能使用其他更早期的方法代替（ e.g. `indexOf` ），或者手动引入它的 Polyfill 来保证这个方法可用。

:::tip
Polyfill 是在浏览器不支持的情况下实现某个功能的代码，可以在概念发明者 Remy Sharp 的博文里了解到它的由来，是一个挺有意思的命名。

点击阅读： [What is a Polyfill?](https://remysharp.com/2010/10/08/what-is-a-polyfill)
:::

以下是摘选自 MDN 网站上关于 [Array.prototype.includes()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes#polyfill) 的 Polyfill 实现：

```js
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function (valueToFind, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined')
      }

      // 1. Let O be ? ToObject(this value).
      var o = Object(this)

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0

      // 3. If len is 0, return false.
      if (len === 0) {
        return false
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0)

      function sameValueZero(x, y) {
        return (
          x === y ||
          (typeof x === 'number' &&
            typeof y === 'number' &&
            isNaN(x) &&
            isNaN(y))
        )
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(valueToFind, elementK) is true, return true.
        if (sameValueZero(o[k], valueToFind)) {
          return true
        }
        // c. Increase k by 1.
        k++
      }

      // 8. Return false
      return false
    },
  })
}
```

由于 JavaScript 允许更改 prototype ，所以 Polyfill 的原理就是先检查浏览器是否支持某个方法，当浏览器不支持的时候，会借助已经被广泛支持的方法来实现相同的功能，达到在旧浏览器上也可以使用新方法的目的。

下面是一个简单的 `includes` 方法实现，也借用浏览器支持的 `indexOf` 方法，让不支持 `includes` 的浏览器也可以使用 `includes` ：

```js
// 借助 indexOf 来实现一个简单的 includes
if (!Array.prototype.includes) {
  Array.prototype.includes = function (v) {
    return this.indexOf(v) > -1
  }
}
```

:::warning
请注意，上面这个实现方案很粗糙，没有 Polyfill 的方案考虑的足够周到，只是在这里做一个简单的实现演示。
:::

Polyfill 会考虑到多种异常情况，最大幅度保证浏览器的兼容支持，当然一些复杂的方法实现起来会比较臃肿，全靠人工维护 Polyfill 很不现实。

而且实际的项目里，要用到的 JavaScript 原生方法非常多，不可能手动去维护每一个方法的兼容性，所以这部分工作，通常会让构建工具来自动化完成，常见的方案就有 [Babel](https://github.com/babel/babel) 。

除了 “语言转换 / 编译” 这个好处之外，在实际的开发中，构建工具可以更好的提高开发效率、自动化的代码检查、规避上线后的生产风险，例如：

- 项目好多代码可以复用，可以直接抽离成 [模块](#学习模块化设计) 、 [组件](#认识组件化设计) ，交给构建工具去合并打包
- [TypeScript](typescript.md) 的类型系统和代码检查真好用，也可以放心写，交给构建工具去编译
- CSS 写起来很慢，可以使用 Sass 、 Less 等 [CSS 预处理器](component.md#使用-css-预处理器) ，利用它们的变量支持、混合继承等功能提高开发效率，最终交给构建工具去编译回 CSS 代码
- 海量的 [npm 包](#依赖包和插件) 开箱即用，剩下的工作交给构建工具去按需抽离与合并
- 项目上线前代码要混淆，人工处理太费劲，交给构建工具自动化处理
- 还有很多列举不完的其他场景…

下面基于接下来要学习的 Vue3 技术栈，介绍两个流行且强相关的构建工具： [Webpack](#webpack) 和 [Vite](#vite) 。

### Webpack

Webpack 是一个老牌的构建工具，前些年可以说几乎所有的项目都是基于 Webpack 构建的，生态最庞大，各种各样的插件最全面，对旧版本的浏览器支持程度也最全面。

点击访问：[Webpack 官网](https://webpack.js.org)

在升级与配置一章里的 [使用 @vue/cli 创建项目](upgrade.md#使用-vue-cli-创建项目) 会指导如何使用 Vue CLI 创建一个基于 Webpack 的 Vue 项目。

### Vite

Vite 的作者也是熟悉的 Vue 作者尤雨溪，它是一个基于 ESM 实现的构建工具，主打更轻、更快的开发体验，主要面向现代浏览器，于 2021 年推出 2.x 版本之后，进入了一个飞速发展的时代，目前市场上的 npm 包基本都对 Vite 做了支持，用来做业务已经没有问题了。

毫秒级的开发服务启动和热重载，对 TypeScript 、 CSS 预处理器等常用开发工具都提供了开箱即用的支持，也兼容海量的 npm 包，如果是先用 Webpack 再用的 Vite ，会很快就喜欢上它！

点击访问：[Vite 官网](https://cn.vitejs.dev)

在升级与配置一章里的 [使用 Vite 创建项目](upgrade.md#使用-vite-创建项目-new) 会指导如何使用流行脚手架创建一个基于 Vite 的 Vue 项目。

### 两者的区别

在开发流程上， Webpack 会先打包，再启动开发服务器，访问开发服务器时，会把打包好的结果直接给过去，下面是 Webpack 使用的 bundler 机制的工作流程。

<ClientOnly>
  <ImgWrap
    src="/assets/img/bundler.png"
    alt="Webpack 的工作原理（摘自 Vite 官网）"
  />
</ClientOnly>

Vite 是基于浏览器原生的 ES Module ，所以不需要预先打包，而是直接启动开发服务器，请求到对应的模块的时候再进行编译，下面是 Vite 使用的 ESM 机制的工作流程。

<ClientOnly>
  <ImgWrap
    src="/assets/img/esm.png"
    alt="Vite 的工作原理（摘自 Vite 官网）"
  />
</ClientOnly>

所以当项目体积越大的时候，在开发启动速度上， Vite 和 Webpack 的差距会越来越大。

可以点击 Vite 官网的这篇文章： [为什么选 Vite](https://cn.vitejs.dev/guide/why.html) 了解更多的技术细节。

构建方面，为了更好的加载体验，以及 Tree Shaking 按需打包 、懒加载和 Chunk 分割利于缓存，两者都需要进行打包；但由于 Vite 是面向现代浏览器，所以如果的项目有兼容低版本浏览器的需求的话，建议还是用 Webpack 来打包，否则， Vite 是目前的更优解。

### 开发环境和生产环境

在使用构建工具的时候，需要了解一下 “环境” 的概念，对构建工具而言，会有 “开发环境（ development ）” 和 “生产环境（ production ）” 之分。

:::tip
需要注意的是，这和业务上的 “测试 -> 预发 -> 生产” 那几个环境的概念是不一样的，业务上线流程的这几个环境，对于项目来说，都属于 “生产环境” ，因为需要打包部署。
:::

#### 开发环境

前面在编写 [Hello TypeScript](typescript.md#hello-typescript) 这个 demo 的时候，使用了 `npm run dev:ts` 这样的命令来测试 TypeScript 代码的可运行性，可以把这个阶段认为是的一个 “测试环境” ，这个时候代码不管怎么写，它都是 TypeScript 代码，不是最终要编译出来的 JavaScript 。

如果基于 Webpack 或者 Vite 这样的构建工具，测试环境提供了更多的功能，例如：

- 可以使用 TypeScript 、 CSS 预处理器之类的需要编译的语言提高开发效率
- 提供了热重载（ Hot Module Replacement ， 简称 HMR ），当修改了代码之后，无需重新运行或者刷新页面，构建工具会检测的修改自动帮更新
- 代码不会压缩，并有 Source Mapping 源码映射，方便 BUG 调试
- 默认提供局域网服务，无需自己做本地部署
- 更多 …

#### 生产环境

在 [Hello TypeScript](typescript.md#hello-typescript) demo 最后配置的一个 `npm run build` 命令，将 TypeScript 代码编译成了 JavaScript ，这个时候 dist 文件夹下的代码文件就处于 “生产环境” 了，因为之后不论源代码怎么修改，都不会直接影响到它们，直到再次执行 build 编译。

可以看出生产环境和开发环境最大的区别就是稳定！除非再次打包发布，否则不会影响到已部署的代码。

- 代码会编译为浏览器最兼容的版本，一些不兼容的新语法会进行 [Polyfill](https://developer.mozilla.org/zh-CN/docs/Glossary/Polyfill)
- 稳定，除非重新发布，否则不会影响到已部署的代码
- 打包的时候代码会进行压缩混淆，缩小项目的体积，也降低源码被直接曝光的风险

#### 环境判断

在 Webpack ，可以使用 `{{ env }}` 来区分开发环境（ development ）还是生产环境（ production ），它会返回当前所处环境的名称。

在 Vite ，还可以通过判断 `import.meta.env.DEV` 为 `true` 时是开发环境，判断 `import.meta.env.PROD` 为 `true` 时是生产环境（这两个值永远相反）。

有关环境变量的问题可以查阅以下文档：

|  工具   | 文档                                                            |
| :-----: | :-------------------------------------------------------------- |
| Webpack | [模式](https://www.webpackjs.com/concepts/mode/)                |
|  Vite   | [环境变量和模式](https://cn.vitejs.dev/guide/env-and-mode.html) |

<script setup>
const env = 'process.env' + '.NODE_ENV'
</script>

<!-- 评论 -->
<ClientOnly>
  <GitalkComment
    :issueId="194"
  />
</ClientOnly>
<!-- 评论 -->
