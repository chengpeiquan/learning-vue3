# 高效开发

:::danger
2021.07.05 补充：在当前最新的 `3.1.4` 版本，部分 API 已被舍弃，以下内容仅适用于 `3.1.2` 版本以下，请留意！近期会更新本章节内容以适应最新版本的 Vue 3.x
:::

可能很多同学（包括我）刚上手 Vue 3.0 之后，都会觉得开发过程似乎变得更繁琐了，Vue 官方团队当然不会无视群众的呼声，如果你基于脚手架和 .vue 文件开发，那么可以享受到更高效率的开发体验。

:::tip
在阅读这篇文章之前，需要对 Vue 3.0 的单组件有一定的了解，如果还处于完全没有接触过的阶段，请先抽点时间阅读 [单组件的编写](component.md) 一章。
:::

截止至 2021-03-21 ，以下方案仍然属于实验性方案，所以在官方文档上还暂时看不到使用说明，期间可能还会有一些功能调整和 BUG 修复。

:::warning
所以要体验以下新特性，请保证项目下 package.json 里的 vue 和 @vue/compiler-sfc 都在 v3.0.6 版本以上，最好同步 NPM 上当前最新的 @next 版本（这两个依赖必须保持同样的版本号）。
:::

## script-setup{new}

这是一个比较有争议的新特性，作为 setup 函数的语法糖，褒贬不一，不过经历了几次迭代之后，目前在体验上来说，感受还是非常棒的。

### 新特性的产生背景

在了解它怎么用之前，可以先了解一下它被推出的一些背景，可以帮助你对比开发体验上的异同点，以及了解为什么会有这一章节里面的新东西。

在 Vue 3.0 的 .vue 组件里，遵循 SFC 规范要求（注：SFC，即 Single-File Component，.vue 单组件），标准的 setup 用法是，在 setup 里面定义的数据如果需要在 template 使用，都需要 return 出来。

如果你使用的是 TypeScript ，还需要借助 [defineComponent](component.md#了解-definecomponent) 来帮助你对类型的自动推导。

```vue
<!-- 标准组件格式 -->
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    // ...

    return {
      // ...
    }
  }
})
</script>
```

关于标准 setup 和 defineComponent 的说明和用法，可以查阅 [全新的 setup 函数](component.md#全新的-setup-函数-new) 一节。

script-setup 的推出是为了让熟悉 3.0 的用户可以更高效率的开发组件，减少一些心智负担，只需要给 script 标签添加一个 setup 属性，那么整个 script 就直接会变成 setup 函数，所有顶级变量、函数，均会自动暴露给模板使用（无需再一个个 return 了）。

Vue 会通过单组件编译器，在编译的时候将其处理回标准组件，所以目前这个方案只适合用 .vue 文件写的工程化项目。

```vue
<!-- 使用 script-setup 格式 -->
<script setup lang="ts">
  // ...
</script>
```

对，就是这样，代码量瞬间大幅度减少……

:::tip
因为 script-setup 的大部分功能在书写上和标准版是一致的，这里只提及一些差异化的表现。
:::

### 变化：template 调用变量

标准组件模式下，setup 里定义的变量，需要 return 后，在 template 部分才可以正确拿到：

```vue
<!-- 标准组件格式 -->
<template>
  <p>{{ msg }}</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    const msg: string = 'Hello World!';
    
    // 要给 template 用的数据需要 return 出来才可以
    return {
      msg
    }
  }
})
</script>
```

在 script-setup 模式下，你定义了就可以直接使用。

```vue
<!-- 使用 script-setup 格式 -->
<template>
  <p>{{ msg }}</p>
</template>

<script setup lang="ts">
const msg: string = 'Hello World!';
</script>
```

### 变化：子组件的挂载

子组件的挂载，在原来的写法是需要 import 后再放到 components 里才能够启用：

```vue
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
    Child
  },

  // 组件里的业务代码
  setup () {
    // ...
  }
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

### 变化：props 的接收

由于整个 script 都变成了一个大的 setup function ，没有了组件选项，也没有了 setup 入参，所以没办法和标准写法一样去接收 props 了。

这里需要使用一个全新的 API ：`defineProps` 。

`defineProps` 是一个方法，内部返回一个对象，也就是挂载到这个组件上的所有 props ，它和普通的 props 用法一样，如果不指定为 prop， 则传下来的属性会被放到 attrs 那边去。

:::tip
前置知识点：[接收 props - 组件之间的通信](communication.md#接收-props)。
:::

### defineProps 的基础用法

所以，如果只是单纯在 template 里使用，那么其实就这么简单定义就可以了：

```ts
import { defineProps } from 'vue'

defineProps([
  'name',
  'userInfo',
  'tags'
])
```

使用 `string[]` 数组作为入参，把 prop 的名称作为数组的 item 传给 `defineProps` 就可以了。

:::tip
记得从 vue 导入 `defineProps` 噢，下面的代码就不重复 import 啦！！！
:::

如果 script 里的方法要拿到 props 的值，你也可以使用字面量定义：

```ts
const props = defineProps([
  'name',
  'userInfo',
  'tags'
])

console.log(props.name);
```

但在作为一个 Vue 老玩家，都清楚不显性的指定 prop 类型的话，很容易在协作中引起程序报错，那么应该如何对每个 prop 进行类型检查呢？

有两种方式来处理类型定义。

### 通过构造函数检查 prop

这是第一种方式：使用 JavaScript 原生构造函数进行类型规定。

也就是跟我们平时定义 prop 类型时一样， Vue 会通过 `instanceof` 来进行 [类型检查](https://v3.cn.vuejs.org/guide/component-props.html#%E7%B1%BB%E5%9E%8B%E6%A3%80%E6%9F%A5) 。

使用这种方法，需要通过一个 “对象” 入参来传递给 `defineProps` ，比如：

```ts
defineProps({
  name: String,
  userInfo: Object,
  tags: Array
});
```

所有原来 props 具备的校验机制，都可以适用，比如你除了要限制类型外，还想指定 `name` 是可选，并且带有一个默认值：

```ts
defineProps({
  name: {
    type: String,
    required: false,
    default: 'Petter'
  },
  userInfo: Object,
  tags: Array
});
```

更多的 props 校验机制，可以点击 [带有类型限制的 props](communication.md#%E5%B8%A6%E6%9C%89%E7%B1%BB%E5%9E%8B%E9%99%90%E5%88%B6%E7%9A%84-props) 和 [可选以及带有默认值的 props](communication.md#%E5%8F%AF%E9%80%89%E4%BB%A5%E5%8F%8A%E5%B8%A6%E6%9C%89%E9%BB%98%E8%AE%A4%E5%80%BC%E7%9A%84-props) 了解更多。

### 使用类型注解检查 prop

这是第二种方式：使用 TypeScript 的类型注解。

和 ref 等 API 的用法一样，`defineProps` 也是可以使用尖括号 <> 来包裹类型定义，紧跟在 API 后面，另外，由于 `defineProps` 返回的是一个对象（因为 props 本身是一个对象），所以尖括号里面的类型还要用大括号包裹，通过 `key: value` 的键值对形式表示，如：

```ts
defineProps<{ name: string }>();
```

注意到了吗？这里使用的类型，和第一种方法提到的指定类型时是不一样的。

:::tip
在这里，不再使用构造函数校验，而是需要遵循使用 TypeScript 的类型，比如字符串是 `string`，而不是 `String` 。
:::

如果有多个 prop ，就跟写 interface 一样：

```ts
defineProps<{
  name: string;
  phoneNumber: number;
  userInfo: object;
  tags: string[];
}>();
```

其中，举例里的 `userInfo` 是一个对象，你可以简单的指定为 object，也可以先定义好它对应的类型，再进行指定：

```ts
interface UserInfo {
  id: number;
  age: number;
}

defineProps<{
  name: string;
  userInfo: UserInfo;
}>();
```

如果你想对某个数据设置为可选，也是遵循 TS 规范，通过英文问号 `?` 来允许可选：

```ts
// name 是可选
defineProps<{
  name?: string;
  tags: string[];
}>();
```

如果你想设置可选参数的默认值，这个暂时不支持，不能跟 TS 一样指定默认值，在 RFC 的文档里也有说明目前无法指定。

>Unresolved questions: Providing props default values when using type-only props declaration.

不过如果你确实需要默认指定，并且无需保留响应式的话，我自己测试是可以按照 ES6 的参数默认值方法指定：

```ts
const { name = 'Petter' } = defineProps<{
  name?: string;
  tags: string[];
}>();
```

这样如果传入了 name 则按传入的数据，否则就按默认值，但是，有个但是，就是这样 name 就会失去响应性（因为响应式数据被解构后会变回普通数据），请注意这一点！

:::warning
需要强调的一点是：在 [构造函数](#通过构造函数检查-prop) 和 [类型注解](#使用类型注解检查-prop) 这两种校验方式只能二选一，不能同时使用，否则会引起程序报错
:::

### 变化：emits 的接收

和 props 一样，emits 的接收也是需要使用一个全新的 API 来操作，这个 API 就是 `defineEmit` 。

和 `defineProps` 一样， `defineEmit` 也是一个方法，它接受的入参格式和标准组件的要求是一致的。

:::tip
注意：`defineProps` 是复数结尾，带有 s，`defineEmit` 没有！

前置知识点：[接收 emits - 组件之间的通信](communication.md#接收-emits)。
:::

### defineEmit 的基础用法

由于 emit 并非提供给模板直接读取，所以需要通过字面量来定义 emits。

最基础的用法也是传递一个 `string[]` 数组进来，把每个 emit 的名称作为数组的 item 。

```ts
// 获取 emit
const emit = defineEmit(['chang-name']);

// 调用 emit
emit('chang-name', 'Tom');
```

由于 `defineEmit` 的用法和原来的 emits 选项差别不大，这里也不重复说明更多的诸如校验之类的用法了，可以查看 [接收 emits](communication.md#接收-emits) 一节了解更多。

### 变化：context 的接收

在标准组件写法里，setup 函数默认支持两个入参：

参数|类型|含义
:--|:--|:--
props|object|由父组件传递下来的数据
context|object|组件的执行上下文

这里的第二个参数 `context` ，是一个普通的对象，它暴露三个组件的 property ：

属性|类型|作用
:--|:--|:--
attrs|非响应式对象|props 未定义的属性都将变成 attrs
slots|非响应式对象|插槽
emit|方法|触发事件

在 script-setup 写法里，就需要通过 `useContext` 来获取。

### useContext 的基础用法

一样的，使用 `useContext` 记得先导入依赖：

```ts
// 导入 useContext 组件
import { useContext } from 'vue'

// 获取 context
const ctx = useContext();

// 打印 attrs
console.log(ctx.attrs);
```

由于 `context` 是一个普通的对象，所以你也可以对它进行解构，直接获取到内部的数据：

```ts
// 直接获取 attrs
const { attrs } = useContext();
```

对于 context 的使用和注意事项，如果不了解的话，可以在 [setup 的参数使用](component.md#setup-%E7%9A%84%E5%8F%82%E6%95%B0%E4%BD%BF%E7%94%A8) 了解更多。

### 变化：全新的 expose 组件

它也是 context 的一个组件成员，用于显示暴露组件的变量或方法给父组件使用，但为什么之前没有被提及呢？

因为在标准组件写法里，子组件的数据都是默认隐式暴露给父组件的（参见：[DOM 元素与子组件 - 响应式 api 之 ref](component.md#dom-元素与子组件)），用和不用目前来说没有特别大的区别。

但是在 script-setup 模式下，一切都变得相反。

:::tip
在 script-setup 模式下，所有数据只是默认 return 给 template 使用，不会暴露到组件外，所以父组件是无法直接通过挂载 ref 变量获取子组件的数据。

如果要调用子组件的数据，需要先在子组件显示的暴露出来，才能够正确的拿到，这个操作，就是由 `expose` 来完成。
:::

`expose` 的用法非常简单，它本身是一个函数，可以接受一个对象参数。

在子组件里，像这样把需要暴露出去的数据通过 `key: value` 的形式作为入参（下面的例子是用到了 ES6 的 [属性的简洁表示法](https://es6.ruanyifeng.com/#docs/object#%E5%B1%9E%E6%80%A7%E7%9A%84%E7%AE%80%E6%B4%81%E8%A1%A8%E7%A4%BA%E6%B3%95)）：

```vue
<script setup lang="ts">
  // 启用expose组件
  const { expose } = useContext();

  // 定义一个想提供给父组件拿到的数据
  const msg: string = 'Hello World!';

  // 显示暴露的数据，才可以在父组件拿到
  expose({
    msg
  });
</script>
```

然后你在父组件就可以通过挂载在子组件上的 ref 变量，去拿到 expose 出来的数据了。

<!-- 谷歌广告 -->
<ClientOnly>
  <google-adsense />
</ClientOnly>
<!-- 谷歌广告 -->