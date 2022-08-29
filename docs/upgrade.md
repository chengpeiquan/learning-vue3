---
outline: 'deep'
---

# 脚手架的升级与配置

截止至 2022 年 2 月 7 日， [Vue 3 已成为新的默认版本](https://zhuanlan.zhihu.com/p/460055155)，在开始使用 Vue3 之前，请先阅读下方 [全新的 Vue 版本](#全新的-vue-版本-new) 一节，以了解默认版本带来的注意事项！

## 全新的 Vue 版本{new}

Vue 3 被指定为默认版本之后，有一些注意事项需要留意：

### 使用 Vue 3

在 npm 的 [vue 版本主页](https://www.npmjs.com/package/vue?activeTab=versions) 上面，会看到当前已使用 `3.2.30` 作为默认 `latest` 版本（也就是运行 `npm i vue` 默认会安装 Vue 3 了，无需再通过指定 `next` 版本）。

包括 `vue-router` 、 `vuex` 、`vue-loader` 和 `@vue/test-utils` 等相关的生态，同样不需要指定 next 版本了，都配合 Vue 3 指定了新的 latest 默认版本。

所有的文档和官方站点将默认切换到 Vue 3 版本，请查看 [官方文档](links.md#官方文档) 一节了解最新的官方资源站点。

### 使用 Vue 2

如果还要用 Vue 2 ，需要手动指定 `legacy` 版本，也就是通过 `npm i vue@legacy` 才能安装到 Vue 2 。

Vue 2 相关的生态目前没有打 `legacy` 的 Tag，所以需要显式的指定版本号才可以安装到配套的程序，比如通过 `npm i vue-router@3.5.3` 才能安装到 Vue 2 配套的 Router 版本。

如果之前使用了 `latest` 标签或 `*` 从 npm 安装 Vue 或其他官方库，请确保项目的 `package.json` 能够明确使用兼容 Vue 2 的版本。

```diff
{
  "dependencies": {
-   "vue": "latest",
+   "vue": "^2.6.14",
-   "vue-router": "latest",
+   "vue-router": "^3.5.3",
-   "vuex": "latest"
+   "vuex": "^3.6.2"
  },
  "devDependencies": {
-   "vue-loader": "latest",
+   "vue-loader": "^15.9.8",
-   "@vue/test-utils": "latest"
+   "@vue/test-utils": "^1.3.0"
  }
}
```

## Hello Vue3

如果想早点开始 Vue 3 的世界，可以通过以下命令直接创建一个启动项目：

```bash
# 全局安装脚手架
npm install -g create-preset

# 使用 `vue3-ts-vite` 模板创建一个名为 `hello-vue3` 的项目
preset init hello-vue3 --template vue3-ts-vite
```

这是一个基于 Vite + TypeScript + Vue 3 + Pinia 的项目启动模板，你可以使用这个项目来练习后面的案例代码，创建完毕后可以直接跳到 [安装 VSCode](#安装-vscode) 和 [添加 VSCode 插件](#添加-vscode-插件) 继续学习。

当然有时间还是希望可以把 [使用 Vite 创建项目](#使用-vite-创建项目-new) 和 [使用 @vue/cli 创建项目](#使用-vue-cli-创建项目) 这两部分内容都看一下。

:::tip
如果网络问题下载失败，可以先执行 `preset proxy on` 开启加速镜像代理下载。
:::

## 使用 Vite 创建项目{new}

Vite 从 2021 年 1 月份发布 2.0 版本以来，发展非常快，我也在第一时间参与贡献了一些文档和插件，并且在 2021 年期间，个人项目已经全面切换到 Vite ，公司业务也在 2021 年底开始用 Vite 来跑新项目，整体情况非常稳定和乐观。

关于是否使用 Vite 和安利团队使用 Vue 3 ，可以看我在 2022 年春节前写的 [Markdown工程师的一周](https://zhuanlan.zhihu.com/p/460538277) 一文，我是非常推荐升级技术栈的。

在这里我推荐以下这几种创建 Vite 项目的方式：[Create Vite](#create-vite) 、 [Create Vue](#create-vue) 和 [Create Preset](#create-preset) 。

### Create Vite

[create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) 是 Vite 官方推荐的一个脚手架工具，可以创建基于 Vite 的不同技术栈基础模板。

```bash
npm create vite
```

然后按照命令行的提示操作（选择 `vue` 技术栈进入），即可创建一个基于 Vite 的基础空项目。

:::tip
不过这里的项目非常基础，啥也没有，如果你要用到 Router 、 Vuex 、 ESLint 等程序，都需要再自己安装和配置，所以推荐使用 [Create Preset](#create-preset) 。
:::

### Create Vue

[create-vue](https://github.com/vuejs/create-vue) 是 Vue 官方推出的一个新脚手架，可以创建基于 Vite 的 Vue 基础模板。

```bash
npm init vue@3
```

然后根据命令行的提示操作。

### Create Preset

[create-preset](https://github.com/awesome-starter/create-preset) 是 Awesome Starter 的 CLI 脚手架，提供快速创建预设项目的能力，可以创建一些有趣实用的项目启动模板，也可以用来管理你的常用项目配置。

#### 简单使用

你也可以通过包管理器来直接创建配置：

```bash
npm create preset
```

然后按照命令行的提示操作，即可创建开箱即用的模板项目。

在这里我们选择 `vue` 技术栈进入，选择 [vue3-ts-vite](https://github.com/awesome-starter/vue3-ts-vite-starter) 创建一个基于 Vite + Vue 3 + TypeScript 的项目启动模板。

:::tip
如果下载失败，可以通过 `npm create preset proxy on` 开启加速镜像代理下载。

点击查看：[代理选项 - Create Preset](https://preset.js.org/zh/docs.html#%E5%BC%80%E5%90%AF%E4%BB%A3%E7%90%86)
:::

#### 全局安装

你也可以像使用 @vue/cli 一样，全局安装到本地，通过 `preset init` 命令来创建项目。

推荐全局安装它，用起来更方便，请先全局安装：

```bash
npm install -g create-preset
```

可以通过下面这个命令来检查安装是否成功，如果成功，将会得到一个版本号：

```bash
preset -v
```

然后可以通过 `--template` 选项直接指定一个模板创建项目，在这里我们使用 `vue3-ts-vite` 模板创建一个名为 `hello-vue3` 的项目：

```bash
preset init hello-vue3 --template vue3-ts-vite
```

你常用的项目模板也可以绑定为本地配置，点击 [Create Preset 官方文档](https://preset.js.org/zh/) 查看完整使用教程。

### 管理项目配置

不论使用上面的那种方式创建项目，都会有一个名为 `vite.config.js` 或 `vite.config.ts` 的项目配置文件（扩展名由项目使用 JavaScript 还是 TypeScript 决定）。

里面会有一些预设好的配置，你可以在 [Vite 官网的配置文档](https://cn.vitejs.dev/config/) 查阅更多的可配置选项。

### 注意事项

虽然 Vite 和 Webpack 在开发体验上差不多，但本质存在很大的差异，特别是依赖包只能使用 ESM 版本，开发期间请多参考 [Vite 官网](https://cn.vitejs.dev/) 的资料，也可以发邮件和我交流。

## 使用 @vue/cli 创建项目

如果你不习惯 Vite ，依然可以使用 Vue CLI 作为开发脚手架。

### 和 Vite 的区别

Vue CLI 使用的构建工具是基于 Webpack ，你可以在 [了解构建工具](guide.md#了解构建工具) 一节了解 Webpack 和 Vite 这两个构建工具的区别。

### 更新 CLI 脚手架

老规矩，还是全局安装，把脚手架更新到最新版本（最低版本要求在 `4.5.6` 以上才能支持 Vue 3.0 ）。

```js
npm install -g @vue/cli
```

### 使用 CLI 创建 3.x 项目{new}

还是熟悉的 `create` 命令。

```js
vue create hello-vue3
```

由于我们要使用 TS ，所以需要选择最后一个选项来进行自定义搭配。

```js
Vue CLI v5.0.4
? Please pick a preset:
  Default ([Vue 3] babel, eslint)
  Default ([Vue 2] babel, eslint)
> Manually select features
```

然后我们按空格选中需要的依赖，总共选择了下面这些：

```js
Vue CLI v5.0.4
? Please pick a preset: Manually select features
? Check the features needed for your project: (Press <space> to select, 
<a> to toggle all, <i> to invert selection, and <enter> to proceed)
 (*) Babel
 (*) TypeScript
 ( ) Progressive Web App (PWA) Support
 (*) Router
 (*) Vuex
 (*) CSS Pre-processors
>(*) Linter / Formatter
 ( ) Unit Testing
 ( ) E2E Testing
```

选择 Vue 版本，我们要用  Vue 3 所以需要选择 3.x 。

```js
? Choose a version of Vue.js that you want to start the project with (Use arrow keys)
> 3.x
  2.x
```

是否选择 class 语法的模板，虽然这个选项是针对 TypeScript 的，在 2.x 版本为了更好的写 TS ，通常需要使用 class 语法，但是因为 Vue 3 有了对 TypeScript 支持度更高的 Composition API ，所以我们选择 `n` ，也就是 “否” 。

```js
? Use class-style component syntax? (y/N) n
```

Babel 可以把一些现代版本的代码转换为兼容性更好的 JS 版本，所以选 `y` 确认。

```js
? Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills,
 transpiling JSX)? (Y/n) y
```

路由模式（ Hash 还是 History ），这个根据自己项目情况选择，你可以先选 `y` 确认，回头遇到部署的问题可以在 “路由” 一章的 [部署问题与服务端配置](router.html#部署问题与服务端配置) 小节查看怎么处理。

```js
? Use history mode for router? (Requires proper server setup for index fallback
 in production) (Y/n) y
```

选择一个 CSS 预处理器，可以根据自己的喜好选择，不过鉴于目前开源社区组件常用的都是 [Less](https://github.com/less/less.js) ，所以也建议先选 Less 作为预处理器的入门。

```js
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported
 by default):
  Sass/SCSS (with dart-sass)
> Less
  Stylus
```

Lint 规则，用来代码检查，写 TypeScript 离不开 Lint ，可以根据自己喜好选择，也可以先选择默认，后面在 [添加协作规范](#添加协作规范) 一节也有说明如何配置规则，这里我们先默认第一个。

```js
? Pick a linter / formatter config: (Use arrow keys)
> ESLint with error prevention only
  ESLint + Airbnb config
  ESLint + Standard config
  ESLint + Prettier
```

Lint 的校验时机，一个是在保存时校验，一个是在提交 commit 的时候才校验，这里我们也选默认。

```js
? Pick additional lint features: (Press <space> to select,
 <a> to toggle all, <i> to invert selection, and <enter> to proceed)
>(*) Lint on save
 ( ) Lint and fix on commit
```

项目配置文件，我习惯独立文件。

```js
? Where do you prefer placing config for Babel, ESLint, etc.? (Use arrow keys)
> In dedicated config files
  In package.json
```

是否保存为未来的项目配置，存起来方便以后快速创建。

```js
? Save this as a preset for future projects? Yes
? Save preset as: vue-3-ts-config
```

至此，项目创建完成！

你可以跟原来一样，通过 `npm run serve` 开启热更进行开发调试，通过 `npm run build` 构建打包上线。

### 管理项目配置

用脚手架最重要的一个配置文件就是 `vue.config.js` 了，你可以拷贝你之前项目下的这个文件过来，就立即可以用。

如果之前没有用过脚手架，可以参考官网的说明文档调整各个选项配置：[配置参考 - Vue CLI](https://cli.vuejs.org/zh/config/)

## 调整 TS Config

如果你在 `vite.config.ts` 或者 `vue.config.js` 设置了 alias 的话，因为 TypeScript 不认识里面配置的 alias 别名，所以需要再对 `tsconfig.json` 做一点调整，增加对应的 path ，否则 TS 不认识。

比如引入 `@cp/HelloWorld.vue` 的时候， TypeScript 不知道等价于 `src/components/HelloWorld.vue`，从而会报错找不到该模块。

假设你在 `vite.config.ts` 里配置了这些 alias ：

```ts
export default defineConfig({
  // ...
  resolve: {
    alias: {
      '@': resolve('src'),  // 源码根目录
      '@img': resolve('src/assets/img'),  // 图片
      '@less': resolve('src/assets/less'),  // 预处理器
      '@libs': resolve('src/libs'),  // 本地库
      '@plugins': resolve('src/plugins'),  // 本地插件
      '@cp': resolve('src/components'),  // 公共组件
      '@views': resolve('src/views'),  // 路由组件
    },
  },
  // ...
})
```

那么在你的 tsconfig.json 就需要相应的加上这些 paths ：

```json{4-12}
{
  "compilerOptions": {
    // ...
    "paths": {
      "@/*": ["src/*"],
      "@img/*": ["src/assets/img/*"],
      "@less/*": ["src/assets/less/*"],
      "@libs/*": ["src/libs/*"],
      "@plugins/*": ["src/plugins/*"],
      "@cp/*": ["src/components/*"],
      "@views/*": ["src/views/*"]
    },
    // ...
  },
  // ...
}
```

:::tip
注意全部要以 `/*` 结尾。
:::

## 添加协作规范

考虑到后续可能会有团队协作，我们最好是能够统一编码风格。

### Editor Config

在项目根目录下再增加一个 `.editorconfig` 文件。

这个文件的作用是强制编辑器以该配置来进行编码，比如缩进统一为空格而不是 Tab ，每次缩进都是 2 个空格而不是 4 个等等。

文件内容如下：

```js
# http://editorconfig.org
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
max_line_length = 80
trim_trailing_whitespace = true

[*.md]
max_line_length = 0
trim_trailing_whitespace = false
```

具体的参数说明可参考：[项目代码风格统一神器 editorconfig的作用与配置说明](https://chengpeiquan.com/article/editorconfig.html)

:::tip
部分编辑器可能需要安装对应的插件才可以支持该配置。

例如 VSCode 需要安装 [EditorConfig for VSCode 扩展](#editorconfig-for-vs-code) 。
:::

### Prettier

[Prettier](https://github.com/prettier/prettier) 是目前最流行的代码格式化工具，可以约束你的代码风格不会乱七八糟，目前你所知道的知名项目（如 Vue 、 Vite 、 React 等）和大厂团队（谷歌、微软、阿里、腾讯等）都在使用 Prettier 来格式化代码。

通过脚手架创建的项目很多都内置了 Prettier 功能集成（例如 [Create Preset](#create-preset) ，参考了主流的格式化规范，比如 2 个空格的缩进、无需写分号结尾、数组 / 对象每一项都带有尾逗号等等）。

如果需要手动增加功能支持，请在项目根目录下创建一个 `.prettierrc` 文件，写入以下内容：

```json
{
  "semi": false,
  "singleQuote": true
}
```

这代表 JavaScript / TypeScript 代码一般情况下不需要加 `;` 分号结尾，然后使用 `''` 单引号来定义字符串等变量。

这里只需要写入与默认配置不同的选项即可，如果和默认配置一致，可以省略，完整的配置选项以及默认值可以在 Prettier 官网的 [Options Docs](https://prettier.io/docs/en/options.html) 查看。

配合 VSCode 的 [VSCode Prettier](#vscode-prettier) 扩展，可以在编辑器里使用这个规则来格式化文件。

如果你开启了 ESLint ，配合 ESLint 的代码提示，可以更方便的体验格式化排版，详见 [ESLint](#eslint) 一节的说明。

:::tip
配合 [VSCode Prettier 扩展](#vscode-prettier) ，这份配置直接在 VSCode 里生效，如果配合 ESLint 使用，需要安装 [prettier](https://www.npmjs.com/package/prettier) 依赖。
:::

### ESLint

[ESLint](https://github.com/eslint/eslint) 是一个查找 JS / TS 代码问题并提供修复建议的工具，换句话说就是可以约束你的代码不会写出一堆 BUG ，它是代码强健性的重要保障。

虽然大部分前端开发者都不愿意接受这些约束（当年我入坑的时候也是），但说实话，经过 ESLint 检查过的代码质量真的高了很多，如果你不愿意总是做一个游兵散勇，建议努力让自己习惯被 ESLint 检查，大厂和大项目都是有 ESLint 检查的。

特别是写 TypeScript ，配合 ESLint 的检查实在太爽了（字面意思，真的很舒服）。

通过脚手架创建的项目通常都会帮你配置好 ESLint 规则，如果有一些项目是一开始没有，后面想增加，你也可以手动配置。

这里以一个 Vite + TypeScript + [Prettier](#prettier) 的 Vue 3 项目为例，在项目根目录下创建一个 `.eslintrc.js` 文件，写入以下内容：

```js
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', 'prettier'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prettier/prettier': 'warn',
    'vue/multi-word-component-names': 'off',
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
}
```

然后安装对应的依赖（记得添加 `-D` 参数添加到 `devDependencies` ，因为都是开发环境下使用的）：

- [eslint](https://www.npmjs.com/package/eslint)
- [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier)
- [eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier)
- [eslint-plugin-vue](https://www.npmjs.com/package/eslint-plugin-vue)
- [@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin)
- [@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser)
- [prettier](https://www.npmjs.com/package/prettier)

就可以在项目中生效了，一旦代码有问题， ESLint 就会帮你检查出来并反馈具体的报错原因，久而久之你的代码就会越写越规范。

更多的选项可以在 ESLint 官网的 [Configuring ESLint](https://eslint.org/docs/user-guide/configuring/) 查阅。

如果有一些文件需要排除检查，可以再创建一个 `.eslintignore` 文件在项目根目录下，里面添加要排除的文件或者文件夹名称：

```txt
dist/*
```

更多的排除规则可以在 ESLint 官网的 [The .eslintignore File](https://eslint.org/docs/user-guide/configuring/ignoring-code#the-eslintignore-file) 一文查阅。

## 安装 VSCode

要问现在前端工程师用的最多的代码编辑器是哪个，肯定是 Visual Studio Code 了！

与其他的编辑器相比，有这些优点：

- 背靠 Microsoft ，完全免费并且开源，开箱即用
- 可以通过简单的配置调整来满足你之前在其他编辑器上的习惯（ e.g. Sublime Text ）
- 轻量级但功能强大，内置了对 JavaScript、TypeScript 和 Node.js 的支持，
- 丰富的插件生态，可以根据你的需要，安装提高编码效率的功能支持，以及其他的语言扩展
- 智能的代码补全、类型推导、代码检查提示、批量编辑、引用跳转、比对文件等功能支持
- 登录你的 GitHub 账号即可实现配置自动同步，在其他电脑上直接使用你的最习惯配置和插件

当然，还有非常多优点，欢迎体验！

点击下载：[Visual Studio Code](https://code.visualstudio.com/Download)

一般情况下开箱即用，无门槛，你也可以阅读官方文档了解一些个性化的配置。

点击查看：[操作文档](https://code.visualstudio.com/docs)

## 添加 VSCode 插件

VSCode 本身是轻量级的，也就是只提供最基础的功能，更优秀的体验或者个性化体验，是需要我们通过插件来启用的。

这里推荐几个非常舒服的 VSCode 插件，可以通过插件中心安装，也可以通过官方应用市场下载。

### Chinese (Simplified)

VSCode 安装后默认是英文本，需要自己进行汉化配置， VSCode 的特色就是插件化处理各种功能，语言方面也一样。

安装该插件并启用，即可让 VSCode 显示为简体中文。

点击下载：[Chinese (Simplified)](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-zh-hans)

### Volar

Vue 官方推荐的 VSCode 扩展，用以代替 Vue 2 时代的 Vetur ，提供了 Vue 3 的语言支持、 TypeScript 支持、基于 [vue-tsc](https://github.com/johnsoncodehk/volar/tree/master/packages/vue-tsc) 的类型检查等功能。

点击下载：[Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

### Vue VSCode Snippets

从实际使用 Vue 的角度提供 Vue 代码片段的生成，可以通过简单的命令，在 .vue 文件里实现大篇幅的代码片段生成，最新版本已基于 Volar 构建。

e.g. 

1. 输入 `ts` 可以快速创建一个包含了 `template` + `script` + `style` 的 Vue 模板（可选 2.x 、3.x 以及 class 风格的模板）

2. 也可以通过输入带有 `v3` 开头的指令来快速生成 Vue 3 的 API 。

下面是输入了 `ts` 两个字母之后，用箭头选择 `vbase-3-ts` 自动生成的一个模板片段，在开发过程中非常省事：

```vue
<template>
  <div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    

    return {}
  }
})
</script>

<style scoped>

</style>
```

点击下载：[Vue VSCode Snippets](https://marketplace.visualstudio.com/items?itemName=sdras.vue-vscode-snippets)

::: tip
为啥我要推荐这个 `vue-vscode-snippets`，而不是 `Vue3snippets`，原因可以看我之前记录的一段揪心的经历…一言难尽，太惨了……

[解决vscode保存vue文件时 压缩stylus代码为一行以及无法注释template的问题](https://chengpeiquan.com/article/vue-vscode-snippets.html)
:::

### Auto Close Tag

可以快速帮你完成 HTML 标签的闭合，除非你熟悉 `jsx` / `tsx`，否则在写 `template` 的时候肯定用得上。

点击下载：[Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)

### Auto Rename Tag

假如你要把 `div` 修改为 `section`，不需要再把 `<div>` 然后找到代码尾部的 `</div>` 才能修改，只需要选中前面的半个标签，直接修改，插件会自动帮你把闭合部分也同步修改，对于篇幅比较长的代码调整非常有帮助。

点击下载：[Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)

### EditorConfig for VSCode

一个可以让编辑器遵守协作规范的插件，详见 [添加协作规范](#添加协作规范) 。

点击下载：[EditorConfig for VSCode](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

### VSCode Prettier

这是 [Prettier](#prettier) 在 VSCode 的一个扩展，不论你的项目有没有安装 Pretter 依赖，安装该扩展之后，单纯在 VSCode 也可以使用 Pretter 来进行代码格式化。

点击下载：[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

点击访问：[Prettier 官网](https://prettier.io/) 了解更多配置。

### VSCode ESLint

这是 [ESLint](#eslint) 在 VSCode 的一个扩展， TypeScript 项目基本都开了 ESLint ，编辑器也建议安装该扩展支持。

点击下载：[VSCode ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

点击访问：[ESLint 官网](https://eslint.org/) 了解更多配置。

### 其他插件

其他的比如预处理器相关的，Git 相关的，可以根据自己的需求到插件市场里搜索安装。

## 项目初始化

至此，脚手架已经帮我们搭好了一个可直接运行的基础项目，已经可以正常的 `dev` 和 `build` 了（取决于你的项目 [脚本命令的配置](guide.md#脚本命令的配置) ），项目配置和编辑器也都弄好了，是不是可以开始写代码了？

不急，还需要了解一点东西，就是如何初始化一个 3.x 项目。

因为在实际开发过程中，我们还会用到各种 npm 包，像 UI 框架、插件的引入都是需要在初始化阶段处理。

甚至有时候还要脱离脚手架，采用 CDN 引入的方式来开发，所以开始写组件之前，我们还需要了解一下在 3.x 项目中，初始化阶段的一些变化。

### 入口文件

项目的初始化都是在入口文件集中处理，3.x 的目录结构对比 2.x 没变化，入口文件依然还是 `main.ts` 

但 3.x 在初始化的时候，做了不少的调整，可以说是面目全非，但是这次改动我认为是好的，因为统一了使用方式，不再跟 2.x 那样很杂。

### 回顾 Vue 2

先回顾一下 2.x，在 2.x，在导入各种依赖之后，通过 `new Vue` 来执行 Vue 的初始化；相关的 Vue 生态和插件，有的使用 `Vue.use` 来进行初始化，有的是作为 `new Vue` 的入参。

```ts
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import xxx from 'xxx'

Vue.use(xxx);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

### 了解 Vue 3{new}

在 3.x ，是通过 `createApp` 来执行 Vue 的初始化，另外不管是 Vue 生态里的东西，还是外部插件、 UI 框架，统一都是由 `use` 来激活初始化，非常统一和简洁。

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import xxx from 'xxx'

createApp(App)
  .use(store)
  .use(router)
  .use(xxx)
  .mount('#app')
```

## Vue Devtools

Vue Devtools 是一个浏览器扩展，支持 Chrome 、 Firefox 等浏览器，需要先 [安装 Vue Devtools](https://devtools.vuejs.org/guide/installation.html) 扩展才能使用。

当你在 Vue 项目通过 `npm run dev` 等命令启动开发环境服务后，访问本地页面（如： `http://localhost:3000/` ），在页面上按 F12 唤起浏览器的控制台，会发现多了一个 `vue` 面板。

面板上有两个主要的 Tabs ：

- Inspector 是以结构化的方式显示调试信息，例如检查组件，你可以选择组件并检查它们的状态：

<ClientOnly>
  <ImgWrap
    src="/assets/img/vue-devtools-inspector.jpg"
    alt="Vue Devtools 的 Inspector 界面"
  />
</ClientOnly>

- Timeline 是以时间线的方式追踪不同类型的数据，例如事件

<ClientOnly>
  <ImgWrap
    src="/assets/img/vue-devtools-timeline.jpg"
    alt="Vue Devtools 的 Timeline 界面"
  />
</ClientOnly>

更多的用法可以在 [Vue Devtools 官网](https://devtools.vuejs.org/) 了解。

## 本章结语

这一章就到这里了，对比 2.x 来说，大体上还是很相似的，但是也有个别调整需要注意了解，比如上面最后提到的入口文件，对于后续的开发工作是非常重要的。

其他的变化，会在每一节涉及到的内容里面，再单独和 2.x 进行对比，这样比较能加深各个功能模块的记忆。

<!-- 谷歌广告 -->
<ClientOnly>
  <GoogleAdsense />
</ClientOnly>
<!-- 谷歌广告 -->

<!-- 评论 -->
<ClientOnly>
  <GitalkComment
    :issueId="45"
  />
</ClientOnly>
<!-- 评论 -->
