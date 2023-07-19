---
outline: 'deep'
---

# 全局状态管理

本来这部分打算放在 [组件之间的通信](communication.html#vuex-new) 里，里面也简单介绍了一下 Vuex ，但 Pinia 作为被官方推荐在 Vue 3 项目里作为全局状态管理的新工具，写着写着笔者认为还是单独开一章来写会更方便阅读和理解。

官方推出的全局状态管理工具目前有 [Vuex](https://vuex.vuejs.org/zh/) 和 [Pinia](https://pinia.vuejs.org/) ，两者的作用和用法都比较相似，但 Pinia 的设计更贴近 Vue 3 组合式 API 的用法。

:::tip
本章内的大部分内容都会和 Vuex 作对比，方便从 Vuex 项目向 Pinia 的迁移。
:::

## 关于 Pinia ~new

由于 Vuex 4.x 版本只是个过渡版，Vuex 4 对 TypeScript 和 Composition API 都不是很友好，虽然官方团队在 GitHub 已有讨论 [Vuex 5](https://github.com/vuejs/rfcs/discussions/270) 的开发提案，但从 2022-02-07 在 Vue 3 被设置为默认版本开始， Pinia 已正式被官方推荐作为全局状态管理的工具。

Pinia 支持 Vue 3 和 Vue 2 ，对 TypeScript 也有很完好的支持，延续本指南的宗旨，在这里只介绍基于 Vue 3 和 TypeScript 的用法。

点击访问：[Pinia 官网](https://pinia.vuejs.org/)

## 安装和启用 ~new

Pinia 目前还没有被广泛的默认集成在各种脚手架里，所以如果原来创建的项目没有 Pinia ，则需要手动安装它。

```bash
# 需要 cd 到的项目目录下
npm install pinia
```

查看的 package.json ，看看里面的 `dependencies` 是否成功加入了 Pinia 和它的版本号（下方是示例代码，以实际安装的最新版本号为准）：

```json
{
  "dependencies": {
    "pinia": "^2.0.11"
  }
}
```

然后打开 `src/main.ts` 文件，添加下面那两行有注释的新代码：

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia' // 导入 Pinia
import App from '@/App.vue'

createApp(App)
  .use(createPinia()) // 启用 Pinia
  .mount('#app')
```

到这里， Pinia 就集成到的项目里了。

:::tip
也可以通过 [Create Preset](upgrade.md#create-preset) 创建新项目（选择 `vue` 技术栈进入，选择 [vue3-ts-vite](https://github.com/awesome-starter/vue3-ts-vite-starter) 模板），可以得到一个集成常用配置的项目启动模板，该模板现在使用 Pinia 作为全局状态管理工具。
:::

## 状态树的结构 ~new

在开始写代码之前，先来看一个对比，直观的了解 Pinia 的状态树构成，才能在后面的环节更好的理解每个功能的用途。

鉴于可能有部分开发者之前没有用过 Vuex ，所以加入了 Vue 组件一起对比（ Options API 写法）。

|   作用   | Vue Component |        Vuex         |  Pinia  |
| :------: | :-----------: | :-----------------: | :-----: |
| 数据管理 |     data      |        state        |  state  |
| 数据计算 |   computed    |       getters       | getters |
| 行为方法 |    methods    | mutations / actions | actions |

可以看到 Pinia 的结构和用途都和 Vuex 与 Component 非常相似，并且 Pinia 相对于 Vuex ，在行为方法部分去掉了 mutations （同步操作）和 actions （异步操作）的区分，更接近组件的结构，入门成本会更低一些。

下面来创建一个简单的 Store ，开始用 Pinia 来进行状态管理。

## 创建 Store ~new

和 Vuex 一样， Pinia 的核心也是称之为 Store 。

参照 Pinia 官网推荐的项目管理方案，也是先在 `src` 文件夹下创建一个 `stores` 文件夹，并在里面添加一个 `index.ts` 文件，然后就可以来添加一个最基础的 Store 。

Store 是通过 `defineStore` 方法来创建的，它有两种入参形式：

### 形式 1 ：接收两个参数

接收两个参数，第一个参数是 Store 的唯一 ID ，第二个参数是 Store 的选项：

```ts
// src/stores/index.ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  // Store 选项...
})
```

### 形式 2 ：接收一个参数

接收一个参数，直接传入 Store 的选项，但是需要把唯一 ID 作为选项的一部分一起传入：

```ts
// src/stores/index.ts
import { defineStore } from 'pinia'

export const useStore = defineStore({
  id: 'main',
  // Store 选项...
})
```

:::tip
不论是哪种创建形式，都必须为 Store 指定一个唯一 ID 。
:::

另外可以看到这里把导出的函数名命名为 `useStore` ，以 `use` 开头是 Vue 3 对可组合函数的一个命名约定。

并且使用的是 `export const` 而不是 `export default` （详见：[命名导出和默认导出](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export)），这样在使用的时候可以和其他的 Vue 组合函数保持一致，都是通过 `import { xxx } from 'xxx'` 来导入。

如果有多个 Store ，可以分模块管理，并根据实际的功能用途进行命名（ e.g. `useMessageStore` 、 `useUserStore` 、 `useGameStore` … ）。

## 管理 state ~new

在上一小节的 [状态树的结构](#状态树的结构-new) 这里已经了解过， Pinia 是在 `state` 里面定义状态数据。

### 给 Store 添加 state

它是通过一个箭头函数的形式来返回数据，并且能够正确的帮推导 TypeScript 类型：

```ts
// src/stores/index.ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  // 先定义一个最基本的 message 数据
  state: () => ({
    message: 'Hello World',
  }),
  // ...
})
```

需要注意一点的是，如果不显式 return ，箭头函数的返回值需要用圆括号 `()` 套起来，这个是箭头函数的要求（详见：[返回对象字面量](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions#返回对象字面量)）。

所以相当于这样写：

```ts
// ...
export const useStore = defineStore('main', {
  state: () => {
    return {
      message: 'Hello World',
    }
  },
  // ...
})
```

笔者还是更喜欢加圆括号的简写方式。

:::tip
可能有开发者会问： Vuex 可以用一个对象来定义 state 的数据， Pinia 可以吗？

答案是：不可以！ state 的类型必须是 `state?: (() => {}) | undefined` ，要么不配置（就是 undefined ），要么只能是个箭头函数。
:::

### 手动指定数据类型

虽然 Pinia 会帮推导 TypeScript 的数据类型，但有时候可能不太够用，比如下面这段代码，请留意代码注释的说明：

```ts
// ...
export const useStore = defineStore('main', {
  state: () => {
    return {
      message: 'Hello World',
      // 添加了一个随机消息数组
      randomMessages: [],
    }
  },
  // ...
})
```

`randomMessages` 的预期应该是一个字符串数组 `string[]` ，但是这个时候 Pinia 会帮推导成 `never[]` ，那么类型就对不上了。

这种情况下就需要手动指定 randomMessages 的类型，可以通过 `as` 来指定：

```ts
// ...
export const useStore = defineStore('main', {
  state: () => {
    return {
      message: 'Hello World',
      // 通过 as 关键字指定 TS 类型
      randomMessages: [] as string[],
    }
  },
  // ...
})
```

或者使用尖括号 `<>` 来指定：

```ts
// ...
export const useStore = defineStore('main', {
  state: () => {
    return {
      message: 'Hello World',
      // 通过尖括号指定 TS 类型
      randomMessages: <string[]>[],
    }
  },
  // ...
})
```

这两种方式是等价的。

### 获取和更新 state

获取 state 有多种方法，略微有区别（详见下方各自的说明），但相同的是，他们都是响应性的。

:::warning
不能直接通过 ES6 解构的方式（ e.g. `const { message } = store` ），那样会破坏数据的响应性。
:::

#### 使用 store 实例

用法上和 Vuex 很相似，但有一点区别是，数据直接是挂在 `store` 上的，而不是 `store.state` 上面！

:::tip
e.g. Vuex 是 `store.state.message` ， Pinia 是 `store.message` 。
:::

所以，可以直接通过 `store.message` 直接调用 state 里的数据。

```ts
import { defineComponent } from 'vue'
import { useStore } from '@/stores'

export default defineComponent({
  setup() {
    // 像 useRouter 那样定义一个变量拿到实例
    const store = useStore()

    // 直接通过实例来获取数据
    console.log(store.message)

    // 这种方式需要把整个 store 给到 template 去渲染数据
    return {
      store,
    }
  },
})
```

但一些比较复杂的数据这样写会很长，所以有时候更推荐用下面介绍的 [computed API](#使用-computed-api) 和 [storeToRefs API](#使用-storetorefs-api) 等方式来获取。

在数据更新方面，在 Pinia 可以直接通过 Store 实例更新 state （这一点与 Vuex 有明显的不同，[更改 Vuex 的 store 中的状态的唯一方法是提交 mutation](https://vuex.vuejs.org/zh/guide/mutations.html)），所以如果要更新 `message` ，只需要像下面这样，就可以更新 `message` 的值了！

```ts
store.message = 'New Message.'
```

#### 使用 computed API

现在 state 里已经有定义好的数据了，下面这段代码是在 Vue 组件里导入的 Store ，并通过计算数据 `computed` 拿到里面的 `message` 数据传给 template 使用。

```vue
<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from '@/stores'

export default defineComponent({
  setup() {
    // 像 useRouter 那样定义一个变量拿到实例
    const store = useStore()

    // 通过计算拿到里面的数据
    const message = computed(() => store.message)
    console.log('message', message.value)

    // 传给 template 使用
    return {
      message,
    }
  },
})
</script>
```

和 [使用 store 实例](#使用-store-实例) 以及 [使用 storeToRefs API](#使用-storetorefs-api) 不同，这个方式默认情况下无法直接更新 state 的值。

:::tip
这里的定义的 `message` 变量是一个只有 getter ，没有 setter 的 [ComputedRef](component.md#类型定义) 数据，所以它是只读的。
:::

如果要更新数据怎么办？

1. 可以通过提前定义好的 Store Actions 方法进行更新。

2. 在定义 computed 变量的时候，配置好 [setter](component.md#setter-的使用) 的行为：

```ts
// 其他代码和上一个例子一样，这里省略...

// 修改：定义 computed 变量的时候配置 getter 和 setter
const message = computed({
  // getter 还是返回数据的值
  get: () => store.message,
  // 配置 setter 来定义赋值后的行为
  set(newVal) {
    store.message = newVal
  },
})

// 此时不再抛出 Write operation failed: computed value is readonly 的警告
message.value = 'New Message.'

// store 上的数据已成功变成了 New Message.
console.log(store.message)
```

#### 使用 storeToRefs API

Pinia 还提供了一个 `storeToRefs` API 用于把 state 的数据转换为 `ref` 变量。

这是一个专门为 Pinia Stores 设计的 API ，类似于 [toRefs](component.md#响应式-api-之-toref-与-torefs-new) ，区别在于，它会忽略掉 Store 上面的方法和非响应性的数据，只返回 state 上的响应性数据。

```ts
import { defineComponent } from 'vue'
import { useStore } from '@/stores'

// 记得导入这个 API
import { storeToRefs } from 'pinia'

export default defineComponent({
  setup() {
    const store = useStore()

    // 通过 storeToRefs 来拿到响应性的 message
    const { message } = storeToRefs(store)
    console.log('message', message.value)

    return {
      message,
    }
  },
})
```

通过这个方式拿到的 `message` 变量是一个 [Ref](component.md#响应式-api-之-ref-new) 类型的数据，所以可以像普通的 ref 变量一样进行读取和赋值。

```ts
// 直接赋值即可
message.value = 'New Message.'

// store 上的数据已成功变成了 New Message.
console.log(store.message)
```

#### 使用 toRefs API

如 [使用 storeToRefs API](#使用-storetorefs-api) 部分所说，该 API 本身的设计就是类似于 [toRefs](component.md#响应式-api-之-toref-与-torefs-new) ，所以也可以直接用 toRefs 把 state 上的数据转成 ref 变量。

```ts
// 注意 toRefs 是 vue 的 API ，不是 Pinia
import { defineComponent, toRefs } from 'vue'
import { useStore } from '@/stores'

export default defineComponent({
  setup() {
    const store = useStore()

    // 跟 storeToRefs 操作都一样，只不过用 Vue 的这个 API 来处理
    const { message } = toRefs(store)
    console.log('message', message.value)

    return {
      message,
    }
  },
})
```

详见 [使用 toRefs](component.md#使用-torefs) 一节的说明，可以像普通的 ref 变量一样进行读取和赋值。

另外，像上面这样，对 store 执行 toRefs 会把 store 上面的 getters 、 actions 也一起提取，如果只需要提取 state 上的数据，可以这样做：

```ts
// 只传入 store.$state
const { message } = toRefs(store.$state)
```

#### 使用 toRef API

toRef 是 toRefs 的兄弟 API ，一个是只转换一个字段，一个是转换所有字段，所以它也可以用来转换 state 数据变成 ref 变量。

```ts
// 注意 toRef 是 vue 的 API ，不是 Pinia
import { defineComponent, toRef } from 'vue'
import { useStore } from '@/stores'

export default defineComponent({
  setup() {
    const store = useStore()

    // 遵循 toRef 的用法即可
    const message = toRef(store, 'message')
    console.log('message', message.value)

    return {
      message,
    }
  },
})
```

详见 [使用 toRef](component.md#使用-toref) 一节的说明，可以像普通的 ref 变量一样进行读取和赋值。

#### 使用 actions 方法

在 Vuex ，如果想通过方法来操作 state 的更新，必须通过 mutation 来提交；而异步操作需要更多一个步骤，必须先通过 action 来触发 mutation ，非常繁琐！

Pinia 所有操作都集合为 action ，无需区分同步和异步，按照平时的函数定义即可更新 state ，具体操作详见 [管理 actions](#管理-actions-new) 一节。

### 批量更新 state

在 [获取和更新 state](#获取和更新-state) 部分说的都是如何修改单个 state 数据，那么有时候要同时修改很多个，会显得比较繁琐。

如果写过 React 或者微信小程序，应该非常熟悉这些用法：

```ts
// 下面不是 Vue 的代码，不要在的项目里使用

// React
this.setState({
  foo: 'New Foo Value',
  bar: 'New bar Value',
})

// 微信小程序
this.setData({
  foo: 'New Foo Value',
  bar: 'New bar Value',
})
```

Pinia 也提供了一个 `$patch` API 用于同时修改多个数据，它接收一个参数：

|     参数     |    类型     |            语法            |
| :----------: | :---------: | :------------------------: |
| partialState | 对象 / 函数 | store.$patch(partialState) |

#### 传入一个对象

当参数类型为对象时，`key` 是要修改的 state 数据名称， `value` 是新的值（支持嵌套传值），用法如下：

```ts
// 继续用前面的数据，这里会打印出修改前的值
console.log(JSON.stringify(store.$state))
// 输出 {"message":"Hello World","randomMessages":[]}

/**
 * 注意这里，传入了一个对象
 */
store.$patch({
  message: 'New Message',
  randomMessages: ['msg1', 'msg2', 'msg3'],
})

// 这里会打印出修改后的值
console.log(JSON.stringify(store.$state))
// 输出 {"message":"New Message","randomMessages":["msg1","msg2","msg3"]}
```

对于简单的数据，直接修改成新值是非常好用的。

但有时候并不单单只是修改，而是要对数据进行拼接、补充、合并等操作，相对而言开销就会很大，这种情况下，更适合 [传入一个函数](#传入一个函数) 来处理。

:::tip
使用这个方式时， `key` 只允许是实例上已有的数据，不可以提交未定义的数据进去。

强制提交的话，在 TypeScript 会抛出错误， JavaScript 虽然不会报错，但实际上， Store 实例上面依然不会有这个新增的非法数据。
:::

#### 传入一个函数

当参数类型为函数时，该函数会有一个入参 `state` ，是当前实例的 state ，等价于 store.$state ，用法如下：

```ts
// 这里会打印出修改前的值
console.log(JSON.stringify(store.$state))
// 输出 {"message":"Hello World","randomMessages":[]}

/**
 * 注意这里，这次是传入了一个函数
 */
store.$patch((state) => {
  state.message = 'New Message'

  // 数组改成用追加的方式，而不是重新赋值
  for (let i = 0; i < 3; i++) {
    state.randomMessages.push(`msg${i + 1}`)
  }
})

// 这里会打印出修改后的值
console.log(JSON.stringify(store.$state))
// 输出 {"message":"New Message","randomMessages":["msg1","msg2","msg3"]}
```

和 [传入一个对象](#传入一个对象) 比，不一定说就是哪种方式更好，通常要结合业务场景合理使用。

:::tip
使用这个方式时，和 [传入一个对象](#传入一个对象) 一样只能修改已定义的数据，并且另外需要注意，传进去的函数只能是同步函数，不可以是异步函数！

如果还不清楚什么是同步和异步，可以阅读 [同步和异步 JavaScript - MDN](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Asynchronous/Introducing) 一文。
:::

### 全量更新 state

在 [批量更新 state](#批量更新-state) 了解到可以用 `store.$patch` 方法对数据进行批量更新操作，不过如其命名，这种方式本质上是一种 “补丁更新” 。

虽然可以对所有数据都执行一次 “补丁更新” 来达到 “全量更新” 的目的，但 Pinia 也提供了一个更好的办法。

从前面多次提到 state 数据可以通过 `store.$state` 来拿到，而这个属性本身是可以直接赋值的。

还是继续用上面的例子， state 上现在有 `message` 和 `randomMessages` 这两个数据，那么要全量更新为新的值，就这么操作：

```ts
store.$state = {
  message: 'New Message',
  randomMessages: ['msg1', 'msg2', 'msg3'],
}
```

同样的，必须遵循 state 原有的数据和对应的类型。

:::tip
该操作不会使 state 失去响应性。
:::

### 重置 state

Pinia 提供了一个 `$reset` API 挂在每个实例上面，用于重置整颗 state 树为初始数据：

```ts
// 这个 store 是上面定义好的实例
store.$reset()
```

具体例子：

```ts
// 修改数据
store.message = 'New Message'
console.log(store.message) // 输出 New Message

// 3s 后重置状态
setTimeout(() => {
  store.$reset()
  console.log(store.message) // 输出最开始的 Hello World
}, 3000)
```

### 订阅 state

和 Vuex 一样， Pinia 也提供了一个用于订阅 state 的 `$subscribe` API 。

#### 订阅 API 的 TS 类型

在了解这个 API 的使用之前，先看一下它的 TS 类型定义：

```ts
// $subscribe 部分的 TS 类型
// ...
$subscribe(
  callback: SubscriptionCallback<S>,
  options?: { detached?: boolean } & WatchOptions
): () => void
// ...
```

可以看到， `$subscribe` 可以接受两个参数：

1. 第一个入参是 callback 函数，必传
2. 第二个入参是一些选项，可选

同时还会返回一个函数，执行后可以用于移除当前订阅，下面来看看具体用法。

#### 添加订阅

`$subscribe` API 的功能类似于 [watch](component.md#watch) ，但它只会在 state 被更新的时候才触发一次，并且在组件被卸载时删除（参考：[组件的生命周期](component.md#组件的生命周期-new)）。

从 [订阅 API 的 TS 类型](#订阅-api-的-ts-类型) 可以看到，它可以接受两个参数，第一个参数是必传的 callback 函数，一般情况下默认用这个方式即可，使用例子：

```ts
// 可以在 state 出现变化时，更新本地持久化存储的数据
store.$subscribe((mutation, state) => {
  localStorage.setItem('store', JSON.stringify(state))
})
```

这个 callback 里面有 2 个入参：

|   入参   |        作用        |
| :------: | :----------------: |
| mutation | 本次事件的一些信息 |
|  state   |  当前实例的 state  |

其中 mutation 包含了以下数据：

|  字段   | 值                                                                                                                                                                                                         |
| :-----: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| storeId | 发布本次订阅通知的 Pinia 实例的唯一 ID（由 [创建 Store](#创建-store-new) 时指定）                                                                                                                          |
|  type   | 有 3 个值：返回 `direct` 代表 [直接更改](#获取和更新-state) 数据；返回 `patch object` 代表是通过 [传入一个对象](#传入一个对象) 更改；返回 `patch function` 则代表是通过 [传入一个函数](#传入一个函数) 更改 |
| events  | 触发本次订阅通知的事件列表                                                                                                                                                                                 |
| payload | 通过 [传入一个函数](#传入一个函数) 更改时，传递进来的荷载信息，只有 `type` 为 `patch object` 时才有                                                                                                        |

如果不希望组件被卸载时删除订阅，可以传递第二个参数 options 用以保留订阅状态，传入一个对象。

可以简单指定为 `{ detached: true }` ：

```ts
store.$subscribe(
  (mutation, state) => {
    // ...
  },
  { detached: true }
)
```

也可以搭配 watch API 的选项一起用。

#### 移除订阅

在 [添加订阅](#添加订阅) 部分已了解过，默认情况下，组件被卸载时订阅也会被一并移除，但如果之前启用了 `detached` 选项，就需要手动取消了。

前面在 [订阅 API 的 TS 类型](#订阅-api-的-ts-类型) 里提到，在启用 `$subscribe` API 之后，会有一个函数作为返回值，这个函数可以用来取消该订阅。

用法非常简单，做一下简单了解即可：

```ts
// 定义一个退订变量，它是一个函数
const unsubscribe = store.$subscribe(
  (mutation, state) => {
    // ...
  },
  { detached: true }
)

// 在合适的时期调用它，可以取消这个订阅
unsubscribe()
```

跟 watch API 的机制非常相似， 它也是返回 [一个取消侦听的函数](component.md#取消侦听) 用于移除指定的 watch 。

## 管理 getters ~new

在 [状态树的结构](#状态树的结构) 了解过， Pinia 的 `getters` 是用来计算数据的。

### 给 Store 添加 getter

:::tip
如果对 Vue 的计算数据不是很熟悉或者没接触过的话，可以先阅读 [数据的计算](component.md#数据的计算-new) 这一节，以便有个初步印象，不会云里雾里。
:::

#### 添加普通的 getter

继续用刚才的 `message` ，来定义一个 Getter ，用于返回一句拼接好的句子。

```ts
// src/stores/index.ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    message: 'Hello World',
  }),
  // 定义一个 fullMessage 的计算数据
  getters: {
    fullMessage: (state) => `The message is "${state.message}".`,
  },
  // ...
})
```

和 [Options API 的 Computed](component.md#回顾-vue-2-3) 写法一样，也是通过函数来返回计算后的值， Getter 可以通过入参的 `state` 来拿到当前实例的数据（在 Pinia 里，官方更推荐使用箭头函数）。

#### 添加引用 getter 的 getter

有时候可能要引用另外一个 getter 的值来返回数据，这个时候不能用箭头函数了，需要定义成普通函数而不是箭头函数，并在函数内部通过 `this` 来调用当前 Store 上的数据和方法。

继续在上面的例子里，添加多一个 `emojiMessage` 的 getter ，在返回 `fullMessage` 的结果的同时，拼接多一串 emoji 。

```ts
export const useStore = defineStore('main', {
  state: () => ({
    message: 'Hello World',
  }),
  getters: {
    fullMessage: (state) => `The message is "${state.message}".`,
    // 这个 getter 返回了另外一个 getter 的结果
    emojiMessage(): string {
      return `🎉🎉🎉 ${this.fullMessage}`
    },
  },
})
```

如果只写 JavaScript ，可能对这一条所说的限制觉得很奇怪，事实上用 JS 写箭头函数来引用确实不会报错，但如果用的是 TypeScript ，不按照这个写法，在 VSCode 提示和执行 TSC 检查的时候都会给抛出一条错误：

```bash
src/stores/index.ts:9:42 - error TS2339:
Property 'fullMessage' does not exist on type '{ message: string; } & {}'.

9     emojiMessage: (state) => `🎉🎉🎉 ${state.fullMessage}`,
                                           ~~~~~~~~~~~


Found 1 error in src/stores/index.ts:9
```

另外关于普通函数的 TS 返回类型，官方建议显式的进行标注，就像这个例子里的 `emojiMessage(): string` 里的 `: string` 。

#### 给 getter 传递参数

getter 本身是不支持参数的，但和 Vuex 一样，支持返回一个具备入参的函数，用来满足需求。

```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    message: 'Hello World',
  }),
  getters: {
    // 定义一个接收入参的函数作为返回值
    signedMessage: (state) => {
      return (name: string) => `${name} say: "The message is ${state.message}".`
    },
  },
})
```

调用的时候是这样：

```ts
const signedMessage = store.signedMessage('Petter')
console.log('signedMessage', signedMessage)
// Petter say: "The message is Hello World".
```

这种情况下，这个 getter 只是调用的函数的作用，不再有缓存，如果通过变量定义了这个数据，那么这个变量也只是普通变量，不具备响应性。

```ts
// 通过变量定义一个值
const signedMessage = store.signedMessage('Petter')
console.log('signedMessage', signedMessage)
// Petter say: "The message is Hello World".

// 2s 后改变 message
setTimeout(() => {
  store.message = 'New Message'

  // signedMessage 不会变
  console.log('signedMessage', signedMessage)
  // Petter say: "The message is Hello World".

  // 必须这样再次执行才能拿到更新后的值
  console.log('signedMessage', store.signedMessage('Petter'))
  // Petter say: "The message is New Message".
}, 2000)
```

### 获取和更新 getter

getter 和 state 都属于数据管理，读取和赋值的方法是一样的，请参考上方 [获取和更新 state](#获取和更新-state-new) 一节的内容。

## 管理 actions ~new

在 [状态树的结构](#状态树的结构) 提到了， Pinia 只需要用 `actions` 就可以解决各种数据操作，无需像 Vuex 一样区分为 `mutations / actions` 两大类。

### 给 Store 添加 action

可以为当前 Store 封装一些可以开箱即用的方法，支持同步和异步。

```ts
// src/stores/index.ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    message: 'Hello World',
  }),
  actions: {
    // 异步更新 message
    async updateMessage(newMessage: string): Promise<string> {
      return new Promise((resolve) => {
        setTimeout(() => {
          // 这里的 this 是当前的 Store 实例
          this.message = newMessage
          resolve('Async done.')
        }, 3000)
      })
    },
    // 同步更新 message
    updateMessageSync(newMessage: string): string {
      // 这里的 this 是当前的 Store 实例
      this.message = newMessage
      return 'Sync done.'
    },
  },
})
```

可以看到，在 action 里，如果要访问当前实例的 state 或者 getter ，只需要通过 `this` 即可操作，方法的入参完全不再受 Vuex 那样有固定形式的困扰。

:::tip
在 action 里， `this` 是当前的 Store 实例，所以如果的 action 方法里有其他函数也要调用实例，请记得写成 [箭头函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions) 来提升 this 。
:::

### 调用 action

在 Pinia 中只要像普通的函数一样使用即可，**不需要**和 Vuex 一样调用 commit 或者 dispatch。

```ts
export default defineComponent({
  setup() {
    const store = useStore()
    const { message } = storeToRefs(store)

    // 立即执行
    console.log(store.updateMessageSync('New message by sync.'))

    // 3s 后执行
    store.updateMessage('New message by async.').then((res) => console.log(res))

    return {
      message,
    }
  },
})
```

## 添加多个 Store ~new

到这里，对单个 Store 的配置和调用相信都已经清楚了，实际项目中会涉及到很多数据操作，还可以用多个 Store 来维护不同需求模块的数据状态。

这一点和 Vuex 的 [Module](https://vuex.vuejs.org/zh/guide/modules.html) 比较相似，目的都是为了避免状态树过于臃肿，但用起来会更为简单。

### 目录结构建议

建议统一存放在 `src/stores` 下面管理，根据业务需要进行命名，比如 `user` 就用来管理登录用户相关的状态数据。

```bash
src
└─stores
  │ # 入口文件
  ├─index.ts
  │ # 多个 store
  ├─user.ts
  ├─game.ts
  └─news.ts
```

里面暴露的方法就统一以 `use` 开头加上文件名，并以 `Store` 结尾，作为小驼峰写法，比如 `user` 这个 Store 文件里面导出的函数名就是：

```ts
// src/stores/user.ts
export const useUserStore = defineStore('user', {
  // ...
})
```

然后以 `index.ts` 里作为统一的入口文件， `index.ts` 里的代码写为：

```ts
export * from './user'
export * from './game'
export * from './news'
```

这样在使用的时候，只需要从 `@/stores` 里导入即可，无需写完整的路径，例如，只需要这样：

```ts
import { useUserStore } from '@/stores'
```

而无需这样：

```ts
import { useUserStore } from '@/stores/user'
```

### 在 Vue 组件 / TS 文件里使用

这里以一个比较简单的业务场景举例，希望能够方便的理解如何同时使用多个 Store 。

假设目前有一个 `userStore` 是管理当前登录用户信息， `gameStore` 是管理游戏的信息，而 “个人中心” 这个页面需要展示 “用户信息” ，以及 “该用户绑定的游戏信息”，那么就可以这样：

```ts
import { defineComponent, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
// 这里导入要用到的 Store
import { useUserStore, useGameStore } from '@/stores'
import type { GameItem } from '@/types'

export default defineComponent({
  setup() {
    // 先从 userStore 获取用户信息（已经登录过，所以可以直接拿到）
    const userStore = useUserStore()
    const { userId, userName } = storeToRefs(userStore)

    // 使用 gameStore 里的方法，传入用户 ID 去查询用户的游戏列表
    const gameStore = useGameStore()
    const gameList = ref<GameItem[]>([])
    onMounted(async () => {
      gameList.value = await gameStore.queryGameList(userId.value)
    })

    return {
      userId,
      userName,
      gameList,
    }
  },
})
```

再次提醒，切记每个 Store 的 ID 必须不同，如果 ID 重复，在同一个 Vue 组件 / TS 文件里定义 Store 实例变量的时候，会以先定义的为有效值，后续定义的会和前面一样。

如果先定义了 userStore :

```ts
// 假设两个 Store 的 ID 一样
const userStore = useUserStore() // 是想要的 Store
const gameStore = useGameStore() // 得到的依然是 userStore 的那个 Store
```

如果先定义了 gameStore :

```ts
// 假设两个 Store 的 ID 一样
const gameStore = useGameStore() // 是想要的 Store
const userStore = useUserStore() // 得到的依然是 gameStore 的那个 Store
```

### Store 之间互相引用

如果在定义一个 Store 的时候，要引用另外一个 Store 的数据，也是很简单，回到那个 message 的例子，添加一个 getter ，它会返回一句问候语欢迎用户：

```ts
// src/stores/message.ts
import { defineStore } from 'pinia'

// 导入用户信息的 Store 并启用它
import { useUserStore } from './user'
const userStore = useUserStore()

export const useMessageStore = defineStore('message', {
  state: () => ({
    message: 'Hello World',
  }),
  getters: {
    // 这里就可以直接引用 userStore 上面的数据了
    greeting: () => `Welcome, ${userStore.userName}!`,
  },
})
```

假设现在 `userName` 是 Petter ，那么会得到一句对 Petter 的问候：

```ts
const messageStore = useMessageStore()
console.log(messageStore.greeting) // Welcome, Petter!
```

## 专属插件的使用 ~new

Pinia 拥有非常灵活的可扩展性，有专属插件可以开箱即用满足更多的需求场景。

### 如何查找插件

插件有统一的命名格式 `pinia-plugin-*` ，所以可以在 npmjs 上搜索这个关键词来查询目前有哪些插件已发布。

点击查询： [pinia-plugin - npmjs](https://www.npmjs.com/search?q=pinia-plugin)

### 如何使用插件

这里以 [pinia-plugin-persistedstate](https://www.npmjs.com/package/pinia-plugin-persistedstate) 为例，这是一个让数据持久化存储的 Pinia 插件。

:::tip
数据持久化存储，指页面关闭后再打开，浏览器依然可以记录之前保存的本地数据，例如：浏览器原生的 [localStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage) 和 [IndexedDB](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API) ，或者是一些兼容多种原生方案并统一用法的第三方方案，例如： [localForage](https://github.com/localForage/localForage) 。
:::

插件也是独立的 npm 包，需要先安装，再激活，然后才能使用。

激活方法会涉及到 Pinia 的初始化过程调整，这里不局限于某一个插件，通用的插件用法如下（请留意代码注释）：

```ts{4-5,7-8,11}
// src/main.ts
import { createApp } from 'vue'
import App from '@/App.vue'
import { createPinia } from 'pinia' // 导入 Pinia
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // 导入 Pinia 插件

const pinia = createPinia() // 初始化 Pinia
pinia.use(piniaPluginPersistedstate) // 激活 Pinia 插件

createApp(App)
  .use(pinia) // 启用 Pinia ，这一次是包含了插件的 Pinia 实例
  .mount('#app')
```

#### 使用前

Pinia 默认在页面刷新时会丢失当前变更的数据，没有在本地做持久化记录：

```ts
// 其他代码省略
const store = useMessageStore()

// 假设初始值是 Hello World
setTimeout(() => {
  // 2s 后变成 Hello World!
  store.message = store.message + '!'
}, 2000)

// 页面刷新后又变回了 Hello World
```

#### 使用后

按照 persistedstate 插件的文档说明，在其中一个 Store 启用它，只需要添加一个 `persist: true` 的选项即可开启：

```ts{14-15}
// src/stores/message.ts
import { defineStore } from 'pinia'
import { useUserStore } from './user'

const userStore = useUserStore()

export const useMessageStore = defineStore('message', {
  state: () => ({
    message: 'Hello World',
  }),
  getters: {
    greeting: () => `Welcome, ${userStore.userName}`,
  },
  // 这是按照插件的文档，在实例上启用了该插件，这个选项是插件特有的
  persist: true,
})
```

回到的页面，现在这个 Store 具备了持久化记忆的功能了，它会从 localStorage 读取原来的数据作为初始值，每一次变化后也会将其写入 localStorage 进行记忆存储。

```ts
// 其他代码省略
const store = useMessageStore()

// 假设初始值是 Hello World
setTimeout(() => {
  // 2s 后变成 Hello World!
  store.message = store.message + '!'
}, 2000)

// 页面刷新后变成了 Hello World!!
// 再次刷新后变成了 Hello World!!!
// 再次刷新后变成了 Hello World!!!!
```

可以在浏览器查看到 localStorage 的存储变化，以 Chrome 浏览器为例，按 F12 ，打开 Application 面板，选择 Local Storage ，可以看到以当前 Store ID 为 Key 的存储数据。

这是其中一个插件使用的例子，更多的用法请根据自己选择的插件的 README 说明操作。

<!-- 评论 -->
<ClientOnly>
  <GitalkComment
    :issueId="152"
  />
</ClientOnly>
<!-- 评论 -->
