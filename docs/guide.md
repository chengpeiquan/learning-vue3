# 起步准备

这一章是为刚刚迈入前端工程化、或者还没有接触过前端工程化的同学准备的。

如果你刚从传统的用 HTML + CSS + JS 手写页面的认知阶段走过来，这一章的内容对你下阶段的学习应该很有用。

在这里会介绍一些前置的知识点科普，方便开始学习 Vue3 的时候，不会对一些基本的认知和操作存在太多疑惑。

:::tip
本指南需要具备一定的 HTML 、 CSS 和 JavaScript 基础，如果完全不懂，请先对这三个知识点进行一些入门的学习。
:::

## 了解前端工程化

现在在前端的工作中，实际业务里的的前端开发，和你刚接触的前端开发已经完全不同了。

刚接触前端的时候，做一个页面，是先创建 HTML 页面文件写写页面结构，在里面写 CSS 代码美化页面，再根据需要写一些 JavaScript 代码增加交互功能，需要几个页面就创建几个页面，相信大家的前端起步都是从这个模式开始的。

而实际上的前端开发工作，早已进入了前端工程化开发的时代，已经充满了各种现代化框架、预处理器、代码编译…

最终的产物也不再单纯是多个 HTML 页面，经常能看到 SPA / SSR / SSG 等词汇的身影。

### 传统开发的弊端

在了解什么是前端工程化之前，我们先回顾一下传统开发存在的弊端，这样更能知道我们为什么需要它。

在传统的前端开发模式下，前端工程师是在 HTML 文件里直接编写代码，所需要的 JavaScript 代码是通过 `script` 标签以内联或者文件引用的形式放到 HTML 代码里的。

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

#### 一个案例

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

你猜会输出什么？ —— 答案是 `2` 。

如果你不知道 `lib-2.js` 里也声明了一个 `foo` 变量，如果在后面的代码里预期了 `foo + 2 === 3` ，那么这样就得不到你想要的结果（因为 `lib-1.js` 里的 `foo` 是 `1` ，  `1 + 2` 等于 `3` ） 。

原因是 JavaScript 的加载顺序是从上到下，当使用 `var` 声明变量时，如果命名有重复，那么后加载的变量会覆盖掉先加载的变量。

这是使用 `var` 声明的情况，它允许使用相同的名称来重复声明，那么换成 `let` 或者 `const` 呢？

虽然不会出现重复声明的情况，但你会收获一段报错：

```bash
Uncaught SyntaxError: Identifier 'foo' has already been declared (at lib-2.js:1:1)
```

你的程序这次直接崩溃了，因为 `let` 和 `const` 无法重复声明，从而抛出这个错误，程序依然无法正确运行。

#### 更多问题

以上只是一个最简单的案例，就暴露出了传统开发很大的弊端，然而并不止于此，实际上，存在了诸如以下这些的问题：

1. 如本案例，可能存在同名的变量声明，引起变量冲突
2. 引入多个资源文件时，比如有多个 JS 文件，在其中一个 JS 文件里面使用了在别处声明的变量，无法快速找到是在哪里声明的，大型项目难以维护
3. 类似第 1 、 2 点提到的问题无法轻松预先感知，很依赖开发人员人工定位原因
4. 大部分代码缺乏分割，比如一个工具函数库，很多时候需要整包引入到 HTML 里，文件很大，然而实际上只需要用到其中一两个方法
5. 由第 3 点大文件延伸出的问题， `script` 的加载从上到下，容易阻塞页面渲染
6. 不同页面的资源引用都需要手动管理，容易造成依赖混乱，难以维护
7. 如果你要压缩 CSS 、混淆 JS 代码，也是要人工使用工具去处理后替换，容易出错

当然，实际上还会有更多的问题会遇到。

### 工程化带来的优势

为了解决传统开发的弊端，前端也开始引入工程化开发的概念，借助工具来解决人工层面的繁琐事情。

1. 引入了模块化和包的概念，作用域隔离，解决了代码冲突的问题
2. 按需导出和导入机制，让编码过程更容易定位问题
3. 自动化的代码检测流程，有问题的代码在开发过程中就可以被发现
4. 编译打包机制可以让你使用开发效率更高的编码方式，比如 Vue 组件、 CSS 的各种预处理器
5. 引入了代码兼容处理的方案（ e.g. Babel ），可以让你自由使用更先进的 JavaScript 语句，而无需顾忌浏览器兼容性，因为最终会帮你转换为浏览器兼容的实现版本
6. 引入了 Tree Shaking 机制，清理没有用到的代码，减少项目构建后的体积

还有非常多的体验提升！列举不完！而对应的工具，根据用途也会有非常多的选择。

### 如何实践工程化

基于 Vue 3 的项目，最主流的工程化组合拳有以下两种：

常用方案|Runtime|构建工具|框架
:-:|:-:|:-:|:-:
方案一|Node|Webpack|Vue
方案二|Node|Vite|Vue

当你技术成熟的时候，还可以选择更喜欢的方案自行组合，例如用 Deno 来代替 Node ，但前期我们还是按照主流的方案来进入工程化的学习。

下面的内容我们将根据 Vue 3 的工程化开发，逐一讲解涉及到常用的工具，了解它们的用途和用法。

## 命令行工具

命令行界面（ Command-line Interface ，缩写 CLI ），是一种通过命令行来实现人机交互的工具。

在工程化开发过程中，前端开发已离不开各种命令行操作，所以请先提前准备好命令行工具。

如果你有所留意，会发现很多工具都可以实现命令行操作，比如：命令行界面（ CLI ）、终端（ Terminal ）、 Shell 、控制台（ Console ）等等。

从完整功能看，它们之间确实有许多区别，不过对于前端开发者来说，日常的命令行交互需要用到的功能不会特别多，所以后面我们会统一一些名词，减少理解上的偏差。

交互行为|统一代替名词|代替名词解释
:-:|:-:|:--
输入|命令行|需要输入命令的时候，会统一用 ”命令行“ 来指代。
输出|控制台|鉴于前端开发者更多接触的是浏览器的 Console 控制台，<br>所以也是会用 ”控制台“ 来指代。

### Windows

在 Windows 平台，你可以使用自带的 CMD 或者 Windows PowerShell 工具。

但为了更好的开发体验，推荐使用以下工具（需要下载安装），可以根据自己的喜好选择其一：

名称|简介|下载
:-:|:--|:-:
Windows Terminal|由微软推出的强大且高效的 Windows 终端|[前往 GitHub 下载](https://github.com/microsoft/terminal)
CMDer|一款体验非常好的 Windows 控制台模拟器|[前往 GitHub 下载](https://github.com/cmderdev/cmder)

我现在在我的 Windows 台式机上是使用 Windows Terminal 比较多，在此之前是用 CMDer ，两者的设计和体验都非常优秀，当然，还有颜值。

### macOS

如果使用的是 Mac 系统，可以直接使用系统自带的 “终端” 工具，我在我的 Macbook 上是使用自带的终端进行开发。

:::tip
其实只要能正常使用命令行，对于前端工程师来说就可以满足日常需求，但选择更喜欢的工具，可以让自己的开发过程更为身心愉悦！
:::

## 了解 Node.js

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

### 下载和安装 Node

在 Node.js 官网提供了安装包的下载，不论你是使用 Windows 系统还是 MacOS 系统， Node 都提供了对应的安装包，直接下载安装包并运行即可安装到你的电脑里，就可以用来开发你的项目了。

点击访问：[Node.js 官网下载](https://nodejs.org/zh-cn/download/)

安装后，打开你的 [命令行工具](#命令行工具) ，输入以下命令即可查看是否安装成功：

```bash
node -v
```

如果已成功安装，会在控制台输出当前的 Node 版本号。

### 版本之间的区别

你可以看到官网标注了 LTS 和 Current 两个系列，并且对应了不同的版本号。

LTS ，全称 Long Time Support ，长期维护版本，这个系列代表着稳定，建议首次下载以及后续的每次升级都选择 LTS 版本，减少开发过程中的未知问题出现，大版本号都是偶数（ e.g. v16.x.x ）。

Current 是最新发布版本，或者叫 “尝鲜版” ，你可以在这个系列体验到最新的功能，但也可能会有一些意想不到的问题和兼容性要处理，大版本号都是奇数（ e.g. v17.x.x ）。

不论是 LTS 还是 Current ，每个系列下面都还有不同的大版本和小版本，是不是每次都必须及时更新到最新版呢？

当然不是，你完全可以依照你的项目技术栈依赖的最低 Node 版本去决定是否需要升级，不过如果条件允许，还是建议至少要把大版本升级到最新的 LTS 版本。

### 配置环境变量

>待完善

## 了解 Node 项目

在安装和配置完 Node.js 之后，我们接下来来了解 Node 项目的一些基础组成，这有助于我们开启前端工程化开发大门。

### 初始化一个项目

如果想让一个项目成为 Node 项目，只需要在命令行 `cd` 到项目所在的目录，执行初始化命令：

```bash
npm init
```

之后命令行会输出一些提示，以及一些问题，可以根据你的实际情况填写项目信息，例如：

```bash
package name: (demo) node-demo
```

以上面这个问题为例：

冒号左边的 `package name` 是问题的题干，会询问你要输入什么内容。

冒号右边的括号内容 `(demo)` 是 Node 为你推荐的答案（不一定会出现这个推荐值），如果你觉得 OK ，可以直接按回车确认，进入下一道题。

冒号右边的 `node-demo` 是你输入的答案（如果你选择了推荐的答案，则这里为空），这个答案会写入到项目信息文件里。

当你回答完所有问题之后，会把你填写的信息输出到控制台，确认无误后，回车完成初始化的工作。

```bash
{
  "name": "node-demo",
  "version": "1.0.0",
  "description": "A demo about Node.js.",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "chengpeiquan",
  "license": "MIT"
}


Is this OK? (yes) 
```

如果你觉得问题太多，太繁琐了，可以直接加上 `-y` 参数，这样会以 Node 推荐的答案帮你快速生成项目信息。

```bash
npm init -y
```

### 了解 package.json

在完成 [项目的初始化](#初始化一个项目) 之后，你会发现在项目的根目录下出现了一个名为 `package.json` 的 JSON 文件。

这是 Node 项目的清单，里面记录了这个项目的基础信息、依赖信息、开发过程的脚本行为、发布相关的信息等等，未来你将在很多项目里看到它的身影。

:::tip
它必须是 JSON 文件，不可以是存储了 JavaScript 对象字面量的 JS 文件。
:::

如果你是按照上面初始化一节的操作得到的这个文件，打开它之后，你会发现里面存储了你在初始化过程中，根据问题确认下来的那些答案，例如：

```json
{
  "name": "node-demo",
  "version": "1.0.0",
  "description": "A demo about Node.js.",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "chengpeiquan",
  "license": "MIT"
}
```

package.json 的字段并非全部必填，唯一的要求就是，必须是一个 JSON 文件，所以你也可以仅仅写入以下内容：

```json
{}
```

但在实际的项目中，往往需要填写更完善的项目信息，除了手动维护这些信息之外，你在安装 npm 包等操作时， Node 也会帮你写入数据到这个文件里，我们来了解一些常用字段的含义：

字段名|含义
:-:|:--
name|项目名称，如果你打算发布成 npm 包，它将作为包的名称
version|项目版本号，如果你打算发布成 npm 包，这个字段是必须的，遵循 [语义化版本号](#语义化版本号管理) 的要求
description|项目的描述
keywords|关键词，用于在 npm 网站上进行搜索
homepage|项目的官网 URL
type|待完善
main|项目的入口文件
scripts|指定运行脚本的命令缩写，常见的如 `npm run build` 等命令就在这里配置，详见 [脚本命令的配置](#脚本命令的配置)
author|作者信息
license|许可证信息，可以选择适当的许可证进行开源
dependencies|记录当前项目的生产依赖，安装 npm 包时会自动生成，详见：[了解包和插件](#了解包和插件)
devDependencies|记录当前项目的开发依赖，安装 npm 包时会自动生成，详见：[了解包和插件](#了解包和插件)

完整的选项可以在 [npm Docs](https://docs.npmjs.com/cli/v8/configuring-npm/package-json/) 上查阅。

### 项目名称规则

如果你打算发布成 npm 包，它将作为包的名称，可以是普通包名，也可以是范围包的包名。

类型|释义|例子
:-:|:--|:--
<span style="display: inline-block; width: 50px;">范围包</span>|具备 `@scope/project-name` 格式，一般有一系列相关的开发依赖之间会以相同的 scope 进行命名|如 `@vue/cli` 、 `@vue/cli-service` 就是一系列相关的范围包
普通包|其他命名都属于普通包|如 `vue` 、 `vue-router`

包名有一定的书写规则：

- 名称必须保持在 1 ~ 214 个字符之间（包括范围包的 `@scope/` 部分）
- 只允许使用小写字母、下划线、短横线、数字、小数点（并且只有范围包可以以点或下划线开头）
- 包名最终成为 URL 、命令行参数或者文件夹名称的一部分，所以名称不能包含任何非 URL 安全字符

:::tip
了解这一点有助于你在后续工作中，在需要查找技术栈相关包的时候，可以知道如何在 npmjs 上找到它们。
:::

如果你打算发布 npm 包，可以通过 `npm view <package-name>` 命令查询包名是否已存在，如果存在就会返回该包的相关信息。

比如我们查询 `vue` 这个包名，会返回它的版本号、许可证、描述等信息：

```bash
npm view vue

vue@3.2.33 | MIT | deps: 5 | versions: 372
The progressive JavaScript framework for building modern web UI.
https://github.com/vuejs/core/tree/main/packages/vue#readme

keywords: vue

# 后面太多信息这里就省略...
```

如果查询一个不存在的包名，则会返回 404 信息：

```bash
npm view vue123456
npm ERR! code E404
npm ERR! 404 Not Found - GET https://registry.npmjs.org/vue123456 - Not found
npm ERR! 404
npm ERR! 404  'vue123456@latest' is not in this registry.
npm ERR! 404 You should bug the author to publish it (or use the name yourself!)
npm ERR! 404
npm ERR! 404 Note that you can also install from a
npm ERR! 404 tarball, folder, http url, or git url.

# 后面太多信息这里就省略...
```

### 语义化版本号管理

Node 项目遵循 [语义化版本号](https://semver.org/lang/zh-CN/) 的规则，例如 `1.0.0` 、 `1.0.1` 、 `1.1.0` 这样的版本号，本教材的主角 Vue 也是遵循了语义化版本号的发布规则。

建议开发者在入门前端工程化的时候就应该熟悉这套规则，后续的项目开发中，你会使用到很多外部依赖，它们也是使用版本号控制来管理代码的发布，每个版本之间可能会有一些兼容性问题，如果不了解版本号的通用规则，很容易在你的开发中带来困扰。

:::tip
现在有很多 CI/CD 流水线作业具备了根据 Git 的 Commit 记录来自动升级版本号，它们也是遵循了语义化版本号规则，版本号的语义化在前端工程里有重大的意义。
:::

#### 基本格式与升级规则

版本号的格式为： `Major.Minor.Patch` （简称 `X.Y.Z` ），它们的含义和升级规则如下：

英文|中文|含义
:-:|:-:|:--
Major|主版本号|当项目作了大量的变更，与旧版本存在一定的不兼容问题
Minor|次版本号|做了向下兼容的功能改动或者少量功能更新
Patch|修订号|修复上一个版本的少量 BUG

一般情况下，三者均为正整数，并且从 `0` 开始，遵循这三条注意事项：

- 当主版本号升级时，次版本号和修订号归零
- 当次版本号升级时，修订号归零，主版本号保持不变
- 当修订号升级时，主版本号和次版本号保持不变

下面以一些常见的例子帮助你快速理解版本号的升级规则：

- 如果不打算发布，可以默认为 `0.0.0` ，代表它并不是一个进入发布状态的包
- 在正式发布之前，你可以将其设置为 `0.1.0` 发布第一个测试版本，自此，代表已进入发布状态，但还处于初期开发阶段，这个阶段你可能经常改变 API ，但不需要频繁的更新主版本号
- 在 `0.1.0` 发布后，修复了 BUG ，下一个版本号将设置为 `0.1.1` ，即更新了一个修订号
- 在 `0.1.1` 发布后，有新的功能发布，下一个版本号可以升级为 `0.2.0` ，即更新了一个次版本号
- 当你觉得这个项目已经功能稳定、没有什么 BUG 了，决定正式发布并给用户使用时，那么就可以进入了 `1.0.0` 正式版了

#### 版本标识符

以上是一些常规的版本号升级规则，你也可以通过添加 “标识符” 来修饰你的版本更新：

格式为： `Major.Minor.Patch-Identifier.1` ，其中的 `Identifier` 代表 “标识符” ，它和版本号之间使用 `-` 短横线来连接，后面的 `.1` 代表当前标识符的第几个版本，每发布一次，这个数字 +1 。

标识符|含义
:-:|:--
alpha|内部版本，代表当前可能有很大的变动
beta|测试版本，代表版本已开始稳定，但可能会有比较多的问题需要测试和修复
rc|即将作为正式版本发布，只需做最后的验证即可发布正式版

### 脚本命令的配置

在工作中，你会频繁接触到 `npm run dev` 启动开发环境、 `npm run build` 构建打包等操作，这些操作其实是对命令行的一种别名。

它在 package.json 里是存放于 `scripts` 字段，以 `[key: string]: string` 为格式的键值对存放数据（ `key: value` ）。

```json
{
  "scripts": {
    // ...
  }
}
```

其中：

- `key` 是命令的缩写，也就是 `npm run xxx` 里的 `xxx` ，如果一个单词不足以表达，可以用冒号 `:` 拼接多个单词，例如 `mock:list` 、 `mock:detail` 等等

- `value` 是完整的执行命令内容，多个命令操作用 `&&` 连接，例如 `git add . && git commit` 

以 Vue CLI 创建的项目为例，它的项目 package.json 文件里就会包括了这样的命令：

```json
{
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build"
  }
}
```

这里的名字是可以自定义的，比如你可以把 `serve` 改成你更喜欢的 `dev` ：

```json{3}
{
  "scripts": {
    "dev": "vue-cli-service serve",
    "build": "vue-cli-service build"
  }
}
```

这样运行 `npm run dev` 也可以相当于运行了 `vue-cli-service serve` 。

据我所了解，有不少开发者曾经对不同的 Vue CLI 版本提供的 `npm run serve` 和 `npm run dev` 有什么区别有过疑问，看到这里应该都明白了吧，可以说没有区别，因为这取决于它对应的命令，而不是取决于它起什么名称。

:::tip
如果 `value` 部分包含了双引号，必须使用转义符 `\` 来避免格式问题，例如： `\"` 。
:::

可以阅读 npm 关于 scripts 的 [完整文档](https://docs.npmjs.com/cli/v8/using-npm/scripts) 了解更多用法。

### Hello Node

看到这里，对于 Node 项目的基本创建流程和关键信息都有所了解了吧！我们来写一个 DEMO ，实际体验一下如何从初始化项目到打印一个 `Hello World` 到控制台的过程。

请先启动你的命令行工具，然后创建一个项目文件夹，这里使用 `mkdir` 命令：

```bash
# 语法是 mkdir <dir-name>
mkdir node-demo
```

使用 `cd` 命令进入刚刚创建好的项目目录：

```bash
# 语法是 cd <dir-path>
cd node-demo
```

执行项目初始化，可以回答问题，也可以添加 `-y` 参数来使用默认配置：

```bash
npm init -y
```

来到这里我们就得到了一个具有 package.json 的 Node 项目了。

在项目下创建一个 `index.js` 的 JS 文件，可以像平时一样书写 JavaScript ，我们输入以下内容并保存：

```js
console.log('Hello World')
```

然后打开 package.json 文件，修改 scripts 部分如下，也就是配置了一个 `"dev": "node index"` 命令：

```json{7}
{
  "name": "demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "node index"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

在命令行执行 `npm run dev` ，可以看到控制台打印出了 `Hello World` ：

```bash{6}
npm run dev

> demo@1.0.0 dev
> node index

Hello World
```

这等价于我们直接在命令行执行 `node index.js` 命令，其中 `node` 是 Node.js 运行文件的命令， `index` 是文件名，相当于 `index.js` ，因为 JS 文件名后缀可以省略。

## 了解模块化设计

在了解 Node 项目之后，就要开始编码加强你对 Node.js 的熟悉程度了，但在开始使用之前，你还需要了解一些概念。

在未来的日子里（不限于本教程，与你在前端工程化相关的工作内容息息相关），你会频繁的接触到两个词：模块（ Module ）和包（ Package ）。

模块和包是 Node 开发最重要的组成部分，不管你是全部自己实现一个项目，还是会依赖各种第三方轮子来协助你的开发，项目的构成都离不开这两者。

### 解决了什么问题

在软件工程的设计原则里，有一个原则叫 “单一职责” 。

假设一个代码块负责了多个职责的功能支持，在后续的迭代过程中，维护成本会极大的增加，虽然只需要修改这个代码块，但需要兼顾职责 1 、职责 2 、职责 3 … 等多个职责的兼容性，稍不注意就会引起工程运行的崩溃。

“单一职责” 的目的就是减少功能维护带来的风险，把代码块的职责单一化，让代码的可维护性更高。

一个完整业务的内部实现，不应该把各种代码都耦合在一起，而应该按照职责去划分好代码块，再进行组合，形成一个 “高内聚，低耦合” 的工程设计。

模块化就是由此而来，在前端工程里，每个单一职责的代码块，就叫做模块（ Module ） ，模块有自己的作用域，功能与业务解耦，非常方便复用和移植。

:::tip
模块化还可以解决我们本章开头所讲述的 [传统开发的弊端](#传统开发的弊端) 里提到的大部分问题，随着下面内容一步步深入，你将一步步的理解它。
:::

### 如何实现模块化

在前端工程的发展过程中，不同时期诞生了很多不同的模块化机制，最为主流的有以下几种：

模块化方案|全称|适用范围
:-:|:-:|:-:
CJS|CommonJS|Node 端
AMD|Async Module Definition|浏览器
CMD|Common Module Definition|浏览器
UMD|Universal Module Definition|Node 端和浏览器
ESM|ES Module|Node 端和浏览器

其中 AMD 、CMD 、 UMD 都已经属于有点过去式的模块化方案了，在新的业务里，结合各种编译工具，可以直接用最新的 ESM 方案来实现模块化，所以可以在后续有接触的时候再了解。

ESM （ ES Module ） 是 JavaScript 在 ES6（ ECMAScript 2015 ）版本推出的模块化标准，旨在成为浏览器和服务端通用的模块解决方案。

CJS （ CommonJS ） 原本是服务端的模块化标准（设计之初也叫 ServerJS ），是为 JavaScript 设计的用于浏览器之外的一个模块化方案， Node 默认支持了该规范，在 Node 12 之前也只支持 CJS ，但从 Node 12 开始，已经同时支持 ES Module 的使用。

至此，不论是 Node 端还是浏览器端， ES Module 是统一的模块化标准了！

但由于历史原因， CJS 在 Node 端依然是非常主流的模块化写法，所以还是值得进行了解，因此下面的内容将主要介绍 CJS 和 ESM 这两种模块化规范是如何实际运用。

:::tip
在开始体验模块化的编写之前，你需要先在你的电脑里 [安装好 Node.js](#下载和安装-node) ，然后打开 [命令行工具](#命令行工具) ，通过 `cd` 命令进入你平时管理项目的目录路径，然后 [初始化一个 Node 项目](#初始化一个项目) 。

另外，在 CJS 和 ESM ，一个独立的文件就是一个模块，该文件内部的变量必须通过导出才能被外部访问到，而外部文件想访问这些变量，需要导入对应的模块才能生效。
:::

### 用 CommonJS 设计模块

虽然现在推荐使用 ES Module 作为模块化标准，但是日后你在工作的过程中，还是不免会遇到要维护一些老项目，因此了解 CommonJS 还是非常有必要的。

以下简称 CJS 代指 CommonJS 规范。

#### 准备工作

延续我们在 [Hello Node](#hello-node) 部分创建的 Node.js DEMO 项目，先调整一下目录结构：

1. 删掉 `index.js` 文件
2. 创建一个 `src` 文件夹，在里面再创建一个 `cjs` 文件夹
3. 在 `cjs` 文件夹里面创建两个文件： `index.cjs` 和 `module.cjs` 

:::tip
注意这里我使用了 `.cjs` 文件扩展名，其实它也是 JS 文件，但这个扩展名是 Node 专门为 CommonJS 规范设计的，可以在 [了解 package.json](#了解-package-json) 部分的内容了解更多。
:::

此时目录结构应该如下：

```bash
node-demo
│ # 源码文件夹
├─src
│ │ # 业务文件夹
│ └─cjs
│   │ # 入口文件
│   ├─index.cjs
│   │ # 模块文件
│   └─module.cjs
│ # 项目清单
└─package.json
```

这是一个常见的 Node 项目目录结构，通常我们的源代码都会放在 `src` 文件夹里面统一管理。

然后我们再修改一下 package.json 里面的 scripts 部分，改成如下：

```json
{
  "scripts": {
    "dev:cjs": "node src/cjs/index.cjs"
  }
}
```

后面我们在命令行执行 `npm run dev:cjs` 就可以测试我们的 CJS 模块了。

#### 基本语法

CJS 使用 `module.exports` 语法导出模块，可以导出任意合法的 JavaScript 类型，例如：字符串、布尔值、对象、数组、函数等等。

使用 `require` 导入模块，在导入的时候，当文件扩展名是 `.js` 时，可以只写文件名，而此时我们使用的是 `.cjs` 扩展名，所以需要完整的书写。

#### 默认导出和导入

默认导出的意思是，一个模块只包含一个值；而导入默认值则意味着，导入时声明的变量名就是对应模块的值。

我们在 `src/cjs/module.cjs` 文件里，写入以下代码，导出一句 `Hello World` 信息：

```js
// src/cjs/module.cjs
module.exports = 'Hello World'
```

:::tip
自己在写入代码的时候，不需要包含文件路径那句注释，这句注释只是为了方便阅读时能够区分代码属于哪个文件，以下代码均如此。
:::

在 `src/cjs/index.cjs` 文件里，写入以下代码，导入我们刚刚编写的模块。

```js
// src/cjs/index.cjs
const m = require('./module.cjs')
console.log(m)
```

在命令行输入 `npm run dev:cjs` ，可以看到成功输出了 `Hello World` 信息：

```bash
npm run dev:cjs

> demo@1.0.0 dev:cjs
> node src/cjs/index.cjs

Hello World
```

可以看到，在导入模块时，声明的 `m` 变量拿到的值，就是整个模块的内容，可以直接使用，此例子中它是一个字符串。

我们再改动一下，把 `src/cjs/module.cjs` 改成如下，这次我们导出一个函数：

```js
// src/cjs/module.cjs
module.exports = function foo() {
  console.log('Hello World')
}
```

相应的，这次变成了导入一个函数，所以我们可以执行它：

```js{3}
// src/cjs/index.cjs
const m = require('./module.cjs')
m()
```

得到的结果也是打印一句 `Hello World` ，不同的是，这一次的打印行为是在模块里定义的，入口文件只是执行模块里的函数。

```bash
npm run dev:cjs

> demo@1.0.0 dev:cjs
> node src/cjs/index.cjs

Hello World
```

#### 命名导出和导入

默认导出的时候，一个模块只包含一个值，有时候你想把很多相同分类的函数进行模块化集中管理，例如想做一些 utils 类的工具函数文件、或者是维护项目的配置文件，全部使用默认导出的话，你会有非常多的文件要维护。

那么就可以用到命名导出，这样既可以导出多个数据，又可以统一在一个文件里维护管理，命名导出是先声明多个变量，然后通过 `{}` 对象的形式导出。

我们再来修改一下 `src/cjs/module.cjs` 文件，这次我们改成如下：

```js
// src/cjs/module.cjs
function foo() {
  console.log('Hello World from foo.')
}

const bar = 'Hello World from bar.'

module.exports = {
  foo,
  bar,
}
```

这个时候你通过原来的方式去拿模块的值，会发现无法直接获取到函数体或者字符串的值，因为打印出来的也是一个对象。

```js
// src/cjs/index.cjs
const m = require('./module.cjs')
console.log(m)
```

控制台输出：

```bash
npm run dev:cjs

> demo@1.0.0 dev:cjs
> node src/cjs/index.cjs

{ foo: [Function: foo], bar: 'Hello World from bar.' }
```

需要通过 `m.foo()` 、 `m.bar` 的形式才可以拿到值。

此时你可以用一种更方便的方式，利用 ES6 的对象解构来直接拿到变量：

```js
// src/cjs/index.cjs
const { foo, bar } = require('./module.cjs')
foo()
console.log(bar)
```

这样子才可以直接调用变量拿到对应的值。

#### 导入时重命名

以上都是基于非常理想的情况下使用模块，有时候不同的模块之间也会存在相同命名导出的情况，我们来看看模块化是如何解决这个问题的。

我们的模块文件保持不变，依然导出这两个变量：

```js
// src/cjs/module.cjs
function foo() {
  console.log('Hello World from foo.')
}

const bar = 'Hello World from bar.'

module.exports = {
  foo,
  bar,
}
```

这次在入口文件里也声明一个 `foo` 变量，我们在导入的时候对模块里的 `foo` 进行了重命名操作。

```js{3}
// src/cjs/index.cjs
const {
  foo: foo2,  // 这里进行了重命名
  bar,
} = require('./module.cjs')

// 就不会造成变量冲突
const foo = 1
console.log(foo)

// 用新的命名来调用模块里的方法
foo2()

// 这个不冲突就可以不必处理
console.log(bar)
```

再次运行 `npm run dev:cjs` ，可以看到打印出来的结果完全符合预期：

```bash
npm run dev:cjs

> demo@1.0.0 dev:cjs
> node src/cjs/index.cjs

1
Hello World from foo.
Hello World from bar.
```

这是利用了 ES6 解构对象的 [给新的变量名赋值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#%E7%BB%99%E6%96%B0%E7%9A%84%E5%8F%98%E9%87%8F%E5%90%8D%E8%B5%8B%E5%80%BC) 技巧。

以上是针对命名导出时的重命名方案，如果是默认导出，那么在导入的时候用一个不冲突的变量名来声明就可以了。

### 用 ES Module 设计模块

ES Module 是新一代的模块化标准，它是在 ES6（ ECMAScript 2015 ）版本推出的，是原生 JavaScript 的一部分。

不过因为历史原因，如果你要直接在浏览器里使用该方案，在不同的浏览器里会有一定的兼容问题，一般都需要借助构建工具来开发，工具会帮你抹平这些差异。

很多新推出的构建工具都默认只支持该方案（ e.g. Vite 、 Rollup ），要兼容 CJS 反而需要自己引入插件单独配置。

后面我们会全程使用 TypeScript 来写 Vue3 ，也是需要使用 ES Module ，因此了解它对你非常重要。

以下简称 ESM 代指 ES Module 规范。

:::tip
在阅读本小节之前，建议先阅读 [用 CommonJS 设计模块](#用-commonjs-设计模块) 以了解前置内容，本小节会在适当的内容前后与 CJS 的写法进行对比。
:::

#### 准备工作

继续使用我们在 [用 CommonJS 设计模块](#用-commonjs-设计模块) 时使用的 Hello Node 项目作为 DEMO ，当然你也可以重新创建一个新的。

一样的，先调整一下目录结构：

1. 在 `src` 文件夹里面创建一个 `esm` 文件夹
2. 在 `esm` 文件夹里面创建两个 MJS 文件： `index.mjs` 和 `module.mjs` 

:::tip
注意这里我使用了 `.mjs` 文件扩展名，因为默认情况下， Node 需要使用该扩展名才会支持 ES Module 规范。

你也可以在 package.json 里增加一个 `"type": "module"` 的字段来使 `.js` 文件支持 ESM ，但对应的，原来使用 CommonJS 规范的文件需要从 `.js` 扩展名改为 `.cjs` 才可以继续使用 CJS 。

为了减少理解上的门槛，这里选择了使用 `.mjs` 新扩展名便于入门，可以在 [了解 package.json](#了解-package-json) 部分的内容了解更多。
:::

此时目录结构应该如下：

```bash{9-14}
node-demo
│ # 源码文件夹
├─src
│ │ # 上次用来测试 CommonJS 的相关文件
│ ├─cjs
│ │ ├─index.cjs
│ │ └─module.cjs
│ │
│ │ # 这次要用的 ES Module 测试文件
│ └─esm
│   │ # 入口文件
│   ├─index.mjs
│   │ # 模块文件
│   └─module.mjs
│
│ # 项目清单
└─package.json
```

同样的，源代码放在 `src` 文件夹里面管理。

然后我们再修改一下 package.json 里面的 scripts 部分，参照上次配置 CSJ 的格式，增加一个 ESM 版本的 script ，改成如下：

```json{4}
{
  "scripts": {
    "dev:cjs": "node src/cjs/index.cjs",
    "dev:esm": "node src/esm/index.mjs"
  }
}
```

后面我们在命令行执行 `npm run dev:esm` 就可以测试我们的 ESM 模块了。

:::tip
注意， script 里的 `.mjs` 扩展名不能省略。

另外，在实际项目中，你可能不需要做这些处理，因为很多工作脚手架已经帮你处理过了，比如我们的 Vue3 项目。
:::

#### 基本语法

ESM 使用 `export default` （默认导出）和 `export` （命名导出）这两个语法导出模块，和 CJS 一样， ESM 也可以导出任意合法的 JavaScript 类型，例如：字符串、布尔值、对象、数组、函数等等。

使用 `import ... from ...` 导入模块，在导入的时候，如果文件扩展名是 `.js` 则可以省略文件名后缀，否则需要把扩展名也完整写出来。

#### 默认导出和导入

ESM 的默认导出也是一个模块只包含一个值，导入时声明的变量名，它对应的数据就是对应模块的值。

我们在 `src/esm/module.mjs` 文件里，写入以下代码，导出一句 `Hello World` 信息：

```js
// src/esm/module.mjs
export default 'Hello World'
```

在 `src/esm/index.mjs` 文件里，写入以下代码，导入我们刚刚编写的模块。

```js
// src/esm/index.mjs
import m from './module.mjs'
console.log(m)
```

在命令行输入 `npm run dev:esm` ，可以看到成功输出了 `Hello World` 信息：

```bash
npm run dev:esm

> demo@1.0.0 dev:esm
> node src/esm/index.mjs

Hello World
```

可以看到，在导入模块时，声明的 `m` 变量拿到的值，就是整个模块的内容，可以直接使用，此例子中它是一个字符串。

像在 CJS 的例子里一样，我们也来再改动一下，把 `src/esm/module.mjs` 改成导出一个函数：

```js
// src/esm/module.mjs
export default function foo() {
  console.log('Hello World')
}
```

同样的，这次也是变成了导入一个函数，我们可以执行它：

```js{3}
// src/esm/index.mjs
import m from './module.mjs'
m()
```

一样可以从模块里的函数得到一句 `Hello World` 的打印信息。

```bash
npm run dev:esm

> demo@1.0.0 dev:esm
> node src/esm/index.mjs

Hello World
```

:::tip
可以看到， CJS 和 ESM 的默认导出是非常相似的，在未来如果有老项目需要从 CJS 往 ESM 迁移，大部分情况下你只需要把 `module.exports` 改成 `export default` 即可。
:::

#### 命名导出和导入

虽然默认导出的时候， CJS 和 ESM 的写法非常相似，但命名导出却完全不同！

在 CJS ，命名导出后的模块数据默认是一个对象，你可以导入模块后通过 `m.foo` 这样的方式去调用，或者在导入的时候直接解构：

```js
// CJS 支持导入的时候直接解构
const { foo } = require('./module.cjs')
```

但 ES Module 不是对象，如果你这样导出，其实也是默认导出：

```js
// 在 ESM ，通过这样导出的数据也是属于默认导出
export default {
  foo: 1,
}
```

无法通过这样导入：

```js
// ESM 无法通过这种方式对默认导出的数据进行 “解构”
import { foo } from './module.mjs'
```

会报错：

```bash
import { foo } from './module.mjs'
         ^^^
SyntaxError: 
The requested module './module.mjs' does not provide an export named 'foo'
```

正确的方式应该是通过 `export` 来对数据进行命名导出，我们修改一下 `src/esm/module.mjs` 文件：

```js
// src/esm/module.mjs
export function foo() {
  console.log('Hello World from foo.')
}

export const bar = 'Hello World from bar.'
```

现在你才可以通过它们的命名进行导入：

```js
// src/esm/index.mjs
import { foo, bar } from './module.mjs'
foo()
console.log(bar)
```

:::tip
切记，和 CJS 不同， ESM 模块不是对象，命名导出之后只能使用花括号 `{}` 来导入名称。
:::

#### 导入时重命名

接下来我们来看看 ESM 是如何处理相同命名导出的问题，我们的模块文件依然保持不变，还是导出两个变量：

```js
// src/esm/module.mjs
export function foo() {
  console.log('Hello World from foo.')
}

export const bar = 'Hello World from bar.'
```

入口文件里面，也声明一个 `foo` 变量，然后导入的时候对模块里的 `foo` 进行重命名操作：

```js{3}
// src/esm/index.mjs
import {
  foo as foo2,  // 这里进行了重命名
  bar
} from './module.mjs'

// 就不会造成变量冲突
const foo = 1
console.log(foo)

// 用新的命名来调用模块里的方法
foo2()

// 这个不冲突就可以不必处理
console.log(bar)
```

可以看到，在 ESM 的重命名方式和 CJS 是完全不同的，它是使用 `as` 关键字来操作，语法为 `<old-name> as <new-name>` 。

现在我们再次运行 `npm run dev:esm` ，可以看到打印出来的结果也是完全符合预期了：

```bash
npm run dev:esm

> demo@1.0.0 dev:esm
> node src/esm/index.mjs

1
Hello World from foo.
Hello World from bar.
```

以上是针对命名导出时的重命名方案，如果是默认导出，和 CJS 一样，在导入的时候用一个不冲突的变量名来声明就可以了。

## 了解组件化设计

>待完善

### 什么是组件化

>待完善

### 解决了什么问题

>待完善

### 如何实现组件化

>待完善

## 了解包和插件

在实际业务中，经常会用到各种各样的插件，插件在 Node 项目里的体现是一个又一个的依赖包。

虽然你也可以把插件的代码文件手动放到你的源码文件夹里引入，但并不是一个最佳的选择，本节内容将带你了解 Node 的依赖包。

### 什么是包

在 Node 项目里，包可以简单理解为模块的集合，一个包可以只提供一个模块的功能，也可以作为多个模块的集合集中管理。

包通常是发布在官方的包管理平台 npmjs 上面，开发者需要使用的时候，可以通过包管理器安装到项目里，并在你的代码里引入，开箱即用（详见： [依赖包的管理](#依赖包的管理) ）。

使用 npm 包可以减少你在项目中重复造轮子，提高项目的开发效率，也可以极大的缩小项目源码的体积（详见：[什么是 node_modules](#什么是-node-modules)）。

包管理平台官网：[https://www.npmjs.com](https://www.npmjs.com)

### 什么是 node_modules

node_modules 是 Node 项目下用于存放已安装的依赖包的目录，如果不存在，会自动创建。

如果是本地依赖，会存在于项目根目录下，如果是全局依赖，会存在于环境变量关联的路径下，详见下方的管理依赖部分内容的讲解。

:::tip
一般在提交项目代码到 Git 仓库或者你的服务器上时，都需要排除 node_modules 文件夹的提交，因为它非常大。

如果托管在 Git 仓库，可以在 .gitignore 文件里添加 `node_modules` 作为要排除的文件夹名称。
:::

### 什么是包管理器

包管理器（ Package Manager ）是用来管理依赖包的工具，比如：发布、安装、更新、卸载等等。

Node 默认提供了一个包管理器 `npm` ，在安装 Node.js 的时候，默认会一起安装 npm 包管理器，可以通过以下命令查看它是否正常。

```bash
npm -v
```

如果正常，将会输出相应的版本号。

### 依赖包的管理

接下来我们会以 npm 作为默认的包管理器，来了解如何在项目里管理依赖包。

#### 配置镜像源

在国内，直接使用 npm 会比较慢，可以通过绑定 [npm Mirror 中国镜像站](https://npmmirror.com/) 的镜像源来提升依赖包的下载速度。

你可以先在命令行输入以下命令查看当前的 npm 配置：

```bash
npm config get registry
# https://registry.npmjs.org/
```

默认情况下，会输出 npm 官方的资源注册表地址，接下来我们在命令行上输入以下命令，进行镜像源的绑定：

```bash
npm config set registry https://registry.npmmirror.com
```

可以再次运行查询命令来查看是否设置成功：

```bash
npm config get registry
# https://registry.npmmirror.com/
```

可以看到已经成功更换为中国镜像站的地址了，之后在安装 npm 包的时候，速度会有很大的提升！

如果需要删除自己配置的镜像源，可以输入以下命令进行移除，移除后会恢复默认设置：

```bash
npm config rm registry
```

#### 本地安装（生产依赖）

执行 `npm install` 的时候，添加 `--save` 或者 `-S` 选项可以将依赖安装到本地，并列为生产依赖。

:::tip
需要提前在命令行 `cd` 到你的项目目录下再执行安装。

另外， `--save` 或者 `-S` 选项在实际使用的时候可以省略，因为它是默认选项。
:::

```bash
npm install --save <package-name>
```

可以在项目的 `package.json` 文件里的 `dependencies` 字段查看是否已安装成功，例如：

```json
// package.json
{
  // 会安装到这里
  "dependencies": {
    // 以 "包名"："版本号" 的格式写入
    "vue-router": "^4.0.14"
  },
}
```

生产依赖包会被安装到项目根目录下的 `node_modules` 目录里。

项目在上线后仍需用到的包，就需要安装到生产依赖里，比如 Vue 的路由 `vue-router` 就需要以这个方式安装。

#### 本地安装（开发依赖）

执行 `npm install` 的时候，如果添加 `--save-dev` 或者 `-D` 选项，可以将依赖安装到本地，并写入开发依赖里。

:::tip
需要提前在命令行 `cd` 到你的项目目录下再执行安装。
:::

```bash
npm install --save-dev <package-name>
```

可以在项目的 `package.json` 文件里的 `devDependencies` 字段查看是否已安装成功，例如：

```json
// package.json
{
  // 会安装到这里
  "devDependencies": {
    // 以 "包名"："版本号" 的格式写入
    "eslint": "^8.6.0"
  },
}
```

开发依赖包也是会被安装到项目根目录下的 `node_modules` 目录里。

和生产依赖包不同的点在于，只在开发环境生效，构建部署到生产环境时可能会被抛弃，一些只在开发环境下使用的包，就可以安装到开发依赖里，比如检查代码是否正确的 `ESLint` 就可以用这个方式安装。

#### 全局安装

执行 `npm install` 的时候，如果添加 `--global` 或者 `-g` 选项，可以将依赖安装到全局，它们将被安装在 [配置环境变量](#配置环境变量) 里配置的全局资源路径里。

```bash
npm install --global <package-name>
```

:::tip
Mac 用户需要使用 `sudo` 来提权才可以完成全局安装。

另外，可以通过 `npm root -g` 查看全局包的安装路径。
:::

一般情况下，类似于 `@vue/cli` 之类的脚手架会提供全局安装的服务，安装后，你就可以使用 `vue create xxx` 等命令直接创建 Vue 项目了。

但不是每个 npm 包在全局安装后都可以正常使用，请阅读 npm 包的主页介绍和使用说明。

#### 版本控制

有时候一些包的新版本不一定适合你的老项目，因此 npm 也提供了版本控制功能，支持通过指定的版本号或者 Tag 安装。

语法如下，在包名后面紧跟 `@` 符号，再紧跟版本号或者 Tag 名称。

```bash
npm install <package-name>@<version | tag>
```

例如：

现阶段 Vue 默认为 3.x 的版本了，如果你想安装 Vue 2 ，可以通过指定版本号的方式安装：

```bash
npm install vue@2.6.14
```

或者通过对应的 Tag 安装：

```bash
npm install vue@legacy
```

:::tip
版本号或者 Tag 名称可以在 npmjs 网站上的包详情页查询。
:::

#### 版本升级

一般来说，直接重新安装依赖包可以达到更新的目的，但也可以通过 `npm update` 命令来更新。

语法如下，可以更新全部的包：

```bash
npm update
```

也可以更新指定的包：

```bash
npm update <package-name>
```

npm 会检查是否有满足版本限制的更新版本。

#### 卸载

可以通过 `npm uninstall` 命令来卸载指定的包，和安装一样，卸载也区分了卸载本地依赖包和卸载全局包，不过只有在卸载全局包的时候才需要添加选项，默认只卸载当前项目下的本地包。

本地卸载：

```bash
npm uninstall <package-name>
```

全局卸载：

```bash
npm uninstall --global <package-name>
```

:::tip
Mac 用户需要使用 `sudo` 来提权才可以完成全局卸载。
:::

### 如何使用包

在了解了 npm 包的常规操作之后，我们通过一个简单的例子来了解如何在项目里使用 npm 包。

继续使用我们的 [Hello Node](#hello-node) DEMO ，或者你也可以重新创建一个 DEMO 。

首先在 [命令行工具](#命令行工具) 通过 `cd` 命令进入项目所在的目录，我们用本地安装的方式来把 [md5 包](https://www.npmjs.com/package/md5) 添加到生产依赖，这是一个为我们提供开箱即用的哈希算法的包，在未来的实际工作中，你可能也会用到它，在这里使用它是因为足够简单，哈哈！

输入以下命令并回车执行：

```bash
npm install md5
```

可以看到控制台提示一共安装了 4 个包，这是因为 md5 这个 npm 包还引用了其他的包作为依赖，需要同时安装才可以正常工作。

```bash
# 这是安装 md5 之后控制台的信息返回
added 4 packages, and audited 5 packages in 2s

found 0 vulnerabilities
```

此时项目目录下会出现一个 node_modules 文件夹和一个 package-lock.json 文件：

```bash
node-demo
│ # 依赖文件夹
├─node_modules
│ # 源码文件夹
├─src
│ # 锁定安装依赖的版本号
├─package-lock.json
│ # 项目清单
└─package.json
```

我们先打开 package.json ，可以看到已经多出了一个 `dependencies` 字段，这里记录了我们刚刚安装的 md5 包信息。

```json{13-15}
{
  "name": "demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev:cjs": "node src/cjs/index.cjs",
    "dev:esm": "node src/esm/index.mjs"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "md5": "^2.3.0"
  }
}
```

来到这里你可能会有一连串的疑问：

>1. 为什么只安装了一个 md5 ，但控制台提示安装了 4 个包？
>2. 为什么 package.json 又只记录了 1 个 md5 包信息？
>3. 为什么提示审核了 5 个包，哪里来的第 5 个包？

不要着急，请先打开 package-lock.json 文件，这个文件是记录了锁定安装依赖的版本号信息（由于篇幅原因，这里的展示省略了一些包的细节）：

```json
{
  "name": "demo",
  "version": "1.0.0",
  "lockfileVersion": 2,
  "requires": true,
  "packages": {
    "": {
      "name": "demo",
      "version": "1.0.0",
      "license": "ISC",
      "dependencies": {
        "md5": "^2.3.0"
      }
    },
    "node_modules/charenc": {
      "version": "0.0.2",
      // ...
    },
    "node_modules/crypt": {
      "version": "0.0.2",
      // ...
    },
    "node_modules/is-buffer": {
      "version": "1.1.6",
      // ...
    },
    "node_modules/md5": {
      "version": "2.3.0",
      // ...
    }
  },
  "dependencies": {
    "charenc": {
      "version": "0.0.2",
      // ...
    },
    "crypt": {
      "version": "0.0.2",
      // ...
    },
    "is-buffer": {
      "version": "1.1.6",
      // ...
    },
    "md5": {
      "version": "2.3.0",
      // ...
      "requires": {
        "charenc": "0.0.2",
        "crypt": "0.0.2",
        "is-buffer": "~1.1.6"
      }
    }
  }
}
```

可以看到这个文件的 `dependencies` 字段除了 md5 之外，还有另外 3 个包信息，它们就是 md5 包所依赖的另外 3 个 npm 包了，这就解答了为什么一共安装了 4 个 npm 包。

在 node_modules 文件夹下你也可以看到以这 4 个包名为命名的文件夹，这些文件夹存放的就是各个包项目发布在 npmjs 平台上的文件。

我们再看 `packages` 字段，这里除了罗列出 4 个 npm 包的信息之外，还把项目的信息也列了进来，这就是为什么是提示审核了 5 个包，原因是除了 4 个依赖包，你的项目本身也是一个包。

:::tip
package-lock.json 文件并不是一成不变的，假如以后 md5 又引用了更多的包，这里记录的信息也会随之增加。

并且不同的包管理器，它的 lock 文件也会不同，如果是使用 yarn 作为包管理器的话，它是生成一个 yarn.lock 文件，而不是 package-lock.json ，有关更多的包管理器，详见 [插件的使用](plugin.md) 一章。
:::

现在我们已经安装好 md5 包了，接下来看看具体如何使用它。

通常在包的 npmjs 主页上会有 API 和用法的说明，只需要根据说明操作，我们打开 `src/esm/index.mjs` 文件，首先需要导入这个包。

包的导入和我们在 [了解模块化设计](#了解模块化设计) 一节了解到的模块导入用法是一样的，只是把 `from` 后面的文件路径换成了包名。

```js
// src/esm/index.mjs
import md5 from 'md5'
```

然后根据 md5 的用法，我们来编写一个小例子，先声明一个原始字符串变量，然后再声明一个使用 md5 加密过的字符串变量，并打印它们：

```js
// src/esm/index.mjs
import md5 from 'md5'

const before = 'Hello World'
const after = md5(before)
console.log({ before, after })
```

在命令行输入 `npm run dev:esm` ，可以在控制台看到输出了这些内容，我们成功获得了转换后的结果：

```bash
npm run dev:esm

> demo@1.0.0 dev:esm
> node src/esm/index.mjs

{ before: 'Hello World', after: 'b10a8db164e0754105b7a99be72e3fe5' }
```

是不是非常简单，其实包的用法和我们在导入模块的用法可以说是完全一样的，区别主要在于，包是需要你安装了才能用，而模块是需要自己编写。

## 了解 TypeScript

本章内容看到这里，相信你已经对 Node 工程项目有了足够的认识了，在此之前我们的所有代码都是使用 JavaScript 编写的，接下来这一节，我将带你认识 TypeScript ，这是一门新的语言，但是上手非常简单。

TypeScript 简称 TS ，既是一门新语言，也是 JS 的一个超集，它是在 JavaScript 的基础上增加了一套类型系统，它支持所有的 JS 语句，为工程化开发而生，最终在编译的时候去掉类型和特有的语法，生成 JS 代码。

只要你本身已经学会了 JS ，并且经历过很多协作类的项目，那么使用 TS 编程是一个很自然而然的过程。

### 为什么需要类型系统

要想知道自己为什么要用 TypeScript ，得先从 JavaScript 有什么不足说起，举一个非常小的例子：

```js
function getFirstWord(msg) {
  console.log(msg.split(' ')[0])
}

getFirstWord('Hello World')  // 输出 Hello

getFirstWord(123) // TypeError: msg.split is not a function
```

这里定义了一个用空格切割字符串的方法，并打印出第一个单词：

1. 第一次执行时，字符串支持 `split` 方法，所以成功获取到了第一个单词 `Hello`
2. 第二次执行时，由于数值不存在 `split` 方法，所以传入 `123` 引起了程序崩溃

这就是 JavaScript 的弊端，过于灵活，没有类型的约束，很容易因为类型的变化导致一些本可避免的 BUG 出现，而且这些 BUG 通常需要在程序运行的时候才会被发现，很容易引发生产事故。

虽然可以在执行 `split` 方法之前执行一层判断或者转换，但很明显增加了很多工作量。

TypeScript 的出现，在编译的时候就可以执行检查来避免掉这些问题，而且配合 VSCode 等编辑器的智能提示，可以很方便的知道每个变量对应的类型。

### Hello TypeScript

我们将继续使用 [Hello Node](#hello-node) 这个 DEMO ，或者你可以再建一个新 DEMO ，依然是在 `src` 文件夹下，创建一个 `ts` 文件夹归类本次的测试文件，然后创建一个 `index.ts` 文件在 `ts` 文件夹下。

:::tip
TypeScript 语言对应的文件扩展名是 `.ts` 。
:::

然后在命令行通过 `cd` 命令进入项目所在的目录路径，安装 TypeScript 开发的两个主要依赖包：

1. [typescript](https://www.npmjs.com/package/typescript) 这个包是用 TypeScript 编程的语言依赖包

2. [ts-node](https://www.npmjs.com/package/ts-node) 是让 Node 可以运行 TypeScript 的执行环境

```bash
npm install -D typescript ts-node
```

这次我们添加了一个 `-D` 参数，因为 TypeScript 和 TS-Node 是开发过程中使用的依赖，所以我们将其添加到 package.json 的 `devDependencies` 字段里。 

然后修改 scripts 字段，增加一个 `dev:ts` 的 script ：

```json{9,17-20}
{
  "name": "demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev:cjs": "node src/cjs/index.cjs",
    "dev:esm": "node src/esm/index.mjs",
    "dev:ts": "ts-node src/ts/index.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "md5": "^2.3.0"
  },
  "devDependencies": {
    "ts-node": "^10.7.0",
    "typescript": "^4.6.3"
  }
}
```

准备工作完毕！

:::tip
请注意， `dev:ts` 这个 script 我是用了 `ts-node` 来代替原来在用的 `node` ，因为使用 `node` 无法识别 TypeScript 语言。
:::

我们把 [为什么需要类型系统](#为什么需要类型系统) 里面提到的例子放到 `src/ts/index.ts` 里，然后在命令行运行 `npm run dev:ts` 来看看这次的结果：

```bash
TSError: ⨯ Unable to compile TypeScript:
src/ts/index.ts:1:23 - error TS7006: Parameter 'msg' implicitly has an 'any' type.

1 function getFirstWord(msg) {
                        ~~~
```

这是告知 `getFirstWord` 的入参 `msg` 带有隐式 any 类型，这个时候你可能还不了解 any 代表什么意思，没关系，我们来看下如何修正这段代码：

```ts{2}
// src/ts/index.ts
function getFirstWord(msg: string) {
  console.log(msg.split(' ')[0])
}

getFirstWord('Hello World')

getFirstWord(123)
```

留意到没有，现在函数的入参 `msg` 已经变成了 `msg: string` ，这是 TypeScript 指定参数为字符串类型的一个写法。

现在再运行 `npm run dev:ts` ，上一个错误提示已经不再出现，取而代之的是一个新的报错：

```bash
TSError: ⨯ Unable to compile TypeScript:
src/ts/index.ts:7:14 - error TS2345: 
Argument of type 'number' is not assignable to parameter of type 'string'.

7 getFirstWord(123)
               ~~~
```

这次的报错代码是在 `getFirstWord(123)` 这里，告诉我们 `number` 类型的数据不能分配给 `string` 类型的参数，也就是我们故意传入一个会报错的数值进去，被 TypeScript 检查出来了！

你可以再仔细留意一下控制台的信息，你会发现没有报错的 `getFirstWord('Hello World')` 也没有打印出结果，这是因为 TypeScript 需要先被编译成 JavaScript ，然后再执行。

这个机制让我们的代码问题能够及早发现，一旦代码出现问题，编译阶段就会失败。

我们移除会报错的那行代码，只保留如下：

```ts
// src/ts/index.ts
function getFirstWord(msg: string) {
  console.log(msg.split(' ')[0])
}

getFirstWord('Hello World')
```

再次运行 `npm run dev:ts` ，这次完美运行！

```ts
npm run dev:ts

> demo@1.0.0 dev:ts
> ts-node src/ts/index.ts

Hello
```

在这个例子里，相信你已经感受到 TypeScript 的魅力了！接下来我们来认识一下不同的 JavaScript 类型，在 TypeScript 里面应该如何定义。

### 常用的 TS 类型定义

在 [Hello TypeScript](#hello-typescript) 的体验中，相信能够感受到 TypeScript 编程带来的好处了，代码的健壮性得到了大大的提升！并且应该也能够大致了解到， TS 类型并不会给你的编程带来非常高的门槛或者说开发阻碍。

如果你还没有体验这个 DEMO ，建议先按教程跑一下，然后我们来讲解不同的 JavaScript 类型应该如何在 TypeScript 里定义，接下来的时间里，你可以一边看，一边在 DEMO 里实践。

#### 原始数据类型

[原始数据类型](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive) 是一种既非对象也无方法的数据，刚才我们演示代码里，函数的入参使用的字符串 String 就是原始数据类型之一。

除了 String ，另外还有数值 Number 、布尔值 Boolean 等等，它们在 TypeScript 都有统一的表达方式，我们列个表格对比，能够更直观的了解：

原始数据类型|JavaScript|TypeScript
:-:|:-:|:-:
字符串|String|string
数值|Number|number
布尔值|Boolean|boolean
大整数|BigInt|bigint
符号|Symbol|symbol
不存在|Null|null
未定义|Undefined|undefined

有没有发现窍门？

对！ TypeScript 对原始数据的类型定义真的是超级简单，就是转为全小写即可！

#### 数组

除了原始数据类型之外， JavaScript 还有引用类型，数组 Array 就是其中的一种。

之所以先讲数组，是因为它在 TS 里面，可能是最接近原始数据的一个类型了，为什么这么说？我们还是列个表，来看一下如何定义数组：

数组里的数据|类型写法 1|类型写法 2
:-:|:-:|:-:
字符串|string[]|Array\<string\>
数值|number[]|Array\<number\>
布尔值|boolean[]|Array\<boolean\>
大整数|bigint[]|Array\<bigint\>
符号|symbol[]|Array\<symbol\>
不存在|null[]|Array\<null\>
未定义|undefined[]|Array\<undefined\>

是吧！就只是在原始数据类型的基础上变化了一下书写格式，就成为了数组的定义！

我个人最常用的就是 `string[]` 这样的格式，只需要追加一个方括号 `[]` ，另外一种写法是基于 TS 的泛型 `Array<T>` ，两种方式定义出来的类型其实是一样的。

对于复杂的数组，比如数组里面的 item 都是对象，其实格式也是一样，只不过把原始数据类型换成对象的类型即可，例如 `GameItem[]` 表示这是一个游戏项目的数组列表。

#### 对象（接口）

>待完善

看完数组咱们就来看对象了，对象也是引用类型，在 [数组](#数组) 的最后我提到了一个 `GameItem[]` 的写法，这里的 `GameItem` 就是一个对象的类型定义。

在 TypeScript ，定义对象的类型应该是第一个比较有门槛的地方，就如对象的键值对里面的值，可能是由原始数据、数组、对象组成的一样，类型定义也是根据值的需要来确定它的类型。

对象的类型定义有两个语法支持： `type` 和 `interface` 。

先看看 `type` 的写法：

```ts
type GameItem = {
  // ...
}
```

再看看 `interface` 的写法：

```ts
interface GameItem {
  // ...
}
```

可以看到它们表面上的区别是一个有 `=` 号，一个没有，事实上在一般的情况下也确实如此，两者非常接近，但是在特殊的时候也有一定的区别。

为了降低学习门槛，我们统一使用 `interface` 来做入门教学，它的写法与 Object 更为接近，事实上它也被用的更多。

这里我通过一些举例来带你举一反三，你随时可以在 DEMO 里进行代码实践。



#### 类

>待完善

#### 联合类型

>待完善

#### 函数

>待完善

#### 任意值

>待完善

#### 第三方库

>待完善

#### 其他

>待完善

#### 类型断言

>待完善

#### 类型推论

>待完善

### 代码检查

>待完善

### 了解 tsconfig.json

>待完善

### 如何转换为 JavaScript

>待完善

### 如何转换为 TypeScript

>待完善

## 了解构建工具

>待完善

### Webpack

>待完善

### Vite

>待完善

### 开发环境和生产环境

>待完善

## 了解 Vue.js

>待完善

### 了解渐进式框架

>待完善

### 了解单页面应用

>待完善

### 传统页面与单组件文件

>待完善

### 事件驱动与数据驱动

>待完善

#### 事件驱动

>待完善

#### 数据驱动

>待完善

### 真实 DOM 与虚拟 DOM

>待完善

#### 真实 DOM

>待完善

#### 虚拟 DOM

>待完善

### 了解响应式数据

>待完善

### Vue 3 带来的变化

>待完善

### Hello Vue3

>待完善

## 本章结语

>待完善

<!-- 谷歌广告 -->
<ClientOnly>
  <google-adsense />
</ClientOnly>
<!-- 谷歌广告 -->

<!-- 评论 -->
<ClientOnly>
  <gitalk-comment
    :issueId="45"
  />
</ClientOnly>
<!-- 评论 -->