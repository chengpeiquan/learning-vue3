# 插件的使用

在构建 Vue 项目的过程中，离不开各种开箱即用的插件支持，用以快速完成需求，避免自己造轮子。

## 关于插件

关于插件的定义，摘选一段 [官方plugins文档](https://v3.vuejs.org/guide/plugins.html) 的描述：

:::tip
插件是自包含的代码，通常向 Vue 添加全局级功能。它可以是一个带有公开 `install()` 方法的 `object`，也可以是 一个`function`

插件的功能范围没有严格的限制，一般有下面几种：

添加全局方法或者 `property`。如：[vue-custom-element](https://github.com/karol-f/vue-custom-element)

添加全局资源：指令/过滤器/过渡等，例如：[vue-touch](https://github.com/vuejs/vue-touch)

通过全局混入来添加一些组件选项，例如：[vue-router](https://github.com/vuejs/vue-router)

添加全局实例方法，通过把它们添加到 `config.globalProperties` 上实现。

一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 [vue-router](https://github.com/vuejs/vue-router)
:::

不同的实现方法，也会有不同的使用方式，下面按照使用方式的不同，把插件按照三类划分，单独讲解他们之间的区别和如何使用。

## 插件的安装和引入

我们的脚手架都是基于 `Node.js`，所以提供了多种多样的安装方式。

### 通过 NPM 安装

NPM 是 `Node.js` 自带的一个包管理工具，在前端工程化十分普及的今天，可以说几乎所有你要用到的插件，都可以在npm上搜到。

通过 `npm install` 命令来安装各种npm包（比如 `npm install vue-router`）。

附：[NPM 官网](https://www.npmjs.com/)

:::tip
NPM 在国内访问速度会比较慢，建议有梯子的用户使用。

我自己在用的是 [Shadowfly](https://shadow-flys.us/auth/register?code=iSGi)，目前已经稳定用了有2年+ 。
:::

### 通过 CNPM 安装

由于一些不可描述的原因， NPM 在国内可能访问速度比较慢，你可以通过绑定淘宝镜像，通过 CNPM 源来下载包，CNPM 是完全同步 NPM 的。

它的安装命令和 NPM 非常一致，通过 `cnpm install` 命令来安装（比如 `cnpm install vue-router`）。

在使用它之前，你需要通过 NPM 命令将其绑定到你的 `node` 上。

```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

附：[CNPM 官网与绑定教程](https://developer.aliyun.com/mirror/NPM)

### 通过 YARN 安装

YARN 也是一个常用的包管理工具，和 NPM 十分相似，NPM 上的包，也会同步到 YARN ，通过 `yarn add` 命令来安装即可（比如 `yarn add vue-router`）。

如果你没有日常翻墙，也可以考虑用 YARN 来代替 NPM，当然，在使用之前，你也必须先安装它才可以，一般情况下，需要添加 `-g` 或者 `--global` 参数来全局安装。

```
npm install -g yarn
```

附：[YARN 官网](https://yarnpkg.com/)

不知道选择哪个？可以戳：[npm和yarn的区别，我们该如何选择?](https://www.jianshu.com/p/254794d5e741)

### 通过 CDN 安装

大部分插件都会提供一个 CDN 版本，让你可以在 `html` 通过 `script` 标签引入。

比如：

```html
<script src="https://unpkg.com/vue-router"></script>
```

### 插件的引入

除了 CDN 版本是直接可用之外，其他通过 NPM、YARN 等方式安装的插件，都需要在入口文件 `main.js` 或者要用到的 `.vue` 文件里引入，比如：

```ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
```

因为本教程都是基于工程化开发，使用的 CLI 脚手架，所以这些内容暂时不谈及 CDN 的使用方式。

通常来说会有细微差别，但影响不大，插件作者也会在插件仓库的 README 或者使用文档里进行告知。

## Vue 专属插件

这里特指 Vue 插件，通过 [Vue Plugins 设计规范](https://v3.cn.vuejs.org/guide/plugins.html) 开发出来的插件，在npm上通常是以 `vue-xxx` 这样带有 vue 关键字的格式命名（比如 [vue-baidu-analytics](https://github.com/chengpeiquan/vue-baidu-analytics)）。

专属插件通常分为 **全局插件** 和 **单组件插件**，区别在于，全局版本是在 `main.ts` 引入后 `use`，而单组件版本则通常是作为一个组件在 `.vue` 文件里引入使用。

### 全局插件的使用{new}

在本教程最最前面的时候，我有特地说了一个内容就是 [项目初始化 - 升级与配置](update.md#项目初始化) ，在这里有提到过就是需要通过 `use` 来初始化框架、插件。

全局插件的使用，就是在 `main.ts` 通过 `import` 引入，然后通过 `use` 来启动初始化。

在 2.x ，全局插件是通过 `Vue.use(xxxxxx)` 来启动，而现在，则需要通过 `createApp` 的 `use`，`use` 方法，既可以单独一行一个 use ，也可以直接链式 use 下去。

**参数**

`use` 方法支持两个参数：

参数|类型|作用
:--|:--|:--
plugin|object \| function|插件，一般是你在 import 时使用的名称
options|object|插件的参数，有些插件在初始化时可以配置一定的选项

基本的写法就是像下面这样：

```ts
// main.ts
import plugin1 from 'plugin1'
import plugin2 from 'plugin2'
import plugin3 from 'plugin3'
import plugin4 from 'plugin4'

createApp(App)
  .use(plugin1)
  .use(plugin2)
  .use(plugin3, {
    // plugin3's options
  })
  .use(plugin4)
  .mount('#app')
```

大部分插件到这里就可以直接启动了，个别插件可能需要通过插件 API 去手动触发，在 `npm package` 的详情页上，作者一般会告知使用方法，按照说明书操作即可。

### 单组件插件的使用{new}

单组件的插件，通常自己本身也是一个 Vue 组件（大部分情况下都会打包为 JS 文件，但本质上是一个 Vue 的 component ）。

单组件的引入，一般都是在需要用到的 `.vue` 文件里单独 `import` ，然后挂到 `template` 里去渲染。

我放一个我之前打包的单组件插件 [vue-picture-cropper](https://github.com/chengpeiquan/vue-picture-cropper) 做案例，理解起来会比较直观：

```vue
<template>
  <!-- 放置组件的渲染标签，用于显示组件 -->
  <vue-picture-cropper
    :boxStyle="{
      width: '100%',
      height: '100%',
      backgroundColor: '#f8f8f8',
      margin: 'auto'
    }"
    :img="pic"
    :options="{
      viewMode: 1,
      dragMode: 'crop',
      aspectRatio: 16 / 9,
    }"
  />
  <!-- 放置组件的渲染标签，用于显示组件 -->
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

// 引入单组件插件
import VuePictureCropper, { cropper } from 'vue-picture-cropper'

export default defineComponent({
  // 挂载组件模板
  components: {
    VuePictureCropper
  },

  // 在这里定义一些组件需要用到的数据和函数
  setup () {
    const pic = ref<string>('');

    onMounted( () => {
      pic.value = require('@/assets/logo.png');
    })

    return {
      pic
    }
  }
})
</script>
```

哈哈哈哈参考上面的代码，还有注释，应该能大概了解如何使用单组件插件了吧！

## 通用 JS 插件

也叫普通插件，这个 “普通” 不是指功能平平无奇，而是指它们无需任何框架依赖，可以应用在任意项目中，属于独立的 JS Library ，比如 [axios](https://github.com/axios/axios) 、 [qrcode](https://github.com/soldair/node-qrcode) 、[md5](https://github.com/pvorb/node-md5) 等等，在任何技术栈都可以单独引入使用，非 Vue 专属。

通用 JS 插件的使用非常灵活，既可以全局挂载，也可以在需要用到的组件里单独引入。

组件里单独引入方式：

```ts
import { defineComponent } from 'vue'
import md5 from 'md5'

export default defineComponent({
  setup () {
    const MD5_MSG: string = md5('message');
  }
})
```

全局挂载方法比较特殊，因为插件本身不是专属 Vue，没有 `install` 接口，无法通过 `use` 方法直接启动，下面有一 part 单独讲这一块的操作，详见 [全局 API 挂载](#全局-api-挂载)。

## 本地的一些工具插件

插件也不全是来自于网上，有时候针对自己的业务，涉及到一些经常用到的功能模块，你也可以抽离出来封装成项目专用的本地插件。

### 为什么要封装本地插件

举个例子，比如在做一个具备用户系统的网站时，会涉及到手机短信验证码模块，你在开始写代码之前，需要先要考虑到这些问题：

1. 很多操作都涉及到下发验证码的请求，比如 “登录” 、 “注册” 、 “修改手机绑定” 、 “支付验证” 等等，代码雷同，只是接口 URL 或者参数不太一样

2. 都是需要对手机号是否有传入、手机号的格式正确性验证等一些判断

3. 需要对接口请求成功和失败的情况做一些不同的数据返回，但要处理的数据很相似，都是用于告知调用方当前是什么情况

4. 返回一些 Toast 告知用户当前的交互结果

:::tip
如果不把这一块的业务代码抽离出来，你需要在每个用到的地方都写一次，不仅繁琐，而且以后一旦产品需求有改动，维护起来就惨了。
:::

### 如何封装一个本地插件

一般情况下，都是封装成一个 JS Library，或者一个 Vue Component 单组件插件就可以了。

我以上面提到的获取手机短信验证码模块为例子，我当时是这么处理的，把判断、请求、结果返回、Toast 都抽离出来，将其封装成一个 `getVerCode.ts` 放到 `src/libs` 目录下：

```ts
import axios from '@libs/axios'
import message from '@libs/message'
import regexp from '@libs/regexp'

/** 
 * 获取验证码
 * @param phoneNumber - 手机号
 * @param mode - 获取模式：login=登录，reg=注册
 * @param params - 请求的参数
 * @return verCode - 验证码：success=验证码内容，error=空值
 */
const getVerCode = (
  phoneNumber: string | number | undefined,
  mode: string,
  params: any = {}
): Promise<string> => {
  return new Promise( (resolve, reject) => {
    
    let apiUrl = '';

    /** 
     * 校验参数
     */
    if ( !phoneNumber ) {
      message.error('请输入手机号');
      return false;
    }
  
    if ( !regexp.isMob(phoneNumber) ) {
      message.error('手机号格式不正确');
      return false;
    }

    if ( !mode ) {
      message.error('验证码获取模式未传入');
      return false;
    }

    /** 
     * 判断当前是请求哪种验证码
     */
    switch (mode) {
      case 'login':
        apiUrl = `/api/sms/login/${phoneNumber}`;
        break;
      case 'reg':
        apiUrl = `/api/sms/register/${phoneNumber}`;
        break;
      case 'rebind':
        apiUrl = `/api/sms/authentication/${phoneNumber}`;
        break;
      default:
        message.error('验证码获取模式传入错误');
        return false;
    }
    
    /** 
     * 请求验证码
     */
    axios({
      isNoToken: true,
      isNoRefresh: true,
      method: 'get',
      url: apiUrl,
      params: params
    }).then( (data: any) => {

      // 异常拦截
      const CODE: number = data.code || 0;
      const MSG: string = data.msg || '';

      if ( CODE !== 0 ) {
        message.error(MSG);

        if ( MSG === '验证码发送过频繁' ) {
          reject('频繁');
          return false;
        }

        reject('');
        return false;
      }

      // 返回验证码成功标识
      message.success('验证码已发送，请查收手机短信');
      const RESULT: string = data.msg || '';
      resolve(RESULT);

    }).catch( (err: any) => {
      message.error('网络异常，获取验证码失败');
      reject('');
    });
  })
}

export default getVerCode;
```

然后你在需要用到的 `.vue` 组件里，就可以这样去获取验证码了，一句代码走天下：

```ts
// 导入验证码插件
import getVerCode from '@libs/getVerCode'

// 获取登录验证码
getVerCode(13800138000, 'login');

// 获取注册验证码
getVerCode(13800138000, 'reg');
```

因为是 `Promise` ，如果还需要做一些别的回调操作，还可以使用 `async / await` 或者 `then / catch` 去处理。

## 全局 API 挂载

对于一些使用频率比较高的插件方法，如果你觉得在每个组件里单独导入再用很麻烦，你也可以考虑将其挂载到 Vue 上，使其成为 Vue 的全局变量。

**注：接下来的全局变量，都是指 Vue 环境里的全局变量，非 Window 下的全局变量。**

### 回顾 2.x

在 2.x ，可以通过 `prototype` 的方式来挂载全局变量，然后通过 `this` 关键字来从 Vue 原型上调用该方法。

我以 `md5` 插件为例，在 `main.ts` 里进行全局 `import`，然后通过 `prototype` 去挂到 Vue 上。

```ts
import Vue from 'vue'
import md5 from 'md5'

Vue.prototype.$md5 = md5;
```

之后在 `.vue` 文件里，你就可以这样去使用 `md5`。

```ts
const MD5_MSG: string = this.$md5('message');
```

### 了解 3.x{new}

在 3.x ，已经不再支持 `prototype` 这样使用了，在 `main.ts` 里没有了 `Vue`，在组件的生命周期里也没有了 `this`。

如果你依然想要挂载全局变量，需要通过全新的 `config.globalProperties` 来实现，在使用该方式之前，可以把 `createApp` 定义为一个变量再执行挂载。

### 定义全局 API{new}

在配置全局变量之前，你需要把初始化时的 `createApp` 定义为一个变量，然后把这些全局变量挂载到上面。

```ts
import md5 from 'md5'

// 创建 Vue 实例
const app = createApp(App)

// 把插件的 API 挂载全局变量到实例上
app.config.globalProperties.$md5 = md5;

// 你也可以自己写一些全局函数去挂载
app.config.globalProperties.$log = (text: string): void => {
  console.log(text);
};

app.mount('#app');
```

### 使用全局 API{new}

要在 Vue 组件里使用，因为 3.x 的生命周期无法取得实例的 `this` 来操作，需要通过全新的 `getCurrentInstance` 组件，导入里面的 `proxy` 代理模块来进行处理。

```ts
// 导入 getCurrentInstance 组件
import { defineComponent, getCurrentInstance } from 'vue'

export default defineComponent({
  setup () {
    // 导入代理模块
    const { proxy } = getCurrentInstance();

    // 调用全局的 MD5 API 进行加密
    const MD5_STRING: string = proxy.$md5('Hello World!');
    
    // 调用刚刚挂载的打印函数
    proxy.$log('Hello World!');
  }
})
```

### 全局 API 的替代方案

在 Vue 3.x 实际上并不是特别推荐使用全局变量，3.x 比较推荐按需引入使用（从使用方式上也可以看得出，这类全局 API 的用法还真的挺麻烦的…）。

特别是针对 TypeScript ，尤大对于全局 API 的相关 PR 说明： [Global API updates](https://github.com/vuejs/rfcs/pull/117)，也是不建议在 TS 里使用。

那么确实是需要用到一些全局 API 怎么办？

对于一般的数据和方法，建议采用 [provide / inject](communication.md#provide-inject) 方案，在根组件（通常是 App.vue ）把需要作为全局使用的数据 / 方法 provide 下去，在需要用到的组件里通过 inject 即可获取到，或者使用 [EventBus](communication.md#eventbus-new) 和 [Vuex](communication.md#vuex-new) 等全局通信方案来处理。

## 本节结语

插件的使用基本上就涉及到这些点了，很多同学之所以还不敢在业务中使用 Vue 3.0，应该也是顾虑于 3.0 是不是有很多插件不能用，影响业务的开发效率（之前有问过不同公司的一些朋友，大部分都是出于这个考虑）。

相信经过这一章的说明，心里应该有底了，在缺少针对性的 Vue 专属插件的情况下，不妨也试一下通用的原生 JS Library 。

<!-- 谷歌广告 -->
<ClientOnly>
  <google-adsense />
</ClientOnly>
<!-- 谷歌广告 -->

<!-- 评论 -->
<ClientOnly>
  <gitalk-comment
    :issueId="48"
  />
</ClientOnly>
<!-- 评论 -->