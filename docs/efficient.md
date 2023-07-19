---
outline: 'deep'
---

# 高效开发

可能很多开发者（包括笔者）刚上手 Vue 3 的那段时间，都会觉得开发过程似乎变得更繁琐了， Vue 官方团队当然不会无视群众的呼声，如果基于脚手架和 `.vue` 文件开发，那么可以享受到更高效率的开发体验。

在阅读这一章之前，需要对 Vue 3 的单组件开发有一定的了解，如果还处于完全没有接触过的阶段，请先抽点时间阅读 [单组件的编写](component.md) 一章。

:::tip
要体验以下新特性，请确保项目下 package.json 里的 [vue](https://www.npmjs.com/package/vue?activeTab=versions) 版本在 `3.2.0` 以上，最好同步 npm 上当前最新的 @latest 版本，否则可能出现 API 未定义等问题。
:::

## script-setup ~new

script-setup 是 Vue 3 组件的一个语法糖，旨在帮助开发者降低 setup 函数需要 return 的心智负担。

Vue 的 `3.1.2` 版本是针对 script-setup 的一个分水岭版本，自 `3.1.4` 开始 script-setup 进入定稿状态，部分旧的 API 已被舍弃，本章节内容将以最新的 API 为准进行整理说明，如果需要查阅旧版 API 的使用，请参阅笔者的 [这篇开荒博文](https://chengpeiquan.com/article/vue3-script-setup.html) 。

script-setup 方案已在 Vue `3.2.0-beta.1` 版本中脱离实验状态，正式进入 Vue 3 的队伍，此后所有的新版本均可以作为一个官方标准的开发方案使用。

### 新特性的产生背景

在了解 script-setup 怎么用之前，可以先了解一下推出该语法糖的一些开发背景，通过对比开发体验上的异同点，了解为什么会有这个新模式。

在 Vue 3 的组件标准写法里，如果数据和方法需要在 `<template />` 里使用，都需要在 `<script />` 的 setup 函数里 return 出来。

如果使用的是 TypeScript ，还需要借助 [defineComponent](component.md#defineComponent-的作用) 对 API 类型进行自动推导。

```vue
<!-- 标准组件格式 -->
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    // ...

    return {
      // ...
    }
  },
})
</script>
```

关于标准 setup 和 defineComponent 的说明和用法，可以查阅 [全新的 setup 函数](component.md#全新的-setup-函数-new) 一节。

script-setup 的推出是为了让熟悉 Vue 3 的开发者可以更高效率地开发组件，减少编码过程中的心智负担，只需要给 `<script />` 标签添加一个 `setup` 属性，那么整个 `<script />` 就直接会变成 setup 函数，所有顶级变量、函数，均会自动暴露给模板使用（无需再一个个 return 了）。

Vue 会通过单组件编译器，在编译的时候将其处理回标准组件，所以目前这个方案只适合用 `.vue` 文件写的工程化项目。

```vue{2}
<!-- 使用 script-setup 格式 -->
<script setup lang="ts">
// ...
</script>
```

对，就是这样，代码量瞬间大幅度减少！

因为 script-setup 的大部分功能在书写上和标准版是一致的，因此下面的内容只提及有差异的写法。

### 全局编译器宏

在 script-setup 模式下，新增了 4 个全局编译器宏，他们无需 import 就可以直接使用。

但是默认的情况下直接使用，如果项目开启了 ESLint ，可能会提示 API 没有导入，但导入 API 后，控制台的 Vue 编译助手又会提示不需要导入，就很尴尬… 不过不用着急！可以通过配置 Lint 规则解决这个问题！

将这几个编译助手写进全局规则里，这样不导入也不会报错了。

```js{5-10}
// 项目根目录下的 .eslintrc.js
module.exports = {
  // ...
  // 在原来的 Lint 规则后面，补充下面的 `globals` 选项
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
}
```

关于几个宏的说明都在下面的文档部分有说明，也可以从这里导航过去直接查看。

|      宏      |                 说明                 |
| :----------: | :----------------------------------: |
| defineProps  | [点击查看](#defineprops-的基础用法)  |
| defineEmits  | [点击查看](#defineemits-的基础用法)  |
| defineExpose | [点击查看](#defineexpose-的基础用法) |
| withDefaults | [点击查看](#withdefaults-的基础用法) |

下面继续了解 script-setup 的变化。

### template 操作简化

如果使用 JSX / TSX 写法，这一点没有太大影响，但对于习惯使用 `<template />` 的开发者来说，这是一个非常爽的体验。

主要体现在这两点：

1. 变量无需进行 return
2. 子组件无需手动注册

#### 变量无需进行 return

标准组件模式下，变量和方法都需要在 setup 函数里 return 出去，才可以在 `<template />` 部分拿到。

```vue{13-16}
<!-- 标准组件格式 -->
<template>
  <p>{{ msg }}</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const msg = 'Hello World!'

    // 要给 `<template />` 用的数据需要 `return` 出去才可以
    return {
      msg,
    }
  },
})
</script>
```

在 script-setup 模式下，定义了就可以直接使用。

```vue
<!-- 使用 script-setup 格式 -->
<template>
  <p>{{ msg }}</p>
</template>

<script setup lang="ts">
const msg = 'Hello World!'
</script>
```

#### 子组件无需手动注册

子组件的挂载，在标准组件里的写法是需要 import 后再放到 components 里才能够启用：

```vue{13-16}
<!-- 标准组件格式 -->
<template>
  <Child />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// 导入子组件
import Child from '@cp/Child.vue'

export default defineComponent({
  // 需要启用子组件作为模板
  components: {
    Child,
  },

  // 组件里的业务代码
  setup() {
    // ...
  },
})
</script>
```

在 script-setup 模式下，只需要导入组件即可，编译器会自动识别并启用。

```vue
<!-- 使用 script-setup 格式 -->
<template>
  <Child />
</template>

<script setup lang="ts">
import Child from '@cp/Child.vue'
</script>
```

### props 的接收方式变化

由于整个 script 都变成了一个大的 setup 函数，没有了组件选项，也没有了 setup 的入参，所以没办法和标准写法一样去接收 props 了。

这里需要使用一个全新的 API ：defineProps 。

defineProps 是一个方法，内部返回一个对象，也就是挂载到这个组件上的所有 props ，它和普通的 props 用法一样，如果不指定为 props ，则传下来的属性会被放到 attrs 那边去。

:::tip
前置知识点：[接收 props - 组件之间的通信](communication.md#接收-props)。
:::

#### defineProps 的基础用法

如果只是单纯在 `<template />` 里使用，那么这么简单定义就可以了：

```ts
defineProps(['name', 'userInfo', 'tags'])
```

使用 `string[]` 数组作为入参，把 prop 的名称作为数组的 item 传给 defineProps 就可以了。

如果 `<script />` 里的方法要拿到 props 的值，也可以使用字面量定义：

```ts
const props = defineProps(['name', 'userInfo', 'tags'])
console.log(props.name)
```

但作为 Vue 的老玩家，都清楚不显性的指定 props 的类型很容易在协作中引起程序报错，那么应该如何对每个 prop 进行类型检查呢？

有两种方式来处理类型定义：

1. 通过构造函数检查 prop
2. 使用类型注解检查 prop

#### 通过构造函数检查 prop

这是第一种方式：使用 JavaScript 原生构造函数进行类型规定，也就是跟平时定义 prop 类型时一样， Vue 会通过 `instanceof` 来进行 [类型检查](https://cn.vuejs.org/guide/components/props.html#prop-validation) 。

使用这种方法，需要通过一个 “对象” 入参来传递给 defineProps ，比如：

```ts
defineProps({
  name: String,
  userInfo: Object,
  tags: Array,
})
```

所有原来 props 具备的校验机制，都可以适用，比如除了要限制类型外，还想指定 `name` 是可选，并且带有一个默认值：

```ts
defineProps({
  name: {
    type: String,
    required: false,
    default: 'Petter',
  },
  userInfo: Object,
  tags: Array,
})
```

更多的 props 校验机制，可以点击 [带有类型限制的 props](communication.md#%E5%B8%A6%E6%9C%89%E7%B1%BB%E5%9E%8B%E9%99%90%E5%88%B6%E7%9A%84-props) 和 [可选以及带有默认值的 props](communication.md#%E5%8F%AF%E9%80%89%E4%BB%A5%E5%8F%8A%E5%B8%A6%E6%9C%89%E9%BB%98%E8%AE%A4%E5%80%BC%E7%9A%84-props) 了解更多。

#### 使用类型注解检查 prop

这是第二种方式：使用 TypeScript 的类型注解，和 ref 等 API 的用法一样，defineProps 也是可以使用尖括号 <> 来包裹类型定义，紧跟在 API 后面。

另外，由于 defineProps 返回的是一个对象（因为 props 本身是一个对象），所以尖括号里面的类型还要用大括号包裹，通过 `key: value` 的键值对形式表示，如：

```ts
defineProps<{ name: string }>()
```

注意到了吗？这里使用的类型，和第一种方法提到的指定类型是不一样的。这里不再使用构造函数校验，而是需要遵循使用 TypeScript 的类型，比如字符串是 `string`，而不是 `String` 。

如果有多个 prop ，就跟写 interface 一样：

```ts
defineProps<{
  name: string
  phoneNumber: number
  userInfo: object
  tags: string[]
}>()
```

其中，举例里的 `userInfo` 是一个对象，可以简单的指定为 object，也可以先定义好它对应的类型，再进行指定：

```ts
interface UserInfo {
  id: number
  age: number
}

defineProps<{
  name: string
  userInfo: UserInfo
}>()
```

如果想对某个数据设置为可选，也是遵循 TS 规范，通过英文问号 `?` 来允许可选：

```ts
// name 是可选
defineProps<{
  name?: string
  tags: string[]
}>()
```

如果想设置可选参数的默认值，需要借助 [withDefaults](#withdefaults-的基础用法) API。

:::warning
需要强调的一点是：在 [构造函数](#通过构造函数检查-prop) 和 [类型注解](#使用类型注解检查-prop) 这两种校验方式只能二选一，不能同时使用，否则会引起程序报错。
:::

#### withDefaults 的基础用法

这个新的 withDefaults API 可以让在使用 TS 类型系统时，也可以指定 props 的默认值。

它接收两个入参：

| 参数          | 含义                          |
| :------------ | :---------------------------- |
| props         | 通过 defineProps 传入的 props |
| defaultValues | 根据 props 的 key 传入默认值  |

光看描述可能不容易理解，看看下面这段演示代码会更直观：

```ts
withDefaults(
  // 这是第一个参数，声明 props
  defineProps<{
    size?: number
    labels?: string[]
  }>(),
  // 这是第二个参数，设置默认值
  {
    size: 3,
    labels: () => ['default label'],
  }
)
```

也可以通过字面量获取 props ：

```ts
// 上面的写法可能比较复杂，存在阅读成本
// 也可以跟平时一样先通过 interface 声明其类型
interface Props {
  size?: number
  labels?: string[]
}

// 再作为 `defineProps` 的类型传入
// 代码风格上会简洁很多
const props = withDefaults(defineProps<Props>(), {
  size: 3,
  labels: () => ['default label'],
})

// 这样就可以通过 `props` 变量拿到需要的值
console.log(props.size)
```

### emits 的接收方式变化

和 props 一样，emits 的接收也是需要使用一个全新的 API 来操作，这个 API 就是 defineEmits 。

和 defineProps 一样， defineEmits 也是一个方法，它接受的入参格式和标准组件的要求是一致的。

:::tip
前置知识点：[接收 emits - 组件之间的通信](communication.md#接收-emits)。
:::

#### defineEmits 的基础用法

需要通过字面量来定义 emits ，最基础的用法也是传递一个 `string[]` 数组进来，把每个 emit 的名称作为数组的 item 。

```ts
// 获取 emit
const emit = defineEmits(['update-name'])

// 调用 emit
emit('update-name', 'Tom')
```

由于 defineEmits 的用法和原来的 emits 选项差别不大，这里也不重复说明更多的诸如校验之类的用法了，可以查看 [接收 emits](communication.md#接收-emits) 一节了解更多。

### attrs 的接收方式变化

attrs 和 props 很相似，也是基于父子通信的数据，如果父组件绑定下来的数据没有被指定为 props ，那么就会被 attrs 接收。

在标准组件里， attrs 的数据是通过 setup 的第二个入参 context 里的 attrs API 获取的。

```ts
// 标准组件的写法
export default defineComponent({
  setup(props, { attrs }) {
    // attrs 是个对象，每个 Attribute 都是它的 key
    console.log(attrs.class)

    // 如果传下来的 Attribute 带有短横线，需要通过这种方式获取
    console.log(attrs['data-hash'])
  },
})
```

但和 props 一样，由于没有了 context 参数，需要使用一个新的 API 来拿到 attrs 数据，这个 API 就是 useAttrs 。

#### useAttrs 的基础用法

顾名思义， useAttrs 可以是用来获取 attrs 数据的，它的用法非常简单：

```ts
import { useAttrs } from 'vue'

// 获取 attrs
const attrs = useAttrs()

// attrs 是个对象，和 props 一样，需要通过 `key` 来得到对应的单个 attr
console.log(attrs.msg)
```

对 attrs 不太了解的话，可以查阅 [获取非 Prop 的 Attribute](communication.md#%E8%8E%B7%E5%8F%96%E9%9D%9E-prop-%E7%9A%84-attribute-new)

### slots 的接收方式变化

slots 是 Vue 组件的插槽数据，也是在父子通信里的一个重要成员。

对于使用 `<template />` 的开发者来说，在 script-setup 里获取插槽数据并不困难，因为跟标准组件的写法是完全一样的，可以直接在 `<template />` 里使用 `<slot />` 标签渲染。

```vue
<template>
  <div>
    <!-- 插槽数据 -->
    <slot />
    <!-- 插槽数据 -->
  </div>
</template>
```

但对使用 JSX / TSX 的开发者来说，就影响比较大了，在标准组件里，想在 script 里获取插槽数据，也是需要在 setup 的第二个入参里拿到 slots API 。

```ts
// 标准组件的写法
export default defineComponent({
  // 这里的 slots 就是插槽
  setup(props, { slots }) {
    // ...
  },
})
```

新版本的 Vue 也提供了一个全新的 useSlots API 来帮助 script-setup 用户获取插槽。

#### useSlots 的基础用法

先来看看父组件，父组件先为子组件传入插槽数据，支持 “默认插槽” 和 “命名插槽” ：

```vue
<template>
  <!-- 子组件 -->
  <ChildTSX>
    <!-- 默认插槽 -->
    <p>Default slot for TSX.</p>
    <!-- 默认插槽 -->

    <!-- 命名插槽 -->
    <template #msg>
      <p>Named slot for TSX.</p>
    </template>
    <!-- 命名插槽 -->
  </ChildTSX>
  <!-- 子组件 -->
</template>

<script setup lang="ts">
// 实际上是导入 ChildTSX.tsx 文件，扩展名默认可以省略
import ChildTSX from '@cp/ChildTSX'
</script>
```

在使用 JSX / TSX 编写的子组件里，就可以通过 useSlots 来获取父组件传进来的 slots 数据进行渲染：

```tsx
// src/components/ChildTSX.tsx
import { defineComponent, useSlots } from 'vue'

export default defineComponent({
  setup() {
    // 获取插槽数据
    const slots = useSlots()

    // 渲染组件
    return () => (
      <div>
        {/* 渲染默认插槽 */}
        <p>{slots.default ? slots.default() : ''}</p>

        {/* 渲染命名插槽 */}
        <p>{slots.msg ? slots.msg() : ''}</p>
      </div>
    )
  },
})
```

请注意，这里的 TSX 组件代码需要使用 `.tsx` 作为文件扩展名，并且构建工具可能默认没有对 JSX / TSX 作支持，以 Vite 为例，需要安装官方提供的 JSX / TSX 支持插件才可以正常使用。

```bash
# 该插件支持使用 JSX 或 TSX 作为 Vue 组件
npm i -D @vitejs/plugin-vue-jsx
```

并在 vite.config.ts 里启用插件，添加对 JSX 和 TSX 的支持。

```ts{3,9-10}
// vite.config.ts
import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  // ...
  plugins: [
    // ...
    // 启用插件
    vueJsx(),
  ],
})
```

如果还存在报错的情况，可以检查项目下的 tsconfig.json 文件里，编译选项 `jsx` 是否设置为 `preserve` ：

```json
{
  "compilerOptions": {
    "jsx": "preserve"
  }
}
```

### ref 的通信方式变化

在标准组件写法里，子组件的数据和方法可以通过在 setup 里 return 出来给父组件调用，也就是父组件可以通过 `childComponent.value.foo` 这样的方式直接操作子组件的数据（参见：[DOM 元素与子组件 - 响应式 API 之 ref](component.md#dom-元素与子组件)）。

但在 script-setup 模式下，所有数据只是默认隐式 return 给 `<template />` 使用，不会暴露到组件外，所以父组件是无法直接通过挂载 ref 变量获取子组件的数据。

在 script-setup 模式下，如果要调用子组件的数据，需要先在子组件显式的暴露出来，才能够正确的拿到，这个操作，就是由 defineExpose API 来完成。

#### defineExpose 的基础用法

defineExpose 的用法非常简单，它本身是一个函数，可以接受一个对象参数。

在子组件里，像这样把需要暴露出去的数据通过 `key: value` 的形式作为入参（下面的例子是用到了 ES6 的 [属性的简洁表示法](https://es6.ruanyifeng.com/#docs/object#%E5%B1%9E%E6%80%A7%E7%9A%84%E7%AE%80%E6%B4%81%E8%A1%A8%E7%A4%BA%E6%B3%95) ）：

```vue{4-7}
<script setup lang="ts">
const msg = 'Hello World!'

// 通过该 API 显式暴露的数据，才可以在父组件拿到
defineExpose({
  msg,
})
</script>
```

然后在父组件就可以通过挂载在子组件上的 ref 变量，去拿到暴露出来的数据了。

### 顶级 await 的支持

在 script-setup 模式下，不必再配合 async 就可以直接使用 await 了，这种情况下，组件的 setup 会自动变成 async setup 。

```vue
<script setup lang="ts">
const res = await fetch(`https://example.com/api/foo`)
const json = await res.json()
console.log(json)
</script>
```

它转换成标准组件的写法就是：

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  async setup() {
    const res = await fetch(`https://example.com/api/foo`)
    const json = await res.json()
    console.log(json)

    return {
      json,
    }
  },
})
</script>
```

## 命名技巧

对于接触编程不久的开发者，在个人练习 demo 或者简单的代码片段里可能会经常看到 `var a` 、 `var b` 这样的命名，因为本身是一段练习代码，因此都是 “能跑就行”，问题不大。

但在工作中，很多开发团队都会有语义化命名的规范要求，严格的团队会有 Code Review 环节，使用这种无意义命名的代码将无法通过审查，在这种背景下，开发者可能会在命名上花费很多时间，在这里也分享笔者的一些常用技巧，希望能够帮助开发者节约在命名上的时间开销。

### 文件命名技巧

在开始讲变量命名之前，先说说文件的命名，因为代码都是保存在文件里，并且可能会互相引用，如果后期再修改文件名或者保存位置而忘记更新代码里的引用路径，那么就会影响程序编译和运行。

#### Vue 组件

在 Vue 项目里，会有放在 views 下的路由组件，有放在 components 目录下的公共组件，虽然都是以 `.vue` 为扩展名的 Vue 组件文件，但根据用途，它们其实并不相同，因此命名上也有不同的技巧。

##### 路由组件

路由组件组件通常存放在 src/views 目录下，在命名上容易困惑的点应该是风格问题，开发者容易陷入是使用 camelCase 小驼峰还是 kebab-case 短横线风格，或者是 snake_case 下划线风格的选择困难。

一般情况下路由组件都是以单个名词或动词进行命名，例如个人资料页使用 `profile` 命名路由，路由的访问路径使用 `/profile` ，对应的路由组件使用 `profile.vue` 命名，下面是几个常见的例子。

```ts
// src/router/routes.ts
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // 首页
  // e.g. `https://example.com/`
  {
    path: '/',
    name: 'home',
    component: () => import('@views/home.vue'),
  },
  // 个人资料页
  // e.g. `https://example.com/profile`
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@views/profile.vue'),
  },
  // 登录页
  // e.g. `https://example.com/login`
  {
    path: '/login',
    name: 'login',
    component: () => import('@views/login.vue'),
  },
]

export default routes
```

如果是一些数据列表类的页面，使用名词复数，或者名词单数加上 `-list` 结尾的 kebab-case 短横线风格写法，推荐短横线风格是因为在 URL 的风格设计里更为常见。

像文章列表可以使用 `articles` 或者 `article-list` ，但同一个项目建议只使用其中一种方式，以保持整个项目的风格统一，下面是几个常见的例子。

```ts
// src/router/routes.ts
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // 文章列表页
  // 翻页逻辑是改变页码进行跳转，因此需要添加动态参数 `:page`
  // 可以在组件内使用路由实例 `route.params.page` 拿到页码
  // e.g. `https://example.com/articles/1`
  {
    path: '/articles/:page',
    name: 'articles',
    component: () => import('@views/articles.vue'),
  },
  // 通知列表页
  // 翻页逻辑使用 AJAX 无刷翻页，这种情况则可以不配置页码参数
  // e.g. `https://example.com/notifications`
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@views/notifications.vue'),
  },
]

export default routes
```

列表里的资源详情页，因为访问的时候通常会带上具体的 ID 以通过接口查询详情数据，这种情况下资源就继续使用单数，例如下面这个例子。

```ts
// src/router/routes.ts
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // 文章详情页
  // 可以在组件内使用路由实例 `route.params.id` 拿到文章 ID
  // e.g. `https://example.com/article/1`
  {
    path: '/article/:id',
    name: 'article',
    component: () => import('@views/article.vue'),
  },
]

export default routes
```

如果项目路由比较多，通常会对同一业务的路由增加文件夹归类，因此上面的文章列表和文章详情页，可以统一放到 article 目录下，使用 `list` 和 `detail` 区分是列表还是详情。

```ts
// src/router/routes.ts
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // 文章相关的路由统一放在这里管理
  {
    path: '/article',
    name: 'article',
    // 这是一个配置了 `<router-view />` 标签的路由中转站组件
    // 目的是使其可以渲染子路由
    component: () => import('@cp/TransferStation.vue'),
    // 由于父级路由没有内容，所以重定向至列表的第 1 页
    // e.g. `https://example.com/article`
    redirect: {
      name: 'article-list',
      params: {
        page: 1,
      },
    },
    children: [
      // 文章列表页
      // e.g. `https://example.com/article/list/1`
      {
        path: 'list/:page',
        name: 'article-list',
        component: () => import('@views/article/list.vue'),
      },
      // 文章详情页
      // e.g. `https://example.com/article/detail/1`
      {
        path: 'detail/:id',
        name: 'article-detail',
        component: () => import('@views/article/detail.vue'),
      },
    ],
  },
]

export default routes
```

对于一些需要用多个单词才能描述的资源，可以使用 kebab-case 短横线风格命名，例如很常见的 “策划面对面” 这种栏目，在设置路由时，比较难用一个单词在 URL 里体现其含义，就需要使用这种多个单词的连接。

```ts
// src/router/routes.ts
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // 面对面栏目
  {
    path: '/face-to-face',
    name: 'face-to-face',
    component: () => import('@views/face-to-face.vue'),
  },
]

export default routes
```

这种情况如果需要使用文件夹管理多个路由，同样建议使用 kebab-case 短横线风格命名，例如上面这个 “策划面对面” 栏目，可能会归属于 “开发计划” 这个业务下，那么其父级文件夹就可以使用 `development-plan` 这样的短横线命名。

##### 公共组件

公共组件组件通常存放在 src/components 目录下，也可以视不同的使用情况，在路由文件夹下创建属于当前路由的 components 目录，作为一个小范围共享的公共组件目录来管理，而 src/components 则只存放全局性质的公共组件。

本节最开始提到了路由组件和公共组件并不相同，虽然都是组件，但路由组件代表的是整个页面，而公共组件更多是作为一个页面上的某个可复用的部件，如果开发者写过 Flutter ，应该能够更深刻的理解到这里的公共组件更接近于 Widget 性质的小部件。

公共组件通常使用 PascalCase 帕斯卡命名法，也就是大驼峰，为什么不用小驼峰呢？

这是源于 Vue 官网的一个 [组件名格式](https://cn.vuejs.org/guide/components/registration.html#component-name-casing) 命名推荐：

> 使用 PascalCase 作为组件名的注册格式，这是因为：<br>
> PascalCase 是合法的 JavaScript 标识符。这使得在 JavaScript 中导入和注册组件都很容易，同时 IDE 也能提供较好的自动补全。<br> >`<PascalCase />` 在模板中更明显地表明了这是一个 Vue 组件，而不是原生 HTML 元素。同时也能够将 Vue 组件和自定义元素（ web components ）区分开来。

而且实际使用 PascalCase 风格的编码过程中，在 VSCode 里可以得到不同颜色的高亮效果，这与 kebab-case 风格的 HTML 标签可以快速区分。

```vue
<template>
  <!-- 普通的 HTML 标签 -->
  <!-- 在笔者的 VSCode 风格里呈现为桃红色 -->
  <div></div>

  <!-- 大驼峰组件 -->
  <!-- 在笔者的 VSCode 风格里呈现为绿色 -->
  <PascalCase />
</template>
```

养成这种习惯还有一个好处，就是使用 UI 框架的时候，例如 Ant Design Vue 的 [Select 组件](https://www.antdv.com/components/select-cn) ，在其文档上演示的是全局安装的写法：

```vue
<template>
  <a-select>
    <a-select-option value="Hello">Hello</a-select-option>
  </a-select>
</template>
```

而实际使用时，为了更好的配合构建工具进行 Tree Shaking 移除没有用到的组件，都是按需引入 UI 框架的组件，因此如果平时有养成习惯使用 PascalCase 命名，就可以很轻松的知道上面的 `<a-select-option />` 组件应该对应的是 `<SelectOption />` ，因此是这样按需导入：

```ts
import { Select, SelectOption } from 'ant-design-vue'
```

可以说， PascalCase 这个命名方式也是目前流行 UI 框架都在使用的命名规范。

#### TypeScript 文件

在 Vue 项目里，虽然 TypeScript 代码可以写在组件里，但由于很多功能实现是可以解耦并复用，所以经常会有专门的目录管理公共方法，这样做也可以避免在一个组件里写出一两千行代码从而导致维护成本提高。

##### libs 文件

笔者习惯将这些方法统一放到 src/libs 目录下，按照业务模块或者功能的相似度，以一个名词或者动词作为文件命名。

例如常用的正则表达式，可以归类到 regexp.ts 里。

```ts
// src/libs/regexp.ts

// 校验手机号格式
export function isMob(phoneNumber: number | string) {
  // ...
}

// 校验电子邮箱格式
export function isEmail(email: string) {
  // ...
}

// 校验网址格式
export function isUrl(url: string) {
  // ...
}

// 校验身份证号码格式
export function isIdCard(idCardNumber: string) {
  // ...
}

// 校验银行卡号码格式
export function isBankCard(bankCardNumber: string) {
  // ...
}
```

统一使用命名导出，这样一个 TS 文件就像一个 npm 包一样，在使用的时候就可以从这个 “包” 里面导出各种要用到的方法直接使用，无需在组件里重复编写判断逻辑。

```ts
import { isMob, isEmail } from '@libs/regexp'
```

其他诸如常用到的短信验证 sms.ts 、登录逻辑 login.ts 、数据格式转换 format.ts 都可以像这样单独抽出来封装，这种与业务解耦的封装方式非常灵活，以后不同项目如果也有类似的需求，就可以直接拿过去复用了！

##### types 文件

对于经常用到的 TypeScript 类型，也可以抽离成公共文件，笔者习惯在 src/types 目录管理公共类型，统一使用 `.ts` 作为扩展名并在里面导出 TS 类型，而不使用 `.d.ts` 这个类型声明文件。

这样做的好处是在使用到相应类型时，可以通过 `import type` 显式导入，在后期的项目维护过程中，可以很明确的知道类型来自于哪里，并且更接近从 npm 包里导入类型使用的开发方式。

例如上文配置路由的例子里，就是从 Vue Router 里导入了路由的类型：

```ts{2}
// src/router/routes.ts
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // ...
]

export default routes
```

在 types 目录下，可以按照业务模块创建多个模块文件分别维护不同的 TS 类型，并统一在 index.ts 里导出：

```bash
src
└─types
  │ # 入口文件
  ├─index.ts
  │ # 管理不同业务的公共类型
  ├─user.ts
  ├─game.ts
  └─news.ts
```

例如 game.ts 可以维护经常用到的游戏业务相关类型，其中为了避免和其他模块命名冲突，以及一眼可以看出是来自哪个业务的类型，可以统一使用业务模块的名称作为前缀。

```ts
// src/types/game.ts

// 游戏公司信息
export interface GameCompany {
  // ...
}

// 游戏信息
export interface GameInfo {
  id: number
  name: string
  gameCompany: GameCompany
  // ...
}
```

将该模块的所有类型在 index.ts 里全部导出：

```ts
// src/types/index.ts
export * from './game'
```

在组件里就可以这样使用该类型：

```ts
// 可以从 `types` 里统一导入，而不必明确到 `types/game`
import type { GameInfo } from '@/types'

const game: GameInfo = {
  id: 1,
  name: 'Contra',
  gameCompany: {},
}
console.log(game)
```

TS 类型都遵循 PascalCase 命名风格，方便和声明的变量作为区分，大部分情况下一看到 `GameInfo` 就知道是类型，而 `gameInfo` 则是一个变量。

### 代码命名技巧

在编写 JavaScript / TypeScript 时，为变量和函数的命名也是新手开发者容易花费比较多时间的一件事情，笔者也分享自己常用的命名套路，可以大幅度降低命名的思考时间，而且可以体现一定的语义化。

#### 变量的命名

首先笔者遵循变量只使用 camelCase 小驼峰风格的基本原则，并且根据不同的类型，搭配不同的命名前缀或后缀。

对于 `string` 字符串类型，使用相关的名词命名即可。

```ts
import { ref } from 'vue'

// 用户名
const username = ref<string>('Petter')

// 职业
const profession = ref<string>('Front-end Engineer')
```

对于 `number` 数值类型，除了一些本身可以代表数字的名词，例如年龄 `age` 、秒数 `seconds` ，其他的情况可以搭配后缀命名，常用的后缀有 `Count` 、 `Number` 、 `Size` 、 `Amount` 等和单位有关的名词。

```ts
import { ref } from 'vue'

// 最大数量
const maxCount = ref<number>(100)

// 页码
const pageNumber = ref<number>(1)

// 每页条数
const pageSize = ref<number>(10)

// 折扣金额
const discountAmount = ref<number>(50)
```

对于 `boolean` 布尔值类型，可搭配 `is` 、 `has` 等 Be 动词或判断类的动词作为前缀命名，并视情况搭配行为动词和目标名词，或者直接使用一些状态形容词。

```ts
import { ref } from 'vue'

// 是否显示弹窗
const isShowDialog = ref<boolean>(false)

// 用户是否为 VIP 会员
const isVIP = ref<boolean>(true)

// 用户是否有头像
const hasAvatar = ref<boolean>(true)

// 是否被禁用
const disabled = ref<boolean>(true)

// 是否可见
const visible = ref<boolean>(true)
```

之所以要搭配 `is` 开头，是为了和函数区分，例如 `showDialog()` 是显示弹窗的方法，而 `isShowDialog` 才是一个布尔值用于逻辑判断。

对于数组，通常使用名词的复数形式，或者名词加上 `List` 结尾作为命名，数组通常会有原始数据类型的数组，也有 JSON 对象数组，笔者习惯对前者使用名词复数，对后者使用 `List` 结尾。

```ts
import { ref } from 'vue'

// 每个 Item 都是字符串
const tags = ref<string>(['食物', '粤菜', '卤水'])

// 每个 Item 都是数值
const tagIds = ref<number>([1, 2, 3])

// 每个 Item 都是 JSON 对象
const memberList = ref<Member[]>([
  {
    id: 1,
    name: 'Petter',
  },
  {
    id: 2,
    name: 'Marry',
  },
])
```

如果是作为函数的入参，通常也遵循变量的命名规则。

除非是一些代码量很少的操作，可以使用 `i` 、 `j` 等单个字母的变量名，例如提交接口参数时，经常只需要提交一个 ID 数组，从 JSON 数组里提取 ID 数组时就可以使用这种简短命名。

```ts
// `map` 的参数命名就可以使用 `i` 这种简短命名
const ids = dataList.map((i) => i.id)
```

#### 函数的命名

函数的命名也是只使用 camelCase 小驼峰风格，通常根据该函数是同步操作还是异步操作，使用不同的动词前缀。

获取数据的函数，通常使用 `get` 、 `query` 、 `read` 等代表会返回数据的动词作为前缀，如果还是觉得很难确定使用哪一个，可以统一使用 `get` ，也可以根据函数的操作性质来决定：

- 如果是同步操作，不涉及接口请求，使用 `get` 作为前缀
- 如果是需要从 API 接口查询数据的异步操作，使用 `query` 作为前缀
- 如果是 Node.js 程序这种需要进行文件内容读取的场景，就使用 `read`

```ts
// 从本地存储读取数据
// 因为是同步操作，所以使用 `get` 前缀
function getLoginInfo() {
  try {
    const info = localStorage.getItem('loginInfo')
    return info ? JSON.parse(info) : null
  } catch (e) {
    return null
  }
}

// 从接口查询数据
// 因为是异步操作，需要去数据库查数据，所以使用 `query` 前缀
async function queryMemberInfo(id: number) {
  try {
    const res = await fetch(`https://example.com/api/member/${id}`)
    const json = await res.json()
    return json
  } catch (e) {
    return null
  }
}
```

修改数据的函数，通常使用 `save` 、 `update` 、 `delete` 等会变更数据的动词作为前缀，一般情况下：

- 数据存储可以统一使用 `save`
- 如果要区分新建或者更新操作，可以对新建操作使用 `create` ，对更新操作使用 `update`
- 删除使用 `delete` 或 `remove`
- 如果是 Node.js 程序需要对文件写入内容，使用 `write`
- 表单验证合法性等场景，可以使用 `verify` 或 `check`
- 切换可见性可以用 `show` 和 `hide` ，如果是写在一个函数里，可以使用 `toggle`
- 发送验证码、发送邮件等等可以使用 `send`
- 打开路由、打开外部 URL 可以使用 `open`

当然以上只是一些常用到的命名技巧建议，对于简单的业务，例如一个 H5 活动页面，也可以在同步操作时使用 `set` 表示可以直接设置，在异步操作时使用 `save` 表示需要提交保存。

```ts
// 将数据保存至本地存储
// 因为是同步操作，所以使用 `set` 前缀
function setLoginInfo(info: LoginInfo) {
  try {
    localStorage.setItem('loginInfo', JSON.stringify(info))
    return true
  } catch (e) {
    return false
  }
}

// 将数据通过接口保存到数据库
// 因为是异步操作，所以使用 `save` 前缀
async function saveMemberInfo(id: number, data: MemberDTO) {
  try {
    const res = await fetch(`https://example.com/api/member/${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    const json = await res.json()
    return json.code === 200
  } catch (e) {
    return false
  }
}
```

Class 类上的方法和函数命名规则一样，但 Class 本身使用 PascalCase 命名法，代表这是一个类，在调用的时候需要 `new` 。

```ts
// 类使用 PascalCase 命名法
class Hello {
  name: string

  constructor(name: string) {
    this.name = name
  }

  say() {
    console.log(`Hello ${this.name}`)
  }
}

const hello = new Hello('World')
hello.say() // Hello World
```

希望曾经在命名上有过困扰的开发者，不再有此烦恼，编写代码更加高效率！

<!-- 评论 -->
<ClientOnly>
  <GitalkComment
    :issueId="118"
  />
</ClientOnly>
<!-- 评论 -->
