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

但在作为一个 Vue 老玩家，都清楚不显性的指定 props 的类型很容易在协作中引起程序报错，那么应该如何对每个 prop 进行类型检查呢？

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

<!-- 谷歌广告 -->
<ClientOnly>
  <GoogleAdsense />
</ClientOnly>
<!-- 谷歌广告 -->

<!-- 评论 -->
<ClientOnly>
  <GitalkComment
    :issueId="118"
  />
</ClientOnly>
<!-- 评论 -->
