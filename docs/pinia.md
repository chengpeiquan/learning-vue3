# 全局状态的管理

本来这部分打算放在 [组件之间的通信](communication.html#vuex-new) 里，里面也简单介绍了一下 Vuex ，但 Pinia 作为被官方推荐在 Vue 3 项目里作为全局状态管理的新工具，写着写着我觉得还是单独开一章来写会更方便阅读和理解。

官方推出的全局状态管理工具目前有 [Vuex](https://vuex.vuejs.org/zh/) 和 [Pinia](https://pinia.vuejs.org/) ，两者的作用和用法都比较相似，但 Pinia 的设计更贴近 Vue 3 组合式 API 的用法。

## 关于 Pinia{new}

由于 Vuex 4.x 版本只是个过渡版，Vuex 4 对 TypeScript 和 Composition API 都不是很友好，虽然官方团队在 GitHub 已有讨论 [Vuex 5](https://github.com/vuejs/rfcs/discussions/270) 的开发提案，但从 2022-02-07 在 Vue 3 被设置为默认版本开始， Pinia 已正式被官方推荐作为全局状态管理的工具。

Pinia 支持 Vue 3 和 Vue 2 ，对 TypeScript 也有很完好的支持，延续本指南的宗旨，我们在这里只介绍基于 Vue 3 和 TypeScript 的用法。

点击访问：[Pinia 官网](https://pinia.vuejs.org/)

## 安装和启用{new}

Pinia 目前还没有被广泛的默认集成在各种脚手架里，所以如果你原来创建的项目没有 Pinia ，则需要手动安装它。

```bash
# 需要 cd 到你的项目目录下
npm install pinia
```

查看你的 package.json ，看看里面的 `dependencies` 是否成功加入了 Pinia 和它的版本号（下方是示例代码，以实际安装的最新版本号为准）：

```json
{
  "dependencies": {
    "pinia": "^2.0.11",
  },
}
```

然后打开 `src/main.ts` 文件，添加下面那两行有注释的新代码：

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia' // 导入 Pinia

createApp(App)
  .use(createPinia()) // 启用 Pinia
  .mount('#app')
```

到这里， Pinia 就集成到你的项目里了。

## 状态树的结构{new}

在开始写代码之前，我们先来看一个对比，直观的了解 Pinia 的状态树构成，才能在后面的环节更好的理解每个功能的用途。

鉴于可能有部分同学之前没有用过 Vuex ，所以我加入了 Vue 组件一起对比（ Options API 写法）。

作用|Vue Component|Vuex|Pinia
:-:|:-:|:-:|:-:
数据管理|data|state|state
数据计算|computed|getters|getters
行为方法|methods|mutations / actions|actions

可以看到 Pinia 的结构和用途都和 Vuex 与 Component 非常相似，并且 Pinia 相对于 Vuex ，在行为方法部分去掉了 mutations （同步操作）和 actions （异步操作）的区分，更接近组件的结构，入门成本会更低一些。

下面我们来创建一个简单的 Store ，开始用 Pinia 来进行状态管理。

## 创建 Store{new}

和 Vuex 一样， Pinia 的核心也是称之为 Store 。

参照 Pinia 官网推荐的项目管理方案，我们也是先在 `src` 文件夹下创建一个 `stores` 文件夹，并在里面添加一个 `index.ts` 文件，然后我们就可以来添加一个最基础的 Store 。

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

另外可以看到我把导出的函数名命名为 `useStore` ，以 `use` 开头是 Vue 3 对可组合函数的一个命名规范。

并且使用的是 `export const` 而不是 `export default` （详见：[命名导出和默认导出](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export)），这样在使用的时候可以和其他的 Vue 组合函数保持一致，都是通过 `import { xxx } from 'xxx'` 来导入。

如果你有多个 Store ，可以分模块管理，并根据实际的功能用途进行命名（ e.g. `useMessageStore`  、 `useUserStore`  、 `useGameStore` … ）。

## 管理 state{new}

### 给 Store 添加 state

在上一小节的 [状态树的结构](#状态树的结构-new) 这里我们已经了解过， Pinia 是在 `state` 里面定义状态数据。它也是通过一个函数的形式来返回数据。

```ts
// src/stores/index.ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  // 我们先定义一个最基本的 message 数据
  state: () => ({
    message: 'Hello World',
  }),
  // ...
})
```

另外需要注意一点，如果不显式 return ，箭头函数的返回值需要用圆括号 `()` 套起来，这个是箭头函数的要求（详见：[返回对象字面量](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions#返回对象字面量)）。

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

我个人还是更喜欢加圆括号的简写方式。

:::tip
为了能够正确的推导 TypeScript 类型， `state` 必须是一个箭头函数。
:::

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

所以，你可以直接通过 `store.message` 直接调用 state 里的数据。

```ts
import { defineComponent } from 'vue'
import { useStore } from '@/stores'

export default defineComponent({
  setup() {
    // 像 useRouter 那样定义一个变量拿到实例
    const store = useStore()

    // 直接通过实例来获取数据
    console.log(store.message)

    // 这种方式你需要把整个 store 给到 template 去渲染数据
    return {
      store,
    }
  },
})
```

但一些比较复杂的数据这样写会很长，所以有时候更推荐用 [computed API](#使用-computed-api) 和 [storeToRefs API](#使用-storetorefs-api) 两种方式来获取。

在数据更新方面，在 Pinia 可以直接通过 Store 实例更新 state （这一点与 Vuex 有明显的不同，[更改 Vuex 的 store 中的状态的唯一方法是提交 mutation](https://vuex.vuejs.org/zh/guide/mutations.html)），所以如果你要更新 `message` ，只需要像下面这样，就可以更新 `message` 的值了！

```ts
store.message = 'New Message.'
```

#### 使用 computed API

现在 state 里已经有我们定义好的数据了，下面这段代码是在 Vue 组件里导入我们的 Store ，并通过计算数据 `computed` 拿到里面的 `message` 数据传给 template 使用。

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

如果你要更新数据怎么办？

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

通过这个方式拿到的 `message` 变量是一个 [Ref](component.md#响应式-api-之-ref-new) 类型的数据，所以你可以像普通的 ref 变量一样进行读取和赋值。

```ts
// 直接赋值即可
message.value = 'New Message.'

// store 上的数据已成功变成了 New Message.
console.log(store.message)
```

#### 使用 toRefs API

如 [使用 storeToRefs API](#使用-storetorefs-api) 部分所说，该 API 本身的设计就是类似于 [toRefs](component.md#响应式-api-之-toref-与-torefs-new) ，所以你也可以直接用 toRefs 把 state 上的数据转成 ref 变量。

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

另外，像上面这样，对 store 执行 toRefs 会把 store 上面的 getters 、 actions 也一起提取，如果你只需要提取 state 上的数据，可以这样做：

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

## 管理 getters{new}

### 给 Store 添加 getter

在 [状态树的结构](#状态树的结构) 了解过， Pinia 的 `getters` 是用来计算数据。

:::tip
如果对 Vue 的计算数据不是很熟悉或者没接触过的话，可以先阅读 [数据的计算](component.md#数据的计算-new) 这一节，以便有个初步印象，不会云里雾里。
:::

#### 添加普通的 getter

我们继续用刚才的 `message` ，来定义一个 Getter ，用于返回一句拼接好的句子。

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

和 [Options API 的 Computed](component.md#回顾-2-x-1) 写法一样，也是通过函数来返回计算后的值，但在 Pinia ，只能使用箭头函数，通过入参的 `state` 来拿到当前实例的数据。

#### 添加引用 getter 的 getter

有时候你可能要引用另外一个 getter 的值来返回数据，这个时候不能用箭头函数了，需要定义成普通函数而不是箭头函数，并在函数内部通过 `this` 来调用当前 Store 上的数据和方法。

我们继续在上面的例子里，添加多一个 `emojiMessage` 的 getter ，在返回 `fullMessage` 的结果的同时，拼接多一串 emoji 。

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

如果你只写 JavaScript ，可能对这一条所说的限制觉得很奇怪，事实上用 JS 写箭头函数来引用确实不会报错，但如果你用的是 TypeScript ，不按照这个写法，在 VSCode 提示和执行 TSC 检查的时候都会给你抛出一条错误：

```bash
src/stores/index.ts:9:42 - error TS2339: Property 'fullMessage' does not exist on type '{ message: string; } & {}'.

9     emojiMessage: (state) => `🎉 ${state.fullMessage}`,
                                           ~~~~~~~~~~~


Found 1 error in src/stores/index.ts:9
```

另外关于普通函数的 TS 返回类型，官方建议显示的进行标注，就像这个例子里的 `emojiMessage(): string` 里的 `: string` 。

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

这种情况下，这个 getter 只是调用的函数的作用，不再有缓存，如果你通过变量定义了这个数据，那么这个变量也只是普通变量，不具备响应性。

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

## 管理 actions{new}

### 给 Store 添加 action

你可以为当前 Store 封装一些可以开箱即用的方法，支持同步和异步。

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
          this.message = newMessage
          resolve('Async done.')
        }, 3000)
      })
    },
    // 同步更新 message
    updateMessageSync(newMessage: string): string {
      this.message = newMessage
      return 'Sync done.'
    },
  },
})
```

### 调用 action

像普通的函数一样使用即可。

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

## 添加多个 Store{new}

到这里，对单个 Store 的配置和调用都已经清楚了吧，实际项目中会涉及到很多数据操作，还可以用多个 Store 来维护不同需求模块的数据状态。

### 目录结构建议

### 在 Vue 组件 / TS 文件里使用

### Store 之间互相引用

## 和 Vuex 的对比
