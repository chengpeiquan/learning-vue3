---
outline: 'deep'
---

# 工程化的前期准备

对于刚刚迈入前端工程化、或者还没有接触过前端工程化的开发者，从传统的用 HTML + CSS + JS 手写页面的认知阶段走到工程化的世界，会面对翻天覆地的变化，需要先学习一些入门准备知识。

这一章会介绍一些前置的知识点科普，方便开始学习 Vue3 的时候，不会对一些基本的认知和操作存在太多疑惑。

:::tip
本指南需要具备一定的 HTML 、 CSS 和 JavaScript 基础，如果完全不懂，请先对这三个知识点进行一些入门的学习。
:::

## 命令行工具

在前端工程化开发过程中，已经离不开各种命令行操作，例如：管理项目依赖、本地服务启动、打包构建，还有拉取代码 / 提交代码这些 Git 操作等等。

命令行界面（ Command-line Interface ，缩写 CLI ），是一种通过命令行来实现人机交互的工具，需要提前准备好命令行界面工具。

如果有所留意，会发现很多工具都可以实现命令行操作，比如：命令行界面（ CLI ）、终端（ Terminal ）、 Shell 、控制台（ Console ）等等。

从完整功能看，它们之间确实有许多区别，不过对于前端开发者来说，日常的命令行交互需要用到的功能不会特别多，所以后面会统一一些名词，减少理解上的偏差。

| 交互行为 | 统一代替名词 | 代替名词解释                                                                          |
| :------: | :----------: | :------------------------------------------------------------------------------------ |
|   输入   |    命令行    | 需要输入命令的时候，会统一用 “命令行” 来指代。                                        |
|   输出   |    控制台    | 鉴于前端开发者更多接触的是浏览器的 Console 控制台，<br>所以也是会用 “控制台” 来指代。 |

### Windows

在 Windows 平台，可以使用自带的 CMD 或者 Windows PowerShell 工具。

但为了更好的开发体验，推荐使用以下工具（需要下载安装），可以根据自己的喜好选择其一：

|       名称       | 简介                                  |                           下载                            |
| :--------------: | :------------------------------------ | :-------------------------------------------------------: |
| Windows Terminal | 由微软推出的强大且高效的 Windows 终端 | [前往 GitHub 下载](https://github.com/microsoft/terminal) |
|      CMDer       | 一款体验非常好的 Windows 控制台模拟器 |   [前往 GitHub 下载](https://github.com/cmderdev/cmder)   |

笔者在 Windows 台式机上是使用 Windows Terminal 比较多，在此之前是用 CMDer ，两者的设计和体验都非常优秀，当然，还有颜值。

### macOS

如果使用的是 Mac 系统，可以直接使用系统自带的 “终端” 工具，笔者在 MacBook 上是使用自带的终端进行开发。

:::tip
其实只要能正常使用命令行，对于前端工程师来说就可以满足日常需求，但选择更喜欢的工具，可以让自己的开发过程更为身心愉悦！
:::

## 安装 Node.js 环境

安装好命令行工具之后，来安装 Node 的开发环境。

### 下载和安装 Node

在 Node.js 官网提供了安装包的下载，不论是使用 Windows 系统还是 MacOS 系统， Node 都提供了对应的安装包，直接下载安装包并运行即可安装到的电脑里，就可以用来开发的项目了。

点击访问：[Node.js 官网下载](https://nodejs.org/zh-cn/download/)

安装后，打开的 [命令行工具](#命令行工具) ，输入以下命令即可查看是否安装成功：

```bash
node -v
```

如果已成功安装，会在控制台输出当前的 Node 版本号。

### 版本之间的区别

可以看到官网标注了 LTS 和 Current 两个系列，并且对应了不同的版本号。

#### Current 版本

Current 是最新发布版本，或者叫 “尝鲜版” ，可以在这个系列体验到最新的功能，但也可能会有一些意想不到的问题和兼容性要处理。

每六个月会发布一次 Current 大版本，新的偶数版本（ e.g. v16.x.x ）会在每年的 4 月份发布，奇数版本（ e.g. v17.x.x ）会在每年的 10 月份发布。

也就是说，所有版本都会有 Current 版本阶段，这个阶段会持续 6 个月的时间，期间会被活跃的维护和变更，在发布满 6 个月后，奇偶数版本会有不同的结果：

- 大版本号是奇数的，将变为不支持状态，不会进入 LTS 版本。
- 大版本号是偶数的，会按照发布节点进入 LTS ，并且作为活跃状态投入使用。

:::tip
除非是狂热的 Node 开发探索者，否则不应该选择 Current 系列（特别是在生产环境），应该选择未被 EOL 的 LTS 系列作为的项目运行环境，详见下方的 [LTS 版本](#lts-版本) 说明。
:::

#### LTS 版本

LTS ，全称 Long Time Support ，长期维护版本，这个系列代表着稳定，建议首次下载以及后续的每次升级都选择 LTS 版本，减少开发过程中的未知问题出现。

每个 LTS 版本的大版本号都是偶数，并且会有 3 个阶段的生命周期：

|  生命周期   | <span style="display: inline-block; width: 90px;">含义</span> | 说明                                                                                                                                        |
| :---------: | :-----------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------ |
|   Active    |                           活跃阶段                            | 每个从 Current 进入 LTS 的偶数版本，都会有 18 个月的时间被积极维护和升级。                                                                  |
| Maintenance |                           维护阶段                            | 活跃阶段达到 18 个月后，会进入为期 12 个月的维护阶段，期间只会进行错误修复和安全补丁。                                                      |
| End of Life |                           结束阶段                            | 简称 EOL ，在维护阶段达到期限之后，该版本进入 EOL 阶段，将不再维护，也就是说，每个 LTS 版本最长会有 30 个月的维护时间，之后将不再进行维护。 |

:::tip
当然也会有一些例外情况，例如 Node.js 16 版本，为了配合 OpenSSL 1.1.1 的 EOL 时间，将提前 7 个月进入 EOL 阶段。

详见官方公告： [Bringing forward the End-of-Life Date for Node.js 16](https://nodejs.org/en/blog/announcements/nodejs16-eol/) 。
:::

#### 是否需要经常更新版本

不论是 LTS 还是 Current ，每个系列下面都还有不同的大版本和小版本，是不是每次都必须及时更新到最新版呢？

当然不是，完全可以依照的项目技术栈依赖的最低 Node 版本去决定是否需要升级，不过如果条件允许，还是建议至少要把大版本升级到最新的 LTS 版本。

:::tip
关于 Node.js 的版本发布时间表可以在官方 GitHub 的 [Release 仓库](https://github.com/nodejs/Release) 查看。
:::

## 基础的 Node 项目

在安装和配置完 Node.js 之后，接下来了解 Node 项目的一些基础组成，这有助于开启前端工程化开发大门。

:::tip
当前文档所演示的 hello-node 项目已托管至 [learning-vue3/hello-node](https://github.com/learning-vue3/hello-node) 仓库，可使用 Git 克隆命令拉取至本地：

```bash
# 从 GitHub 克隆
git clone https://github.com/learning-vue3/hello-node.git

# 如果 GitHub 访问失败，可以从 Gitee 克隆
git clone https://gitee.com/learning-vue3/hello-node.git
```

成品项目可作为学习过程中的代码参考，但更建议按照教程的讲解步骤，从零开始亲手搭建一个新项目并完成 node 开发的体验，可以更有效的提升学习效果。
:::

### 初始化一个项目

如果想让一个项目成为 Node 项目，只需要在命令行 `cd` 到项目所在的目录，执行初始化命令：

```bash
npm init
```

之后命令行会输出一些提示，以及一些问题，可以根据的实际情况填写项目信息，例如：

```bash
package name: (demo) hello-node
```

以上面这个问题为例：

冒号左边的 `package name` 是问题的题干，会询问要输入什么内容。

冒号右边的括号内容 `(demo)` 是 Node 为推荐的答案（不一定会出现这个推荐值），如果觉得 OK ，可以直接按回车确认，进入下一道题。

冒号右边的 `hello-node` 是输入的答案（如果选择了推荐的答案，则这里为空），这个答案会写入到项目信息文件里。

当回答完所有问题之后，会把填写的信息输出到控制台，确认无误后，回车完成初始化的工作。

```bash
{
  "name": "hello-node",
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

如果觉得问题太多，太繁琐了，可以直接加上 `-y` 参数，这样会以 Node 推荐的答案帮快速生成项目信息。

```bash
npm init -y
```

### 了解 package.json

在完成 [项目的初始化](#初始化一个项目) 之后，会发现在项目的根目录下出现了一个名为 `package.json` 的 JSON 文件。

这是 Node 项目的清单，里面记录了这个项目的基础信息、依赖信息、开发过程的脚本行为、发布相关的信息等等，未来将在很多项目里看到它的身影。

:::tip
它必须是 JSON 文件，不可以是存储了 JavaScript 对象字面量的 JS 文件。
:::

如果是按照上面初始化一节的操作得到的这个文件，打开它之后，会发现里面存储了在初始化过程中，根据问题确认下来的那些答案，例如：

```json
{
  "name": "hello-node",
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

package.json 的字段并非全部必填，唯一的要求就是，必须是一个 JSON 文件，所以也可以仅仅写入以下内容：

```json
{}
```

但在实际的项目中，往往需要填写更完善的项目信息，除了手动维护这些信息之外，在安装 npm 包等操作时， Node 也会帮写入数据到这个文件里，来了解一些常用字段的含义：

|     字段名      | 含义                                                                                                        |
| :-------------: | :---------------------------------------------------------------------------------------------------------- |
|      name       | 项目名称，如果打算发布成 npm 包，它将作为包的名称                                                           |
|     version     | 项目版本号，如果打算发布成 npm 包，这个字段是必须的，遵循 [语义化版本号](#语义化版本号管理) 的要求          |
|   description   | 项目的描述                                                                                                  |
|    keywords     | 关键词，用于在 npm 网站上进行搜索                                                                           |
|    homepage     | 项目的官网 URL                                                                                              |
|      main       | 项目的入口文件                                                                                              |
|     scripts     | 指定运行脚本的命令缩写，常见的如 `npm run build` 等命令就在这里配置，详见 [脚本命令的配置](#脚本命令的配置) |
|     author      | 作者信息                                                                                                    |
|     license     | 许可证信息，可以选择适当的许可证进行开源                                                                    |
|  dependencies   | 记录当前项目的生产依赖，安装 npm 包时会自动生成，详见：[依赖包和插件](#依赖包和插件)                        |
| devDependencies | 记录当前项目的开发依赖，安装 npm 包时会自动生成，详见：[依赖包和插件](#依赖包和插件)                        |
|      type       | 配置 Node 对 CJS 和 ESM 的支持                                                                              |

其中最后的 type 字段是涉及到模块规范的支持，它有两个可选值： `commonjs` 和 `module` ，其默认值为 `commonjs` 。

- 当不设置或者设置为 `commonjs` 时，扩展名为 `.js` 和 `.cjs` 的文件都是 CommonJS 规范的模块，如果要使用 ES Module 规范，需要使用 `.mjs` 扩展名
- 当设置为 `module` 时，扩展名为 `.js` 和 `.mjs` 的文件都是 ES Module 规范的模块，如果要使用 CommonJS 规范，需要使用 `.cjs` 扩展名

关于模块规范可以在 [学习模块化设计](#学习模块化设计) 一节了解更多。

关于 package.json 的完整的选项可以在 [npm Docs](https://docs.npmjs.com/cli/v8/configuring-npm/package-json/) 上查阅。

### 项目名称规则

如果打算发布成 npm 包，它将作为包的名称，可以是普通包名，也可以是范围包的包名。

|                              类型                               | 释义                                                                                     | 例子                                                       |
| :-------------------------------------------------------------: | :--------------------------------------------------------------------------------------- | :--------------------------------------------------------- |
| <span style="display: inline-block; width: 50px;">范围包</span> | 具备 `@scope/project-name` 格式，一般有一系列相关的开发依赖之间会以相同的 scope 进行命名 | 如 `@vue/cli` 、 `@vue/cli-service` 就是一系列相关的范围包 |
|                             普通包                              | 其他命名都属于普通包                                                                     | 如 `vue` 、 `vue-router`                                   |

包名有一定的书写规则：

- 名称必须保持在 1 ~ 214 个字符之间（包括范围包的 `@scope/` 部分）
- 只允许使用小写字母、下划线、短横线、数字、小数点（并且只有范围包可以以点或下划线开头）
- 包名最终成为 URL 、命令行参数或者文件夹名称的一部分，所以名称不能包含任何非 URL 安全字符

:::tip
了解这一点有助于在后续工作中，在需要查找技术栈相关包的时候，可以知道如何在 npmjs 上找到它们。
:::

如果打算发布 npm 包，可以通过 `npm view <package-name>` 命令查询包名是否已存在，如果存在就会返回该包的相关信息。

比如查询 `vue` 这个包名，会返回它的版本号、许可证、描述等信息：

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

建议开发者在入门前端工程化的时候就应该熟悉这套规则，后续的项目开发中，会使用到很多外部依赖，它们也是使用版本号控制来管理代码的发布，每个版本之间可能会有一些兼容性问题，如果不了解版本号的通用规则，很容易在的开发中带来困扰。

:::tip
现在有很多 CI/CD 流水线作业具备了根据 Git 的 Commit 记录来自动升级版本号，它们也是遵循了语义化版本号规则，版本号的语义化在前端工程里有重大的意义。
:::

#### 基本格式与升级规则

版本号的格式为： `Major.Minor.Patch` （简称 `X.Y.Z` ），它们的含义和升级规则如下：

| 英文  |   中文   | 含义                                               |
| :---: | :------: | :------------------------------------------------- |
| Major | 主版本号 | 当项目作了大量的变更，与旧版本存在一定的不兼容问题 |
| Minor | 次版本号 | 做了向下兼容的功能改动或者少量功能更新             |
| Patch |  修订号  | 修复上一个版本的少量 BUG                           |

一般情况下，三者均为正整数，并且从 `0` 开始，遵循这三条注意事项：

- 当主版本号升级时，次版本号和修订号归零
- 当次版本号升级时，修订号归零，主版本号保持不变
- 当修订号升级时，主版本号和次版本号保持不变

下面以一些常见的例子帮助快速理解版本号的升级规则：

- 如果不打算发布，可以默认为 `0.0.0` ，代表它并不是一个进入发布状态的包
- 在正式发布之前，可以将其设置为 `0.1.0` 发布第一个测试版本，自此，代表已进入发布状态，但还处于初期开发阶段，这个阶段可能经常改变 API ，但不需要频繁的更新主版本号
- 在 `0.1.0` 发布后，修复了 BUG ，下一个版本号将设置为 `0.1.1` ，即更新了一个修订号
- 在 `0.1.1` 发布后，有新的功能发布，下一个版本号可以升级为 `0.2.0` ，即更新了一个次版本号
- 当觉得这个项目已经功能稳定、没有什么 BUG 了，决定正式发布并给用户使用时，那么就可以进入了 `1.0.0` 正式版了

#### 版本标识符

以上是一些常规的版本号升级规则，也可以通过添加 “标识符” 来修饰的版本更新：

格式为： `Major.Minor.Patch-Identifier.1` ，其中的 `Identifier` 代表 “标识符” ，它和版本号之间使用 `-` 短横线来连接，后面的 `.1` 代表当前标识符的第几个版本，每发布一次，这个数字 +1 。

| 标识符 | 含义                                                               |
| :----: | :----------------------------------------------------------------- |
| alpha  | 内部版本，代表当前可能有很大的变动                                 |
|  beta  | 测试版本，代表版本已开始稳定，但可能会有比较多的问题需要测试和修复 |
|   rc   | 即将作为正式版本发布，只需做最后的验证即可发布正式版               |

### 脚本命令的配置

在工作中，会频繁接触到 `npm run dev` 启动开发环境、 `npm run build` 构建打包等操作，这些操作其实是对命令行的一种别名。

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

这里的名字是可以自定义的，比如可以把 `serve` 改成更喜欢的 `dev` ：

```json{3}
{
  "scripts": {
    "dev": "vue-cli-service serve",
    "build": "vue-cli-service build"
  }
}
```

这样运行 `npm run dev` 也可以相当于运行了 `vue-cli-service serve` 。

据笔者所了解，有不少开发者曾经对不同的 Vue CLI 版本提供的 `npm run serve` 和 `npm run dev` 有什么区别有过疑问，看到这里应该都明白了吧，可以说没有区别，因为这取决于它对应的命令，而不是取决于它起什么名称。

:::tip
如果 `value` 部分包含了双引号 `"` ，必须使用转义符 `\` 来避免格式问题，例如： `\"` 。
:::

可以阅读 npm 关于 scripts 的 [完整文档](https://docs.npmjs.com/cli/v8/using-npm/scripts) 了解更多用法。

### Hello Node

看到这里，对于 Node 项目的基本创建流程和关键信息都有所了解了吧！来写一个 demo ，实际体验一下如何从初始化项目到打印一个 `Hello World` 到控制台的过程。

请先启动的命令行工具，然后创建一个项目文件夹，这里使用 `mkdir` 命令：

```bash
# 语法是 mkdir <dir-name>
mkdir hello-node
```

使用 `cd` 命令进入刚刚创建好的项目目录：

```bash
# 语法是 cd <dir-path>
cd hello-node
```

执行项目初始化，可以回答问题，也可以添加 `-y` 参数来使用默认配置：

```bash
npm init -y
```

来到这里就得到了一个具有 package.json 的 Node 项目了。

在项目下创建一个 `index.js` 的 JS 文件，可以像平时一样书写 JavaScript ，输入以下内容并保存：

```js
console.log('Hello World')
```

然后打开 package.json 文件，修改 scripts 部分如下，也就是配置了一个 `"dev": "node index"` 命令：

```json{7}
{
  "name": "hello-node",
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

这等价于直接在命令行执行 `node index.js` 命令，其中 `node` 是 Node.js 运行文件的命令， `index` 是文件名，相当于 `index.js` ，因为 JS 文件名后缀可以省略。

## 学习模块化设计

在了解 Node 项目之后，就要开始通过编码来加强对 Node.js 的熟悉程度了，但在开始使用之前，还需要了解一些概念。

在未来的日子里（不限于本教程，与前端工程化相关的工作内容息息相关），会频繁的接触到两个词：模块（ Module ）和包（ Package ）。

模块和包是 Node 开发最重要的组成部分，不管是全部自己实现一个项目，还是依赖各种第三方轮子来协助开发，项目的构成都离不开这两者。

### 模块化解决了什么问题

在软件工程的设计原则里，有一个原则叫 “单一职责” 。

假设一个代码块负责了多个职责的功能支持，在后续的迭代过程中，维护成本会极大的增加，虽然只需要修改这个代码块，但需要兼顾职责 1 、职责 2 、职责 3 … 等多个职责的兼容性，稍不注意就会引起工程运行的崩溃。

“单一职责” 的目的就是减少功能维护带来的风险，把代码块的职责单一化，让代码的可维护性更高。

一个完整业务的内部实现，不应该把各种代码都耦合在一起，而应该按照职责去划分好代码块，再进行组合，形成一个 “高内聚，低耦合” 的工程设计。

模块化就是由此而来，在前端工程里，每个单一职责的代码块，就叫做模块（ Module ） ，模块有自己的作用域，功能与业务解耦，非常方便复用和移植。

:::tip
模块化还可以解决本章开头所讲述的 [传统开发的弊端](#传统开发的弊端) 里提到的大部分问题，随着下面内容一步步深入，将一步步的理解它。
:::

### 如何实现模块化

在前端工程的发展过程中，不同时期诞生了很多不同的模块化机制，最为主流的有以下几种：

| 模块化方案 |            全称             |    适用范围     |
| :--------: | :-------------------------: | :-------------: |
|    CJS     |          CommonJS           |     Node 端     |
|    AMD     |   Async Module Definition   |     浏览器      |
|    CMD     |  Common Module Definition   |     浏览器      |
|    UMD     | Universal Module Definition | Node 端和浏览器 |
|    ESM     |          ES Module          | Node 端和浏览器 |

其中 AMD 、CMD 、 UMD 都已经属于偏过去式的模块化方案，在新的业务里，结合各种编译工具，可以直接用最新的 ESM 方案来实现模块化，所以可以在后续有接触的时候再了解。

ESM （ ES Module ） 是 JavaScript 在 ES6（ ECMAScript 2015 ）版本推出的模块化标准，旨在成为浏览器和服务端通用的模块解决方案。

CJS （ CommonJS ） 原本是服务端的模块化标准（设计之初也叫 ServerJS ），是为 JavaScript 设计的用于浏览器之外的一个模块化方案， Node 默认支持了该规范，在 Node 12 之前也只支持 CJS ，但从 Node 12 开始，已经同时支持 ES Module 的使用。

至此，不论是 Node 端还是浏览器端， ES Module 是统一的模块化标准了！

但由于历史原因， CJS 在 Node 端依然是非常主流的模块化写法，所以还是值得进行了解，因此下面的内容将主要介绍 CJS 和 ESM 这两种模块化规范是如何实际运用。

:::tip
在开始体验模块化的编写之前，请先在电脑里 [安装好 Node.js](#下载和安装-node) ，然后打开 [命令行工具](#命令行工具) ，通过 `cd` 命令进入平时管理项目的目录路径， [初始化一个 Node 项目](#初始化一个项目) 。

另外，在 CJS 和 ESM ，一个独立的文件就是一个模块，该文件内部的变量必须通过导出才能被外部访问到，而外部文件想访问这些变量，需要导入对应的模块才能生效。
:::

### 用 CommonJS 设计模块

虽然现在推荐使用 ES Module 作为模块化标准，但是日后在实际工作的过程中，还是不免会遇到要维护一些老项目，因此了解 CommonJS 还是非常有必要的。

以下简称 CJS 代指 CommonJS 规范。

#### 准备工作

延续在 [Hello Node](#hello-node) 部分创建的 Node.js demo 项目，先调整一下目录结构：

1. 删掉 `index.js` 文件
2. 创建一个 `src` 文件夹，在里面再创建一个 `cjs` 文件夹
3. 在 `cjs` 文件夹里面创建两个文件： `index.cjs` 和 `module.cjs`

:::tip
请注意这里使用了 `.cjs` 文件扩展名，其实它也是 JS 文件，但这个扩展名是 Node 专门为 CommonJS 规范设计的，可以在 [了解 package.json](#了解-package-json) 部分的内容了解更多。
:::

此时目录结构应该如下：

```bash
hello-node
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

这是一个常见的 Node 项目目录结构，通常源代码都会放在 `src` 文件夹里面统一管理。

接下来再修改一下 package.json 里面的 scripts 部分，改成如下：

```json
{
  "scripts": {
    "dev:cjs": "node src/cjs/index.cjs"
  }
}
```

后面在命令行执行 `npm run dev:cjs` 命令，就可以测试刚刚添加的 CJS 模块了。

#### 基本语法

CJS 使用 `module.exports` 语法导出模块，可以导出任意合法的 JavaScript 类型，例如：字符串、布尔值、对象、数组、函数等等。

使用 `require` 导入模块，在导入的时候，当文件扩展名是 `.js` 时，可以只写文件名，而此时使用的是 `.cjs` 扩展名，所以需要完整的书写。

#### 默认导出和导入

默认导出的意思是，一个模块只包含一个值；而导入默认值则意味着，导入时声明的变量名就是对应模块的值。

在 `src/cjs/module.cjs` 文件里，写入以下代码，导出一句 `Hello World` 信息：

```js
// src/cjs/module.cjs
module.exports = 'Hello World'
```

:::tip
自己在写入代码的时候，不需要包含文件路径那句注释，这句注释只是为了方便阅读时能够区分代码属于哪个文件，以下代码均如此。
:::

在 `src/cjs/index.cjs` 文件里，写入以下代码，导入刚刚编写的模块。

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

再改动一下，把 `src/cjs/module.cjs` 改成如下，这次导出一个函数：

```js
// src/cjs/module.cjs
module.exports = function foo() {
  console.log('Hello World')
}
```

相应的，这次变成了导入一个函数，所以可以执行它：

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

默认导出的时候，一个模块只包含一个值，有时候如果想把很多相同分类的函数进行模块化集中管理，例如想做一些 utils 类的工具函数文件、或者是维护项目的配置文件，全部使用默认导出的话，会有非常多的文件要维护。

那么就可以用到命名导出，这样既可以导出多个数据，又可以统一在一个文件里维护管理，命名导出是先声明多个变量，然后通过 `{}` 对象的形式导出。

再来修改一下 `src/cjs/module.cjs` 文件，这次改成如下：

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

这个时候通过原来的方式去拿模块的值，会发现无法直接获取到函数体或者字符串的值，因为打印出来的也是一个对象。

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

此时可以用一种更方便的方式，利用 ES6 的对象解构来直接拿到变量：

```js
// src/cjs/index.cjs
const { foo, bar } = require('./module.cjs')
foo()
console.log(bar)
```

这样子才可以直接调用变量拿到对应的值。

#### 导入时重命名

以上都是基于非常理想的情况下使用模块，有时候不同的模块之间也会存在相同命名导出的情况，来看看模块化是如何解决这个问题的。

的模块文件保持不变，依然导出这两个变量：

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

这次在入口文件里也声明一个 `foo` 变量，在导入的时候对模块里的 `foo` 进行了重命名操作。

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

不过因为历史原因，如果要直接在浏览器里使用该方案，在不同的浏览器里会有一定的兼容问题，需要通过 Babel 等方案进行代码的版本转换（可在 [控制编译代码的兼容性](#控制编译代码的兼容性) 一节了解如何使用 Babel ）。

因此一般情况下都需要借助构建工具进行开发，工具通常会提供开箱即用的本地服务器用于开发调试，并且最终打包的时候还可以抹平不同浏览器之间的差异。

随着 ESM 的流行，很多新推出的构建工具都默认只支持该方案（ e.g. Vite 、 Rollup ），如果需要兼容 CJS 反而需要另外引入插件单独配置。除了构建工具，很多语言也是默认支持 ESM ，例如 TypeScript ，因此了解 ESM 非常重要。

以下简称 ESM 代指 ES Module 规范。

:::tip
在阅读本小节之前，建议先阅读 [用 CommonJS 设计模块](#用-commonjs-设计模块) 以了解前置内容，本小节会在适当的内容前后与 CJS 的写法进行对比。
:::

#### 准备工作

继续使用在 [用 CommonJS 设计模块](#用-commonjs-设计模块) 时使用的 hello-node 项目作为 demo ，当然也可以重新创建一个新的。

一样的，先调整一下目录结构：

1. 在 `src` 文件夹里面创建一个 `esm` 文件夹
2. 在 `esm` 文件夹里面创建两个 MJS 文件： `index.mjs` 和 `module.mjs`

:::tip
注意这里使用了 `.mjs` 文件扩展名，因为默认情况下， Node 需要使用该扩展名才会支持 ES Module 规范。

也可以在 package.json 里增加一个 `"type": "module"` 的字段来使 `.js` 文件支持 ESM ，但对应的，原来使用 CommonJS 规范的文件需要从 `.js` 扩展名改为 `.cjs` 才可以继续使用 CJS 。

为了减少理解上的门槛，这里选择了使用 `.mjs` 新扩展名便于入门，可以在 [了解 package.json](#了解-package-json) 部分的内容了解更多。
:::

此时目录结构应该如下：

```bash{9-14}
hello-node
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

然后再修改一下 package.json 里面的 scripts 部分，参照上次配置 CJS 的格式，增加一个 ESM 版本的 script ，改成如下：

```json{4}
{
  "scripts": {
    "dev:cjs": "node src/cjs/index.cjs",
    "dev:esm": "node src/esm/index.mjs"
  }
}
```

后面在命令行执行 `npm run dev:esm` 就可以测试的 ESM 模块了。

:::tip
注意， script 里的 `.mjs` 扩展名不能省略。

另外，在实际项目中，可能不需要做这些处理，因为很多工作脚手架已经帮处理过了，比如的 Vue3 项目。
:::

#### 基本语法

ESM 使用 `export default` （默认导出）和 `export` （命名导出）这两个语法导出模块，和 CJS 一样， ESM 也可以导出任意合法的 JavaScript 类型，例如：字符串、布尔值、对象、数组、函数等等。

使用 `import ... from ...` 导入模块，在导入的时候，如果文件扩展名是 `.js` 则可以省略文件名后缀，否则需要把扩展名也完整写出来。

#### 默认导出和导入

ESM 的默认导出也是一个模块只包含一个值，导入时声明的变量名，它对应的数据就是对应模块的值。

在 `src/esm/module.mjs` 文件里，写入以下代码，导出一句 `Hello World` 信息：

```js
// src/esm/module.mjs
export default 'Hello World'
```

在 `src/esm/index.mjs` 文件里，写入以下代码，导入刚刚编写的模块。

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

像在 CJS 的例子里一样，也来再改动一下，把 `src/esm/module.mjs` 改成导出一个函数：

```js
// src/esm/module.mjs
export default function foo() {
  console.log('Hello World')
}
```

同样的，这次也是变成了导入一个函数，可以执行它：

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
可以看到， CJS 和 ESM 的默认导出是非常相似的，在未来如果有老项目需要从 CJS 往 ESM 迁移，大部分情况下只需要把 `module.exports` 改成 `export default` 即可。
:::

#### 命名导出和导入

虽然默认导出的时候， CJS 和 ESM 的写法非常相似，但命名导出却完全不同！

在 CJS 里，使用命名导出后的模块数据默认是一个对象，可以导入模块后通过 `m.foo` 这样的方式去调用对象的属性，或者在导入的时候直接解构拿到对象上的某个属性：

```js
// CJS 支持导入的时候直接解构
const { foo } = require('./module.cjs')
```

但 ES Module 的默认导出不能这样做，例如下面这个例子，虽然默认导出了一个对象：

```js
// 在 ESM ，通过这样导出的数据也是属于默认导出
export default {
  foo: 1,
}
```

但是无法和 CJS 一样通过大括号的方式导入其中的某个属性：

```js
// ESM 无法通过这种方式对默认导出的数据进行 “解构”
import { foo } from './module.mjs'
```

这样操作在运行过程中，控制台会抛出错误信息：

```bash
import { foo } from './module.mjs'
         ^^^
SyntaxError:
The requested module './module.mjs' does not provide an export named 'foo'
```

正确的方式应该是通过 `export` 对数据进行命名导出，先将 `src/esm/module.mjs` 文件修改成如下代码，请留意 `export` 关键字的使用：

```js
// src/esm/module.mjs
export function foo() {
  console.log('Hello World from foo.')
}

export const bar = 'Hello World from bar.'
```

通过 `export` 命名导出的方式，现在才可以使用大括号将它们进行命名导入：

```js
// src/esm/index.mjs
import { foo, bar } from './module.mjs'

foo()
console.log(bar)
```

这一次程序可以顺利运行了：

```bash
npm run dev:esm

> demo@1.0.0 dev:esm
> node src/esm/index.mjs

Hello World from foo.
Hello World from bar.
```

那么有没有办法像 CJS 一样使用 `m.foo` 调用对象属性的方式一样，去使用这些命名导出的模块呢？

答案是肯定的！命名导出支持使用 `* as 变量名称` 的方式将其所有命名挂在某个变量上，该变量是一个对象，每一个导出的命名都是其属性：

```ts
// src/esm/index.mjs
// 注意这里使用了另外一种方式，将所有的命名导出都挂在了 `m` 变量上
import * as m from './module.mjs'

console.log(typeof m)
console.log(Object.keys(m))

m.foo()
console.log(m.bar)
```

运行 `npm run dev:esm` ，将输出：

```bash
npm run dev:esm

> demo@1.0.0 dev:esm
> node src/esm/index.mjs

object
[ 'bar', 'foo' ]
Hello World from foo.
Hello World from bar.
```

#### 导入时重命名

接下来看看 ESM 是如何处理相同命名导出的问题，项目下的模块文件依然保持不变，还是导出两个变量：

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

现在再次运行 `npm run dev:esm` ，可以看到打印出来的结果也是完全符合预期了：

```bash
npm run dev:esm

> demo@1.0.0 dev:esm
> node src/esm/index.mjs

1
Hello World from foo.
Hello World from bar.
```

以上是针对命名导出时的重命名方案，如果是默认导出，和 CJS 一样，在导入的时候用一个不冲突的变量名来声明就可以了。

#### 在浏览器里访问 ESM

ES Module 除了支持在 Node 环境使用，还可以和普通的 JavaScript 代码一样在浏览器里运行。

要在浏览器里体验 ESM ，需要使用现代的主流浏览器（如 Chrome ），并注意其访问限制，例如本地开发不能直接通过 `file://` 协议在浏览器里访问本地 HTML 内引用的 JS 文件，这是因为浏览器对 JavaScript 的安全性要求，会触发 [CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS) 错误，因此需要启动本地服务并通过 `http://` 协议访问。

:::tip
CORS （全称 Cross-Origin Resource Sharing ）是指跨源资源共享，可以决定浏览器是否需要阻止 JavaScript 获取跨域请求的响应。

现代浏览器默认使用 “同源安全策略” ，这里的 “源” 指 URL 的 `origin` 部分，例如网页可以通过 `window.location.origin` 获取到如 `https://example.com` 这样格式的数据，就是网页的 `origin` 。

默认情况下，非同源的请求会被浏览器拦截，最常见的场景是通过 XHR 或者 Fetch 请求 API 接口，需要网页和接口都部署在同一个域名才可以请求成功，否则就会触发跨域限制。

如果网页和接口不在同一个域名，例如网页部署在 `https://web.example.com` ，接口部署在 `https://api.example.com` ，此时需要在 `https://api.example.com` 的 API 服务端程序里，配置 `Access-Control-Allow-Origin: *` 允许跨域请求（ `*` 代表允许任意外域访问，也可以指定具体的域名作为白名单列表）。
:::

##### 添加服务端程序

接下来搭建一个简单的本地服务，并通过 HTML 文件来引入 ESM 模块文件，体验浏览器端如何使用 ESM 模块。

在 hello-node 项目的根目录下创建名为 server 的文件夹（与 src 目录同级），并添加 index.js 文件，敲入以下代码：

```js
// server/index.js
const { readFileSync } = require('fs')
const { resolve } = require('path')
const { createServer } = require('http')

/**
 * 判断是否 ESM 文件
 */
function isESM(url) {
  return String(url).endsWith('mjs')
}

/**
 * 获取 MIME Type 信息
 * @tips `.mjs` 和 `.js` 一样，都使用 JavaScript 的 MIME Type
 */
function mimeType(url) {
  return isESM(url) ? 'application/javascript' : 'text/html'
}

/**
 * 获取入口文件
 * @returns 存放在本地的文件路径
 */
function entryFile(url) {
  const file = isESM(url) ? `../src/esm${url}` : './index.html'
  return resolve(__dirname, file)
}

/**
 * 创建 HTTP 服务
 */
const app = createServer((request, response) => {
  // 获取请求时的相对路径，如网页路径、网页里的 JS 文件路径等
  const { url } = request

  // 转换成对应的本地文件路径并读取其内容
  const entry = entryFile(url)
  const data = readFileSync(entry, 'utf-8')

  // 需要设置正确的响应头信息，浏览器才可以正确响应
  response.writeHead(200, { 'Content-Type': mimeType(url) })
  response.end(data)
})

/**
 * 在指定的端口号启动本地服务
 */
const port = 8080
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at:`)
  console.log()
  console.log(`  ➜  Local:  http://localhost:${port}/`)
  console.log()
})
```

这是一个基础的 Node.js 服务端程序，利用了 HTTP 模块启动本地服务，期间利用 FS 模块的 I/O 能力对本地文件进行读取，而 PATH 模块则简化了文件操作过程中的路径处理和兼容问题（例如众所周知的 Windows 与 macOS 的路径斜杆问题）。

:::tip
在这段服务端程序代码里，请留意 `mimeType` 方法，要让浏览器能够正确解析 `.mjs` 文件，需要在服务端响应文件内容时，将其 MIME Type 设置为 和 JavaScript 文件一样，这一点非常重要。

并且需要注意传递给 `readFileSync` API 的文件路径是否与真实存在的文件路径匹配，如果启动服务时，在 Node 控制台报了 `no such file or directory` 的错误，请检查是否因为笔误写错了文件名称，或者文件路径多了空格等情况。
:::

##### 添加入口页面

继续在 server 目录下添加一个 index.html 并写入以下 HTML 代码，它将作为网站的首页文件：

:::tip
可以在 VSCode 先新建一个空文件，文件语言设置为 HTML ，并写入英文感叹号 `!` ，再按 Tab 键（或者鼠标选择第一个代码片段提示），可快速生成基础的 HTML 结构。
:::

```html{11}
<!-- server/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ESM run in browser</title>
  </head>
  <body>
    <script type="module" src="./index.mjs"></script>
  </body>
</html>
```

请注意在 `<script />` 标签这一句代码上，比平时多了一个 `type="module"` 属性，这代表这个 script 是使用了 ESM 模块，而 `src` 属性则对应指向了上文在 src/esm 目录下的入口文件名。

之所以无需使用 `../src/esm/index.mjs` 显式的指向真实目录，是因为在 [添加服务端程序](#添加服务端程序) 时，已通过服务端代码里的 `entryFile` 方法重新指向了文件所在的真实路径，所以在 HTML 文件里可以使用 `./` 简化文件路径。

##### 启动服务并访问

打开 package.json 文件，在 `scripts` 字段追加一个 `serve` 命令如下：

```json{5}
{
  "scripts": {
    "dev:cjs": "node src/cjs/index.cjs",
    "dev:esm": "node src/esm/index.mjs",
    "serve": "node server/index.js"
  }
}
```

在命令行运行 `npm run serve` 即可启动本地服务：

```bash
❯ npm run serve

> demo@1.0.0 serve
> node server/index.js

Server running at:

  ➜  Local:  http://localhost:8080/

```

根据命令行提示，在浏览器访问 `http://localhost:8080/` 地址，即可访问本地服务。

:::tip
如遭遇端口号冲突，可在 server/index.js 的 `const port = 8080` 代码处修改为其他端口号。
:::

因为在编写 HTML 文件时没有写入内容，只引入了 ESM 模块文件，因此需要按 F12 唤起浏览器的控制台查看 Log ，可以看到控制台根据模块的文件内容，输出了这三句 Log （如果没有 Log ，可在控制台唤起的情况下按 F5 重新载入页面）：

```bash
1                                                   index.mjs:8
Hello World from foo.                               module.mjs:2
Hello World from bar.                               index.mjs:14
```

分别来自 src/esm/index.mjs 本身的 `console.log` 语句，以及 `import` 进来的 module.mjs 里的 `console.log` 语句。

如果未能出现这三句 Log ，请留意 `.mjs` 文件内容是否为上一小节最后的内容：

src/esm/index.mjs 文件内容为：

```js
// src/esm/index.mjs
import {
  foo as foo2, // 这里进行了重命名
  bar,
} from './module.mjs'

// 就不会造成变量冲突
const foo = 1
console.log(foo)

// 用新的命名来调用模块里的方法
foo2()

// 这个不冲突就可以不必处理
console.log(bar)
```

src/esm/module.mjs 文件内容为：

```js
// src/esm/module.mjs
export function foo() {
  console.log('Hello World from foo.')
}

export const bar = 'Hello World from bar.'
```

##### 内联的 ESM 代码

到目前为止， server/index.html 文件里始终是通过文件的形式引入 ESM 模块，其实 `<script type="module" />` 也支持编写内联代码，和普通的 `<script />` 标签用法相同：

```html
<script type="module">
  // ESM 模块的 JavaScript 代码
</script>
```

请移除 `<script />` 标签的 `src` 属性，并在标签内写入 src/esm/index.mjs 文件里的代码，现在该 HTML 文件的完整代码如下：

```html{10-26}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ESM run in browser</title>
  </head>
  <body>
    <!-- 标签内的代码就是 src/esm/index.mjs 的代码 -->
    <script type="module">
      import {
        foo as foo2, // 这里进行了重命名
        bar,
      } from './module.mjs'

      // 就不会造成变量冲突
      const foo = 1
      console.log(foo)

      // 用新的命名来调用模块里的方法
      foo2()

      // 这个不冲突就可以不必处理
      console.log(bar)
    </script>
  </body>
</html>
```

回到浏览器刷新 `http://localhost:8080/` ，可以看到浏览器控制台依然输出了和引入 `src="./index.mjs"` 时一样的 Log 信息：

```bash
1                                                   (index):21
Hello World from foo.                               module.mjs:2
Hello World from bar.                               (index):27
```

##### 了解模块导入限制

虽然以上例子可以完美地在浏览器里引用现成的 ESM 模块代码并运行，但不代表工程化项目下所有的 ES Module 模块化方式都适合浏览器。

先做一个小尝试，将 src/esm/index.mjs 文件内容修改如下，导入项目已安装的 md5 工具包：

```js
// src/esm/index.mjs
import md5 from 'md5'
console.log(md5('Hello World'))
```

回到浏览器刷新 `http://localhost:8080/` ，观察控制台，可以发现出现了一个红色的错误信息：

```bash
Uncaught TypeError: Failed to resolve module specifier "md5".
Relative references must start with either "/", "./", or "../".
```

这是因为不论是通过 `<script type="module" />` 标签还是通过 `import` 语句导入，模块的路径都必须是以 `/` 、 `./` 或者是 `../` 开头，因此无法直接通过 npm 包名进行导入。

这种情况下需要借助另外一个 script 类型： `importmap` ，在 server/index.html 里追加 `<script type="importmap" />` 这一段代码：

```html{10-17}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ESM run in browser</title>
  </head>
  <body>
    <!-- 注意需要先通过 `importmap` 引入 npm 包的 CDN -->
    <script type="importmap">
      {
        "imports": {
          "md5": "https://esm.run/md5"
        }
      }
    </script>

    <!-- 然后才能在 `module` 里 `import xx from 'xx'` -->
    <script type="module" src="./index.mjs"></script>
  </body>
</html>
```

再次刷新页面，可以看到控制台成功输出了 `b10a8db164e0754105b7a99be72e3fe5` 这个字符串，也就是 `Hello World` 被 MD5 处理后的结果。

可以看到 `importmap` 的声明方式和 package.json 的 dependencies 字段非常相似， JSON 的 key 是包名称， value 则是支持 ESM 的远程地址。

:::tip
Import Maps 的运行机制是通过 import 映射来控制模块说明符的解析，类似于构建工具常用的 `alias` 别名机制。

这是一个现代浏览器才能支持的新特性，建议使用 Chrome 最新版本体验完整功能，可以在其 [GitHub 仓库](https://github.com/WICG/import-maps) 查看更多用法。
:::

上方例子里， md5 对应的远程地址是使用了来自 `esm.run` 网站的 URL ，而不是 npm 包同步到 jsDelivr CDN 或者 UNPKG CDN 的地址，这是因为 md5 这个包本身不支持 ES Module ，需要通过 `esm.run` 这个网站进行在线转换才可以在 `<script type="module" />` 上使用。

<ClientOnly>
  <ImgWrap
    src="/assets/img/esm-run.jpg"
    alt="esm.run 网站上的包转换操作界面"
  />
</ClientOnly>

该网站的服务是 jsDelivr CDN 所属的服务商提供，因此也可以通过 jsDelivr CDN 的 URL 添加 `/+esm` 参数来达到转换效果，以 md5 包为例：

```bash
# 默认是一个 CJS 包
https://cdn.jsdelivr.net/npm/md5

# 可添加 `/+esm` 参数变成 ESM 包
https://cdn.jsdelivr.net/npm/md5/+esm
```

总的来说，现阶段在浏览器使用 ES Module 并不是一个很好的选择，建议开发者还是使用构建工具来开发，工具可以抹平这些浏览器差异化问题，降低开发成本。

## 认识组件化设计

学习完模块化设计之后，未来在 Vue 的工程化开发过程中，还会遇到一个新的概念，那就是 “组件” 。

### 什么是组件化

模块化属于 JavaScript 的概念，但作为一个页面，都知道它是由 HTML + CSS + JS 三部分组成的，既然 JS 代码可以按照不同的功能、需求划分成模块，那么页面是否也可以呢？

答案是肯定的！组件化就是由此而来。

在前端工程项目里，页面可以理解为一个积木作品，组件则是用来搭建这个作品的一块又一块积木。

<ClientOnly>
  <ImgWrap
    src="/assets/img/components.png"
    alt="把页面拆分成多个组件，降低维护成本（摘自 Vue 官网）"
  />
</ClientOnly>

### 解决了什么问题

模块化属于 JavaScript 的概念，把代码块的职责单一化，一个函数、一个类都可以独立成一个模块。

但这只解决了逻辑部分的问题，一个页面除了逻辑，还有骨架（ HTML ）和样式（ CSS ），组件就是把一些可复用的 HTML 结构和 CSS 样式再做一层抽离，然后再放置到需要展示的位置。

常见的组件有：页头、页脚、导航栏、侧边栏… 甚至小到一个用户头像也可以抽离成组件，因为头像可能只是尺寸、圆角不同而已。

每个组件都有自己的 “作用域” ， JavaScript 部分利用 [模块化](#学习模块化设计) 来实现作用域隔离， HTML 和 CSS 代码则借助 [Style Scoped](component.md#style-scoped) 来生成独有的 hash ，避免全局污染，这些方案组合起来，使得组件与组件之间的代码不会互相影响。

### 如何实现组件化

在 Vue ，是通过 Single-File Component （简称 SFC ， `.vue` 单文件组件）来实现组件化开发。

一个 Vue 组件是由三部分组成的：

```vue
<template>
  <!-- HTML 代码 -->
</template>

<script>
// JavaScript 代码
</script>

<style scoped>
/* CSS 代码 */
</style>
```

在后面的 [单组件的编写](component.md) 一章中，会详细介绍如何编写一个 Vue 组件。

## 依赖包和插件

在实际业务中，经常会用到各种各样的插件，插件在 Node 项目里的体现是一个又一个的依赖包。

虽然也可以把插件的代码文件手动放到的源码文件夹里引入，但并不是一个最佳的选择，本节内容将带了解 Node 的依赖包。

### 什么是包

在 Node 项目里，包可以简单理解为模块的集合，一个包可以只提供一个模块的功能，也可以作为多个模块的集合集中管理。

包通常是发布在官方的包管理平台 npmjs 上面，开发者需要使用的时候，可以通过包管理器安装到项目里，并在的代码里引入，开箱即用（详见： [依赖包的管理](#依赖包的管理) ）。

使用 npm 包可以减少在项目中重复造轮子，提高项目的开发效率，也可以极大的缩小项目源码的体积（详见：[什么是 node_modules](#什么是-node-modules)）。

包管理平台官网：[https://www.npmjs.com](https://www.npmjs.com)

### 什么是 node_modules

node_modules 是 Node 项目下用于存放已安装的依赖包的目录，如果不存在，会自动创建。

如果是本地依赖，会存在于项目根目录下，如果是全局依赖，会存在于环境变量关联的路径下，详见下方的管理依赖部分内容的讲解。

:::tip
一般在提交项目代码到 Git 仓库或者的服务器上时，都需要排除 node_modules 文件夹的提交，因为它非常大。

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

接下来会以 npm 作为默认的包管理器，来了解如何在项目里管理依赖包。

#### 配置镜像源

在国内，直接使用 npm 会比较慢，可以通过绑定 [npm Mirror 中国镜像站](https://npmmirror.com/) 的镜像源来提升依赖包的下载速度。

可以先在命令行输入以下命令查看当前的 npm 配置：

```bash
npm config get registry
# https://registry.npmjs.org/
```

默认情况下，会输出 npm 官方的资源注册表地址，接下来在命令行上输入以下命令，进行镜像源的绑定：

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

:::tip
如果之前已经绑定过 `npm.taobao` 系列域名，也请记得更换成 `npmmirror` 这个新的域名！

随着新的域名已经正式启用，老 `npm.taobao.org` 和 `registry.npm.taobao.org` 域名在 2022 年 05 月 31 日零时后不再提供服务。

详见：[【望周知】淘宝 npm 镜像站喊切换新域名啦](https://zhuanlan.zhihu.com/p/430580607)
:::

#### 本地安装

项目的依赖建议优先选择本地安装，这是因为本地安装可以把依赖列表记录到 package.json 里，多人协作的时候可以减少很多问题出现，特别是当本地依赖与全局依赖版本号不一致的时候。

##### 生产依赖

执行 `npm install` 的时候，添加 `--save` 或者 `-S` 选项可以将依赖安装到本地，并列为生产依赖。

:::tip
需要提前在命令行 `cd` 到的项目目录下再执行安装。

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
  }
}
```

生产依赖包会被安装到项目根目录下的 `node_modules` 目录里。

项目在上线后仍需用到的包，就需要安装到生产依赖里，比如 Vue 的路由 `vue-router` 就需要以这个方式安装。

##### 开发依赖

执行 `npm install` 的时候，如果添加 `--save-dev` 或者 `-D` 选项，可以将依赖安装到本地，并写入开发依赖里。

:::tip
需要提前在命令行 `cd` 到的项目目录下再执行安装。
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
  }
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

一般情况下，类似于 `@vue/cli` 之类的脚手架会提供全局安装的服务，安装后，就可以使用 `vue create xxx` 等命令直接创建 Vue 项目了。

但不是每个 npm 包在全局安装后都可以正常使用，请阅读 npm 包的主页介绍和使用说明。

#### 版本控制

有时候一些包的新版本不一定适合的老项目，因此 npm 也提供了版本控制功能，支持通过指定的版本号或者 Tag 安装。

语法如下，在包名后面紧跟 `@` 符号，再紧跟版本号或者 Tag 名称。

```bash
npm install <package-name>@<version | tag>
```

例如：

现阶段 Vue 默认为 3.x 的版本了，如果想安装 Vue 2 ，可以通过指定版本号的方式安装：

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

在了解了 npm 包的常规操作之后，通过一个简单的例子来了解如何在项目里使用 npm 包。

继续使用的 [Hello Node](#hello-node) demo ，或者也可以重新创建一个 demo 。

首先在 [命令行工具](#命令行工具) 通过 `cd` 命令进入项目所在的目录，用本地安装的方式来把 [md5 包](https://www.npmjs.com/package/md5) 添加到生产依赖，这是一个为提供开箱即用的哈希算法的包，在未来的实际工作中，可能也会用到它，在这里使用它是因为足够简单。

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
hello-node
│ # 依赖文件夹
├─node_modules
│ # 源码文件夹
├─src
│ # 锁定安装依赖的版本号
├─package-lock.json
│ # 项目清单
└─package.json
```

先打开 package.json ，可以看到已经多出了一个 `dependencies` 字段，这里记录了刚刚安装的 md5 包信息。

```json{14-16}
{
  "name": "hello-node",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev:cjs": "node src/cjs/index.cjs",
    "dev:esm": "node src/esm/index.mjs",
    "serve": "node server/index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "md5": "^2.3.0"
  }
}
```

来到这里可能会有一连串的疑问：

> 1.  为什么只安装了一个 md5 ，但控制台提示安装了 4 个包？
> 2.  为什么 package.json 又只记录了 1 个 md5 包信息？
> 3.  为什么提示审核了 5 个包，哪里来的第 5 个包？

不要着急，请先打开 package-lock.json 文件，这个文件是记录了锁定安装依赖的版本号信息（由于篇幅原因，这里的展示省略了一些包的细节）：

```json
{
  "name": "hello-node",
  "version": "1.0.0",
  "lockfileVersion": 2,
  "requires": true,
  "packages": {
    "": {
      "name": "hello-node",
      "version": "1.0.0",
      "license": "ISC",
      "dependencies": {
        "md5": "^2.3.0"
      }
    },
    "node_modules/charenc": {
      "version": "0.0.2"
      // ...
    },
    "node_modules/crypt": {
      "version": "0.0.2"
      // ...
    },
    "node_modules/is-buffer": {
      "version": "1.1.6"
      // ...
    },
    "node_modules/md5": {
      "version": "2.3.0"
      // ...
    }
  },
  "dependencies": {
    "charenc": {
      "version": "0.0.2"
      // ...
    },
    "crypt": {
      "version": "0.0.2"
      // ...
    },
    "is-buffer": {
      "version": "1.1.6"
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

在 node_modules 文件夹下也可以看到以这 4 个包名为命名的文件夹，这些文件夹存放的就是各个包项目发布在 npmjs 平台上的文件。

再看 `packages` 字段，这里除了罗列出 4 个 npm 包的信息之外，还把项目的信息也列了进来，这就是为什么是提示审核了 5 个包，原因是除了 4 个依赖包，该项目本身也是一个包。

:::tip
package-lock.json 文件并不是一成不变的，假如以后 md5 又引用了更多的包，这里记录的信息也会随之增加。

并且不同的包管理器，它的 lock 文件也会不同，如果是使用 yarn 作为包管理器的话，它是生成一个 yarn.lock 文件，而不是 package-lock.json ，有关更多的包管理器，详见 [插件的使用](plugin.md) 一章。
:::

现在已经安装好 md5 包了，接下来看看具体如何使用它。

通常在包的 npmjs 主页上会有 API 和用法的说明，只需要根据说明操作，打开 `src/esm/index.mjs` 文件，首先需要导入这个包。

包的导入和在 [学习模块化设计](#学习模块化设计) 一节了解到的模块导入用法是一样的，只是把 `from` 后面的文件路径换成了包名。

```js
// src/esm/index.mjs
import md5 from 'md5'
```

然后根据 md5 的用法，来编写一个小例子，先声明一个原始字符串变量，然后再声明一个使用 md5 加密过的字符串变量，并打印它们：

```js
// src/esm/index.mjs
import md5 from 'md5'

const before = 'Hello World'
const after = md5(before)
console.log({ before, after })
```

在命令行输入 `npm run dev:esm` ，可以在控制台看到输出了这些内容，成功获得了转换后的结果：

```bash
npm run dev:esm

> demo@1.0.0 dev:esm
> node src/esm/index.mjs

{ before: 'Hello World', after: 'b10a8db164e0754105b7a99be72e3fe5' }
```

是不是非常简单，其实包的用法和在导入模块的用法可以说是完全一样的，区别主要在于，包是需要安装了才能用，而模块是需要自己编写。

## 控制编译代码的兼容性

作为一名前端工程师，了解如何控制代码的兼容性是非常重要的能力。

在 “了解前端工程化” 的 [为什么要使用构建工具](engineering.md#为什么要使用构建工具) 一节里，已简单介绍过 Polyfill 的作用，以及介绍了构建工具可以通过 [Babel](https://github.com/babel/babel) 等方案自动化处理代码的兼容问题，这一小节将讲解 Babel 的配置和使用，亲自体验如何控制代码的兼容性转换。

### 如何查询兼容性

在开始学习使用 Babel 之前，需要先掌握一个小技能：了解如何查询代码在不同浏览器上的兼容性。

说起浏览器兼容性，前端工程师应该都不陌生，特别是初学者很容易会遇到在自己的浏览器上布局正确、功能正常，而在其他人的电脑或者手机上访问就会有布局错位或者运行报错的问题出现，最常见的场景就是开发者使用的是功能强大的 Chrome 浏览器，而产品用户使用了 IE 浏览器。

这是因为网页开发使用的 HTML / CSS / JavaScript 每年都在更新新版本，推出更好用的新 API ，或者废弃部分过时的旧 API ，不同的浏览器在版本更新过程中，对这些新 API 的支持程度并不一致，如果使用了新 API 而没有做好兼容支持，很容易就会在低版本浏览器上出现问题。

为了保证程序可以正确的在不同版本浏览器之间运行，就需要根据产品要支持的目标浏览器范围，去选择兼容性最好的编程方案。

在 Web 开发有一个网站非常知名：[Can I use](https://caniuse.com) ，只要搜索 API 的名称，它会以图表的形式展示该 API 在不同浏览器的不同版本之间的支持情况，支持 HTML 标签、 CSS 属性、 JavaScript API 等内容的查询。

以 JavaScript ES6 的 `class` 新特性为例：

<ClientOnly>
  <ImgWrap
    src="/assets/img/caniuse-es6-classes.jpg"
    alt="在 caniuse 网站上查询 ES6 `class` 的兼容情况"
  />
</ClientOnly>

可以看到在 Chrome 浏览器需要在 49 版本开始才被完全支持，而 IE 浏览器则全面不支持，如果不做特殊处理（例如引入 Polyfill 方案），那么就需要考虑在编程过程中，是否需要可以直接使用 `class` 来实现功能，还是寻找其他替代方案。

在工作中，工程师无需关注每一个 API 的具体支持范围，这些工作可以交给工具来处理，下面将介绍 Babel 的使用入门。

### Babel 的使用和配置

Babel 是一个 JavaScript 编译器，它可以让开发者仅需维护一份简单的 JSON 配置文件，即可调动一系列工具链将源代码编译为目标浏览器指定版本所支持的语法。

#### 安装 Babel

请打开 hello-node 项目，安装以下几个 Babel 依赖：

```bash
npm i -D @babel/core @babel/cli @babel/preset-env
```

此时在 package.json 的 `devDependencies` 可以看到有了如下三个依赖：

```json
{
  "devDependencies": {
    "@babel/cli": "^7.19.3",
    "@babel/core": "^7.19.3",
    "@babel/preset-env": "^7.19.3"
  }
}
```

它们的作用分别如下：

| <span style="display: inline-block; width: 160px;">依赖</span> | 作用                                               | <span style="display: inline-block; width: 90px;">文档</span> |
| :------------------------------------------------------------: | :------------------------------------------------- | :-----------------------------------------------------------: |
|                           @babel/cli                           | 安装后可以从命令行使用 Babel 编译文件              |        [查看文档](https://babel.dev/docs/en/babel-cli)        |
|                          @babel/core                           | Babel 的核心功能包                                 |       [查看文档](https://babel.dev/docs/en/babel-core)        |
|                       @babel/preset-env                        | 智能预设，可以通过它的选项控制代码要转换的支持版本 |    [查看文档](https://babel.dev/docs/en/babel-preset-env)     |

:::tip
在使用 Babel 时，建议在项目下进行本地安装，尽量不选择全局安装，这是因为不同项目可能依赖于不同版本的 Babel ，全局依赖和可能会出现使用上的异常。
:::

#### 添加 Babel 配置

接下来在 hello-node 的根目录下创建一个名为 babel.config.json 的文件，这是 Babel 的配置文件，写入以下内容：

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "chrome": "41"
        },
        "modules": false,
        "useBuiltIns": "usage",
        "corejs": "3.6.5"
      }
    ]
  ]
}
```

这份配置将以 Chrome 浏览器作为目标浏览器，编译结果将保留 ES Module 规范，可以在 [配置文件文档](https://babel.dev/docs/en/config-files) 查看更多配置选项。

这里的 `targets.chrome` 字段代表编译后要支持的目标浏览器版本号，在 caniuse 查询可知 [ES6 的 class 语法](https://caniuse.com/es6-class) 在 Chrome 49 版本之后才被完全支持，而 Chrome 41 或更低的版本是完全不支持该语法，因此先将其目标版本号设置为 41 ，下一步将开始测试 Babel 的编译结果。

#### 使用 Babel 编译代码

在 hello-node 的 src 目录下添加一个 babel 文件夹，并在该文件夹下创建一个 index.js 文件，写入以下代码：

```js
// src/babel/index.js
export class Hello {
  constructor(name) {
    this.name = name
  }

  say() {
    return `Hello ${this.name}`
  }
}
```

根据上一步的 Babel 配置，在这里使用 `class` 语法作为测试代码。

接下来再打开 package.json 文件，添加一个 `compile` script 如下：

```json{5}
{
  "scripts": {
    "dev:cjs": "node src/cjs/index.cjs",
    "dev:esm": "node src/esm/index.mjs",
    "compile": "babel src/babel --out-dir compiled",
    "serve": "node server/index.js"
  }
}
```

这条命令的含义是：使用 Babel 处理 src/babel 目录下的文件，并输出到根目录下的 compiled 文件夹。

在命令行运行以下命令：

```bash
npm run compile
```

可以看到 hello-node 的根目录下多了一个 compiled 文件夹，里面有一个和源码相同命名的 index.js 文件，它的文件内容如下：

```js
// compiled/index.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]
    descriptor.enumerable = descriptor.enumerable || false
    descriptor.configurable = true
    if ('value' in descriptor) descriptor.writable = true
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps)
  if (staticProps) _defineProperties(Constructor, staticProps)
  Object.defineProperty(Constructor, 'prototype', { writable: false })
  return Constructor
}

export var Hello = /*#__PURE__*/ (function () {
  function Hello(name) {
    _classCallCheck(this, Hello)

    this.name = name
  }

  _createClass(Hello, [
    {
      key: 'say',
      value: function say() {
        return `Hello ${this.name}`
      },
    },
  ])

  return Hello
})()
```

由于 Chrome 41 版本不支持 `class` 语法，因此 Babel 做了大量的工作对其进行转换兼容。

再次打开 babel.config.json ，将 `targets.chrome` 的版本号调整为支持 `class` 语法的 Chrome 49 版本：

```diff{7-8}
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
-          "chrome": "41"
+          "chrome": "49"
        },
        "modules": false,
        "useBuiltIns": "usage",
        "corejs": "3.6.5"
      }
    ]
  ]
}
```

再次执行编译，这一次编译后的代码和编译前完全一样：

```js
// compiled/index.js
export class Hello {
  constructor(name) {
    this.name = name
  }

  say() {
    return `Hello ${this.name}`
  }
}
```

因为此时配置文件指定的目标浏览器版本已支持该语法，无需转换。

Babel 的使用其实非常简单，了解了这部分知识点之后，如果某一天需要自己控制代码的兼容性，只需要配合官方文档调整 Babel 的配置，处理起来就得心应手了！

<!-- 评论 -->
<ClientOnly>
  <GitalkComment
    :issueId="163"
  />
</ClientOnly>
<!-- 评论 -->
