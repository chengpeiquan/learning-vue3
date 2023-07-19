---
outline: 'deep'
---

# 组件之间的通信

经过前面几章的阅读，相信开发者已经可以搭建一个基础的 Vue 3 项目了！

但实际业务开发过程中，还会遇到一些组件之间的通信问题，父子组件通信、兄弟组件通信、爷孙组件通信，还有一些全局通信的场景。

:::tip
这一章节的内容，Vue 3 对比 Vue 2 的变化都比较大！
:::

这一章就按使用场景来划分对应的章节吧，在什么场景下遇到问题，也方便快速找到对应的处理办法。

| 通信场景     | 快速定位                  |
| :----------- | :------------------------ |
| 父子组件通信 | [点击查看](#父子组件通信) |
| 爷孙组件通信 | [点击查看](#爷孙组件通信) |
| 兄弟组件通信 | [点击查看](#兄弟组件通信) |
| 全局组件通信 | [点击查看](#全局组件通信) |

## 父子组件通信

父子组件通信是指，B 组件引入到 A 组件里渲染，此时 A 是 B 的父级；B 组件的一些数据需要从 A 组件拿，B 组件有时也要告知 A 组件一些数据变化情况。

他们之间的关系如下， Child.vue 是直接挂载在 Father.vue 下面：

```bash
# 父组件
Father.vue
│ # 子组件
└─Child.vue
```

常用的方法有：

| 方案             | 父组件向子组件 | 子组件向父组件 | 对应章节传送门                 |
| :--------------- | :------------- | :------------- | :----------------------------- |
| props / emits    | props          | emits          | [点击查看](#props-emits)       |
| v-model / emits  | v-model        | emits          | [点击查看](#v-model-emits)     |
| ref / emits      | ref            | emits          | [点击查看](#ref-emits)         |
| provide / inject | provide        | inject         | [点击查看](#provide-inject)    |
| EventBus         | emit / on      | emit / on      | [点击查看](#eventbus-new)      |
| Reative State    | -              | -              | [点击查看](#reative-state-new) |
| Vuex             | -              | -              | [点击查看](#vuex-new)          |
| Pinia            | -              | -              | [点击查看](pinia.md)           |

为了方便阅读，下面的父组件统一叫 Father.vue ，子组件统一叫 Child.vue 。

:::warning
在 Vue 2 ，有的开发者可能喜欢用 `$attrs / $listeners` 来进行通信，但该方案在 Vue 3 已经移除了，详见 [移除 $listeners](https://v3-migration.vuejs.org/zh/breaking-changes/listeners-removed.html) 。
:::

## props / emits

这是 Vue 跨组件通信最常用，也是基础的一个方案，它的通信过程是：

1. 父组件 Father.vue 通过 props 向子组件 Child.vue 传值
2. 子组件 Child.vue 则可以通过 emits 向父组件 Father.vue 发起事件通知

最常见的场景就是统一在父组件发起 AJAX 请求，拿到数据后，再根据子组件的渲染需要传递不同的 props 给不同的子组件使用。

### 下发 props

> 注：这一小节的步骤是在 Father.vue 里操作。

下发的过程是在 Father.vue 里完成的，父组件在向子组件下发 props 之前，需要导入子组件并启用它作为自身的模板，然后在 `setup` 里处理好数据并 return 给 `<template />` 用。

在 Father.vue 的 `<script />` 里：

```ts
// Father.vue
import { defineComponent } from 'vue'
import Child from '@cp/Child.vue'

interface Member {
  id: number
  name: string
}

export default defineComponent({
  // 需要启用子组件作为模板
  components: {
    Child,
  },

  // 定义一些数据并 `return` 给 `<template />` 用
  setup() {
    const userInfo: Member = {
      id: 1,
      name: 'Petter',
    }

    // 不要忘记 `return` ，否则 `<template />` 拿不到数据
    return {
      userInfo,
    }
  },
})
```

然后在 Father.vue 的 `<template />` 这边拿到 return 出来的数据，把要传递的数据通过属性的方式绑定在组件标签上。

```vue
<!-- Father.vue -->
<template>
  <Child
    title="用户信息"
    :index="1"
    :uid="userInfo.id"
    :user-name="userInfo.name"
  />
</template>
```

这样就完成了 props 数据的下发。

在 `<template />` 绑定属性这里，如果是普通的字符串，比如上面的 `title`，则直接给属性名赋值就可以。

如果是变量名，或者其他类型如 `number` 、 `boolean` 等，比如上面的 `index`，则需要通过属性动态绑定的方式来添加，使用 `v-bind:` 或者 `:` 符号进行绑定。

另外官方文档推荐对 camelCase 风格（小驼峰）命名的 props ，在绑定时使用和 HTML attribute 一样的 kebab-case 风格（短横线），例如使用 `user-name` 代替 `userName` 传递，详见官网的 [传递 prop 的细节](https://cn.vuejs.org/guide/components/props.html#prop-passing-details) 一节。

### 接收 props

> 注：这一小节的步骤是在 Child.vue 里操作。

接收的过程是在 Child.vue 里完成的，在 `<script />` 部分，子组件通过与 `setup` 同级的 props 来接收数据。

它可以是一个 `string[]` 数组，把要接受的变量名放到这个数组里，直接放进来作为数组的 `item` ：

```ts
// Child.vue
export default defineComponent({
  props: ['title', 'index', 'userName', 'uid'],
})
```

但这种情况下，使用者不知道这些属性的使用限制，例如是什么类型的值、是否必传等等。

### 带有类型限制的 props

> 注：这一小节的步骤是在 Child.vue 里操作。

和 TypeScript 一样，类型限制可以为程序带来更好的健壮性， Vue 的 props 也支持增加类型限制。

相对于传递一个 `string[]` 类型的数组，更推荐的方式是把 props 定义为一个对象，以对象形式列出，每个 Property 的名称和值分别是各自的名称和类型，只有合法的类型才允许传入。

:::tip
注意，和 TS 的类型定义不同， props 这里的类型，首字母需要大写，也就是 JavaScript 的基本类型。
:::

支持的类型有：

| 类型     | 含义                                    |
| :------- | :-------------------------------------- |
| String   | 字符串                                  |
| Number   | 数值                                    |
| Boolean  | 布尔值                                  |
| Array    | 数组                                    |
| Object   | 对象                                    |
| Date     | 日期数据，e.g. `new Date()`             |
| Function | 函数，e.g. 普通函数、箭头函数、构造函数 |
| Promise  | Promise 类型的函数                      |
| Symbol   | Symbol 类型的值                         |

了解了基本的类型限制用法之后，接下来给 props 加上类型限制：

```ts
// Child.vue
export default defineComponent({
  props: {
    title: String,
    index: Number,
    userName: String,
    uid: Number,
  },
})
```

现在如果传入不正确的类型，程序就会抛出警告信息，告知开发者必须正确传值。

如果需要对某个 Prop 允许多类型，比如这个 `uid` 字段，可能是数值，也可能是字符串，那么可以在类型这里，使用一个数组，把允许的类型都加进去。

```ts{9-10}
// Child.vue
export default defineComponent({
  props: {
    // 单类型
    title: String,
    index: Number,
    userName: String,

    // 这里使用了多种类型
    uid: [Number, String],
  },
})
```

### 可选以及带有默认值的 props

> 注：这一小节的步骤是在 Child.vue 里操作。

所有 props 默认都是可选的，如果不传递具体的值，则默认值都是 `undefined` ，可能引起程序运行崩溃， Vue 支持对可选的 props 设置默认值，也是通过对象的形式配置 props 的选项。

其中支持配置的选项有：

| 选项      | 类型     | 含义                                                                                                                        |
| :-------- | :------- | :-------------------------------------------------------------------------------------------------------------------------- |
| type      | string   | 类型                                                                                                                        |
| required  | boolean  | 是否必传， `true` 代表必传， `false` 代表可选                                                                               |
| default   | any      | 与 `type` 选项的类型相对应的默认值，如果 `required` 选项是 `false` ，但这里不设置默认值，则会默认为 `undefined`             |
| validator | function | 自定义验证函数，需要 return 一个布尔值， `true` 代表校验通过， `false` 代表校验不通过，当校验不通过时，控制台会抛出警告信息 |

了解了配置选项后，接下来再对 props 进行改造，将其中部分选项设置为可选，并提供默认值：

```ts
// Child.vue
export default defineComponent({
  props: {
    // 可选，并提供默认值
    title: {
      type: String,
      required: false,
      default: '默认标题',
    },

    // 默认可选，单类型
    index: Number,

    // 添加一些自定义校验
    userName: {
      type: String,

      // 在这里校验用户名必须至少 3 个字
      validator: (v) => v.length >= 3,
    },

    // 默认可选，但允许多种类型
    uid: [Number, String],
  },
})
```

### 使用 props ~new

> 注：这一小节的步骤是在 Child.vue 里操作。

在 `<template />` 部分， Vue 3 的使用方法和 Vue 2 是一样的，比如要渲染父组件传入的 props ：

```vue
<!-- Child.vue -->
<template>
  <p>标题：{{ title }}</p>
  <p>索引：{{ index }}</p>
  <p>用户id：{{ uid }}</p>
  <p>用户名：{{ userName }}</p>
</template>
```

但是 `<script />` 部分，变化非常大！

在 Vue 2 里，只需要通过 `this.uid` 、 `this.userName` 就可以使用父组件传下来的 Prop ，但是 Vue 3 没有了 `this` ，所以是通过 `setup` 的入参进行操作。

```ts{11-13}
// Child.vue
export default defineComponent({
  props: {
    title: String,
    index: Number,
    userName: String,
    uid: Number,
  },

  // 在这里需要添加一个入参
  setup(props) {
    // 该入参包含了当前组件定义的所有 props
    console.log(props)
  },
})
```

关于 Setup 函数的第一个入参 `props` ：

1. 该入参包含了当前组件定义的所有 props （如果父组件 Father.vue 传进来的数据在 Child.vue 里未定义，不仅不会拿到，并且在控制台会有警告信息）。
2. 该入参可以随意命名，比如可以写成一个下划线 `_` ，通过 `_.uid` 也可以拿到数据，但是语义化命名是一个良好的编程习惯。
3. 该入参具备响应性，父组件修改了传递下来的值，子组件也会同步得到更新，因此请不要直接解构，可以通过 [toRef 或 toRefs](component.md#响应式-api-之-toref-与-torefs-new) API 转换为响应式变量

### 传递非 props 的属性

上一小节最后有一句提示是：

> 如果父组件 Father.vue 传进来的数据在 Child.vue 里未定义，不仅不会拿到，并且在控制台会有警告信息。

这种情况虽然无法从 props 里拿到对应的数据，但也不意味着不能传递任何未定义的属性数据，在父组件，除了可以给子组件绑定 props ，还可以根据实际需要去绑定一些特殊的属性。

比如给子组件设置 `class`、`id`，或者 `data-xxx` 之类的一些自定义属性，如果子组件 Child.vue 的 `<template />` 里只有一个根节点，那么这些属性默认会自动继承并渲染在 Node 节点上。

假设当前在子组件 Child.vue 是如下这样只有一个根节点，并且未接收任何 props ：

:::tip
如果已安装 [Vue VSCode Snippets](upgrade.md#vue-vscode-snippets) 这个 VSCode 插件，可以在空的 `.vue` 文件里输入 `v3` ，在出现的代码片段菜单里选择 `vbase-3-ts` 生成一个 Vue 组件的基础代码片段。
:::

```vue{3}
<!-- Child.vue -->
<template>
  <div class="child">子组件</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  },
})
</script>

<style scoped>
.child {
  width: 100%;
}
</style>
```

在 Father.vue 里对 Child.vue 传递了多个属性：

```vue{4-8}
<!-- Father.vue -->
<template>
  <Child
    id="child-component"
    class="class-name-from-father"
    :keys="['foo', 'bar']"
    :obj="{ foo: 'bar' }"
    data-hash="b10a8db164e0754105b7a99be72e3fe5"
  />
</template>
```

回到浏览器，通过 Chrome 的审查元素可以看到子组件 Child.vue 在渲染后，按照 HTML 属性的渲染规则生成了多个属性：

```html{3-7}
<!-- Child.vue 在浏览器里渲染后的 HTML DOM 结构 -->
<div
  class="child class-name-from-father"
  id="child-component"
  keys="foo,bar"
  obj="[object Object]"
  data-hash="b10a8db164e0754105b7a99be72e3fe5"
  data-v-2dcc19c8=""
  data-v-7eb2bc79=""
>
  子组件
</div>
```

:::tip
其中有两个以 `data-v-` 开头的属性是 `<style />` 标签开启了 [Style Scoped](component.md#style-scoped) 功能自动生成的 Hash 值。
:::

可以在 Child.vue 配置 `inheritAttrs` 为 `false` 来屏蔽这些非 props 属性的渲染。

```ts{3}
// Child.vue
export default defineComponent({
  inheritAttrs: false,
  setup() {
    // ...
  },
})
```

关闭了 之后，现在的 DOM 结构如下，只保留了两个由 Style Scoped 生成的 Hash 值：

```html
<!-- Child.vue 在浏览器里渲染后的 HTML DOM 解构 -->
<div class="child" data-v-2dcc19c8="" data-v-7eb2bc79="">子组件</div>
```

这一类非 props 属性通常称之为 attrs 。

刚接触 Vue 的开发者可能容易混淆这两者，确实是非常接近，都是由父组件传递，由子组件接收，支持传递的数据类型也一样，但为什么一部分是在 props 获取，一部分在 attrs 获取呢？笔者给出一个比较容易记忆的方式，不一定特别准确，但相信可以帮助开发者加深两者的区别理解。

根据它们的缩写，其实是可以知道 Prop 是指 Property ，而 Attr 是指 Attribute ，虽然都是 “属性” ，但 Property 更接近于事物本身的属性，因此需要在组件里声明，而 Attribute 更偏向于赋予的属性，因此用于指代父组件传递的其他未被声明为 Property 的属性。

### 获取非 props 的属性 ~new

> 注：这一小节的步骤是在 Child.vue 里操作。

在上一小节 [传递非 props 的属性](#传递非-props-的属性) 已经在父组件 Father.vue 里向子组件 Child.vue 传递了一些 attrs 自定义属性，在子组件里想要拿到这些属性，使用原生 JavaScript 操作是需要通过 [Element.getAttribute()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getAttribute) 方法，但 Vue 提供了更简单的操作方式。

在 Child.vue 里，可以通过 `setup` 的第二个参数 `context` 里的 `attrs` 来获取到这些属性，并且父组件传递了什么类型的值，获取到的也是一样的类型，这一点和使用 `Element.getAttribute()` 完全不同。

```ts
// Child.vue
export default defineComponent({
  setup(props, { attrs }) {
    // `attrs` 是个对象，每个 Attribute 都是它的 `key`
    console.log(attrs.id) // child-component
    console.log(attrs.class) // class-name-from-father

    // 传递数组会被保留类型，不会被转换为 `key1,key2` 这样的字符串
    // 这一点与 `Element.getAttribute()` 完全不同
    console.log(attrs.keys) // ['foo', 'bar']

    // 传递对象也可以正常获取
    console.log(attrs.obj) // {foo: 'bar'}

    // 如果传下来的 Attribute 带有短横线，需要通过这种方式获取
    console.log(attrs['data-hash']) // b10a8db164e0754105b7a99be72e3fe5
  },
})
```

:::tip
子组件不论是否设置 `inheritAttrs` 属性，都可以通过 `attrs` 拿到父组件传递下来的数据，但是如果要使用 `Element.getAttribute()` 则只有当 `inheritAttrs` 为 `true` 的时候才可以，因为此时在 DOM 上才会渲染这些属性。
:::

与 Vue 2 的 `<template />` 只能有一个根节点不同， Vue 3 允许多个根节点，多个根节点的情况下，无法直接继承这些 attrs 属性（在 `inheritAttrs: true` 的情况也下无法默认继承），需要在子组件 Child.vue 里通过 `v-bind` 绑定到要继承在节点上。

可以通过 Vue 实例属性 `$attrs` 或者从 setup 函数里把 `attrs` return 出来使用。

```vue{6-10,17,19-21}
<!-- Child.vue -->
<template>
  <!-- 默认不会继承属性 -->
  <div class="child">不会继承</div>

  <!-- 绑定后可继承， `$attrs` 是一个 Vue 提供的实例属性 -->
  <div class="child" v-bind="$attrs">使用 $attrs 继承</div>

  <!-- 绑定后可继承， `attrs` 是从 `setup` 里 `return` 出来的变量 -->
  <div class="child" v-bind="attrs">使用 attrs 继承</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup(props, { attrs }) {

    return {
      attrs,
    }
  },
})
</script>
```

### 绑定 emits ~new

> 注：这一小节的步骤是在 Father.vue 里操作。

如果父组件 Father.vue 需要获取子组件 Child.vue 的数据更新情况，可以由子组件通过 emits 进行通知，下面这个更新用户年龄的例子可以学习如何给子组件绑定 emit 事件。

事件的逻辑是由父组件决定的，因此需要在父组件 Father.vue 的 `<script />` 里先声明数据变量和一个更新函数，并且这个更新函数通常会有一个入参作为数据的新值接收。

在本例子里，父组件声明了一个 `updateAge` 方法，它接受一个入参 `newAge` ，代表新的年龄数据，这个入参的值将由子组件 Child.vue 在触发 emits 时传入。

因为还需要在 `<template />` 部分绑定给子组件，所以请记得 return 出来。

```ts{22-28,32}
// Father.vue
import { defineComponent, reactive } from 'vue'
import Child from '@cp/Child.vue'

interface Member {
  id: number
  name: string
  age: number
}

export default defineComponent({
  components: {
    Child,
  },
  setup() {
    const userInfo: Member = reactive({
      id: 1,
      name: 'Petter',
      age: 0,
    })

    /**
     * 声明一个更新年龄的方法
     * @param newAge - 新的年龄，由子组件触发 emits 时传递
     */
    function updateAge(newAge: number) {
      userInfo.age = newAge
    }

    return {
      userInfo,
      updateAge,
    }
  },
})
```

再看 Father.vue 的 `<template />` 部分，和 Click 事件使用 `@click` 一样，自定义的 emits 事件也是通过 `v-on` 或者是 `@` 来绑定：

```vue
<!-- Father.vue -->
<template>
  <Child @update-age="updateAge" />
</template>
```

和 props 一样，官方文档也推荐将 camelCase 风格（小驼峰）命名的函数，在绑定时使用 kebab-case 风格（短横线），例如使用 `update-age` 代替 `updateAge` 传递。

### 接收并调用 emits ~new

> 注：这一小节的步骤是在 Child.vue 里操作。

和 props 一样，可以指定是一个数组，把要接收的 `emit` 事件名称写进去：

```ts{3}
// Child.vue
export default defineComponent({
  emits: ['update-age'],
})
```

和 props 不同，通常情况下 emits 这样配置就足够使用了。

接下来如果子组件需要更新数据并通知父组件，可以使用 `setup` 第二个参数 `context` 里的 `emit` 方法触发：

```ts{4-6}
// Child.vue
export default defineComponent({
  emits: ['update-age'],
  setup(props, { emit }) {
    // 通知父组件将年龄设置为 `2`
    emit('update-age', 2)
  },
})
```

`emit` 方法最少要传递一个参数：事件名称。

事件名称是指父组件 Father.vue 绑定事件时 `@update-age="updateAge"` 里的 `update-age` ，如果改成 `@hello="updateAge"` ，那么事件名称就需要使用 `hello` ，一般情况下事件名称和更新函数的名称会保持一致，方便维护。

对于需要更新数据的情况， `emit` 还支持传递更多的参数，对应更新函数里的入参，所以可以看到上面例子里的 `emit('update-age', 2)` 有第二个参数，传递了一个 `2` 的数值，就是作为父组件 `updateAge` 的入参 `newAge` 传递。

如果需要通信的数据很多，建议第二个入参使用一个对象来管理数据，例如父组件调整为：

```ts
// Father.vue
function updateInfo({ name, age }: Member) {
  // 当 `name` 变化时更新 `name` 的值
  if (name && name !== userInfo.name) {
    userInfo.name = name
  }

  // 当 `age` 变化并且新值在正确的范围内时，更新 `age` 的值
  if (age > 0 && age !== userInfo.age) {
    userInfo.age = age
  }
}
```

子组件在传递新数据时，就应该使用对象的形式传递：

```ts
// Child.vue
emit('update-info', {
  name: 'Tom',
  age: 18,
})
```

这对于更新表单等数据量较多的场景非常好用。

### 接收 emits 时做一些校验

> 注：这一小节的步骤是在 Child.vue 里操作。

和 props 一样，子组件在接收 emits 时也可以对这些事件做一些验证，这个时候就需要将 emits 配置为对象，然后把事件名称作为 `key` ， `value` 则对应为一个用来校验的方法。

还是用回上文那个更新年龄的方法，如果需要增加一个条件：当达到成年人的年龄时才会更新父组件的数据，那么就可以将 emits 调整为：

```ts{4-14}
// Child.vue
export default defineComponent({
  emits: {
    // 需要校验
    'update-age': (age: number) => {
      // 写一些条件拦截，返回 `false` 表示验证不通过
      if (age < 18) {
        console.log('未成年人不允许参与')
        return false
      }

      // 通过则返回 `true`
      return true
    },

    // 一些无需校验的，设置为 `null` 即可
    'update-name': null,
  },
})
```

接下来如果提交 `emit('update-age', 2)` ，因为不满足验证条件，浏览器控制台将会出现一段 `[Vue warn]: Invalid event arguments: event validation failed for event "update-age".` 这样的警告信息。

## v-model / emits

相对于 [props / emits](#props-emits) 这一对通信方案，使用 v-model 的方式更为简单：

1. 在 Father.vue ，通过 v-model 向 Child.vue 传值

2. Child.vue 通过自身设定的 emits 向 Father.vue 通知数据更新

v-model 的用法和 props 非常相似，但是很多操作上更为简化，但操作简单带来的 “副作用” ，就是功能上也没有 props 那么多。

### 绑定 v-model ~new

> 注：这一小节的步骤是在 Father.vue 里操作。

和下发 props 的方式类似，都是在子组件上绑定 Father.vue 定义好的数据，这是绑定一个数据的例子：

```vue
<!-- Father.vue -->
<template>
  <Child v-model:username="userInfo.name" />
</template>
```

和 Vue 2 不同， Vue 3 可以直接绑定 v-model ，而无需在子组件指定 [model 选项](https://v2.cn.vuejs.org/v2/api/#model) ，并且 Vue 3 的 v-model 需要使用英文冒号 `:` 指定要绑定的属性名，同时也支持绑定多个 v-model 。

如果要绑定多个数据，写多个 v-model 即可：

```vue
<!-- Father.vue -->
<template>
  <Child
    v-model:uid="userInfo.id"
    v-model:username="userInfo.name"
    v-model:age="userInfo.age"
  />
</template>
```

看到这里应该能明白了，一个 v-model 其实就是一个 prop ，它支持的数据类型和 prop 是一样的，所以子组件在接收数据的时候，完全按照 props 去定义就可以了。

点击回顾：[接收 props](#接收-props) ，了解在 Child.vue 如何接收 props，以及相关的 props 类型限制等部分内容。

### 配置 emits ~new

> 注：这一小节的步骤是在 Child.vue 里操作。

虽然 v-model 的配置和 props 相似，但是为什么出这么两个相似的东西？自然是为了简化一些开发上的操作。

使用 props / emits ，如果要更新父组件的数据，还需要在父组件声明一个更新函数并绑定事件给子组件，才能够更新。

而使用 v-model / emits ，无需在父组件声明更新函数，只需要在子组件 Child.vue 里通过 `update:` 前缀加上 v-model 的属性名这样的格式，即可直接定义一个更新事件。

```ts{8-9}
// Child.vue
export default defineComponent({
  props: {
    uid: Number,
    username: String,
    age: Number,
  },
  // 注意这里的 `update:` 前缀
  emits: ['update:uid', 'update:username', 'update:age'],
})
```

这里的 update 后面的属性名，支持驼峰写法，这一部分和 Vue 2 的使用是相同的。

在配置 emits 时，也可以对数据更新做一些校验，配置方式和讲解 props / emits 时 [接收 emits 时做一些校验](#接收-emits-时做一些校验) 这一小节的操作是一样的。

在 Child.vue 配置好 emits 之后，就可以在 `setup` 里直接操作数据的更新了：

```ts
// Child.vue
export default defineComponent({
  setup(props, { emit }) {
    // 2s 后更新用户名
    setTimeout(() => {
      emit('update:username', 'Tom')
    }, 2000)
  },
})
```

子组件通过调用 `emit('update:xxx')` 即可让父组件更新对应的数据。

## ref / emits

在学习 [响应式 API 之 ref](component.md#响应式-api-之-ref-new) 的时候，已讲解过 `ref` 是可以用在 [DOM 元素与子组件](component.md#dom-元素与子组件) 上面，所以也可以使用 ref 配合 emits 完成父子组件的通信。

### 父组件操作子组件 ~new

> 注：这一小节的步骤是在 Father.vue 里操作。

父组件可以给子组件绑定 `ref` 属性，然后通过 Ref 变量操作子组件的数据或者调用子组件里面的方法。

先在 `<template />` 处给子组件标签绑定 `ref` 属性：

```vue
<!-- Father.vue -->
<template>
  <Child ref="child" />
</template>
```

然后在 `<script />` 部分定义好对应的变量名称 `child` （记得要 return 出来哦），即可通过该变量操作子组件上的变量或方法：

```ts{10-11,15-19,24}
// Father.vue
import { defineComponent, onMounted, ref } from 'vue'
import Child from '@cp/Child.vue'

export default defineComponent({
  components: {
    Child,
  },
  setup() {
    // 给子组件定义一个 `ref` 变量
    const child = ref<InstanceType<typeof Child>>()

    // 请保证视图渲染完毕后再执行操作
    onMounted(async () => {
      // 执行子组件里面的 AJAX 请求函数
      await child.value!.queryList()

      // 显示子组件里面的弹窗
      child.value!.isShowDialog = true
    })

    // 必须 `return` 出去才可以给到 `<template />` 使用
    return {
      child,
    }
  },
})
```

需要注意的是，在子组件 Child.vue 里，变量和方法也需要在 `setup` 里 return 出来才可以被父组件调用到。

### 子组件通知父组件

子组件如果想主动向父组件通讯，也需要使用 emits ，详细的配置方法可见：[绑定 emits](#绑定-emits-new)

## 爷孙组件通信

顾名思义，爷孙组件是比 [父子组件通信](#父子组件通信) 要更深层次的引用关系（也有称之为 “隔代组件” ）。

C 组件被引入到 B 组件里， B 组件又被引入到 A 组件里渲染，此时 A 是 C 的爷爷级别（可能还有更多层级关系），它们之间的关系可以假设如下：

```
Grandfather.vue
└─Son.vue
  └─Grandson.vue
```

可以看到 Grandson.vue 并非直接挂载在 Grandfather.vue 下面，他们之间还隔着至少一个 Son.vue （在实际业务中可能存在更多层级），如果使用 props ，只能一级组件一级组件传递下去，就太繁琐了。

<ClientOnly>
  <ImgWrap
    src="/assets/img/communication-prop-drilling.png"
    alt="Props 的多级传递会非常繁琐（摘自 Vue 官网）"
  />
</ClientOnly>

因此需要更直接的通信方式来解决这种问题，这一 Part 就是讲一讲 C 和 A 之间的数据传递，常用的方法有：

| 方案             | 爷组件向孙组件 | 孙组件向爷组件 | 对应章节传送门                 |
| :--------------- | :------------- | :------------- | :----------------------------- |
| provide / inject | provide        | inject         | [点击查看](#provide-inject)    |
| EventBus         | emit / on      | emit / on      | [点击查看](#eventbus-new)      |
| Reative State    | -              | -              | [点击查看](#reative-state-new) |
| Vuex             | -              | -              | [点击查看](#vuex-new)          |
| Pinia            | -              | -              | [点击查看](pinia.md)           |

因为上下级的关系的一致性，爷孙组件通信的方案也适用于 [父子组件通信](#父子组件通信) ，只需要把爷孙关系换成父子关系即可，为了方便阅读，下面的爷组件统一叫 Grandfather.vue，子组件统一叫 Grandson.vue 。

## provide / inject

这个通信方式也是有两部分：

1. Grandfather.vue 通过 provide 向孙组件 Grandson.vue 提供数据和方法
2. Grandson.vue 通过 inject 注入爷爷组件 Grandfather.vue 的数据和方法

无论组件层次结构有多深，发起 provide 的组件都可以作为其所有下级组件的依赖提供者。

<ClientOnly>
  <ImgWrap
    src="/assets/img/communication-provide-inject.png"
    alt="使用 provide / inject 后，问题将变得非常简单（摘自 Vue 官网）"
  />
</ClientOnly>

Vue 3 的这一部分内容对比 Vue 2 来说变化很大，但使用起来其实也很简单，开发者学到这里不用慌，它们之间也有相同的地方：

1. 爷组件不需要知道哪些子组件使用它 provide 的数据
2. 子组件不需要知道 inject 的数据来自哪里

另外要切记一点就是： provide 和 inject 绑定并不是可响应的，这是刻意为之的，除非传入了一个可侦听的对象。

### 发起 provide ~new

> 注：这一小节的步骤是在 Grandfather.vue 里操作。

先来回顾一下 Vue 2 的用法：

```ts{8-13}
export default {
  // 在 `data` 选项里定义好数据
  data() {
    return {
      tags: ['中餐', '粤菜', '烧腊'],
    }
  },
  // 在 `provide` 选项里添加要提供的数据
  provide() {
    return {
      tags: this.tags,
    }
  },
}
```

旧版的 provide 用法和 data 类似，都是配置为一个返回对象的函数，而 Vue 3 的新版 provide ，和 Vue 2 的用法区别比较大。

在 Vue 3 ， provide 需要导入并在 `setup` 里启用，并且现在是一个全新的方法，每次要 provide 一个数据的时候，就要单独调用一次。

provide 的 TS 类型如下：

```ts
// `provide` API 本身的类型
function provide<T>(key: InjectionKey<T> | string, value: T): void

// 入参 `key` 的其中一种类型
interface InjectionKey<T> extends Symbol {}
```

每次调用 provide 的时候都需要传入两个参数：

| 参数  | 说明       |
| :---- | :--------- |
| key   | 数据的名称 |
| value | 数据的值   |

其中 key 一般使用 `string` 类型就可以满足大部分业务场景，如果有特殊的需要（例如开发插件时可以避免和用户的业务冲突），可以使用 `InjectionKey<T>` 类型，这是一个继承自 Symbol 的泛型：

```ts
import type { InjectionKey } from 'vue'
const key = Symbol() as InjectionKey<string>
```

还需要注意的是， provide 不是响应式的，如果要使其具备响应性，需要传入响应式数据，详见：[响应性数据的传递与接收](#响应性数据的传递与接收-new) 。

下面来试试在爷组件 Grandfather.vue 里创建数据 provide 下去：

```ts{6-19}
// Grandfather.vue
import { defineComponent, provide, ref } from 'vue'

export default defineComponent({
  setup() {
    // 声明一个响应性变量并 provide 其自身
    // 孙组件获取后可以保持响应性
    const msg = ref('Hello World!')
    provide('msg', msg)

    // 只 provide 响应式变量的值
    // 孙组件获取后只会得到当前的值
    provide('msgValue', msg.value)

    // 声明一个方法并 provide
    function printMsg() {
      console.log(msg.value)
    }
    provide('printMsg', printMsg)
  },
})
```

### 接收 inject ~new

> 注：这一小节的步骤是在 Grandson.vue 里操作。

也是先回顾一下在 Vue 2 里的用法，和接收 props 类似：

```ts{2-3}
export default {
  // 通过 `inject` 选项获取
  inject: ['tags'],
  mounted() {
    console.log(this.tags)
  },
}
```

Vue 3 的新版 inject 和 Vue 2 的用法区别也是比较大，在 Vue 3 ， inject 和 provide 一样，也是需要先导入然后在 `setup` 里启用，也是一个全新的方法，每次要 inject 一个数据的时候，也是要单独调用一次。

另外还有一个特殊情况需要注意，当 Grandson.vue 的父级、爷级组件都 provide 了相同名字的数据下来，那么在 inject 的时候，会优先选择离它更近的组件的数据。

根据不同的场景， inject 可以接受不同数量的入参，入参类型也各不相同。

#### 默认用法

默认情况下， inject API 的 TS 类型如下：

```ts
function inject<T>(key: InjectionKey<T> | string): T | undefined
```

每次调用时只需要传入一个参数：

| 参数 | 类型   | 说明                        |
| :--- | :----- | :-------------------------- |
| key  | string | 与 provide 相对应的数据名称 |

接下来看看如何在孙组件里 inject 爷组件 provide 下来的数据：

```ts{7-19}
// Grandson.vue
import { defineComponent, inject } from 'vue'
import type { Ref } from 'vue'

export default defineComponent({
  setup() {
    // 获取响应式变量
    const msg = inject<Ref<string>>('msg')
    console.log(msg!.value)

    // 获取普通的字符串
    const msgValue = inject<string>('msgValue')
    console.log(msgValue)

    // 获取函数
    const printMsg = inject<() => void>('printMsg')
    if (typeof printMsg === 'function') {
      printMsg()
    }
  },
})
```

可以看到在每个 inject 都使用尖括号 `<>` 添加了相应的 TS 类型，并且在调用变量的时候都进行了判断，这是因为默认的情况下， inject 除了返回指定类型的数据之外，还默认带上 `undefined` 作为可能的值。

如果明确数据不会是 `undefined` ，也可以在后面添加 `as` 关键字指定其 TS 类型，这样 TypeScript 就不再因为可能出现 `undefined` 而提示代码有问题。

```ts{7-17}
// Grandson.vue
import { defineComponent, inject } from 'vue'
import type { Ref } from 'vue'

export default defineComponent({
  setup() {
    // 获取响应式变量
    const msg = inject('msg') as Ref<string>
    console.log(msg.value)

    // 获取普通的字符串
    const msgValue = inject('msgValue') as string
    console.log(msgValue)

    // 获取函数
    const printMsg = inject('printMsg') as () => void
    printMsg()
  },
})
```

#### 设置默认值

inject API 还支持设置默认值，可以接受更多的参数。

默认情况下，只需要传入第二个参数指定默认值即可，此时它的 TS 类型如下，

```ts
function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T
```

对于不可控的情况，建议在 inject 时添加一个兜底的默认值，防止程序报错：

```ts{7-19}
// Grandson.vue
import { defineComponent, inject, ref } from 'vue'
import type { Ref } from 'vue'

export default defineComponent({
  setup() {
    // 获取响应式变量
    const msg = inject<Ref<string>>('msg', ref('Hello'))
    console.log(msg.value)

    // 获取普通的字符串
    const msgValue = inject<string>('msgValue', 'Hello')
    console.log(msgValue)

    // 获取函数
    const printMsg = inject<() => void>('printMsg', () => {
      console.log('Hello')
    })
    printMsg()
  },
})
```

需要注意的是， inject 的什么类型的数据，其默认值也需要保持相同的类型。

#### 工厂函数选项

inject API 在第二个 TS 类型的基础上，还有第三个 TS 类型，可以传入第三个参数：

```ts
function inject<T>(
  key: InjectionKey<T> | string,
  defaultValue: () => T,
  treatDefaultAsFactory?: false
): T
```

当第二个参数是一个工厂函数，那么可以添加第三个值，将其设置为 `true` ，此时默认值一定会是其 return 的值。

在 Grandson.vue 里新增一个 inject ，接收一个不存在的函数名，并提供一个工厂函数作为默认值：

```ts{11-21}
// Grandson.vue
import { defineComponent, inject } from 'vue'

interface Food {
  name: string
  count: number
}

export default defineComponent({
  setup() {
    // 获取工厂函数
    const getFood = inject<() => Food>('nonexistentFunction', () => {
      return {
        name: 'Pizza',
        count: 1,
      }
    })
    console.log(typeof getFood) // function

    const food = getFood()
    console.log(food) // {name: 'Pizza', count: 1}
  },
})
```

此时因为第三个参数默认为 [Falsy 值](https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy) ，所以可以得到一个函数作为默认值，并可以调用该函数获得一个 Food 对象。

如果将第三个参数传入为 `true` ，再运行程序则会在 `const food = getFood()` 这一行报错：

```ts{20,22,24-26}
// Grandson.vue
import { defineComponent, inject } from 'vue'

interface Food {
  name: string
  count: number
}

export default defineComponent({
  setup() {
    // 获取工厂函数
    const getFood = inject<() => Food>(
      'nonexistentFunction',
      () => {
        return {
          name: 'Pizza',
          count: 1,
        }
      },
      true
    )
    console.log(typeof getFood) // object

    // 此时下面的代码无法运行
    // 报错 Uncaught (in promise) TypeError: getMsg is not a function
    const food = getFood()
    console.log(food)
  },
})
```

因为此时第三个入参告知 inject ，默认值是一个工厂函数，因此默认值不再是函数本身，而是函数的返回值，所以 `typeof getFood` 得到的不再是一个 `function` 而是一个 `object` 。

这个参数对于需要通过工厂函数返回数据的情况非常有用！

## 兄弟组件通信

兄弟组件是指两个组件都挂载在同一个 Father.vue 下，但两个组件之间并没有什么直接的关联，先看看它们的关系：

```
Father.vue
├─Brother.vue
└─LittleBrother.vue
```

这种层级关系下，如果组件之间要进行通信，目前通常有这两类选择：

1. 【不推荐】先把数据传给 Father.vue ，再使用 [父子组件通信](#父子组件通信) 方案处理
2. 【推荐】借助 [全局组件通信](#全局组件通信) 的方案达到目的

下面的内容将进入全局通信的讲解。

## 全局组件通信

全局组件通信是指项目下两个任意组件，不管是否有直接关联（例如父子关系、爷孙关系）都可以直接进行交流的通信方案。

举个例子，像下面这种项目结构， B2.vue 可以采用全局通信方案直接向 D2.vue 发起交流，而无需经过它们各自的父组件。

```bash
A.vue
├─B1.vue
├───C1.vue
├─────D1.vue
├─────D2.vue
├───C2.vue
├─────D3.vue
└─B2.vue
```

常用的方法有：

| 方案          | 发起方 | 接收方 | 对应章节传送门                 |
| :------------ | :----- | :----- | :----------------------------- |
| EventBus      | emit   | on     | [点击查看](#eventbus-new)      |
| Reative State | -      | -      | [点击查看](#reative-state-new) |
| Vuex          | -      | -      | [点击查看](#vuex-new)          |
| Pinia         | -      | -      | [点击查看](pinia.md)           |

## EventBus ~new

EventBus 通常被称之为 “全局事件总线” ，是用在全局范围内通信的一个常用方案，在 Vue 2 时期该方案非常流行，其特点就是 “简单” 、 “灵活” 、 “轻量级” 。

### 回顾 Vue 2

在 Vue 2 ，使用 EventBus 无需导入第三方插件，可以在项目下的 libs 文件夹里，创建一个名为 eventBus.ts 的文件，导出一个新的 Vue 实例即可。

```ts
// src/libs/eventBus.ts
import Vue from 'vue'
export default new Vue()
```

上面短短两句代码已完成了一个 EventBus 的创建，接下来就可以开始进行通信。

先在负责接收事件的组件里，利用 Vue 的生命周期，通过 `eventBus.$on` 添加事件侦听，通过 `eventBus.$off` 移除事件侦听。

```ts{5-8,11-12}
import eventBus from '@libs/eventBus'

export default {
  mounted() {
    // 在组件创建时，添加一个名为 `hello` 的事件侦听
    eventBus.$on('hello', () => {
      console.log('Hello World')
    })
  },
  beforeDestroy() {
    // 在组件销毁前，通过 `hello` 这个名称移除该事件侦听
    eventBus.$off('hello')
  },
}
```

然后在另外一个组件里通过 `eventBus.$emit` 触发事件侦听。

```ts{6-7}
import eventBus from './eventBus'

export default {
  methods: {
    sayHello() {
      // 触发名为 `hello` 的事件
      eventBus.$emit('hello')
    },
  },
}
```

这样一个简单的全局方案就完成了。

### 了解 Vue 3 ~new

Vue 3 应用实例不再实现事件触发接口，因此移除了 `$on` 、 `$off` 和 `$once` 这几个事件 API ，无法像 Vue 2 一样利用 Vue 实例创建 EventBus 。

根据官方文档在 [事件 API 迁移策略](https://v3-migration.vuejs.org/breaking-changes/events-api.html#migration-strategy) 的推荐，可以使用 [mitt](https://github.com/developit/mitt) 或者 [tiny-emitter](https://github.com/scottcorgan/tiny-emitter) 等第三方插件实现 EventBus 。

### 创建 Vue 3 的 EventBus ~new

这里以 mitt 为例，示范如何创建一个 Vue 3 的 EventBus ，首先需要安装它。

```
npm i mitt
```

然后在 src/libs 文件夹下，创建一个名为 eventBus.ts 的文件，文件内容和 Vue 2 的写法其实是一样的，只不过是把 Vue 实例换成了 mitt 实例。

```ts
// src/libs/eventBus.ts
import mitt from 'mitt'
export default mitt()
```

接下来就可以定义通信的相关事件了，常用的 API 和参数如下：

| 方法名称 | 作用                           |
| :------- | :----------------------------- |
| on       | 注册一个侦听事件，用于接收数据 |
| emit     | 调用方法发起数据传递           |
| off      | 用来移除侦听事件               |

`on` 的参数：

| 参数    | 类型             | 作用                                 |
| :------ | :--------------- | :----------------------------------- |
| type    | string \| symbol | 方法名                               |
| handler | function         | 接收到数据之后要做什么处理的回调函数 |

这里的 `handler` 建议使用具名函数，因为匿名函数无法销毁。

`emit` 的参数：

| 参数 | 类型             | 作用                         |
| :--- | :--------------- | :--------------------------- |
| type | string \| symbol | 与 on 对应的方法名           |
| data | any              | 与 on 对应的，允许接收的数据 |

`off` 的参数：

| 参数    | 类型             | 作用                                    |
| :------ | :--------------- | :-------------------------------------- |
| type    | string \| symbol | 与 on 对应的方法名                      |
| handler | function         | 要被删除的，与 on 对应的 handler 函数名 |

更多的 API 可以查阅 [插件的官方文档](https://github.com/developit/mitt) ，在了解了最基本的用法之后，来开始配置一对组件通信。

### 创建和移除侦听事件 ~new

在需要暴露交流事件的组件里，通过 `on` 配置好接收方法，同时为了避免路由切换过程中造成事件多次被绑定，从而引起多次触发，需要在适当的时机 `off` 掉：

```ts
import { defineComponent, onBeforeUnmount } from 'vue'
import eventBus from '@libs/eventBus'

export default defineComponent({
  setup() {
    // 声明一个打招呼的方法
    function sayHi(msg = 'Hello World!') {
      console.log(msg)
    }

    // 启用侦听
    eventBus.on('sayHi', sayHi)

    // 在组件卸载之前移除侦听
    onBeforeUnmount(() => {
      eventBus.off('sayHi', sayHi)
    })
  },
})
```

关于销毁的时机，可以参考 [组件的生命周期](component.md#组件的生命周期-new) 。

### 调用侦听事件 ~new

在需要调用交流事件的组件里，通过 `emit` 进行调用：

```ts
import { defineComponent } from 'vue'
import eventBus from '@libs/eventBus'

export default defineComponent({
  setup() {
    // 调用打招呼事件，传入消息内容
    eventBus.emit('sayHi', 'Hello')
  },
})
```

### 旧项目升级 EventBus

在 Vue 3 的 EventBus 里，可以看到它的 API 和旧版是非常接近的，只是去掉了 `$` 符号。

如果要对旧的项目进行升级改造，由于原来都是使用了 `$on` 、 `$emit` 等旧的 API ，一个一个组件去修改成新的 API 容易遗漏或者全局替换出错。

因此可以在创建 eventBus.ts 的时候，通过自定义一个 eventBus 对象来挂载 mitt 的 API 。

在 eventBus.ts 里，改成以下代码：

```ts
// src/libs/eventBus.ts
import mitt from 'mitt'

// 初始化一个 mitt 实例
const emitter = mitt()

// 在导出时使用旧的 API 名称去调用 mitt 的 API
export default {
  $on: (...args) => emitter.on(...args),
  $emit: (...args) => emitter.emit(...args),
  $off: (...args) => emitter.off(...args),
}
```

这样在组件里就可以继续使用 `eventBus.$on` 、`eventBus.$emit` 等旧 API ，不会影响旧项目的升级使用。

## Reative State ~new

在 Vue 3 里，使用响应式的 reative API 也可以实现一个小型的状态共享库，如果运用在一个简单的 H5 活动页面这样小需求里，完全可以满足使用。

### 创建状态中心

首先在 src 目录下创建一个 state 文件夹，并添加一个 index.ts 文件，写入以下代码：

```ts
// src/state/index.ts
import { reactive } from 'vue'

// 如果有多个不同业务的内部状态共享
// 使用具名导出更容易维护
export const state = reactive({
  // 设置一个属性并赋予初始值
  message: 'Hello World',

  // 添加一个更新数据的方法
  setMessage(msg: string) {
    this.message = msg
  },
})
```

这就完成了一个简单的 Reactive State 响应式状态中心的创建。

### 设定状态更新逻辑

接下来在一个组件 Child.vue 的 `<script />` 里添加以下代码，分别进行了以下操作：

1. 打印初始值
2. 对 state 里的数据启用侦听器
3. 使用 state 里的方法更新数据
4. 直接更新 state 的数据

```ts
// Child.vue
import { defineComponent, watch } from 'vue'
import { state } from '@/state'

export default defineComponent({
  setup() {
    console.log(state.message)
    // Hello World

    // 因为是响应式数据，所以可以侦听数据变化
    watch(
      () => state.message,
      (val) => {
        console.log('Message 发生变化：', val)
      }
    )

    setTimeout(() => {
      state.setMessage('Hello Hello')
      // Message 发生变化： Hello Hello
    }, 1000)

    setTimeout(() => {
      state.message = 'Hi Hi'
      // Message 发生变化： Hi Hi
    }, 2000)
  },
})
```

### 观察全局状态变化

继续在另外一个组件 Father.vue 里写入以下代码，导入 state 并在 `<template />` 渲染其中的数据：

```vue
<!-- Father.vue -->
<template>
  <div>{{ state.message }}</div>
  <Child />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Child from '@cp/Child.vue'
import { state } from '@/state'

export default defineComponent({
  components: {
    Child,
  },
  setup() {
    return {
      state,
    }
  },
})
</script>
```

可以观察到当 Child.vue 里的定时器执行时， Father.vue 的视图也会同步得到更新。

一个无需额外插件即可实现的状态中心就这么完成了！

## Vuex ~new

Vuex 是 Vue 生态里面非常重要的一个成员，运用于状态管理模式。

它也是一个全局的通信方案，对比 [EventBus](#eventbus-new)，Vuex 的功能更多，更灵活，但对应的学习成本和体积也相对较大，通常大型项目才会用上 Vuex 。

### 在了解之前

摘自 Vuex 仓库 README 文档的一段官方提示：

> Pinia is now the new default<br>
> The official state management library for Vue has changed to Pinia. Pinia has almost the exact same or enhanced API as Vuex 5, described in Vuex 5 RFC. You could simply consider Pinia as Vuex 5 with a different name. Pinia also works with Vue 2.x as well.<br>
> Vuex 3 and 4 will still be maintained. However, it's unlikely to add new functionalities to it. Vuex and Pinia can be installed in the same project. If you're migrating existing Vuex app to Pinia, it might be a suitable option. However, if you're planning to start a new project, we highly recommend using Pinia instead.<br>

意思是 Pinia 已经成为 Vue 生态最新的官方状态管理库，不仅适用于 Vue 3 ，也支持 Vue 2 ，而 Vuex 将进入维护状态，不再增加新功能， Vue 官方强烈建议在新项目中使用 Pinia 。

:::tip
笔者建议：如果是全新的项目，建议直接使用 [Pinia](pinia.md) ，不仅更加适配 Vue 3 组合式 API 的使用，对 TypeScript 的支持也更完善，上手难度和使用舒适度均比 Vuex 更好， Vuex 正在逐渐退出舞台，请根据实际需求决定是否需要启用它。
:::

### Vuex 的目录结构

在 Vue 3 里使用 Vuex ，需要选择 4.x 版本，也是当前的 @latest 标签对应的版本，请先安装它。

```bash
npm i vuex
```

接下来按照下面的目录结构创建对应的目录与文件：

```bash
src
│ # Vuex 的目录
├─store
├───index.ts
└─main.ts
```

一般情况下一个 index.ts 足矣，它是 Vuex 的入口文件，如果的项目比较庞大，可以在 store 目录下创建一个命名为 modules 的文件夹，使用 [Vuex Modules](https://vuex.vuejs.org/zh/guide/modules.html) 的方式导入到 index.ts 里去注册。

### 回顾 Vue 2

在 Vue 2 ，需要先分别导入 `vue` 和 `vuex`，使用 `use` 方法启用 Vuex 后，通过 `new Vuex.Store(...)` 的方式进行初始化。

```ts
// src/store/index.ts
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {},
})
```

之后在组件里就可以通过 `this.$store` 操作 Vuex 上的方法了。

```ts
export default {
  mounted() {
    // 通过 `this.$store` 操作 Vuex
    this.$store.commit('increment')
    console.log(this.$store.state.count)
  },
}
```

### 了解 Vue 3 ~new

Vue 3 需要从 Vuex 里导入 `createStore` 创建实例：

```ts
// src/store/index.ts
import { createStore } from 'vuex'

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {},
})
```

之后在 src/main.ts 里启用 Vuex ：

```ts{4,7}
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

createApp(App)
  .use(store) // 启用 Vuex
  .mount('#app')
```

Vue 3 在组件里使用 Vuex 的方式和 Vue 2 有所不同，需要像使用路由那样通过一个组合式 API `useStore` 启用。

```ts{2,6-7}
import { defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    // 需要创建一个 store 变量
    const store = useStore()

    // 再使用 store 去操作 Vuex 的 API
    // ...
  },
})
```

### Vuex 的配置

除了初始化方式有一定的改变， Vuex 在 Vue 3 的其他配置和 Vue 2 是一样的。

由于现在在 Vue 3 里已经更推荐使用 Pinia ， Vuex 已处于维护状态，因此关于 Vuex 的使用将不展开更多的介绍，有需要的开发者可以查看 Vuex 官网的 [使用指南](https://next.vuex.vuejs.org/zh/guide/) 了解更多。

## Pinia ~new

Pinia 和 Vuex 一样，也是 Vue 生态里面非常重要的一个成员，也都是运用于全局的状态管理。

但面向 [Componsition API](component.md#组件的基本写法) 而生的 Pinia ，更受 Vue 3 喜爱，已被钦定为官方推荐的新状态管理工具。

为了阅读上的方便，对 Pinia 单独开了一章，请在 [全局状态的管理](pinia.md) 一章阅读。

<!-- 评论 -->
<ClientOnly>
  <GitalkComment
    :issueId="62"
  />
</ClientOnly>
<!-- 评论 -->
