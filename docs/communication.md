# 组件之间的通信

经过前面的那几部分的阅读，相信搭一个基础的 Vue 3.0 项目应该没什么问题了！

但实际业务开发过程中，还会遇到一些组件之间的通信问题，父子组件通信、兄弟组件通信、爷孙组件通信，还有一些全局通信的场景。

:::tip
这一章节的内容，3.x 对比 2.x 变化都比较大！
:::

这一章就按使用场景来划分对应的章节吧，在什么场景下遇到问题，也方便快速找到对应的处理办法。

通信场景|快速定位
:--|:--
父子组件通信|[点击查看](#父子组件通信)
爷孙组件通信|[点击查看](#爷孙组件通信)
兄弟组件通信|[点击查看](#兄弟组件通信)
全局组件通信|[点击查看](#全局组件通信)

## 父子组件通信

父子组件通信是指，B 组件引入到 A 组件里渲染，此时 A 是 B 的父级；B 组件的一些数据需要从A组件拿，B 组件有时也要告知 A 组件一些数据变化情况。

他们之间的关系如下，`Child.vue` 是直接挂载在 `Father.vue` 下面：

```
Father.vue
└─Child.vue
```

常用的方法有：

方案|父组件向子组件|子组件向父组件|对应章节传送门
:--|:--|:--|:--
props / emits|props|emits|[点击查看](#props-emits)
v-model / emits|v-model|emits|[点击查看](#v-model-emits)
ref / emits|ref|emits|[点击查看](#ref-emits)
provide / inject|provide|inject|[点击查看](#provide-inject)
EventBus|emit / on|emit / on|[点击查看](#eventbus-new)
Vuex|-|-|[点击查看](#vuex-new)

为了方便阅读，下面的父组件统一叫 `Father.vue`，子组件统一叫 `Child.vue`。

:::warning
在 2.x，有的同学可能喜欢用 `$attrs / $listeners` 来进行通信，但该方案在 3.x 已经移除了，详见 [移除 $listeners](https://v3.cn.vuejs.org/guide/migration/listeners-removed.html)
:::

## props / emits

这是Vue跨组件通信最常用，也是基础的一个方案，它的通信过程是：

1. `Father.vue` 通过 `prop` 向 `Child.vue` 传值（可包含父级定义好的函数）

2. `Child.vue` 通过 `emit` 向 `Father.vue` 触发父组件的事件执行

### 下发 props

下发的过程是在 `Father.vue` 里完成的，父组件在向子组件下发 `props` 之前，需要导入子组件并启用它作为自身的模板，然后在 `setup` 里处理好数据，return 给 `template` 用。

在 `Father.vue` 的 `script` 里：

```ts
import { defineComponent } from 'vue'
import Child from '@cp/Child.vue'

interface Member {
  id: number,
  name: string
};

export default defineComponent({
  // 需要启用子组件作为模板
  components: {
    Child
  },

  // 定义一些数据并return给template用
  setup () {
    const userInfo: Member = {
      id: 1,
      name: 'Petter'
    }

    // 不要忘记return，否则template拿不到数据
    return {
      userInfo
    }
  }
})
```

然后在 `Father.vue` 的 `template` 这边拿到 return 出来的数据，把要传递的数据通过属性的方式绑定在 `template` 的组件标签上。

```vue
<template>
  <Child
    title="用户信息"
    :index="1"
    :uid="userInfo.id"
    :user-name="userInfo.name"
  />
</template>
```

这样就完成了 `props` 数据的下发。

:::tip
1. 在 `template` 绑定属性这里，如果是普通的字符串，比如上面的 `title`，则直接给属性名赋值就可以

2. 如果是变量，或者其他类型如 `Number`、`Object` 等，则需要通过属性动态绑定的方式来添加，使用 `v-bind:` 或者 `:` 符号进行绑定

3. 官方建议 prop 在 `template` 统一采用短横线分隔命名 （详见：[Prop 的大小写命名](https://v3.cn.vuejs.org/guide/component-props.html#prop-%E7%9A%84%E5%A4%A7%E5%B0%8F%E5%86%99%E5%91%BD%E5%90%8D-camelcase-vs-kebab-case)），但实际上你采用驼峰也是可以正确拿到值，因为 Vue 的源码里有做转换
:::

### 接收 props

接收的过程是在 `Child.vue` 里完成的，在 `script` 部分，子组件通过与 `setup` 同级的 `props` 来接收数据。

它可以是一个数组，每个 `item` 都是 `String` 类型，把你要接受的变量名放到这个数组里，直接放进来作为数组的 `item`：

```ts
export default defineComponent({
  props: [
    'title',
    'index',
    'userName',
    'uid'
  ]
})
```

但这种情况下，使用者不知道这些属性到底是什么类型的值，是否必传。

### 带有类型限制的 props

> 注：这一小节的步骤是在 `Child.vue` 里操作。

既然我们最开始在决定使用 Vue 3.0 的时候，为了更好的类型限制，已经决定写 `TypeScript` ，那么我们最好不要出现这种使用情况。

**推荐的方式是把 `props` 定义为一个对象，以对象形式列出 `prop`，每个 `property` 的名称和值分别是 `prop` 各自的名称和类型，只有合法的类型才允许传入。**

:::tip
注意，和 TS 的类型定义不同， `props` 这里的类型，首字母需要大写。
:::

支持的类型有：

类型|含义
:--|:--
String|字符串
Number|数值
Boolean|布尔值
Array|数组
Object|对象
Date|日期数据，e.g. new Date()
Function|函数，e.g. 普通函数、箭头函数、构造函数
Promise|Promise 类型的函数
Symbol|Symbol 类型的值

于是我们把 `props` 再改一下，加上类型限制：

```ts
export default defineComponent({
  props: {
    title: String,
    index: Number,
    userName: String,
    uid: Number
  }
})
```

这样我们如果传入不正确的类型，程序就会抛出警告信息，告知开发者必须正确传值。

如果你需要对某个 `prop` 允许多类型，比如这个 `uid` 字段，它可能是数值，也可能是字符串，那么可以在类型这里，使用一个数组，把允许的类型都加进去。

```ts
export default defineComponent({
  props: {
    // 单类型
    title: String,
    index: Number,
    userName: String,

    // 这里使用了多种类型
    uid: [ Number, String ]
  }
})
```

### 可选以及带有默认值的 props

> 注：这一小节的步骤是在 `Child.vue` 里操作。

有时候我们想对一些 `prop` 设置为可选，然后提供一些默认值，还可以再将 `prop` 再进一步设置为对象，支持的字段有：

字段|类型|含义|
:--|:--|:--
type|string|prop 的类型
required|boolean|是否必传，true=必传，false=可选
default|any|与 type 字段的类型相对应的默认值，如果 required 是 false ，但这里不设置默认值，则会默认为 `undefined`
validator|function|自定义验证函数，需要 return 一个布尔值，true=校验通过，false=校验不通过，当校验不通过时，控制台会抛出警告信息

我们现在再对 `props` 改造一下，对部分字段设置为可选，并提供默认值：

```ts
export default defineComponent({
  props: {
    // 可选，并提供默认值
    title: {
      type: String,
      required: false,
      default: '默认标题'
    },

    // 默认可选，单类型
    index: Number,

    // 添加一些自定义校验
    userName: {
      type: String,

      // 在这里校验用户名必须至少3个字
      validator: v => v.length >= 3
    },

    // 默认可选，但允许多种类型
    uid: [ Number, String ]
  }
})
```

### 使用 props{new}

> 注：这一小节的步骤是在 `Child.vue` 里操作。

在 `template` 部分，3.x 的使用方法和 2.x 是一样的，比如要渲染我们上面传入的 `props` ：

```vue
<template>
  <p>标题：{{ title }}</p>
  <p>索引：{{ index }}</p>
  <p>用户id：{{ uid }}</p>
  <p>用户名：{{ userName }}</p>
</template>
```

**但是 `script` 部分，变化非常大！**

在 2.x ，只需要通过 `this.uid`、`this.userName` 就可以使用父组件传下来的 `prop` 。

但是 3.x 没有了 `this`， 需要给 `setup` 添加一个入参才可以去操作。

```ts
export default defineComponent({
  props: {
    title: String,
    index: Number,
    userName: String,
    uid: Number
  },

  // 在这里需要添加一个入参
  setup (props) {

    // 该入参包含了我们定义的所有props
    console.log(props);

  }
})
```

:::tip
1. `prop` 是只读，不允许修改

2. `setup` 的第一个入参，包含了我们定义的所有props（如果在 `Child.vue` 里未定义，但 父组件 `Father.vue` 那边非要传过来的，不会拿到，且控制台会有警告信息）

3. 该入参可以随意命名，比如你可以写成一个下划线 `_`，通过 `_.uid` 也可以拿到数据，但是语义化命名，是一个良好的编程习惯。
:::

### 传递非 Prop 的 Attribute

上面的提示里有提到一句：

> 如果在 `Child.vue` 里未定义，但 父组件 `Father.vue` 那边非要传过来的，不会拿到，且控制台会有警告信息

但并不意味着你不能传递任何未定义的属性数据，在父组件，除了可以给子组件绑定 props，你还可以根据实际需要去绑定一些特殊的属性。

比如给子组件设置 `class`、`id`，或者 `data-xxx` 之类的一些自定义属性，**如果 `Child.vue` 组件的 `template` 只有一个根节点，这些属性默认自动继承，并渲染在 node 节点上**。

在 `Father.vue` 里，对 `Child.vue` 传递了 `class`、`id` 和 `data-hash`：

```vue
<template>
  <Child
    class="child"
    keys="aaaa"
    data-hash="afJasdHGUHa87d688723kjaghdhja"
  />
</template>
```

渲染后（2个 `data-v-xxx` 是父子组件各自的 `css scoped` 标记）：

```html
<div
  class="child"
  keys="aaaa"
  data-hash="afJasdHGUHa87d688723kjaghdhja"
  data-v-2dcc19c8=""
  data-v-7eb2bc79=""
>
  <!-- Child的内容 -->
</div>
```

你可以在 `Child.vue` 配置 `inheritAttrs` 为 `false`，来屏蔽这些自定义属性的渲染。

```ts
export default defineComponent({
  inheritAttrs: false,
  setup () {
    // ...    
  }
})
```

### 获取非 Prop 的 Attribute{new}

想要拿到这些属性，原生操作需要通过 `element.getAttribute` ，但 Vue 也提供了相关的 API ：

在 `Child.vue` 里，可以通过 `setup` 的第二个参数 `context` 里的 `attrs` 来获取到这些属性。

```ts
export default defineComponent({
  setup (props, { attrs }) {
    // attrs 是个对象，每个 Attribute 都是它的 key
    console.log(attrs.class);

    // 如果传下来的 Attribute 带有短横线，需要通过这种方式获取
    console.log(attrs['data-hash']);
  }
})
```

:::tip
1. `attr` 和 `prop` 一样，都是只读的

2. 不管 `inheritAttrs` 是否设置，都可以通过 `attrs` 拿到这些数据，但是 `element.getAttribute` 则只有 `inheritAttrs` 为 `true` 的时候才可以。
:::

Vue 3.x 的 `template` 还允许多个根节点，多个根节点的情况下，无法直接继承这些属性，需要在 `Child.vue` 指定继承在哪个节点上，否则会有警告信息。

```vue
<template>
  <!-- 指定继承 -->
  <p v-bind="attrs"></p>
  <!-- 指定继承 -->
  
  <!-- 这些不会自动继承 -->
  <p></p>
  <p></p>
  <p></p>
  <!-- 这些不会自动继承 -->
</template>
```

当然，前提依然是，`setup` 里要把 `attrs` 给 `return` 出来。

查看详情：[多个根节点上的 Attribute 继承](https://v3.cn.vuejs.org/guide/component-attrs.html#%E5%A4%9A%E4%B8%AA%E6%A0%B9%E8%8A%82%E7%82%B9%E4%B8%8A%E7%9A%84-attribute-%E7%BB%A7%E6%89%BF)

### 绑定 emits{new}

最开始有介绍到，子组件如果需要向父组件告知数据更新，或者执行某些函数时，是通过 emits 来进行的。

每个 `emit` 都是事件，所以需要先由父组件先给子组件绑定，子组件才能知道应该怎么去调用。

:::tip
当然，父组件也是需要先在 `setup` 里进行定义并 `return`，才能够在 `template` 里绑定给子组件。
:::

比如要给 `Child.vue` 绑定一个更新用户年龄的方法，那么在 `Father.vue` 里需要这么处理：

先看 `script` 部分（留意注释部分）：

```ts
import { defineComponent, reactive } from 'vue'
import Child from '@cp/Child.vue'

interface Member {
  id: number,
  name: string,
  age: number
};

export default defineComponent({
  components: {
    Child
  },
  setup () {
    const userInfo: Member = reactive({
      id: 1,
      name: 'Petter',
      age: 0
    })

    // 定义一个更新年龄的方法
    const updateAge = (age: number): void => {
      userInfo.age = age;
    }

    return {
      userInfo,

      // return给template用
      updateAge
    }
  }
})
```

再看 `template` 部分（为了方便阅读，我把之前绑定的 props 先去掉了）：

```vue
<template>
  <Child
    @update-age="updateAge"
  />
</template>
```

:::tip
1. 动态绑定 `props` 是用 `:`，绑定 `emit` 是用 `@`

2. 关于绑定的这个 `@` 符号，其实很好记忆，因为在 Vue 的 `template` 里，所有的事件绑定都是通过 `@`，比如 `@click`、`@change` 等等

3. 同样的，在绑定 `emit` 时，也需要使用短横线写法（详见：[事件名](https://v3.cn.vuejs.org/guide/component-custom-events.html#%E4%BA%8B%E4%BB%B6%E5%90%8D)）
:::

### 接收 emits

> 注：这一小节的步骤是在 `Child.vue` 里操作。

和 `props` 一样，你可以指定是一个数组，把要接收的 `emit` 名称写进去：

```ts
export default defineComponent({
  emits: [
    'update-age'
  ]
})
```

其实日常这样配置就足够用了。

:::tip
1. 这里的 `emit` 名称指 `Father.vue` 在给 `Child.vue` 绑定事件时，`template` 里面给子组件指定的 `@aaaaa="bbbbb"` 里的 `aaaaa`

2. 当在 emits 选项中定义了原生事件 (如 `click` ) 时，将使用组件中的事件替代原生事件侦听器
:::

### 接收 emits 时做一些校验

当然你也可以对这些事件做一些验证，配置为对象，然后把这个 `emit` 名称作为 `key`， `value` 则配置为一个方法。

比如上面的更新年龄，只允许达到成年人的年龄才会去更新父组件的数据：

```ts
export default defineComponent({
  emits: {
    // 需要校验
    'update-age': (age: number) => {
      // 写一些条件拦截，记得返回false
      if ( age < 18 ) {
        console.log('未成年人不允许参与');
        return false;
      }

      // 通过则返回true
      return true;
    },

    // 一些无需校验的，设置为null即可
    'update-name': null
  }
})
```

### 调用 emits{new}

> 注：这一小节的步骤是在 `Child.vue` 里操作。

和 `props` 一样，也需要在 `setup` 的入参里引入 `emit` ，才允许操作。

`setup` 的第二个入参 `expose` 是一个对象，你可以完整导入 `expose` 然后通过 `expose.emit` 去操作，也可以按需导入 `{ emit }` （推荐这种方式）：

```ts
export default defineComponent({
  emits: [
    'update-age'
  ],
  setup (props, { emit }) {
    
    // 2s 后更新年龄
    setTimeout( () => {
      emit('update-age', 22);
    }, 2000);

  }
})
```

:::tip
`emit` 的第二个参数开始是父组件那边要接收的自定义数据，为了开发上的便利，建议如果需要传多个数据的情况下，直接将第二个参数设置为一个对象，把所有数据都放到对象里，传递和接收起来都会方便很多。
:::

## v-model / emits

对比 `props / emits` ，这个方式更为简单：

1. 在 `Father.vue` ，通过 `v-model` 向 `Child.vue` 传值

2. `Child.vue` 通过自身设定的 emits 向 `Father.vue` 通知数据更新

`v-model` 的用法和 `props` 非常相似，但是很多操作上更为简化，但操作简单带来的 “副作用” ，就是功能上也没有 `props` 那么多。

### 绑定 v-model{new}

它的和下发 props 的方式类似，都是在子组件上绑定 `Father.vue` 定义好并 `return` 出来的数据。

:::tip
1. 和 2.x 不同， 3.x 可以直接绑定 `v-model` ，而无需在子组件指定 `model` 选项。

2. 另外，3.x 的 `v-model` 需要使用 `:` 来指定你要绑定的属性名，同时也开始支持绑定多个 `v-model`
:::

我们来看看具体的操作：

```vue
<template>
  <Child
    v-model:user-name="userInfo.name"
  />
</template>
```

如果你要绑定多个数据，写多个 `v-model` 即可

```vue
<template>
  <Child
    v-model:user-name="userInfo.name"
    v-model:uid="userInfo.id"
  />
</template>
```

看到这里应该能明白了，一个 `v-model` 其实就是一个 `prop`，它支持的数据类型，和 `prop` 是一样的。

所以，子组件在接收数据的时候，完全按照 `props` 去定义就可以了。

点击回顾：[接收 props](#接收-props) ，了解在 `Child.vue` 如何接收 `props`，以及相关的 `props` 类型限制等部分内容。

### 配置 emits

> 注：这一小节的步骤是在 `Child.vue` 里操作。

虽然 `v-model` 的配置和 `prop` 相似，但是为什么出这么两个相似的东西？自然是为了简化一些开发上的操作。

使用 props / emits，如果要更新父组件的数据，还需要在父组件定义好方法，然后 `return` 给 `template` 去绑定事件给子组件，才能够更新。

而使用 `v-model / emits` ，无需如此，可以在 `Child.vue` 直接通过 “update:属性名” 的格式，直接定义一个更新事件：

```ts
export default defineComponent({
  props: {
    userName: String,
    uid: Number
  },
  emits: [
    'update:userName',
    'update:uid'
  ]
})
```

btw: 这里的 update 后面的属性名，支持驼峰写法，这一部分和 2.x 的使用是相同的。

这里也可以对数据更新做一些校验，配置方式和 [接收 emits 时做一些校验](#接收-emits-时做一些校验) 是一样的。

### 调用自身的 emits{new}

> 注：这一小节的步骤是在 `Child.vue` 里操作。

在 `Child.vue` 配置好 emits 之后，就可以在 `setup` 里直接操作数据的更新了：

```ts
export default defineComponent({
  // ...
  setup (props, { emit }) {

    // 2s 后更新用户名
    setTimeout(() => {
      emit('update:userName', 'Tom')
    }, 2000);

  }
})
```

在使用上，和 [调用 emits](#调用-emits-new) 是一样的。

## ref / emits

在学习 [响应式 API 之 ref](component.md#响应式-api-之-ref-new) 的时候，我们了解到 `ref` 是可以用在 [DOM 元素与子组件](component.md#dom-元素与子组件) 上面。

### 父组件操作子组件{new}

所以，父组件也可以直接通过对子组件绑定 `ref` 属性，然后通过 ref 变量去操作子组件的数据或者调用里面的方法。

比如导入了一个 `Child.vue` 作为子组件，需要在 `template` 处给子组件标签绑定 `ref`：

```vue
<template>
  <Child ref="child" />
</template>
```

然后在 `script` 部分定义好对应的变量名称（记得要 `return` 出来）：

```ts
import { defineComponent, onMounted, ref } from 'vue'
import Child from '@cp/Child.vue'

export default defineComponent({
  components: {
    Child
  },
  setup () {
    // 给子组件定义一个ref变量
    const child = ref<HTMLElement>(null);

    // 请保证视图渲染完毕后再执行操作
    onMounted( () => {
      // 执行子组件里面的ajax函数
      child.value.getList();

      // 打开子组件里面的弹窗
      child.value.isShowDialog = true;
    });

    // 必须return出去才可以给到template使用
    return {
      child
    }
  }
})
```

### 子组件通知父组件

子组件如果想主动向父组件通讯，也需要使用 `emit`，详细的配置方法可见：[绑定 emits](#绑定-emits-new)

## 爷孙组件通信

顾名思义，爷孙组件是比 [父子组件通信](#父子组件通信) 要更深层次的引用关系（也有称之为 “隔代组件”）：

C组件引入到B组件里，B组件引入到A组件里渲染，此时A是C的爷爷级别（可能还有更多层级关系），如果你用 `props` ，只能一级一级传递下去，那就太繁琐了，因此我们需要更直接的通信方式。

他们之间的关系如下，`Grandson.vue` 并非直接挂载在 `Grandfather.vue` 下面，他们之间还隔着至少一个 `Son.vue` （可能有多个）：

```
Grandfather.vue
└─Son.vue
  └─Grandson.vue
```

这一 Part 就是讲一讲 C 和 A 之间的数据传递，常用的方法有：

方案|爷组件向孙组件|孙组件向爷组件|对应章节传送门
:--|:--|:--|:--
provide / inject|provide|inject|[点击查看](#provide-inject)
EventBus|emit / on|emit / on|[点击查看](#eventbus-new)
Vuex|-|-|[点击查看](#vuex-new)

为了方便阅读，下面的父组件统一叫 `Grandfather.vue`，子组件统一叫 `Grandson.vue`，但实际上他们之间可以隔无数代…

:::tip
因为上下级的关系的一致性，爷孙组件通信的方案也适用于 [父子组件通信](#父子组件通信) ，只需要把爷孙关系换成父子关系即可。
:::

## provide / inject

这个特性有两个部分：`Grandfather.vue` 有一个 `provide` 选项来提供数据，`Grandson.vue` 有一个 `inject` 选项来开始使用这些数据。

1. `Grandfather.vue` 通过 `provide` 向 `Grandson.vue` 传值（可包含定义好的函数）

2. `Grandson.vue` 通过 `inject` 向 `Grandfather.vue` 触发爷爷组件的事件执行

无论组件层次结构有多深，发起 `provide` 的组件都可以作为其所有下级组件的依赖提供者。

:::tip
这一部分的内容变化都特别大，但使用起来其实也很简单，不用慌，也有相同的地方：

1. 父组件不需要知道哪些子组件使用它 provide 的 property

2. 子组件不需要知道 inject property 来自哪里

另外，要切记一点就是：provide 和 inject 绑定并不是可响应的。这是刻意为之的，但如果传入了一个可监听的对象，那么其对象的 property 还是可响应的。
:::

### 发起 provide{new}

我们先来回顾一下 2.x 的用法：

```ts
export default {
  // 定义好数据
  data () {
    return {
      tags: [ '中餐', '粤菜', '烧腊' ]
    }
  },
  // provide出去
  provide () {
    return {
      tags: this.tags
    }
  }
}
```

旧版的 `provide` 用法和 `data` 类似，都是配置为一个返回对象的函数。

3.x 的新版 `provide`， 和 2.x 的用法区别比较大。

:::tip
在 3.x ， `provide` 需要导入并在 `setup` 里启用，并且现在是一个全新的方法。

每次要 `provide` 一个数据的时候，就要单独调用一次。
:::

每次调用的时候，都需要传入 2 个参数：

参数|类型|说明
:--|:--|:--
key|string|数据的名称
value|any|数据的值

来看一下如何创建一个 `provide`：

```ts
// 记得导入provide
import { defineComponent, provide } from 'vue'

export default defineComponent({
  // ...
  setup () {
    // 定义好数据
    const msg: string = 'Hello World!';

    // provide出去
    provide('msg', msg);
  }
})
```

操作非常简单对吧哈哈哈，但需要注意的是，`provide` 不是响应式的，如果你要使其具备响应性，你需要传入响应式数据，详见：[响应性数据的传递与接收](#响应性数据的传递与接收-new)

### 接收 inject{new}

也是先来回顾一下 2.x 的用法：

```ts
export default {
  inject: [
    'tags'
  ],
  mounted () {
    console.log(this.tags);
  }
}
```

旧版的 `inject` 用法和 `props` 类似，3.x 的新版 `inject`， 和 2.x 的用法区别也是比较大。

:::tip
在 3.x， `inject` 和 `provide` 一样，也是需要先导入然后在 `setup` 里启用，也是一个全新的方法。

每次要 `inject` 一个数据的时候，就要单独调用一次。
:::

每次调用的时候，只需要传入 1 个参数：

参数|类型|说明
:--|:--|:--
key|string|与 `provide` 相对应的数据名称

来看一下如何创建一个 `inject`：

```ts
// 记得导入inject
import { defineComponent, inject } from 'vue'

export default defineComponent({
  // ...
  setup () {
    const msg: string = inject('msg') || '';
  }
})
```

也是很简单（写 TS 的话，由于 `inject` 到的值可能是 `undefined`，所以要么加个 `undefined` 类型，要么给变量设置一个空的默认值）。

### 响应性数据的传递与接收{new}

之所以要单独拿出来说， 是因为变化真的很大 - -

在前面我们已经知道，provide 和 inject 本身不可响应，但是并非完全不能够拿到响应的结果，只需要我们传入的数据具备响应性，它依然能够提供响应支持。

我们以 `ref` 和 `reactive` 为例，来看看应该怎么发起 `provide` 和接收 `inject`。

对这 2 个 API 还不熟悉的同学，建议先阅读一下 [响应式 API 之 ref](component.md#响应式-api-之-ref-new) 和 [响应式 API 之 reactive](component.md#响应式-api-之-reactive-new) 。 

先在 `Grandfather.vue` 里 `provide` 数据：

```ts
export default defineComponent({
  // ...
  setup () {
    // provide一个ref
    const msg = ref<string>('Hello World!');
    provide('msg', msg);

    // provide一个reactive
    const userInfo: Member = reactive({
      id: 1,
      name: 'Petter'
    });
    provide('userInfo', userInfo);

    // 2s 后更新数据
    setTimeout(() => {
      // 修改消息内容
      msg.value = 'Hi World!';

      // 修改用户名
      userInfo.name = 'Tom';
    }, 2000);
  }
})
```

在 `Grandsun.vue` 里 `inject` 拿到数据：

```ts
export default defineComponent({
  setup () {
    // 获取数据
    const msg = inject('msg');
    const userInfo = inject('userInfo');

    // 打印刚刚拿到的数据
    console.log(msg);
    console.log(userInfo);

    // 因为 2s 后数据会变，我们 3s 后再看下，可以争取拿到新的数据
    setTimeout(() => {
      console.log(msg);
      console.log(userInfo);
    }, 3000);

    // 响应式数据还可以直接给 template 使用，会实时更新
    return {
      msg,
      userInfo
    }
  }
})
```

非常简单，非常方便！！！

:::tip
响应式的数据 `provide` 出去，在子孙组件拿到的也是响应式的，并且可以如同自身定义的响应式变量一样，直接 `return` 给 `template` 使用，一旦数据有变化，视图也会立即更新。

但上面这句话有效的前提是，不破坏数据的响应性，比如 ref 变量，你需要完整的传入，而不能只传入它的 `value`，对于 `reactive` 也是同理，不能直接解构去破坏原本的响应性。

切记！切记！！！
:::

### 引用类型的传递与接收

> 这里是针对非响应性数据的处理

provide 和 inject 并不是可响应的，这是官方的故意设计，但是由于引用类型的特殊性，在子孙组件拿到了数据之后，他们的属性还是可以正常的响应变化。

先在 `Grandfather.vue` 里 `provide` 数据：

```ts
export default defineComponent({
  // ...
  setup () {
    // provide 一个数组
    const tags: string[] = [ '中餐', '粤菜', '烧腊' ];
    provide('tags', tags);

    // provide 一个对象
    const userInfo: Member = {
      id: 1,
      name: 'Petter'
    };
    provide('userInfo', userInfo);

    // 2s 后更新数据
    setTimeout(() => {
      // 增加tags的长度
      tags.push('叉烧');

      // 修改userInfo的属性值
      userInfo.name = 'Tom';
    }, 2000);
  }
})
```

在 `Grandsun.vue` 里 `inject` 拿到数据：

```ts
export default defineComponent({
  setup () {
    // 获取数据
    const tags: string[] = inject('tags') || [];
    const userInfo: Member = inject('userInfo') || {
      id: 0,
      name: ''
    };

    // 打印刚刚拿到的数据
    console.log(tags);
    console.log(tags.length);
    console.log(userInfo);

    // 因为 2s 后数据会变，我们 3s 后再看下，能够看到已经是更新后的数据了
    setTimeout(() => {
      console.log(tags);
      console.log(tags.length);
      console.log(userInfo);
    }, 3000);
  }
})
```

引用类型的数据，拿到后可以直接用，属性的值更新后，子孙组件也会被更新。

:::warning
由于不具备真正的响应性，`return` 给模板使用依然不会更新视图，如果涉及到视图的数据，请依然使用 [响应式 API](component.md#响应式数据的变化-new) 。
:::

### 基本类型的传递与接收

> 这里是针对非响应性数据的处理

基本数据类型被直接 `provide` 出去后，再怎么修改，都无法更新下去，子孙组件拿到的永远是第一次的那个值。

先在 `Grandfather.vue` 里 `provide` 数据：

```ts
export default defineComponent({
  // ...
  setup () {
    // provide 一个数组的长度
    const tags: string[] = [ '中餐', '粤菜', '烧腊' ];
    provide('tagsCount', tags.length);

    // provide 一个字符串
    let name: string = 'Petter';
    provide('name', name);

    // 2s 后更新数据
    setTimeout(() => {
      // tagsCount 在 Grandson 那边依然是 3
      tags.push('叉烧');

      // name 在 Grandson 那边依然是 Petter
      name = 'Tom';
    }, 2000);
  }
})
```

在 `Grandsun.vue` 里 `inject` 拿到数据：

```ts
export default defineComponent({
  setup () {
    // 获取数据
    const name: string = inject('name') || '';
    const tagsCount: number = inject('tagsCount') || 0;

    // 打印刚刚拿到的数据
    console.log(name);
    console.log(tagsCount);

    // 因为 2s 后数据会变，我们 3s 后再看下
    setTimeout(() => {
      // 依然是 Petter
      console.log(name);

      // 依然是 3
      console.log(tagsCount);
    }, 3000);
  }
})
```

很失望，并没有变化。

:::tip
那么是否一定要定义成响应式数据或者引用类型数据呢？

当然不是，我们在 `provide` 的时候，也可以稍作修改，让它能够同步更新下去。
:::

我们再来一次，依然是先在 `Grandfather.vue` 里 `provide` 数据：

```ts
export default defineComponent({
  // ...
  setup () {
    // provide 一个数组的长度
    const tags: string[] = [ '中餐', '粤菜', '烧腊' ];
    provide('tagsCount', (): number => {
      return tags.length;
    });

    // provide 字符串
    let name: string = 'Petter';
    provide('name', (): string => {
      return name;
    });

    // 2s 后更新数据
    setTimeout(() => {
      // tagsCount 现在可以正常拿到 4 了
      tags.push('叉烧');

      // name 现在可以正常拿到 Tom 了
      name = 'Tom';
    }, 2000);
  }
})
```

再来 `Grandsun.vue` 里修改一下 `inject` 的方式，看看这次拿到的数据：

```ts
export default defineComponent({
  setup () {
    // 获取数据
    const tagsCount: any = inject('tagsCount');
    const name: any = inject('name');

    // 打印刚刚拿到的数据
    console.log(tagsCount());
    console.log(name());

    // 因为 2s 后数据会变，我们 3s 后再看下
    setTimeout(() => {
      // 现在可以正确得到 4
      console.log(tagsCount());

      // 现在可以正确得到 Tom
      console.log(name());
    }, 3000);
  }
})
```

这次可以正确拿到数据了，看出这2次的写法有什么区别了吗？

:::tip
基本数据类型，需要 `provide` 一个函数，将其 `return` 出去给子孙组件用，这样子孙组件每次拿到的数据才会是新的。

但由于不具备响应性，所以子孙组件每次都需要重新通过执行 `inject` 得到的函数才能拿到最新的数据。
:::

按我个人习惯来说，使用起来挺别扭的，能不用就不用……

:::warning
由于不具备真正的响应性，`return` 给模板使用依然不会更新视图，如果涉及到视图的数据，请依然使用 [响应式 API](component.md#响应式数据的变化-new) 。
:::

## 兄弟组件通信

兄弟组件是指两个组件都挂载在同一个 `Father.vue` 下，但两个组件之间并没有什么直接的关联，先看看他们的关系：

```
Father.vue
├─Brother.vue
└─LittleBrother.vue
```

既然没有什么直接关联， ╮(╯▽╰)╭ 所以也没有什么专属于他们的通信方式。

如果他们之间要交流，目前大概有这两类选择：

1. 【不推荐】先把数据传给 `Father.vue`，再通过 [父子组件通信](#父子组件通信) 的方案去交流

2. 【推荐】借助 [全局组件通信](#全局组件通信) 的方案才能达到目的。

## 全局组件通信

全局组件通信是指，两个任意的组件，不管是否有关联（e.g. 父子、爷孙）的组件，都可以直接进行交流的通信方案。

举个例子，像下面这样，`B2.vue` 可以采用全局通信方案，直接向 `D2.vue` 发起交流，而无需经过他们的父组件。

```
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

方案|发起方|接收方|对应章节传送门
:--|:--|:--|:--
EventBus|emit|on|[点击查看](#eventbus-new)
Vuex|-|-|[点击查看](#vuex-new)

## EventBus{new}

`EventBus` 通常被称之为 “全局事件总线” ，它是用来在全局范围内通信的一个常用方案，它的特点就是： “简单” 、 “灵活” 、“轻量级”。

:::tip
在中小型项目，全局通信推荐优先采用该方案，事件总线在打包压缩后不到 200 个字节， API 也非常简单和灵活。
:::

### 回顾 2.x

在 2.x，使用 EventBus 无需导入第三方插件，直接在自己的 `libs` 文件夹下创建一个 `bus.ts` 文件，暴露一个新的 Vue 实例即可。
 
```ts
import Vue from 'vue';
export default new Vue();
```

然后就可以在组件里引入 bus ，通过 `$emit` 去发起交流，通过 `$on` 去监听接收交流。

旧版方案的完整案例代码可以查看官方的 [2.x 语法 - 事件 API](https://v3.cn.vuejs.org/guide/migration/events-api.html#_2-x-%E8%AF%AD%E6%B3%95)

### 了解 3.x{new}

Vue 3.x 移除了 `$on` 、 `$off` 和 `$once` 这几个事件 API ，应用实例不再实现事件触发接口。

根据官方文档在 [迁移策略 - 事件 API](https://v3.cn.vuejs.org/guide/migration/events-api.html#%E8%BF%81%E7%A7%BB%E7%AD%96%E7%95%A5) 的推荐，我们可以用 [mitt](https://github.com/developit/mitt) 或者 [tiny-emitter](https://github.com/scottcorgan/tiny-emitter) 等第三方插件来实现 `EventBus` 。

### 创建 3.x 的 EventBus{new}

这里以 `mitt` 为例，示范如何创建一个 Vue 3.x 的 `EventBus` 。

首先，需要安装 `mitt` ：

```
npm install --save mitt
```

然后在 `libs` 文件夹下，创建一个 `bus.ts` 文件，内容和旧版写法其实是一样的，只不过是把 Vue 实例，换成了 mitt 实例。

```ts
import mitt from 'mitt';
export default mitt();
```

然后就可以定义发起和接收的相关事件了，常用的 API 和参数如下：

方法名称|作用
:--|:--
on|注册一个监听事件，用于接收数据
emit|调用方法发起数据传递
off|用来移除监听事件

`on` 的参数：

参数|类型|作用
:--|:--|:--
type|string \| symbol|方法名
handler|function|接收到数据之后要做什么处理的回调函数

这里的 `handler` 建议使用具名函数，因为匿名函数无法销毁。

`emit` 的参数：

参数|类型|作用
:--|:--|:--
type|string \| symbol|与 on 对应的方法名
data|any|与 on 对应的，允许接收的数据

`off` 的参数：

参数|类型|作用
:--|:--|:--
type|string \| symbol|与 on 对应的方法名
handler|function|要删除的，与 on 对应的 handler 函数名

更多的 API 可以查阅 [插件的官方文档](https://github.com/developit/mitt) ，在了解了最基本的用法之后，我们来开始配置一对交流。

:::tip
如果你需要把 `bus` 配置为全局 API ，不想在每个组件里分别 import 的话，可以参考之前的章节内容： [全局 API 挂载](plugin.md#全局-api-挂载) 。
:::

### 创建和移除监听事件{new}

在需要暴露交流事件的组件里，通过 `on` 配置好接收方法，同时为了避免路由切换过程中造成事件多次被绑定，多次触发，需要在适当的时机 `off` 掉：

```ts
import { defineComponent, onBeforeUnmount } from 'vue'
import bus from '@libs/bus'

export default defineComponent({
  setup () {
    // 定义一个打招呼的方法
    const sayHi = (msg: string = 'Hello World!'): void => {
      console.log(msg);
    }

    // 启用监听
    bus.on('sayHi', sayHi);

    // 在组件卸载之前移除监听
    onBeforeUnmount( () => {
      bus.off('sayHi', sayHi);
    })
  }
})
```

btw: 关于销毁的时机，可以参考 [组件的生命周期](component.md#组件的生命周期-new) 。

### 调用监听事件{new}

在需要调用交流事件的组件里，通过 `emit` 进行调用：

```ts
import { defineComponent } from 'vue'
import bus from '@libs/bus'

export default defineComponent({
  setup () {
    // 调用打招呼事件，传入消息内容
    bus.emit('sayHi', '哈哈哈哈哈哈哈哈哈哈哈哈哈哈');
  }
})
```

### 旧项目升级 EventBus

在 [Vue 3.x 的 EventBus](#创建-3-x-的-eventbus-new)，我们可以看到它的 API 和旧版是非常接近的，只是去掉了 `$` 符号。

如果你要对旧的项目进行升级改造，因为原来都是使用了 `$on` 、 `$emit` 等旧的 API ，一个一个组件去修改成新的 API 肯定不现实。

我们可以在创建 `bus.ts` 的时候，通过自定义一个 `bus` 对象，来挂载 `mitt` 的 API 。

在 `bus.ts` 里，改成以下代码：

```ts
import mitt from 'mitt';

// 初始化一个 mitt 实例
const emitter = mitt();

// 定义一个空对象用来承载我们的自定义方法
const bus: any = {};

// 把你要用到的方法添加到 bus 对象上
bus.$on = emitter.on;
bus.$emit = emitter.emit;

// 最终是暴露自己定义的 bus
export default bus;
```

这样我们在组件里就可以继续使用 `bus.$on` 、`bus.$emit` 等以前的老 API 了，不影响我们旧项目的升级使用。

## Vuex{new}

Vuex 是 Vue 生态里面非常重要的一个成员，运用于状态管理模式。

它也是一个全局的通信方案，对比 [EventBus](#eventbus-new)，Vuex 的功能更多，更灵活，但对应的，学习成本和体积也相对较大，通常大型项目才会用上 Vuex。

摘取一段官网的介绍，官方也只建议在大型项目里才用它：

>**什么情况下我应该使用 Vuex？**<br>
>Vuex 可以帮助我们管理共享状态，并附带了更多的概念和框架。这需要对短期和长期效益进行权衡。<br>
>如果您不打算开发大型单页应用，使用 Vuex 可能是繁琐冗余的。

### 在了解之前

在对 Vue 3.x 里是否需要使用 Vuex 的问题上，带有一定的争议，大部分开发者在社区发表的评论都认为通过 [EventBus](#eventbus-new) 和 [provide / inject](#provide-inject) ，甚至 export 一个 [reactive](component.md#响应式-api-之-reactive-new) 对象也足以满足大部分业务需求。

见仁见智，请根据自己的实际需要去看是否需要启用它。

我自己的话，目前的新项目也还没有特别深度的去用到 Vuex，目前来说，确实还用不上，所以这一部分也没有办法讲的很细。

好在新版 Vuex 和旧版几乎没什么区别，大家可以了解一下大概的变化之后，按照之前的官网文档去配置，使用其他应该没有太大的问题。

### Vuex 的目录结构

如果你在创建 Vue 项目的时候选择了带上 Vuex ，那么 `src` 文件夹下会自动生成 Vuex 的相关文件，如果创建时没有选择，你也可以自己按照下面解构去创建对应的目录与文件。

```
src
├─store
├───index.ts
└─main.ts
```

一般情况下一个 `index.ts` 足矣，它是 Vuex 的入口文件，如果你的项目比较庞大，你可以在 `store` 下创建一个 `modules` 文件夹，用 Vuex Modules 的方式导入到 `index.ts` 里去注册。

### 回顾 2.x

在 2.x ，你需要先分别导入 `Vue` 和 `Vuex`，`use` 后通过 `new Vuex.Store(...)` 的方式去初始化

```ts
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
```

### 了解 3.x{new}

而 3.x 简化了很多，只需要从 `vuex` 里导入 `createStore`，直接通过 `createStore` 去创建即可。

```ts
import { createStore } from 'vuex'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
```

### Vuex 的配置

除了初始化方式有一定的改变，Vuex 的其他的配置和原来是一样的，具体可以查看 [使用指南 - Vuex](https://next.vuex.vuejs.org/zh/guide/)

### 在组件里使用 Vuex{new}

和 2.x 不同的是，3.x 在组件里使用 Vuex，更像新路由那样，需要通过 `useStore` 去启用。

```ts
import { defineComponent } from 'vue'
import { useStore } from 'vuex';

export default defineComponent({
  setup () {
    // 需要创建一个 store 变量
    const store = useStore();

    // 再使用 store 去操作 Vuex 的 API
    // ...
  }
})
```

其他的用法，都是跟原来一样的。

## 本节结语

组件的通信在中大型项目里非常实用，它可以让你的组件避免写的又长又臭，可以按模块去拆分成不同的组件，然后通过组件之间的通信方式来关联起来。

<!-- 谷歌广告 -->
<ClientOnly>
  <google-adsense />
</ClientOnly>
<!-- 谷歌广告 -->

<!-- 评论 -->
<ClientOnly>
  <gitalk-comment
    :issueId="62"
  />
</ClientOnly>
<!-- 评论 -->
