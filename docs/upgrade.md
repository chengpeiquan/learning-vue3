---
outline: 'deep'
---

# 脚手架的升级与配置

相信在 “了解前端工程化” 一章里阅读过 [Vue.js 与工程化](engineering.html#vue-js-与工程化) 一节内容的开发者，可以轻松猜到本书接下来关于 Vue 3 的学习都将基于前端工程化展开，本章将介绍如何配置 Vue 3 的开发环境，并创建基于前端工程化的 Vue 3 项目。

:::tip
如果还不熟悉 Node.js 、 npm 依赖管理等前端工程化工具链的使用，请先阅读 [工程化的前期准备](guide.md) 一章。
:::

## 全新的 Vue 版本 ~new

在 2022 年 2 月 7 日， Vue 3 代替了 Vue 2 成为 Vue 的默认版本，有一些注意事项需要留意：

### 使用 Vue 3

在 npmjs 网站 [Vue 主页的版本列表](https://www.npmjs.com/package/vue?activeTab=versions) 上面，可以看到当前已使用 `3.x.x` 这样的版本号作为 `latest` 这个 Tag 对应的版本，也就是运行 `npm i vue` 默认会安装 Vue 3 了，无需再和以前一样，需要指定 `vue@next` 才可以安装到 Vue 3 。

<ClientOnly>
  <ImgWrap
    src="/assets/img/vue-versions-on-npmjs.jpg"
    alt="Vue 在 npmjs 上的版本列表"
  />
</ClientOnly>

包括 `vue-router` 、 `vuex` 、`vue-loader` 和 `@vue/test-utils` 等相关的生态，同样不需要指定 next 版本了，都配合 Vue 3 指定了新的 latest 默认版本。

同时 Vue 生态的所有官方文档也都默认切换到 Vue 3 版本，可在 [官方文档](links.md#官方文档) 一节了解最新的官方资源站点。

### 使用 Vue 2

如果还需要使用 Vue 2 ，则在安装的时候需要手动指定 Tag 为 `legacy` 或者 `v2-latest` 才能安装到 Vue 2 ：

```bash
# 安装 2.6.x 的最新版本
npm i vue@legacy

# 安装 2.7.x 的最新版本
npm i vue@v2-latest
```

注意到 Vue 2 配对了两个不同的 Tag ，分别对应 2.7 系列和 2.6 系列。

:::tip
Vue 2.7 系列是在 Vue 2 的基础上，对标 Vue 3 的功能支持所作的升级，主要是面向想使用 Vue 3 的新特性、但顾虑于产品对旧浏览器的支持而无法贸然升级的开发者。

Vue 2.7 与 Vue 2.6 之前的旧版本在使用上略有不同，具体可以查看 Vue 2 的 [更新记录](https://github.com/vuejs/vue/blob/main/CHANGELOG.md) 了解具体的差异化。
:::

对于一些没有打 Tag 的 Vue 2 相关生态（如 vuex 截止到撰写本文时还没有为旧版本打 Tag ），则需要显式的指定版本号才可以安装到配套的程序：

```bash
# 显式的指定具体版本号安装
npm i vuex@3.6.2
```

如果之前使用了 `latest` 标签或 `*` 从 npm 安装 Vue 或其他官方库，请确保项目下的 package.json 文件能够明确使用兼容 Vue 2 的版本。

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

:::tip
上方代码块里的 `-` 号代表移除， `+` 号代表新增，这是一种 Diff 风格的排版，表明修改前后的变化，后文如有类似的代码风格同理。
:::

## Hello Vue3

如果想早点开始 Vue 3 的世界，可以通过以下命令直接创建一个启动项目：

```bash
# 全局安装脚手架
npm install -g create-preset

# 使用 `vue3-ts-vite` 模板创建一个名为 `hello-vue3` 的项目
preset init hello-vue3 --template vue3-ts-vite
```

这是一个基于 Vite + TypeScript + Vue 3 + Pinia 的项目启动模板，可以使用这个项目来练习后面的案例代码，创建完毕后可以直接跳到 [安装 VSCode](#安装-vscode) 和 [添加 VSCode 插件](#添加-vscode-插件) 继续学习。

当然有时间还是希望继续阅读 [使用 Vite 创建项目](#使用-vite-创建项目-new) 和 [使用 @vue/cli 创建项目](#使用-vue-cli-创建项目) 这两部分内容，了解 Vue 3 更主流的项目创建方案。

:::tip
如果网络问题下载失败，可以先执行 `preset proxy on` 开启加速镜像代理下载。
:::

## 使用 Vite 创建项目 ~new

Vite 是由 Vue 作者尤雨溪先生带领团队开发的一个构建工具，它利用浏览器原生支持 ES 模块的特点，极大提升了开发体验，自 2021 年 1 月份发布 2.0 版本以来，发展非常快，笔者也在第一时间参与贡献了一些文档和插件，并且在 2021 年期间，个人项目已经全面切换到 Vite ，公司业务也在 2021 年底开始使用 Vite 创建新项目，整体情况非常稳定，前景非常乐观。

关于是否使用 Vite 和安利团队使用 Vue 3 ，可以看笔者在 2022 年春节前写的 [Markdown 工程师的一周](https://zhuanlan.zhihu.com/p/460538277) 一文，记录了一次关于团队技术栈升级的总结，笔者是非常推荐升级技术栈的！

在这里推荐以下这几种创建 Vite 项目的方式：[Create Vite](#create-vite) 、 [Create Vue](#create-vue) 和 [Create Preset](#create-preset) 。

### Create Vite

[create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) 是 Vite 官方推荐的一个脚手架工具，可以创建基于 Vite 的不同技术栈基础模板。

运行以下命令创建模板项目，再按照命令行的提示操作（选择 `vue` 技术栈进入），即可创建一个基于 Vite 的基础空项目。

```bash
npm create vite
```

不过这个方式创建的项目非常基础，如果需要用到 Router 、 Vuex 、 ESLint 等程序，都需要再单独安装和配置，所以推荐使用 [Create Preset](#create-preset) 。

### Create Vue

[create-vue](https://github.com/vuejs/create-vue) 是 Vue 官方推出的一个新脚手架，用以代替基于 Webpack 的 Vue CLI ，它可以创建基于 Vite 的 Vue 基础模板。

运行以下命令创建模板项目，然后根据命令行的提示操作即可。

```bash
npm init vue@3
```

### Create Preset

[create-preset](https://github.com/awesome-starter/create-preset) 是 Awesome Starter 的 CLI 脚手架，提供快速创建预设项目的能力，可以创建一些有趣实用的项目启动模板，也可以用来管理的常用项目配置。

#### 简单使用

可以通过包管理器直接创建配置，然后按照命令行的提示操作，即可创建开箱即用的模板项目。

```bash
npm create preset
```

在这里选择 `vue` 技术栈进入，选择 [vue3-ts-vite](https://github.com/awesome-starter/vue3-ts-vite-starter) 创建一个基于 Vite + Vue 3 + TypeScript 的项目启动模板。

:::tip
如果下载失败，可以通过 `npm create preset proxy on` 开启加速镜像代理下载。

点击查看：[代理选项 - Create Preset](https://preset.js.org/zh/docs.html#%E5%BC%80%E5%90%AF%E4%BB%A3%E7%90%86)
:::

#### 全局安装

也可以像使用 @vue/cli 一样，全局安装到本地，通过 `preset init` 命令来创建项目。

推荐全局安装它，用起来更方便，请先全局安装：

```bash
npm install -g create-preset
```

可以通过下面这个命令来检查安装是否成功，如果成功，将会得到一个版本号：

```bash
preset -v
```

然后可以通过 `--template` 选项直接指定一个模板创建项目，在这里使用 `vue3-ts-vite` 模板创建一个名为 `hello-vue3` 的项目：

```bash
preset init hello-vue3 --template vue3-ts-vite
```

常用的项目模板也可以绑定为本地配置，点击 [Create Preset 官方文档](https://preset.js.org/zh/) 查看完整使用教程。

### 管理项目配置

不论使用上方哪种方式创建项目，在项目的根目录下都会有一个名为 `vite.config.js` 或 `vite.config.ts` 的项目配置文件（其扩展名由项目使用 JavaScript 还是 TypeScript 决定）。

里面会有一些预设好的配置，可以在 [Vite 官网的配置文档](https://cn.vitejs.dev/config/) 查阅更多的可配置选项。

## 使用 @vue/cli 创建项目

如果不习惯 Vite ，依然可以使用 Vue CLI 作为开发脚手架。

### 和 Vite 的区别

Vue CLI 使用的构建工具是基于 Webpack ，可以在 [了解构建工具](guide.md#了解构建工具) 一节了解 Webpack 和 Vite 这两个构建工具的区别。

### 更新 CLI 脚手架

请先全局安装，把脚手架更新到最新版本（最低版本要求在 `4.5.6` 以上才能支持 Vue 3 项目的创建）。

```js
npm install -g @vue/cli
```

### 使用 CLI 创建 3.x 项目 ~new

Vue CLI 全局安装后，可以在命令行输入 `vue` 进行操作，创建项目使用的是 `create` 命令：

```js
vue create hello-vue3
```

由于要使用 TypeScript ，所以需要选择最后一个选项来进行自定义搭配，通过键盘的上下箭头进行切换选择：

```js
Vue CLI v5.0.4
? Please pick a preset:
  Default ([Vue 3] babel, eslint)
  Default ([Vue 2] babel, eslint)
> Manually select features
```

多选菜单可以按空格选中需要的依赖，总共选择了下面这些选项：

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

选择 Vue 版本，要用 Vue 3 所以需要选择 3.x ：

```js
? Choose a version of Vue.js that you want to start the project with
  (Use arrow keys)
> 3.x
  2.x
```

是否选择 Class 语法的模板，在 Vue 2 版本为了更好的支持 TypeScript ，通常需要使用 Class 语法，由于 Vue 3 有了对 TypeScript 支持度更高的 Composition API ，因此选择 `n` ，也就是 “否” ：

```js
? Use class-style component syntax? (y/N) n
```

Babel 可以把新版本的 JavaScript 语句转换为兼容性更好的低版本 Polyfill 写法，所以选 `y` 确认使用：

```js
? Use Babel alongside TypeScript
  (required for modern mode, auto-detected polyfills, transpiling JSX)?
  (Y/n) y
```

接下来是选择路由模式，选 `y` 启用 History 模式，选 `n` 使用 Hash 模式，可根据项目情况选择。

建议先选 `y` 确认，如果遇到部署的问题可以在 “路由” 一章的 [部署问题与服务端配置](router.html#部署问题与服务端配置) 小节查看如何处理。

```js
? Use history mode for router?
  (Requires proper server setup for index fallback in production)
  (Y/n) y
```

选择一个 CSS 预处理器，可以根据自己的喜好选择，不过鉴于目前开源社区组件常用的都是 [Less](https://github.com/less/less.js) ，所以也建议选择 Less 作为入门的预处理器工具。

```js
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported
 by default):
  Sass/SCSS (with dart-sass)
> Less
  Stylus
```

Lint 规则，用来代码检查，写 TypeScript 离不开 Lint ，可以根据自己喜好选择，也可以先选择默认，后面在 [添加协作规范](#添加协作规范) 一节也有说明如何配置规则，这里先默认第一个：

```js
? Pick a linter / formatter config: (Use arrow keys)
> ESLint with error prevention only
  ESLint + Airbnb config
  ESLint + Standard config
  ESLint + Prettier
```

Lint 的校验时机，一个是在保存时校验，一个是在提交 commit 的时候才校验，这里也选默认：

```js
? Pick additional lint features: (Press <space> to select,
 <a> to toggle all, <i> to invert selection, and <enter> to proceed)
>(*) Lint on save
 ( ) Lint and fix on commit
```

项目配置文件，笔者更习惯保存为独立文件：

```js
? Where do you prefer placing config for Babel, ESLint, etc.?
  (Use arrow keys)
> In dedicated config files
  In package.json
```

是否保存为未来的项目配置，存起来方便以后快速创建：

```js
? Save this as a preset for future projects? Yes
? Save preset as: vue-3-ts-config
```

至此，项目创建完成！可以通过 `npm run serve` 开启热更进行开发调试，通过 `npm run build` 构建打包上线。

### 管理项目配置

Vue CLI 的配置文件是 `vue.config.js` ，可以参考官网的说明文档调整各个选项配置：[配置参考 - Vue CLI](https://cli.vuejs.org/zh/config/) 。

## 调整 TS Config

如果在 Vite 的配置文件 vite.config.ts ，或者是在 Vue CLI 的配置文件 vue.config.js 里设置了 alias 的话，因为 TypeScript 不认识里面配置的 alias 别名，所以需要再对 tsconfig.json 做一点调整，增加对应的 paths ，否则在 VSCode 里可能会路径报红，提示找不到模块或其相应的类型声明。

比如在 Vue 组件里引入路径为 `@cp/HelloWorld.vue` 的时候，可以避免写出 `../../../../components/HelloWorld.vue` 这样的非常多层级的相对路径，但是默认情况下 TypeScript 并不知道这个 alias 等价于 `src/components/HelloWorld.vue` 这个文件路径，从而会报错找不到该模块并导致无法正确编译。

假设在 vite.config.ts 里配置了这些 alias ：

```ts{4-12}
export default defineConfig({
  // ...
  resolve: {
    alias: {
      '@': resolve('src'), // 源码根目录
      '@img': resolve('src/assets/img'), // 图片
      '@less': resolve('src/assets/less'), // 预处理器
      '@libs': resolve('src/libs'), // 本地库
      '@plugins': resolve('src/plugins'), // 本地插件
      '@cp': resolve('src/components'), // 公共组件
      '@views': resolve('src/views'), // 路由组件
    },
  },
  // ...
})
```

那么在该项目的 tsconfig.json 文件里就需要相应的加上这些 paths ：

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
注意 paths 的配置全部要以 `/*` 结尾，代表该目录下的文件都可以被匹配，而不是指向某一个文件。
:::

## 添加协作规范

考虑到后续可能会有团队协作，最好是能够统一编码风格。

### Editor Config

在项目根目录下再增加一个名为 `.editorconfig` 的文件。

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

具体的参数说明可参考：[项目代码风格统一神器 editorconfig 的作用与配置说明](https://chengpeiquan.com/article/editorconfig.html)

:::tip
部分编辑器可能需要安装对应的插件才可以支持该配置。

例如 VSCode 需要安装 [EditorConfig for VSCode 扩展](#editorconfig-for-vs-code) 。
:::

### Prettier

[Prettier](https://github.com/prettier/prettier) 是目前最流行的代码格式化工具，可以约束的代码风格不会乱七八糟，目前所知道的知名项目（如 Vue 、 Vite 、 React 等）和大厂团队（谷歌、微软、阿里、腾讯等）都在使用 Prettier 格式化代码。

通过脚手架创建的项目很多都内置了 Prettier 功能集成（例如 [Create Preset](#create-preset) ，参考了主流的格式化规范，比如 2 个空格的缩进、无需写分号结尾、数组 / 对象每一项都带有尾逗号等等）。

如果需要手动增加功能支持，请在项目根目录下创建一个名为 `.prettierrc` 的文件，写入以下内容：

```json
{
  "semi": false,
  "singleQuote": true
}
```

这代表 JavaScript / TypeScript 代码一般情况下不需要加 `;` 分号结尾，然后使用 `''` 单引号来定义字符串等变量。

这里只需要写入与默认配置不同的选项即可，如果和默认配置一致，可以省略，完整的配置选项以及默认值可以在 Prettier 官网的 [Options Docs](https://prettier.io/docs/en/options.html) 查看。

配合 VSCode 的 [VSCode Prettier](#vscode-prettier) 扩展，可以在编辑器里使用该规则格式化文件（此时无需在项目下安装 Prettier 依赖）。

如果开启了 ESLint ，配合 ESLint 的代码提示，可以更方便的体验格式化排版，详见 [ESLint](#eslint) 一节的说明。

:::tip
配合 [VSCode Prettier 扩展](#vscode-prettier) ，这份配置直接在 VSCode 里生效，如果配合 ESLint 使用，需要安装 [Prettier](https://www.npmjs.com/package/prettier) 依赖。
:::

### ESLint

[ESLint](https://github.com/eslint/eslint) 是一个查找 JavaScript / TypeScript 代码问题并提供修复建议的工具，换句话说就是可以约束的代码不会写出一堆 BUG ，它是代码健壮性的重要保障。

虽然大部分前端开发者都不愿意接受这些约束（当年笔者入坑的时候也是），但说实话，经过 ESLint 检查过的代码质量真的高了很多，如果不愿意总是做一个游兵散勇，建议努力让自己习惯被 ESLint 检查，大厂和大项目都是有 ESLint 检查的。

特别是写 TypeScript ，配合 ESLint 的检查实在太爽了（字面意思，真的很舒服）。

通过脚手架创建的项目通常都会帮配置好 ESLint 规则，如果有一些项目是一开始没有，后面想增加 ESLint 检查，也可以手动配置具体规则。

这里以一个 Vite + TypeScript + [Prettier](#prettier) 的 Vue 3 项目为例，在项目根目录下创建一个名为 `.eslintrc.js` 文件，写入以下内容：

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

这样就可以在项目中生效了（如果 VSCode 未能立即生效，重启编辑器即可），一旦代码有问题， ESLint 就会帮检查出来并反馈具体的报错原因，久而久之的代码就会越写越规范。

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
- 可以通过简单的配置调整来满足之前在其他编辑器上的习惯（ e.g. Sublime Text ）
- 轻量级但功能强大，内置了对 JavaScript、TypeScript 和 Node.js 的支持，
- 丰富的插件生态，可以根据的需要，安装提高编码效率的功能支持，以及其他的语言扩展
- 智能的代码补全、类型推导、代码检查提示、批量编辑、引用跳转、比对文件等功能支持
- 登录的 GitHub 账号即可实现配置自动同步，在其他电脑上直接使用的最习惯配置和插件

当然，还有非常多优点可自行体验！

点击下载：[Visual Studio Code](https://code.visualstudio.com/Download)

一般情况下开箱即用，无门槛，也可以阅读官方文档了解一些个性化的配置。

点击查看：[VSCode 操作文档](https://code.visualstudio.com/docs)

## 添加 VSCode 插件

VSCode 本身是轻量级的，也就是只提供最基础的功能，更优秀的体验或者个性化体验，是需要通过插件来启用的。

这里推荐几个非常舒服的 VSCode 插件，可以通过插件中心安装，也可以通过官方应用市场下载。

### Chinese (Simplified)

VSCode 安装后默认是英文本，需要自己进行汉化配置， VSCode 的特色就是插件化处理各种功能，语言方面也一样。

安装该插件并启用，即可让 VSCode 显示为简体中文。

点击下载：[Chinese (Simplified)](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-zh-hans)

### Volar

Vue 官方推荐的 VSCode 扩展，用以代替 Vue 2 时代的 [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur) ，提供了 Vue 3 的语言支持、 TypeScript 支持、基于 [vue-tsc](https://github.com/johnsoncodehk/volar/tree/master/packages/vue-tsc) 的类型检查等功能。

点击下载：[Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

:::tip
Volar 取代了 Vetur 作为 Vue 3 的官方扩展，如果之前已经安装了 Vetur ，请确保在 Vue 3 的项目中禁用它。
:::

### Vue VSCode Snippets

从实际使用 Vue 的角度提供 Vue 代码片段的生成，可以通过简单的命令，在 .vue 文件里实现大篇幅的代码片段生成，例如：

1. 输入 `ts` 可以快速创建一个包含了 `template` + `script` + `style` 的 Vue 组件模板（可选 2.x 、3.x 以及 class 风格的模板）

2. 也可以通过输入带有 `v3` 开头的指令来快速生成 Vue 3 的 API 。

下面是输入了 `ts` 两个字母之后，用箭头选择 `vbase-3-ts` 自动生成的一个模板片段，在开发过程中非常省事：

```vue
<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  },
})
</script>

<style scoped></style>
```

点击下载：[Vue VSCode Snippets](https://marketplace.visualstudio.com/items?itemName=sdras.vue-vscode-snippets)

### Auto Close Tag

可以快速完成 HTML 标签的闭合，除非通过 `.jsx` / `.tsx` 文件编写 Vue 组件，否则在 `.vue` 文件里写 `template` 的时候肯定用得上。

点击下载：[Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)

### Auto Rename Tag

假如要把 `div` 修改为 `section`，不需要再把 `<div>` 然后找到代码尾部的 `</div>` 才能修改，只需要选中前面或后面的半个标签直接修改，插件会自动把闭合部分也同步修改，对于篇幅比较长的代码调整非常有帮助。

点击下载：[Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)

### EditorConfig for VSCode

一个可以让编辑器遵守协作规范的插件，详见 [添加协作规范](#添加协作规范) 。

点击下载：[EditorConfig for VSCode](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

### Prettier for VSCode

这是 [Prettier](#prettier) 在 VSCode 的一个扩展，不论项目有没有安装 Pretter 依赖，安装该扩展之后，单纯在 VSCode 也可以使用 Pretter 进行代码格式化。

点击下载：[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

点击访问：[Prettier 官网](https://prettier.io/) 了解更多配置。

### ESLint for VSCode

这是 [ESLint](#eslint) 在 VSCode 的一个扩展， TypeScript 项目基本都开了 ESLint ，编辑器也建议安装该扩展支持以便获得更好的代码提示。

点击下载：[VSCode ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

点击访问：[ESLint 官网](https://eslint.org/) 了解更多配置。

### 其他插件

其他的比如预处理器相关的，Git 相关的，可以根据自己的需求在 [VSCode 的插件市场](https://marketplace.visualstudio.com) 里搜索安装。

## 项目初始化

至此，通过脚手架已经搭好了一个可直接运行的基础项目，已经可以正常的 `npm run dev` 和 `npm run build` 了（具体命令取决于的项目 [脚本命令的配置](guide.md#脚本命令的配置) ），项目配置和编辑器也都弄好了，是不是可以开始写代码了呢？

请不要着急，还需要了解一点东西，就是如何初始化一个 Vue 3 项目。

因为在实际开发过程中，还会用到各种 npm 包，像很多 UI 框架、功能插件的引入都是需要在 Vue 初始化阶段处理。

甚至有时候还要脱离脚手架，采用 CDN 引入的方式来开发，所以开始写组件之前，还需要了解一下在 Vue 3 项目中，初始化阶段对比 Vue 2 的一些变化。

### 入口文件

项目的初始化都是在入口文件集中处理，Vue 3 的目录结构对比 Vue 2 没有变化，入口文件依然还是 main.ts 这个文件。

但是 Vue 3 在初始化的时候，做了不少的调整，代码写法和 Vue 2 是完全不同，但是对于这次大改动，笔者认为是好的，因为统一了相关生态的启用方式，不再像 Vue 2 时期那样多方式共存，显得比较杂乱。

### 回顾 Vue 2

Vue 2 在导入各种依赖之后，通过 `new Vue()` 执行 Vue 的初始化，相关的 Vue 生态和插件，有的是使用 `Vue.use()` 来进行初始化，有的是作为 `new Vue()` 的入参：

```ts{10-12,18-19}
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import pluginA from 'pluginA'
import pluginB from 'pluginB'
import pluginC from 'pluginC'

// 使用了 `use` 方法激活
Vue.use(pluginA)
Vue.use(pluginB)
Vue.use(pluginC)

Vue.config.productionTip = false

// 作为 `new Vue()` 的入参激活
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
```

### 了解 Vue 3 ~new

在 Vue 3 ，使用 `createApp` 执行 Vue 的初始化，另外不管是 Vue 生态里的东西，还是外部插件、 UI 框架，统一都是由 `use()` 进行激活，非常统一和简洁：

```ts{10-14}
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import pluginA from 'pluginA'
import pluginB from 'pluginB'
import pluginC from 'pluginC'

createApp(App)
  .use(store)
  .use(router)
  .use(pluginA)
  .use(pluginB)
  .use(pluginC)
  .mount('#app')
```

## Vue Devtools

Vue Devtools 是一个浏览器扩展，支持 Chrome 、 Firefox 等浏览器，需要先安装才能使用。

点击安装：[Vue Devtools 的浏览器扩展](https://devtools.vuejs.org/guide/installation.html)

当在 Vue 项目通过 `npm run dev` 等命令启动开发环境服务后，访问本地页面（如： `http://localhost:3000/` ），在页面上按 F12 唤起浏览器的控制台，会发现多了一个名为 `vue` 的面板。

面板的顶部有一个菜单可以切换不同的选项卡，菜单数量会根据不同项目有所不同，例如没有安装 Pinia 则不会出现 Pinia 选项卡，这里以其中一部分选项卡作为举例。

Components 是以结构化的方式显示组件的调试信息，可以查看组件的父子关系，并检查组件的各种内部状态：

<ClientOnly>
  <ImgWrap
    src="/assets/img/vue-devtools-components.jpg"
    dark="/assets/img/vue-devtools-components-dark.jpg"
    alt="Vue Devtools 的 Components 界面"
  />
</ClientOnly>

Routes 可以查看当前所在路由的配置信息：

<ClientOnly>
  <ImgWrap
    src="/assets/img/vue-devtools-routes.jpg"
    dark="/assets/img/vue-devtools-routes-dark.jpg"
    alt="Vue Devtools 的 Routes 界面"
  />
</ClientOnly>

Timeline 是以时间线的方式追踪不同类型的数据，例如事件：

<ClientOnly>
  <ImgWrap
    src="/assets/img/vue-devtools-timeline.jpg"
    dark="/assets/img/vue-devtools-timeline-dark.jpg"
    alt="Vue Devtools 的 Timeline 界面"
  />
</ClientOnly>

Pinia 是可以查看当前组件引入的全局状态情况：

<ClientOnly>
  <ImgWrap
    src="/assets/img/vue-devtools-pinia.jpg"
    dark="/assets/img/vue-devtools-pinia-dark.jpg"
    alt="Vue Devtools 的 Pinia 界面"
  />
</ClientOnly>

可以在 [Vue Devtools 官网](https://devtools.vuejs.org/) 了解更多的用法。

<!-- 评论 -->
<ClientOnly>
  <GitalkComment
    :issueId="45"
  />
</ClientOnly>
<!-- 评论 -->
