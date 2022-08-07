# 了解前端工程化

现在前端的工作中，实际业务里的前端开发，和你刚接触时的前端开发已经完全不同了。

刚接触前端的时候，做一个页面，是先创建 HTML 页面文件写页面结构，再在里面写 CSS 代码美化页面，再根据需要写一些 JavaScript 代码增加交互功能，需要几个页面就创建几个页面，相信大家的前端起步都是从这个模式开始的。

而实际上的前端开发工作，早已进入了前端工程化开发的时代，已经充满了各种现代化框架、预处理器、代码编译…

最终的产物也不再单纯是多个 HTML 页面，经常能看到 SPA / SSR / SSG 等词汇的身影。

## 传统开发的弊端

在了解什么是前端工程化之前，我们先回顾一下传统开发存在的一些弊端，这样更能知道我们为什么需要它。

在传统的前端开发模式下，前端工程师大部分只需要单纯的写写页面，都是在 HTML 文件里直接编写代码，所需要的 JavaScript 代码是通过 `script` 标签以内联或者文件引用的形式放到 HTML 代码里的，当然 CSS 代码也是一样的处理方式。

例如这样：

```html
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
  
</body>
</html>
```

如演示代码，虽然可以把代码分成多个文件来维护，这样可以有效降低代码维护成本，但在实际开发过程中，还是会存在代码运行时的一些问题。

### 一个常见的案例

我们继续用上面的演示代码，来看一个最简单的一个例子。

先在 `lib-1.js` 文件里，我们声明一个变量：

```js
var foo = 1
```

然后在 `lib-2.js` 文件里，我们也声明一个变量（没错，也是 `foo` ）：

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

如果在开发的过程中，不知道在 `lib-2.js` 文件里也声明了一个 `foo` 变量，一旦在后面的代码里预期了 `foo + 2 === 3` ，那么这样就得不到想要的结果（因为 `lib-1.js` 里的 `foo` 是 `1` ，  `1 + 2` 等于 `3` ） 。 原因是 JavaScript 的加载顺序是从上到下，当使用 `var` 声明变量时，如果命名有重复，那么后加载的变量会覆盖掉先加载的变量。

这是使用 `var` 声明的情况，它允许使用相同的名称来重复声明，那么换成 `let` 或者 `const` 呢？

虽然不会出现重复声明的情况，但同样会收到一段报错：

```bash
Uncaught SyntaxError: Identifier 'foo' has already been declared (at lib-2.js:1:1)
```

程序这次直接崩溃了，因为 `let` 和 `const` 无法重复声明，从而抛出这个错误，程序依然无法正确运行。

### 更多问题

以上只是一个最简单的案例，就暴露出了传统开发很大的弊端，然而并不止于此，实际上，存在了诸如以下这些的问题：

1. 如本案例，可能存在同名的变量声明，引起变量冲突
2. 引入多个资源文件时，比如有多个 JS 文件，在其中一个 JS 文件里面使用了在别处声明的变量，无法快速找到是在哪里声明的，大型项目难以维护
3. 类似第 1 、 2 点提到的问题无法轻松预先感知，很依赖开发人员人工定位原因
4. 大部分代码缺乏分割，比如一个工具函数库，很多时候需要整包引入到 HTML 里，文件很大，然而实际上只需要用到其中一两个方法
5. 由第 4 点大文件延伸出的问题， `script` 的加载从上到下，容易阻塞页面渲染
6. 不同页面的资源引用都需要手动管理，容易造成依赖混乱，难以维护
7. 如果你要压缩 CSS 、混淆 JS 代码，也是要人力操作使用工具去一个个处理后替换，容易出错

当然，实际上还会有更多的问题会遇到。

## 工程化带来的优势

为了解决传统开发的弊端，前端也开始引入工程化开发的概念，借助工具来解决人工层面的繁琐事情。

### 开发层面的优势

在 [传统开发的弊端](#传统开发的弊端) 里，我们主要列举的是开发层面的问题，工程化首要解决的当然也是我们在开发层面遇到的问题。

在开发层面，前端工程化给我们带来了至少这些好处：

1. 引入了模块化和包的概念，作用域隔离，解决了代码冲突的问题
2. 按需导出和导入机制，让编码过程更容易定位问题
3. 自动化的代码检测流程，有问题的代码在开发过程中就可以被发现
4. 编译打包机制可以让你使用开发效率更高的编码方式，比如 Vue 组件、 CSS 的各种预处理器
5. 引入了代码兼容处理的方案（ e.g. Babel ），可以让你自由使用更先进的 JavaScript 语句，而无需顾忌浏览器兼容性，因为最终会帮你转换为浏览器兼容的实现版本
6. 引入了 Tree Shaking 机制，清理没有用到的代码，减少项目构建后的体积

还有非常多的体验提升！列举不完！而对应的工具，根据用途也会有非常多的选择，我们在后面的学习过程中，会一步一步体验到工程化带来的好处！

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

虽然也可以自行调整成别的结构，但根据本人在多年的工作实际接触下来，以及从很多开源项目的代码里看到的，都是沿用脚手架创建的项目结构（不同脚手架创建的结构会有所不同，但基于同一技术栈的项目基本上都具备相同的结构）。

:::tip
在 [脚手架的升级与配置](update.md) 一章可以学习如何使用脚手架创建 Vue 3 项目。
:::

#### 统一的代码风格

不管你是接手过其他人的代码，或者是修改自己不同时期的代码，可能都会遇到这样的情况，例如一个模板语句，上面包含了很多属性，有的人喜欢写成一行，属性多了维护起来很麻烦，需要花费较多时间辨认：

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

而工程化配合统一的代码格式化规范，可以让不同人维护的代码，最终提交到 Git 上的时候，风格都保持一致，并且类似这种很多属性的地方，都会自动帮你格式化为一个属性一行，维护起来就很方便：

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
在 [添加协作规范](update.md#添加协作规范) 一节可以学习如何给项目添加统一的协作规范。
:::

#### 可复用的模块和组件

传统项目比较容易被复用的只有 JavaScript 代码和 CSS 代码，会抽离公共函数文件上传到 CDN ，然后在 HTML 页面里引入这些远程资源， HTML 代码部分通常只有由 JS 创建的比较小段的 DOM 结构。

并且通过 CDN 引入的资源，很多时候都是完整引入，可能有时候只需要用到里面的一两个功能，却要把很大的完整文件都引用进来。

这种情况下，在前端工程化里，就可以抽离成一个开箱即用的 npm 组件包，并且很多包都提供了模块化导出，配合构建工具的 Tree Shaking ，可以抽离用到的代码，没有用到的其他功能都会被抛弃，不会一起发布到生产环境。

:::tip
在 [依赖包和插件](guide.md#依赖包和插件) 一节可以学习如何查找和使用开箱即用的 npm 包。
:::

#### 代码健壮性有保障

传统的开发模式里，我们只能够写 JavaScript ，而在工程项目里，我们可以在开发环境编写带有类型系统的 TypeScript ，然后再编译为浏览器能认识的 JavaScript 。

在开发过程中，编译器会帮我们检查代码是否有问题，比如我在 TypeScript 里声明了一个布尔值的变量，然后不小心将它赋值为数值：

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

我们得以及时发现问题并修复，减少线上事故的发生。

#### 团队开发效率高

在前后端合作环节，可以提前 Mock 接口与后端同学同步开发，如果遇到跨域等安全限制，也可以进行本地代理，不受跨域困扰

前端工程在开发过程中，还有很多可以交给程序处理的环节，像前面提到的代码格式化、代码检查，还有在部署上线的时候也可以配合 CI/CD 完成自动化流水线，不像以前改个字都要找服务端同学去更新，可以把非常多的人力操作剥离出来交给程序。

### 求职竞争上的优势

>待完善

## Vue.js 与工程化

>待完善

### 了解 Vue.js 与全新的 3.0 版本

>待完善

### Vue 与工程化之间的关联

>待完善

### 选择 Vue 入门工程化的理由

>待完善

## 现代化的开发概念

>待完善

名词|全称|中文
:-:|:-:|:-:
SPA|Single Page Application|单页面应用
SSR|Server-Side Rendering|服务端渲染
SSG|Static Site Generator|静态站点生成器

### MPA 与 SPA

>待完善

### CSR 与 SSR

>待完善

### Pre-Rendering 与 SSG

>待完善

### ISR 与 DPR

>待完善

## 工程化不止于前端

>待完善

### 服务端开发

>待完善

### App 开发

>待完善

### 桌面程序开发

>待完善

### 应用脚本开发

>待完善

## 实践工程化的流程

>待完善

基于 Vue 3 的项目，最主流的工程化组合拳有以下两种：

常用方案|Runtime|构建工具|框架
:-:|:-:|:-:|:-:
方案一|Node|Webpack|Vue
方案二|Node|Vite|Vue

当你技术成熟的时候，还可以选择更喜欢的方案自行组合，例如用 Deno 来代替 Node ，但前期我们还是按照主流的方案来进入工程化的学习。

下面的内容我们将根据 Vue 3 的工程化开发，逐一讲解涉及到常用的工具，了解它们的用途和用法。

## 工程化神器 Node.js

只要你在近几年有接触过前端开发，哪怕你没有实际使用过，也应该有听说过 Node.js ，那么它是一个什么样的存在？

### 什么是 Node.js

Node.js （简称 Node ） 是一个基于 Chrome V8 引擎构建的 JS 运行时（ JavaScript Runtime ）。

它让 JavaScript 代码不再局限于网页上，还可以跑在客户端、服务端等场景，极大的推动了前端开发的发展，现代的前端开发几乎都离不开 Node 。

### 什么是 Runtime

Runtime ，可以叫它 “运行时” 或者 “运行时环境” ，这个概念是指，你的代码在哪里运行，哪里就是运行时。

传统的 JavaScript 只能跑在浏览器上，每个浏览器都为 JS 提供了一个运行时环境，你可以简单的把浏览器当成一个 Runtime ，明白了这一点，相信你就能明白什么是 Node 。

Node 就是一个让 JS 可以脱离浏览器运行的环境，当然，这里并不是说 Node 就是浏览器。

### Node 和浏览器的区别

虽然 Node 也是基于 Chrome V8 引擎构建，但它并不是一个浏览器，它提供了一个完全不一样的运行时环境，没有 Window 、没有 Document 、没有 DOM 、没有 Web API ，没有 UI 界面…

但它提供了很多浏览器做不到的能力，比如和操作系统的交互，例如 “文件读写” 这样的操作在浏览器有诸多的限制，而在 Node 则轻轻松松。

对于前端开发者来说， Node 的巨大优势在于，使用一种语言就可以编写所有东西（前端和后端），不再花费很多精力去学习各种各样的开发语言。

哪怕你仅仅只做 Web 开发，也不再需要顾虑新的语言特性在浏览器上的兼容性（ e.g. ES6 、 ES7 、 ES8 、 ES9 …）， Node 配合构建工具，以及诸如 Babel 这样的代码编译器，可以帮你转换为浏览器兼容性最高的 ES5 。

当然还有很多工程化方面的好处，总之一句话，使用 Node ，你的开发体验会非常好。

## 工程化的构建工具

>待完善

在前端开发领域，构建工具可以帮我们解决很多问题：

- 新版本的 JS 代码好用，但有兼容问题，我们可以通过构建工具去转换成低版本 JS 的实现
- 项目好多代码可以复用，我们可以直接抽离成 [模块](#学习模块化设计) 、 [组件](#认识组件化设计) ，交给构建工具去合并打包
- [TypeScript](typescript.md) 的类型系统和代码检查真好用，我们也可以放心写，交给构建工具去编译
- CSS 写起来好烦，我们可以使用 Sass 、 Less 等 [CSS 预处理器](component.md#使用-css-预处理器) ，交给构建工具去编译
- 海量的 [npm 包](#依赖包和插件) 开箱即用，剩下的工作交给构建工具去按需抽离与合并
- 项目上线前代码要混淆，人工处理太费劲，交给构建工具自动化处理
- 写不完的其他场景…

目前已经有很多流行的构建工具，例如： [Grunt](https://github.com/gruntjs/grunt) 、 [Gulp](https://github.com/gulpjs/gulp) 、 [Webpack](https://github.com/webpack/webpack) 、 [Snowpack](https://github.com/FredKSchott/snowpack) 、 [Parcel](https://github.com/parcel-bundler/parcel) 、 [Rollup](https://github.com/rollup/rollup) 、 [Vite](https://github.com/vitejs/vite) … 每一个工具都有自己的特色。

基于我们主要开发 Vue 项目，在这里只介绍两个流行且强相关的工具： [Webpack](#webpack) 和 [Vite](#vite) 。

### Webpack

Webpack 是一个老牌的构建工具，前些年可以说几乎所有的项目都是基于 Webpack 构建的，生态最庞大，各种各样的插件最全面，对旧版本的浏览器支持程度也最全面。

点击访问：[Webpack 官网](https://webpack.js.org)

在升级与配置一章里的 [使用 @vue/cli 创建项目](update.md#使用-vue-cli-创建项目) 会指导你如何使用 Vue CLI 创建一个基于 Webpack 的 Vue 项目。

### Vite

Vite 的作者也是我们熟悉的 Vue 作者尤雨溪，它是一个基于 ESM 实现的构建工具，主打更轻、更快的开发体验，主要面向现代浏览器，于 2021 年推出 2.x 版本之后，进入了一个飞速发展的时代，目前市场上的 npm 包基本都对 Vite 做了支持，用来做业务已经没有问题了。

毫秒级的开发服务启动和热重载，对 TypeScript 、 CSS 预处理器等常用开发工具都提供了开箱即用的支持，也兼容海量的 npm 包，如果你是先用 Webpack 再用的 Vite ，你会很快就喜欢上它！

点击访问：[Vite 官网](https://cn.vitejs.dev)

在升级与配置一章里的 [使用 Vite 创建项目](update.md#使用-vite-创建项目-new) 会指导你如何使用流行脚手架创建一个基于 Vite 的 Vue 项目。

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

你可以点击 Vite 官网的这篇文章： [为什么选 Vite](https://cn.vitejs.dev/guide/why.html) 了解更多的技术细节。

构建方面，为了更好的加载体验，以及 Tree Shaking 按需打包 、懒加载和 Chunk 分割利于缓存，两者都需要进行打包；但由于 Vite 是面向现代浏览器，所以如果你的项目有兼容低版本浏览器的需求的话，建议还是用 Webpack 来打包，否则， Vite 是目前的更优解。

### 开发环境和生产环境

在使用构建工具的时候，需要了解一下 “环境” 的概念，对构建工具而言，会有 “开发环境（ development ）” 和 “生产环境（ production ）” 之分。

:::tip
需要注意的是，这和业务上的 “测试 -> 预发 -> 生产” 那几个环境的概念是不一样的，业务上线流程的这几个环境，对于项目来说，都属于 “生产环境” ，因为需要打包部署。
:::

#### 开发环境

我们前面在编写 [Hello TypeScript](#hello-typescript) 这个 demo 的时候，使用了 `npm run dev:ts` 这样的命令来测试 TypeScript 代码的可运行性，你可以把这个阶段认为是我们的一个 “测试环境” ，这个时候代码不管怎么写，它都是 TypeScript 代码，不是最终要编译出来的 JavaScript 。

如果基于 Webpack 或者 Vite 这样的构建工具，测试环境提供了更多的功能，例如：

- 可以使用 TypeScript 、 CSS 预处理器之类的需要编译的语言提高开发效率
- 提供了热重载（ Hot Module Replacement ， 简称 HMR ），当你修改了代码之后，无需重新运行或者刷新页面，构建工具会检测你的修改自动帮你更新
- 代码不会压缩，并有 Source Mapping 源码映射，方便 BUG 调试
- 默认提供局域网服务，无需自己做本地部署
- 更多 …

#### 生产环境

我们在 [Hello TypeScript](#hello-typescript) demo 最后配置的一个 `npm run build` 命令，将 TypeScript 代码编译成了 JavaScript ，这个时候 dist 文件夹下的代码文件就处于 “生产环境” 了，因为之后不论源代码怎么修改，都不会直接影响到它们，直到再次执行 build 编译。

可以看出生产环境和开发环境最大的区别就是稳定！除非你再次打包发布，否则不会影响到已部署的代码。

- 代码会编译为浏览器最兼容的版本，一些不兼容的新语法会进行 [Polyfill](https://developer.mozilla.org/zh-CN/docs/Glossary/Polyfill)
- 稳定，除非重新发布，否则不会影响到已部署的代码
- 打包的时候代码会进行压缩混淆，缩小项目的体积，也降低源码被直接曝光的风险

#### 环境判断

在 Webpack ，你可以使用 `{{ env }}` 来区分开发环境（ development ）还是生产环境（ production ），它会返回当前所处环境的名称。

<script setup>
const env = 'process.env' + '.NODE_ENV'
</script>

在 Vite ，你还可以通过判断 `import.meta.env.DEV` 为 `true` 时是开发环境，判断 `import.meta.env.PROD` 为 `true` 时是生产环境（这两个值永远相反）。

有关环境变量的问题可以查阅以下文档：

工具|文档
:-:|:--
Webpack|[模式](https://www.webpackjs.com/concepts/mode/)
Vite|[环境变量和模式](https://cn.vitejs.dev/guide/env-and-mode.html)
