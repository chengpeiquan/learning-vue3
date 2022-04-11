# 单组件的编写

项目搭好了，第一个要了解的肯定是组件的变化，由于这部分篇幅会非常大，所以会分成很多个小节，一部分一部分按照开发顺序来逐步了解。

btw: 出于对 Vue 3.0 的尊敬，以及前端的发展趋势，我们这一次是打算直接使用 `TypeScript` 来编写组件，对 TS 不太熟悉的同学，建议先对 TS 有一定的了解，然后一边写一边加深印象。

## 全新的 setup 函数{new}

在开始编写组件之前，我们需要了解两个全新的前置知识点：`setup` 与 `defineComponent`。

### 了解 setup

Vue 3.x 的 `composition api` 系列里，推出了一个全新的 `setup` 函数，它是一个组件选项，在创建组件之前执行，一旦 props 被解析，并作为组合式 API 的入口点。

:::tip
说的通俗一点，就是使用 Vue 3.x 的生命周期的情况下，整个组件相关的业务代码，都可以丢到 `setup` 里编写。

因为在 `setup` 之后，其他的生命周期才会被启用（点击了解：[组件的生命周期](#组件的生命周期-new)）。
:::

基本语法：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  setup (props, context) {
    // 业务代码写这里...
    
    return {
      // 需要给template用的数据、函数放这里return出去...
    }
  }
})
```

这里我还写了一个 `defineComponent`，也是本次的新东西，可以点击 [了解 defineComponent](#了解-definecomponent) 。

:::warning
使用 `setup` 的情况下，请牢记一点：不能再用 `this` 来获取 Vue 实例，也就是无法通过 `this.xxx` 、 `this.fn()` 这样来获取实例上的数据，或者执行实例上的方法。

全新的 3.x 组件编写，请继续往下看，会一步一步做说明。
:::

### setup 的参数使用

`setup` 函数包含了两个入参：

参数|类型|含义|是否必传
:--|:--|:--|:--
props|object|由父组件传递下来的数据|否
context|object|组件的执行上下文|否

**第一个参数 `props` ：**

它是响应式的（只要你不解构它，或者使用 [toRef / toRefs](#响应式-api-之-toref-与-torefs-new) 进行响应式解构），当传入新的 prop 时，它将被更新。

**第二个参数 `context` ：**

`context` 只是一个普通的对象，它暴露三个组件的 property：

属性|类型|作用
:--|:--|:--
attrs|非响应式对象|props 未定义的属性都将变成 attrs
slots|非响应式对象|插槽
emit|方法|触发事件

因为 `context` 只是一个普通对象，所以你可以直接使用 ES6 解构。

平时使用可以通过直接传入 `{ emit }` ，即可用 `emit('xxx')` 来代替使用 `context.emit('xxx')`，另外两个功能也是如此。

但是 `attrs` 和 `slots` 请保持 `attrs.xxx`、`slots.xxx` 来使用他们数据，不要解构这两个属性，因为他们虽然不是响应式对象，但会随组件本身的更新而更新。

两个参数的具体使用，可以详细了解可查阅 [组件之间的通信](communication.md) 一章。

### 了解 defineComponent

这是 Vue 3.x 推出的一个全新 API ，`defineComponent` 可以用于 `TypeScript` 的类型推导，帮你简化掉很多编写过程中的类型定义。

比如，你原本需要这样才可以使用 `setup`：

```ts
import { Slots } from 'vue'

// 声明props和return的数据类型
interface Data {
  [key: string]: unknown
}

// 声明context的类型
interface SetupContext {
  attrs: Data
  slots: Slots
  emit: (event: string, ...args: unknown[]) => void
}

// 使用的时候入参要加上声明，return也要加上声明
export default {
  setup(props: Data, context: SetupContext): Data {
    // ...

    return {
      // ...
    }
  }
}
```

是不是很繁琐？（肯定是啊！不用否定……

使用了 `defineComponent` 之后，你就可以省略这些类型定义：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  setup (props, context) {
    // ...
    
    return {
      // ...
    }
  }
})
```

而且不只适用于 `setup`，只要是 Vue 本身的 API ，`defineComponent` 都可以自动帮你推导。

在编写组件的过程中，你只需要维护自己定义的数据类型就可以了，专注于业务。

## 组件的生命周期{new}

在了解了两个前置知识点之后，也还不着急写组件，我们还需要先了解组件的生命周期，你才能够灵活的把控好每一处代码的执行结果达到你的预期。

### 升级变化

从 2.x 升级到 3.x，在保留对 2.x 的生命周期支持的同时，3.x 也带来了一定的调整。

:::tip
3.x 依然支持 2.x 的生命周期，但是不建议混搭使用，前期你可以继续使用 2.x 的生命周期，但还是**建议尽快熟悉并完全使用 3.x 的生命周期来编写你的组件**。
:::

生命周期的变化，可以直观的从下表了解：

2.x 生命周期|3.x 生命周期|执行时间说明
:-:|:-:|:-:
beforeCreate|setup|组件创建前执行
created|setup|组件创建后执行
beforeMount|onBeforeMount|组件挂载到节点上之前执行
mounted|onMounted|组件挂载完成后执行
beforeUpdate|onBeforeUpdate|组件更新之前执行
updated|onUpdated|组件更新完成之后执行
beforeDestroy|onBeforeUnmount|组件卸载之前执行
destroyed|onUnmounted|组件卸载完成后执行
errorCaptured|onErrorCaptured|当捕获一个来自子孙组件的异常时激活钩子函数

其中，在3.x，`setup` 的执行时机比 2.x 的 `beforeCreate` 和 `created` 还早，可以完全代替原来的这 2 个钩子函数。

另外，被包含在 `<keep-alive>` 中的组件，会多出两个生命周期钩子函数：

2.x 生命周期|3.x 生命周期|执行时间说明
:-:|:-:|:-:
activated|onActivated|被激活时执行
deactivated|onDeactivated|切换组件后，原组件消失前执行

### 使用 3.x 的生命周期

在 3.x ，**每个生命周期函数都要先导入才可以使用**，并且所有生命周期函数统一放在 `setup` 里运行。

如果你需要在达到 2.x 的 `beforeCreate` 和 `created` 目的的话，直接把函数执行在 `setup` 里即可。

比如：

```ts
import { defineComponent, onBeforeMount, onMounted } from 'vue'

export default defineComponent({
  setup () {

    console.log(1);
    
    onBeforeMount( () => {
      console.log(2);
    });
    
    onMounted( () => {
      console.log(3);
    });

    console.log(4);

    return {}
  }
})
```

最终将按照生命周期的顺序输出：

```js
// 1
// 4
// 2
// 3
```

## 组件的基本写法

btw：官网的例子片段挺多，使用 `JavaScript` 基本上没啥问题，故这里只讲述如何通过 `TypeScript` 来编写一个组件。

如果你是从 2.x 就开始写 TS 的话，应该知道在 2.x 的时候就已经有了 `extend` 和 `class component` 的基础写法；3.x 在保留 class 写法的同时，还推出了 `defineComponent` + `composition api`的新写法。

加上视图部分又有 `template` 和 `tsx` 的写法、以及 3.x 对不同版本的生命周期兼容，累计下来，在 Vue 里写 TS ，至少有 9 种不同的组合方式（我的认知内，未有更多的尝试），堪比孔乙己的回字（甚至吊打回字……

我们先来回顾一下这些写法组合分别是什么，了解一下 3.x 最好使用哪种写法：

### 回顾 2.x

在 2.x ，为了更好的 TS 推导，用的最多的还是 `class component` 的写法。

适用版本|基本写法|视图写法
:-:|:-:|:-:
2.x|Vue.extend|template
2.x|class component|template
2.x|class component|tsx

### 了解 3.x{new}

目前 3.x 从官方对版本升级的态度来看， `defineComponent` 就是为了解决之前 2.x 对 TS 推导不完善等问题而推出的，尤大也是更希望大家习惯 `defineComponent` 的使用。

适用版本|基本写法|视图写法|生命周期版本|官方是否推荐
:-:|:-:|:-:|:-:|:-:
3.x|class component|template|2.x|×
3.x|defineComponent|template|2.x|×
3.x|defineComponent|template|3.x|√
3.x|class component|tsx|2.x|×
3.x|defineComponent|tsx|2.x|×
3.x|defineComponent|tsx|3.x|√

btw: 我本来还想把每种写法都演示一遍，但写到这里，看到这么多种组合，我累了……

所以从接下来开始，都会以 `defineComponent` + `composition api` + `template` 的写法，并且按照 3.x 的生命周期来作为示范案例。

接下来，使用 `composition api` 来编写组件，先来实现一个最简单的 `Hello World!`。

:::warning
在 3.x ，只要你的数据要在 `template` 中使用，就必须在 `setup` 里return出来。

当然，只在函数中调用到，而不需要渲染到模板里的，则无需 return 。
:::

```vue
<template>
  <p class="msg">{{ msg }}</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    const msg = 'Hello World!';

    return {
      msg
    }
  }
})
</script>

<style lang="stylus" scoped>
.msg
  font-size 14px
</style>
```

和 2.x 一样，都是 `template` + `script` + `style` 三段式组合，上手非常简单。

`template` 和 2.x 可以说是完全一样（会有一些不同，比如 `router-link` 移除了 `tag` 属性等等，后面讲到了会说明）

`style` 则是根据你熟悉的预处理器或者原生 CSS 来写的，完全没有变化。

变化最大的就是 `script` 部分了。

## 响应式数据的变化 {new}

响应式数据是 MVVM 数据驱动编程的特色，相信大部分人当初入坑 MVVM 框架，都是因为响应式数据编程比传统的操作 DOM 要来得方便，而选择 Vue ，则是方便中的方便。

在 3.x，响应式数据当然还是得到了保留，但是对比 2.x 的写法， 3.x 的步伐迈的有点大。

:::tip
虽然官方文档做了一定的举例，但实际用起来还是会有一定的坑，比如可能你有些数据用着用着就失去了响应……

这些情况不是 bug ，_(:з)∠)_而是你用的姿势不对……

相对来说官方文档并不会那么细致的去提及各种场景的用法，包括在 `TypeScript` 中的类型定义，所以本章节主要通过踩坑心得的思路来复盘一下这些响应式数据的使用。
:::

相对于 2.x 在 `data` 里定义后即可通过 `this.xxx` 来调用响应式数据，3.x 的生命周期里取消了 Vue 实例的 `this`，你要用到的比如 `ref` 、`reactive` 等响应式 API ，都必须通过导入才能使用，然后在 `setup` 里定义。

```ts
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup () {
    const msg = ref<string>('Hello World!');

    return {
      msg
    }
  }
})
```

由于新的 API 非常多，但有些使用场景却不多，所以当前暂时只对常用的几个 API 做使用和踩坑说明，更多的 API 可以在官网查阅。

先放上官方文档：[响应性 API | Vue.js](https://v3.cn.vuejs.org/api/reactivity-api)

## 响应式 API 之 ref{new}

`ref` 是最常用的一个响应式 API，它可以用来定义所有类型的数据，包括 Node 节点。

没错，在 2.x 常用的 `this.$refs.xxx` 来取代 `document.querySelector('.xxx')` 获取 Node 节点的方式，也是用这个 API 来取代。

### 类型声明

在开始使用 API 之前，要先了解一下在 `TypeScript` 中，`ref` 需要如何进行类型声明。

平时我们在定义变量的时候，都是这样给他们进行类型声明的：

```ts
// 单类型
const msg: string = 'Hello World!';

// 多类型
const phoneNumber: number | string = 13800138000;
```

但是在使用 `ref` 时，不能这样子声明，会报错，正确的声明方式应该是使用 `<>` 来包裹类型定义，紧跟在 `ref` API 之后：

```ts
// 单类型
const msg = ref<string>('Hello World!');

// 多类型
const phoneNumber = ref<number | string>(13800138000);
```

### 变量的定义

了解了如何进行类型声明之后，对变量的定义就没什么问题了，前面说了它可以用来定义所有类型的数据，包括 Node 节点，但不同类型的值之间还是有少许差异和注意事项，具体可以参考如下。

#### 基本类型

对字符串、布尔值等基本类型的定义方式，比较简单：

```ts
// 字符串
const msg = ref<string>('Hello World!');

// 数值
const count = ref<number>(1);

// 布尔值
const isVip = ref<boolean>(false);
```

#### 引用类型

对于对象、数组等引用类型也适用，比如要定义一个对象：

```ts
// 声明对象的格式
interface Member {
  id: number,
  name: string
};

// 定义一个成员对象
const userInfo = ref<Member>({
  id: 1,
  name: 'Tom'
});
```

定义一个普通数组：

```ts
// 数字数组
const uids = ref<number[]>([ 1, 2, 3 ]);

// 字符串数组
const names = ref<string[]>([ 'Tom', 'Petter', 'Andy' ]);
```

定义一个对象数组：

```ts
// 声明对象的格式
interface Member {
  id: number,
  name: string
};

// 定义一个成员组
const memberList = ref<Member[]>([
  {
    id: 1,
    name: 'Tom'
  },
  {
    id: 2,
    name: 'Petter'
  }
]);
```

### DOM 元素与子组件

除了可以定义数据，`ref` 也有我们熟悉的用途，就是用来挂载节点，也可以挂在子组件上。

对于 2.x 常用的 `this.$refs.xxx` 来获取 DOM 元素信息，该 API 的使用方式也是同样：

模板部分依然是熟悉的用法，把 ref 挂到你要引用的 DOM 上。

```vue
<template>
  <!-- 挂载DOM元素 -->
  <p ref="msg">
    留意该节点，有一个ref属性
  </p>
  <!-- 挂载DOM元素 -->

  <!-- 挂载子组件 -->
  <Child ref="child" />
  <!-- 挂载子组件 -->
</template>
```

`script` 部分有三个最基本的注意事项：

:::tip
1. 定义挂载节点后，也是必须通过 `xxx.value` 才能正确操作到挂载的 DOM 元素或组件（详见下方的[变量的读取与赋值](#变量的读取与赋值)）；

2. 请保证视图渲染完毕后再执行 DOM 或组件的相关操作（需要放到生命周期的 `onMounted` 或者 `nextTick` 函数里，这一点在 2.x 也是一样）；

3. 该变量必须 `return` 出去才可以给到 `template` 使用（这一点是 3.x 生命周期的硬性要求，子组件的数据和方法如果要给父组件操作，也要 `return` 出来才可以）。
:::

配合上面的 `template` ，来看看 `script` 部分的具体例子：

```ts
import { defineComponent, onMounted, ref } from 'vue'
import Child from '@cp/Child.vue'

export default defineComponent({
  components: {
    Child
  },
  setup () {
    // 定义挂载节点，声明的类型详见下方附表
    const msg = ref<HTMLElement | null>(null);
    const child = ref<typeof Child | null>(null);

    // 请保证视图渲染完毕后再执行节点操作 e.g. onMounted / nextTick
    onMounted( () => {
      // 比如获取DOM的文本
      console.log(msg.value.innerText);

      // 或者操作子组件里的数据
      child.value.isShowDialog = true;
    });

    // 必须return出去才可以给到template使用
    return {
      msg,
      child
    }
  }
})
```

关于 DOM 和子组件的 TS 类型声明，可参考以下规则：

节点类型|声明类型|参考文档
:--|:--|:--
DOM 元素|使用 HTML 元素接口|[HTML 元素接口](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model#html_%E5%85%83%E7%B4%A0%E6%8E%A5%E5%8F%A3)
子组件|使用 typeof 获取子组件的类型|[typeof 操作符](https://zhuanlan.zhihu.com/p/311150643)

另外，关于这一小节，有一个可能会引起 TS 编译报错的情况是，新版本的脚手架创建出来的项目会默认启用 `--strictNullChecks` 选项，会导致案例中的代码无法正常运行（报错 `TS2531: Object is possibly 'null'.` ）。

原因是：默认情况下 `null` 和 `undefined` 是所有类型的子类型，但开启了 `strictNullChecks` 选项之后，会使 `null` 和 `undefined` 只能赋值给 `void` 和它们各自，这虽然是个更为严谨的选项，但因此也会带来一些影响赶工期的额外操作。

**有以下几种解决方案可以参考：**

1. 在涉及到相关操作的时候，对节点变量增加一个判断：

```ts
if ( child.value ) {
  // 读取子组件的数据
  console.log(child.value.num);

  // 执行子组件的方法
  child.value.sayHi('use if in onMounted');
}
```

2. 通过 TS 的可选符 ? 来将目标设置为可选，避免出现错误（这个方式不能直接修改子组件数据的值）

```ts
// 读取子组件的数据
console.log(child.value?.num);

// 执行子组件的方法
child.value?.sayHi('use ? in onMounted');
```

3. 在项目根目录下的 `tsconfig.json` 文件里，显式的关闭 `strictNullChecks` 选项，关闭后，由自己来决定是否需要对 `null` 进行判断：

```json
{
  "compilerOptions": {
    // ...
    "strictNullChecks": false
  },
  // ...
}
```

4. 使用 any 类型来代替，但是写 TS 还是尽量不要使用 any ，满屏的 AnyScript 不如写回 JS 。

### 变量的读取与赋值

被 `ref` 包裹的变量会全部变成对象，不管你定义的是什么类型的值，都会转化为一个 ref 对象，其中 ref 对象具有指向内部值的单个 property `.value`。

:::tip
读取任何 ref 对象的值都必须通过 `xxx.value` 才可以正确获取到。
:::

请牢记上面这句话，初拥 3.x 的同学很多 bug 都是由于这个问题引起的（包括我……

对于普通变量的值，读取的时候直接读变量名即可：

```ts
// 读取一个字符串
const msg: string = 'Hello World!';
console.log('msg的值', msg);

// 读取一个数组
const uids: number[] = [ 1, 2, 3 ];
console.log('第二个uid', uids[1]);
```

对 ref 对象的值的读取，切记！必须通过 value ！

```ts
// 读取一个字符串
const msg = ref<string>('Hello World!');
console.log('msg的值', msg.value);

// 读取一个数组
const uids = ref<number[]>([ 1, 2, 3 ]);
console.log('第二个uid', uids.value[1]);
```

普通变量都必须使用 `let` 才可以修改值，由于 ref 对象是个引用类型，所以可以在 `const` 定义的时候，直接通过 `.value` 来修改。

```ts
// 定义一个字符串变量
const msg = ref<string>('Hi!');

// 1s后修改它的值
setTimeout(() => {
  msg.value = 'Hello!'
}, 1000);
```

因此你在对接接口数据的时候，可以自由的使用 `forEach`、`map`、`filter` 等遍历函数来操作你的 ref 数组，或者直接重置它。

```ts
const data = ref<string[]>([]);

// 提取接口的数据
data.value = api.data.map( (item: any) => item.text );

// 重置数组
data.value = [];
```

问我为什么突然要说这个？因为涉及到下一部分的知识，关于 `reactive` 的。

## 响应式 API 之 reactive{new}

`reactive` 是继 `ref` 之后最常用的一个响应式 API 了，相对于 `ref`，它的局限性在于只适合对象、数组。

:::tip
使用 `reactive` 的好处就是写法跟平时的对象、数组几乎一模一样，但它也带来了一些特殊注意点，请留意赋值部分的特殊说明。
:::

### 类型声明与定义

`reactive` 的声明方式，以及定义方式，没有 `ref` 的变化那么大，就是和普通变量一样。

reactive 对象：

```ts
// 声明对象的格式
interface Member {
  id: number,
  name: string
};

// 定义一个成员对象
const userInfo: Member = reactive({
  id: 1,
  name: 'Tom'
});
```

reactive 数组：

```ts
// 普通数组
const uids: number[] = [ 1, 2, 3];

// 对象数组
interface Member {
  id: number,
  name: string
};

// 定义一个成员对象数组
const userList: Member[] = reactive([
  {
    id: 1,
    name: 'Tom'
  },
  {
    id: 2,
    name: 'Petter'
  },
  {
    id: 3,
    name: 'Andy'
  }
]);
```

### 变量的读取与赋值

reactive 对象在读取字段的值，或者修改值的时候，与普通对象是一样的。

reactive 对象：

```ts
// 声明对象的格式
interface Member {
  id: number,
  name: string
};

// 定义一个成员对象
const userInfo: Member = reactive({
  id: 1,
  name: 'Tom'
});

// 读取用户名
console.log(userInfo.name);

// 修改用户名
userInfo.name = 'Petter';
```

但是对于 reactive 数组，和普通数组会有一些区别。

先看看普通数组，重置，或者改变值，都是可以直接轻松的进行操作：

```ts
// 定义一个普通数组
let uids: number[] = [ 1, 2, 3 ];

// 从另外一个对象数组里提取数据过来
uids = api.data.map( item => item.id );

// 合并另外一个数组
let newUids: number[] = [ 4, 5, 6 ];
uids = [...uids, ...newUids];

// 重置数组
uids = [];
```

在 2.x 的时候，你在操作数组时，完全可以和普通数组那样随意的处理数据的变化，依然能够保持响应性。

但在 3.x ，如果你使用 `reactive` 定义数组，则不能这么搞了，必须只使用那些不会改变引用地址的操作。

:::tip
按照原来的思维去使用 `reactive` 数组，会造成数据变了，但模板不会更新的 bug ，如果你遇到类似的情况，可以从这里去入手排查问题所在。
:::

举个例子，比如你要从接口读取翻页数据的时候，通常要先重置数组，再异步添加数据：

如果你使用常规的重置，会导致这个变量失去响应性：

```ts
/** 
 * 不推荐使用这种方式
 * 异步添加数据后，模板不会响应更新
 */
let uids: number[] = reactive([ 1, 2, 3 ]);

// 丢失响应性的步骤
uids = [];

// 异步获取数据后，模板依然是空数组
setTimeout( () => {
  uids.push(1);
}, 1000);
```

要让模板那边依然能够保持响应性，则必须在关键操作时，不破坏响应性 API 的存在。

```ts
/** 
 * 不推荐使用这种方式
 * 异步添加数据后，模板不会响应更新
 */
let uids: number[] = reactive([ 1, 2, 3 ]);

// 不会破坏响应性
uids.length = 0;

// 异步获取数据后，模板可以正确的展示
setTimeout( () => {
  uids.push(1);
}, 1000);
```

### 特别注意

不要对通过 `reactive` 定义的对象进行解构，解构后得到的变量会失去响应性。

比如这些情况，在 2s 后都得不到新的 name 信息：

```ts
import { defineComponent, reactive } from 'vue'

interface Member {
  id: number,
  name: string
};

export default defineComponent({
  setup () {

    // 定义一个带有响应性的成员对象
    const userInfo: Member = reactive({
      id: 1,
      name: 'Petter'
    });

    // 2s后更新userInfo
    setTimeout( () => {
      userInfo.name = 'Tom';
    }, 2000);

    // 这个变量在2s后不会同步更新
    const newUserInfo: Member = {...userInfo};

    // 这个变量在2s后不会再同步更新
    const { name } = userInfo;

    // 这样return出去给模板用，在2s后也不会同步更新
    return {
      ...userInfo
    }
  }
})
```

## 响应式 API 之 toRef 与 toRefs{new}

看到这里之前，应该对 `ref` 和 `reactive` 都有所了解了，为了方便开发者，Vue 3.x 还推出了 2 个与之相关的 API ，用于 `reactive` 向 `ref` 转换。

### 各自的作用

两个 API 的拼写非常接近，顾名思义，一个是只转换一个字段，一个是转换所有字段。

API|作用
:--|:--
toRef|创建一个新的ref变量，转换 reactive 对象的某个字段为ref变量
toRefs|创建一个新的对象，它的每个字段都是 reactive 对象各个字段的ref变量

我们先定义好一个 `reactive` 变量：

```ts
interface Member {
  id: number,
  name: string
};

const userInfo: Member = reactive({
  id: 1,
  name: 'Petter'
});
```

然后来看看这 2 个 API 应该怎么使用。

### 使用 toRef

`toRef` 接收 2 个参数，第一个是 `reactive` 对象, 第二个是要转换的 `key` 。

在这里我们只想转换 `userInfo` 里的 `name` ，只需要这样操作：

```ts
const name: string = toRef(userInfo, 'name');
```

这样就成功创建了一个 `ref` 变量。

之后读取和赋值就使用 `name.value`，它会同时更新 `name` 和 `userInfo.name`。 

:::tip
在 `toRef` 的过程中，如果使用了原对象上面不存在的 `key` ，那么定义出来的变量的 `value` 将会是 `undefined` 。

如果你对这个不存在的 `key` 的 `ref` 变量，进行了 `value` 赋值，那么原来的对象也会同步增加这个 `key`，其值也会同步更新。
:::

### 使用 toRefs

`toRefs` 接收 1 个参数，是一个 `reactive` 对象。

```ts
const userInfoRefs: Member = toRefs(userInfo);
```

这个新的 `userInfoRefs` ，本身是个普通对象，但是它的每个字段，都是与原来关联的 `ref` 变量。

### 为什么要进行转换

关于为什么要出这么 2 个 API ，官方文档没有特别说明，不过经过自己的一些实际使用，以及在写上一节 `reactive` 的 [特别注意](#特别注意)，可能知道一些使用理由。

`ref` 和 `reactive` 这两者的好处就不重复了，但是在使用的过程中，各自都有各自不方便的地方：

1. `ref` 虽然在 `template` 里使用起来方便，但比较烦的一点是在 `script` 里进行读取/赋值的时候，要一直记得加上 `.value` ，否则bug就来了

2. `reactive` 虽然在使用的时候，因为你知道它本身是一个 `Object` 类型，所以你不会忘记 `foo.bar` 这样的格式去操作，但是在 `template` 渲染的时候，你又因此不得不每次都使用 `foo.bar` 的格式去渲染

那么有没有办法，既可以在编写 `script` 的时候不容易出错，在写 `template` 的时候又比较简单呢？

于是， `toRef` 和 `toRefs` 因此诞生。

### 什么场景下比较适合使用它们

从便利性和可维护性来说，最好只在功能单一、代码量少的组件里使用，比如一个表单组件，通常表单的数据都放在一个对象里。

当然你也可以更猛一点就是把所有的数据都定义到一个 `data` 里，然后你再去 `data` 里面取…但是没有必要为了转换而转换。

### 在业务中的具体运用

这一部分我一直用 `userInfo` 来当案例，那就继续以一个用户信息表的小 demo 来做这个的演示吧。

**在 `script` 部分：**

1. 先用 `reactive` 定义一个源数据，所有的数据更新，都是修改这个对象对应的值，按照对象的写法去维护你的数据

2. 再通过 `toRefs` 定义一个给 `template` 用的对象，它本身不具备响应性，但是它的字段全部是 `ref` 变量

3. 在 `return` 的时候，对 `toRefs` 对象进行解构，这样导出去就是各个字段对应的 `ref` 变量，而不是一整个对象

```ts
import { defineComponent, reactive, toRefs } from 'vue'

interface Member {
  id: number,
  name: string,
  age: number,
  gender: string
};

export default defineComponent({
  setup () {
    // 定义一个reactive对象
    const userInfo = reactive({
      id: 1,
      name: 'Petter',
      age: 18,
      gender: 'male'
    })

    // 定义一个新的对象，它本身不具备响应性，但是它的字段全部是ref变量
    const userInfoRefs = toRefs(userInfo);

    // 2s后更新userInfo
    setTimeout( () => {
      userInfo.id = 2;
      userInfo.name = 'Tom';
      userInfo.age = 20;
    }, 2000);

    // 在这里结构toRefs对象才能继续保持响应式
    return {
      ...userInfoRefs
    }
  }
})
```

**在 `template` 部分：**

由于 `return` 出来的都是 `ref` 变量，所以你在模板里直接使用 `userInfo` 各个字段的 `key` 即可。

```vue
<template>
  <ul class="user-info">

    <li class="item">
      <span class="key">ID:</span>
      <span class="value">{{ id }}</span>
    </li>

    <li class="item">
      <span class="key">name:</span>
      <span class="value">{{ name }}</span>
    </li>

    <li class="item">
      <span class="key">age:</span>
      <span class="value">{{ age }}</span>
    </li>

    <li class="item">
      <span class="key">gender:</span>
      <span class="value">{{ gender }}</span>
    </li>

  </ul>
</template>
```

### 需要注意的问题

请注意是否有相同命名的变量存在，比如上面在 `return` 给 `template` 使用时，解构 `userInfoRefs` 的时候已经包含了一个 `name` 字段，此时如果还有一个单独的变量也叫 `name`。

:::tip
那么他们谁会生效，取决于谁排在后面。

因为 `return` 出去的其实是一个对象，在对象里，如果存在相同的 `key` ，则后面那个会覆盖前面的。
:::

这种情况下，会以单独定义的 `name` 为渲染数据。

```ts
return {
  ...userInfoRefs,
  name
}
```

这种情况下，则是以 `userInfoRefs` 里的 `name` 为渲染数据。

```ts
return {
  name,
  ...userInfoRefs
}
```

所以当你决定使用 `toRef` 和 `toRefs` 的时候，请注意这个特殊情况！

## 函数的定义和使用{new}

在了解了响应式数据如何使用之后，接下来就要开始了解函数了。

在 2.x，函数都是放在 `methods` 对象里定义，然后再在 `mounted` 等生命周期或者模板里通过 `click` 使用。

但在 3.x 的生命周期里，和数据的定义一样，都是通过 `setup` 来完成。

:::tip
1. 你可以在 `setup` 里定义任意类型的函数（普通函数、class 类、箭头函数、匿名函数等等）

2. 需要自动执行的函数，执行时机需要遵循生命周期

3. 需要暴露给模板去通过 `click`、`change` 等行为来触发的函数，需要把函数名在 `setup` 里进行 `return` 才可以在模板里使用
:::

简单写一下例子：

```vue
<template>
  <p>{{ msg }}</p>

  <!-- 在这里点击执行return出来的方法 -->
  <button @click="changeMsg">修改MSG</button>
  <!-- 在这里点击执行return出来的方法 -->
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  setup () {
    const msg = ref<string>('Hello World!');

    // 这个要暴露给模板使用，必须return才可以使用
    function changeMsg () {
      msg.value = 'Hi World!';
    }

    // 这个要在页面载入时执行，无需return出去
    const init = () => {
      console.log('init');
    }

    // 在这里执行init
    onMounted( () => {
      init();
    });

    return {
      // 数据
      msg,

      // 方法
      changeMsg
    }
  }
})
</script>
```

## 数据的监听{new}

监听数据变化也是组件里的一项重要工作，比如监听路由变化、监听参数变化等等。

Vue 3.x 在保留原来的 `watch` 功能之外，还新增了一个 `watchEffect` 帮助我们更简单的进行监听。

### watch

在 Vue 3 ，新版的 `watch` 和 Vue 2 的旧版写法对比，在使用方式上变化非常大！

#### 回顾 2.x

在 Vue 2 是这样用的，和 `data` 、 `methods` 都在同级配置：

```ts
export default {
  data() {
    return {
      // ...
    }
  },
  // 注意这里，放在 data 、 methods 同个级别
  watch: {
    // ...
  },
  methods: {
    // ...
  }
}
```

并且类型繁多，选项式 API 的类型如下：

```ts
watch: { [key: string]: string | Function | Object | Array}
```

联合类型过多，意味着用法复杂，下面是个很好的例子，虽然出自 [官网](https://v3.cn.vuejs.org/api/options-data.html#watch) 的用法介绍，但也反映出来对初学者不太友好，初次接触可能会觉得一头雾水：

```ts
export default {
  data() {
    return {
      a: 1,
      b: 2,
      c: {
        d: 4
      },
      e: 5,
      f: 6
    }
  },
  watch: {
    // 侦听顶级 property
    a(val, oldVal) {
      console.log(`new: ${val}, old: ${oldVal}`)
    },
    // 字符串方法名
    b: 'someMethod',
    // 该回调会在任何被侦听的对象的 property 改变时被调用，不论其被嵌套多深
    c: {
      handler(val, oldVal) {
        console.log('c changed')
      },
      deep: true
    },
    // 侦听单个嵌套 property
    'c.d': function (val, oldVal) {
      // do something
    },
    // 该回调将会在侦听开始之后被立即调用
    e: {
      handler(val, oldVal) {
        console.log('e changed')
      },
      immediate: true
    },
    // 你可以传入回调数组，它们会被逐一调用
    f: [
      'handle1',
      function handle2(val, oldVal) {
        console.log('handle2 triggered')
      },
      {
        handler: function handle3(val, oldVal) {
          console.log('handle3 triggered')
        }
        /* ... */
      }
    ]
  },
  methods: {
    someMethod() {
      console.log('b changed')
    },
    handle1() {
      console.log('handle 1 triggered')
    }
  }
}
```

当然肯定也会有人觉得这样选择多是个好事，选择适合自己的就好，但我个人还是感觉，这种写法对于初学者来说不是那么友好，有些过于复杂化，如果一个用法可以适应各种各样的场景，岂不是更妙？

:::tip
另外需要注意的是，不能使用箭头函数来定义 watcher 函数 (例如 `searchQuery: newValue => this.updateAutocomplete(newValue)` )。

因为箭头函数绑定了父级作用域的上下文，所以 `this` 将不会按照期望指向组件实例， `this.updateAutocomplete` 将是 `undefined` 。
:::

Vue 2 也可以通过 `this.$watch()` 这个 API 的用法来实现对某个数据的监听，它接受三个参数： `source` 、 `callback` 和 `options` 。

```ts
export default {
  data() {
    return {
      a: 1,
    }
  },
  // 生命周期钩子
  mounted() {
    this.$watch('a', (newVal, oldVal) => {
      // ...
    })
  }
}
```

由于 `this.$watch` 的用法和 Vue 3 比较接近，所以这里不做过多的回顾，请直接看 [了解 3.x](#了解-3-x) 部分。

#### 了解 3.x

在 Vue 3 的组合式 API 写法， `watch` 是一个可以接受 3 个参数的函数（保留了 Vue 2 的 `this.$watch` 这种用法），在使用层面上简单了好多。

```ts
import { watch } from 'vue'

// 一个用法走天下
watch(
  source, // 必传，要监听的数据源
  callback, // 必传，监听到变化后要执行的回调函数
  // options // 可选，一些监听选项
)
```

下面的内容都基于 Vue 3 的组合式 API 用法展开讲解。

#### API 的 TS 类型

在了解用法之前，先对它的 TS 类型定义做一个简单的了解， watch 作为组合式 API ，根据使用方式有两种类型定义：

1. 基础用法的 TS 类型，详见 [基础用法](#基础用法) 部分

```ts
// watch 部分的 TS 类型
// ...
export declare function watch<T, Immediate extends Readonly<boolean> = false>(
  source: WatchSource<T>,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchOptions<Immediate>
): WatchStopHandle
// ...
```

2. 批量监听的 TS 类型，详见 [批量监听](#批量监听) 部分

```ts
// watch 部分的 TS 类型
// ...
export declare function watch<
  T extends MultiWatchSources,
  Immediate extends Readonly<boolean> = false
>(
  sources: [...T],
  cb: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
  options?: WatchOptions<Immediate>
): WatchStopHandle

// MultiWatchSources 是一个数组
declare type MultiWatchSources = (WatchSource<unknown> | object)[];
// ...
```

但是不管是基础用法还是批量监听，可以看到这个 API 都是接受 3 个入参：

参数|是否可选|含义
:-:|:-:|:--
source|必传|数据源（详见：[要监听的数据源](#要监听的数据源)）
callback|必传|监听到变化后要执行的回调函数（详见：[监听后的回调函数](#监听后的回调函数)）
options|可选|一些监听选项（详见：[监听的选项](#监听的选项)）

并返回一个可以用来停止监听的函数（详见：[停止监听](#停止监听)）。

#### 要监听的数据源

在上面 [API 的 TS 类型](#api-的-ts-类型) 已经对 watch API 的组成有一定的了解了，这里先对数据源的类型和使用限制做下说明。

:::tip
如果不提前了解，在使用的过程中可能会遇到 “监听了但没有反应” 的情况出现。

另外，这部分内容会先围绕基础用法展开说明，批量监听会在 [批量监听](#批量监听) 部分单独说明。
:::

watch API 的第 1 个参数 `source` 是要监听的数据源，它的 TS 类型如下：

```ts
// watch 第 1 个入参的 TS 类型
// ...
export declare type WatchSource<T = any> = Ref<T> | ComputedRef<T> | (() => T)
// ...
```

可以看到能够用于监听的数据，是通过 [响应式 API](#响应式数据的变化-new) 定义的变量（ `Ref<T>` ），或者是一个 [计算数据](#数据的计算-new) （ `ComputedRef<T>` ），或者是一个 [getter 函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/get) （ `() => T` ）。

所以要想定义的 watch 能够做出预期的行为，数据源必须具备响应性或者是一个 getter ，如果只是通过 `let` 定义一个普通变量，然后去改变这个变量的值，这样是无法监听的。

:::tip
如果要监听响应式对象里面的某个值（这种情况下对象本身是响应式，但它的 property 不是），需要写成 getter 函数，简单的说就是需要写成有返回值的函数，这个函数 return 你要监听的数据， e.g. `() => foo.bar` ，可以结合下方 [基础用法](#基础用法) 的例子一起理解。
:::

#### 监听后的回调函数

在上面 [API 的 TS 类型](#api-的-ts-类型) 介绍了 watch API 的组成，和数据源一样，先了解一下回调函数的定义。

:::tip
和数据源部分一样，回调函数的内容也是会先围绕基础用法展开说明，批量监听会在 [批量监听](#批量监听) 部分单独说明。
:::

watch API 的第 2 个参数 `callback` 是监听到数据变化时要做出的行为，它的 TS 类型如下：

```ts
// watch 第 2 个入参的 TS 类型
// ...
export declare type WatchCallback<V = any, OV = any> = (
  value: V,
  oldValue: OV,
  onCleanup: OnCleanup
) => any
// ...
```

乍一看它有三个参数，但实际上这些参数不是你自己定义的，而是 watch API 传给你的，所以不管你用或者不用，它们都在那里：

参数|作用
:--|:--
value|变化后的新值，类型和数据源保持一致
oldValue|变化前的旧值，类型和数据源保持一致
onCleanup|注册一个清理函数，详见 [监听效果清理](#监听效果清理) 部分

注意：第一个参数是新值，第二个才是原来的旧值！

如同其他 JS 函数，在使用 watch 的回调函数时，可以对这三个参数任意命名，比如把 `value` 命名为你觉得更容易理解的 `newValue` 。

:::tip
如果监听的数据源是一个 [引用类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#%E5%AF%B9%E8%B1%A1) 时（ e.g. `Object` 、 `Array` 、 `Date` … ）， `value` 和 `oldValue` 是完全相同的，因为指向同一个对象。
:::

另外，默认情况下，`watch` 是惰性的，也就是只有当被监听的数据源发生变化时才执行回调。

#### 基础用法

来到这里，对 2 个必传的参数都有一定的了解了，我们先看看基础的用法，也就是日常最常编写的方案，我们只需要先关注前 2 个必传的参数。

```ts
// 不要忘了导入要用的 API
import { defineComponent, reactive, watch } from 'vue'

export default defineComponent({
  setup() {
    // 定义一个响应式数据
    const userInfo = reactive({
      name: 'Petter',
      age: 18,
    })

    // 2s后改变数据
    setTimeout(() => {
      userInfo.name = 'Tom'
    }, 2000)

    /**
     * 可以直接监听这个响应式对象
     * callback 的参数如果不用可以不写
     */
    watch(userInfo, () => {
      console.log('监听整个 userInfo ', userInfo.name)
    })

    /**
     * 也可以监听对象里面的某个值
     * 此时数据源需要写成 getter 函数
     */
    watch(
      // 数据源，getter 形式
      () => userInfo.name,
      // 回调函数 callback
      (newValue, oldValue) => {
        console.log('只监听 name 的变化 ', userInfo.name)
        console.log('打印变化前后的值', { oldValue, newValue })
      }
    )
  },
})
```

一般的业务场景，基础用法足以面对。

如果你有多个数据源要监听，并且监听到变化后要执行的行为一样，那么可以使用 [批量监听](#批量监听) 。

特殊的情况下，你可以搭配 [监听的选项](#监听的选项) 做一些特殊的用法，详见下面部分的内容。

#### 批量监听

如果你有多个数据源要监听，并且监听到变化后要执行的行为一样，第一反应可能是这样来写：

1. 抽离相同的处理行为为公共函数
2. 然后定义多个监听操作，传入这个公共函数

```ts{15-25}
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  setup() {
    const message = ref<string>('')
    const index = ref<number>(0)

    // 2s后改变数据
    setTimeout(() => {
      // 来到这里才会触发 watch 的回调
      message.value = 'Hello World!'
      index.value++
    }, 2000)

    // 抽离相同的处理行为为公共函数
    const handleWatch = (
      newValue: string | number,
      oldValue: string | number
    ): void => {
      console.log({ newValue, oldValue })
    }

    // 然后定义多个监听操作，传入这个公共函数
    watch(message, handleWatch)
    watch(index, handleWatch)
  },
})
```

这样写其实没什么问题，不过除了抽离公共代码的写法之外， watch API 还提供了一个批量监听的用法，和 [基础用法](#基础用法) 的区别在于，数据源和回调参数都变成了数组的形式。

数据源：以数组的形式传入，里面每一项都是一个响应式数据。

回调参数：原来的 `value` 和 `newValue` 也都变成了数组，每个数组里面的顺序和数据源数组排序一致。

可以看下面的这个例子更为直观：

```ts{17,19}
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  setup() {
    // 定义多个数据源
    const message = ref<string>('')
    const index = ref<number>(0)

    // 2s后改变数据
    setTimeout(() => {
      message.value = 'Hello World!'
      index.value++
    }, 2000)

    watch(
      // 数据源改成了数组
      [message, index],
      // 回调的入参也变成了数组，每个数组里面的顺序和数据源数组排序一致
      ([newMessage, newIndex], [oldMessage, oldIndex]) => {
        console.log('message 的变化', { newMessage, oldMessage })
        console.log('index 的变化', { newIndex, oldIndex })
      }
    )
  },
})
```

什么情况下可能会用到批量监听呢？比如一个子组件有多个 props ，当有任意一个 prop 发生变化时，都需要执行初始化函数重置组件的状态，那么这个时候就可以用上这个功能啦！

:::tip
在适当的业务场景，你也可以使用 [watchEffect](#watchEffect) 来完成批量监听，但请留意 [功能区别](#和-watch-的区别) 部分的说明。
:::

#### 监听的选项

在 [API 的 TS 类型](#api-的-ts-类型) 里提到， watch API 还接受第 3 个参数 `options` ，可选的一些监听选项。

它的 TS 类型如下：

```ts
// watch 第 3 个入参的 TS 类型
// ...
export declare interface WatchOptions<Immediate = boolean>
  extends WatchOptionsBase {
  immediate?: Immediate
  deep?: boolean
}
// ...

// 继承的 base 类型
export declare interface WatchOptionsBase extends DebuggerOptions {
  flush?: 'pre' | 'post' | 'sync'
}
// ...

// 继承的 debugger 选项类型
export declare interface DebuggerOptions {
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}
// ...
```

`options` 是一个对象的形式传入，有以下几个选项：

选项|类型|默认值|可选值|作用
:-:|:-:|:-:|:-:|:--
deep|boolean|true|true \| false|是否进行深度监听
immediate|boolean|false|true \| false|是否立即执行监听回调
flush|string|'pre'|'pre' \| 'post' \| 'sync'|控制监听回调的调用时机
onTrack|(e) => void|||在数据源被追踪时调用
onTrigger|(e) => void|||在监听回调被触发时调用

其中 `onTrack` 和 `onTrigger` 的 `e` 是 debugger 事件，建议在回调内放置一个 [debugger 语句](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/debugger) 以调试依赖，这两个选项仅在开发模式下生效。

#### 监听选项之 deep

`deep` 选项接受一个布尔值，可以设置为 `true` 开启深度监听，或者是 `false` 关闭深度监听，在 Vue 3 默认是开启深度监听，这一点和 Vue 2 不一样， Vue 2 需要手动开启。

设置为 `false` 的情况下，如果直接监听一个响应式的 [引用类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#%E5%AF%B9%E8%B1%A1) 数据（e.g. `Object` 、 `Array` … ），虽然它的属性的值有变化，但对其本身来说是不变的，所以不会触发 watch 的 callback 。

下面是一个关闭了深度监听的例子：

```ts{23-26}
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  setup() {
    // 定义一个响应式数据，注意我是用的 ref 来定义
    const nums = ref<number[]>([])

    // 2s后给这个数组添加项目
    setTimeout(() => {
      nums.value.push(1)

      // 可以打印一下，确保数据确实变化了
      console.log('修改后', nums.value)
    }, 2000)

    // 但是这个 watch 不会按预期执行
    watch(
      nums,
      // 这里的 callback 不会被触发
      () => {
        console.log('触发监听', nums.value)
      },
      // 因为关闭了 deep
      {
        deep: false,
      }
    )
  },
})
```

类似这种情况，你需要把 `deep` 设置为 `true` 才可以触发监听。

:::tip
可以看到我的例子特地用了 [ref API](#响应式-api-之-ref-new) ，这是因为通过 [reactive API](#响应式-api-之-reactive-new) 定义的对象无法将 `deep` 成功设置为 `false` （这一点在目前的官网文档未找到说明，最终是在 [watch API 的源码](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/apiWatch.ts#L212) 上找到了答案）。

```ts{4}
// ...
if (isReactive(source)) {
  getter = () => source
  deep = true // 被强制开启了
}
// ...
```
:::

#### 监听选项之 immediate

在 [监听后的回调函数](#监听后的回调函数) 部分有了解过， watch 默认是惰性的，也就是只有当被监听的数据源发生变化时才执行回调。

这句话是什么意思呢？来看一下这段代码，为了减少 [deep](#监听选项之-deep) 选项的干扰，我们换一个类型，换成 `string` 数据来演示，请留意我的注释：

```ts
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  setup() {
    // 这个时候不会触发 watch 的回调
    const message = ref<string>('')

    // 2s后改变数据
    setTimeout(() => {
      // 来到这里才会触发 watch 的回调
      message.value = 'Hello World!'
    }, 2000)

    watch(message, () => {
      console.log('触发监听', message.value)
    })
  },
})
```

可以看到，数据在初始化的时候并不会触发监听回调，如果有需要的话，通过 `immediate` 选项来让它直接触发。

`immediate` 选项接受一个布尔值，默认是 `false` ，你可以设置为 `true` 让回调立即执行。

我们改成这样，请留意高亮的代码部分和新的注释：

```ts{5-6,19-22}
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  setup() {
    // 这一次在这里可以会触发 watch 的回调了
    const message = ref<string>('')

    // 2s后改变数据
    setTimeout(() => {
      // 这一次，这里是第二次触发 watch 的回调，不再是第一次
      message.value = 'Hello World!'
    }, 2000)

    watch(
      message,
      () => {
        console.log('触发监听', message.value)
      },
      // 设置 immediate 选项
      {
        immediate: true,
      }
    )
  },
})
```

注意，在带有 immediate 选项时，不能在第一次回调时取消该数据源的监听，详见 [停止监听](#停止监听) 部分。

#### 监听选项之 flush

`flush` 选项是用来控制 [监听回调](#监听后的回调函数) 的调用时机，接受指定的字符串，可选值如下，默认是 `'pre'` 。

可选值|回调的调用时机|使用场景
:-:|:--|:--
'pre'|将在渲染前被调用|允许回调在模板运行前更新了其他值
'sync'|在渲染时被同步调用|目前来说没什么好处，可以了解但不建议用…
'post'|被推迟到渲染之后调用|如果要通过 ref 操作 [DOM 元素与子组件](#dom-元素与子组件) ，需要使用这个值来启用该选项，以达到预期的执行效果

对于 `'pre'` 和 `'post'` ，回调使用队列进行缓冲。回调只被添加到队列中一次。

即使观察值变化了多次，值的中间变化将被跳过，不会传递给回调，这样做不仅可以提高性能，还有助于保证数据的一致性。

更多关于 flush 的信息，请参阅 [副作用刷新时机](https://v3.cn.vuejs.org/guide/reactivity-computed-watchers.html#%E5%89%AF%E4%BD%9C%E7%94%A8%E5%88%B7%E6%96%B0%E6%97%B6%E6%9C%BA) 。

#### 停止监听

如果你在 [setup](#全新的-setup-函数-new) 或者 [script-setup](efficient.md#script-setup-new) 里使用 watch 的话， [组件被卸载](#组件的生命周期-new) 的时候也会一起被停止，一般情况下不太需要关心如何停止监听。

不过有时候你可能想要手动取消， Vue 3 也提供了方法。

:::tip
随着组件被卸载一起停止的前提是，侦听器必须是 [同步语句](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Asynchronous/Introducing#%E5%90%8C%E6%AD%A5javascript) 创建的，这种情况下侦听器会绑定在当前组件上。

如果放在 `setTimeout` 等 [异步函数](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Asynchronous/Introducing#%E5%BC%82%E6%AD%A5javascript) 里面创建，则不会绑定到当前组件，因此组件卸载的时候不会一起停止该侦听器，这种时候你就需要手动停止监听。
:::

在 [API 的 TS 类型](#api-的-ts-类型) 有提到，当你在定义一个 watch 行为的时候，它会返回一个用来停止监听的函数。

这个函数的 TS 类型如下：

```ts
export declare type WatchStopHandle = () => void;
```

用法很简单，做一下简单了解即可：

```ts
// 定义一个取消观察的变量，它是一个函数
const unwatch = watch(message, () => {
  // ...
})

// 在合适的时期调用它，可以取消这个监听
unwatch()
```

但是也有一点需要注意的是，如果你启用了 [immediate  选项](#监听选项之-immediate) ，不能在第一次触发监听回调时执行它。

```ts
// 注意：这是一段错误的代码，运行会报错
const unwatch = watch(
  message,
  // 监听的回调
  () => {
    // ...
    // 在这里调用会有问题 ❌
    unwatch()
  },
  // 启用 immediate 选项
  {
    immediate: true,
  }
)
```

你会收获一段报错，告诉你 `unwatch` 这个变量在初始化前无法被访问：

```bash
Uncaught ReferenceError: Cannot access 'unwatch' before initialization
```

目前有两种方案可以让你实现这个操作：

方案一：使用 `var` 并判断变量类型，利用 [var 的变量提升](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/var#%E6%8F%8F%E8%BF%B0) 来实现目的。

```ts{2,7-9}
// 这里改成 var ，不要用 const 或 let
var unwatch = watch(
  message,
  // 监听回调
  () => {
    // 这里加一个判断，是函数才执行它
    if (typeof unwatch === 'function') {
      unwatch()
    }
  },
  // 监听选项
  {
    immediate: true,
  }
)
```

不过 `var` 已经属于过时的语句了，建议用方案二的 `let` 。

方案二：使用 `let` 并判断变量类型。

```ts{5-6,11-13}
// 如果不想用 any ，可以导入 TS 类型
import type { WatchStopHandle } from 'vue'

// 这里改成 let ，但是要另起一行，先定义，再赋值
let unwatch: WatchStopHandle
unwatch = watch(
  message,
  // 监听回调
  () => {
    // 这里加一个判断，是函数才执行它
    if (typeof unwatch === 'function') {
      unwatch()
    }
  },
  // 监听选项
  {
    immediate: true,
  }
)
```

#### 监听效果清理

在 [监听后的回调函数](#监听后的回调函数) 部分提及到一个参数 `onCleanup` ，它可以帮你注册一个清理函数。

有时 watch 的回调会执行异步操作，当 watch 到数据变更的时候，需要取消这些操作，这个函数的作用就用于此，会在以下情况调用这个清理函数：

- watcher 即将重新运行的时候
- watcher 被停止（组件被卸载或者被手动 [停止监听](#停止监听) ）

TS 类型：

```ts
declare type OnCleanup = (cleanupFn: () => void) => void;
```

用法方面比较简单，传入一个回调函数运行即可，不过需要注意的是，需要在停止监听之前注册好清理行为，否则不会生效。

我们在 [停止监听](#停止监听) 里的最后一个 immediate 例子的基础上继续添加代码，请注意注册的时机：

```ts{6-9}
let unwatch: WatchStopHandle
unwatch = watch(
  message,
  (newValue, oldValue, onCleanup) => {
    // 需要在停止监听之前注册好清理行为
    onCleanup(() => {
      console.log('监听清理ing')
      // 根据实际的业务情况定义一些清理操作 ...
    })
    // 然后再停止监听
    if (typeof unwatch === 'function') {
      unwatch()
    }
  },
  {
    immediate: true,
  }
)
```

### watchEffect

如果一个函数里包含了多个需要监听的数据，一个一个数据去监听太麻烦了，在 Vue 3 ，你可以直接使用 watchEffect API 来简化你的操作。

#### API 的 TS 类型

这个 API 的类型如下，使用的时候需要传入一个副作用函数（相当于 watch 的 [监听后的回调函数](#监听后的回调函数) ），也可以根据你的实际情况传入一些可选的 [监听选项](#监听的选项) 。

和 watch API 一样，它也会返回一个用于 [停止监听](#停止监听) 的函数。

```ts
// watchEffect 部分的 TS 类型
// ...
export declare type WatchEffect = (onCleanup: OnCleanup) => void

export declare function watchEffect(
  effect: WatchEffect,
  options?: WatchOptionsBase
): WatchStopHandle
// ...
```

副作用函数也会传入一个清理回调作为参数，和 watch 的 [监听效果清理](#监听效果清理) 一样的用法。

你可以理解为它是一个简化版的 watch ，具体简化在哪里呢？请看下面的用法示例。

#### 用法示例

它立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数。

```ts
import { defineComponent, ref, watchEffect } from 'vue'

export default defineComponent({
  setup () {
    // 单独定义两个数据，后面用来分开改变数值
    const name = ref<string>('Petter');
    const age = ref<number>(18);

    // 定义一个调用这两个数据的函数
    const getUserInfo = (): void => {
      console.log({
        name: name.value,
        age: age.value
      });
    }

    // 2s后改变第一个数据
    setTimeout(() => {
      name.value = 'Tom';
    }, 2000);

    // 4s后改变第二个数据
    setTimeout(() => {
      age.value = 20;
    }, 4000);

    // 直接监听调用函数，在每个数据产生变化的时候，它都会自动执行
    watchEffect(getUserInfo);
  }
})
```

#### 和 watch 的区别

虽然理论上 `watchEffect` 是 `watch` 的一个简化操作，可以用来代替 [批量监听](#批量监听) ，但它们也有一定的区别：

1. `watch` 可以访问侦听状态变化前后的值，而 `watchEffect` 没有。

2. `watch` 是在属性改变的时候才执行，而 `watchEffect` 则默认会执行一次，然后在属性改变的时候也会执行。

第二点的意思，看下面这段代码可以有更直观的理解：

使用 watch ：

```ts{13-17}
export default defineComponent({
  setup() {
    const foo = ref<string>('')

    setTimeout(() => {
      foo.value = 'Hello World!'
    }, 2000)

    function bar() {
      console.log(foo.value)
    }

    // 使用 watch 需要先手动执行一次
    bar()

    // 然后当 foo 有变动时，才会通过 watch 来执行 bar()
    watch(foo, bar)
  },
})
```

使用 watchEffect ：

```ts{13-14}
export default defineComponent({
  setup() {
    const foo = ref<string>('')

    setTimeout(() => {
      foo.value = 'Hello World!'
    }, 2000)

    function bar() {
      console.log(foo.value)
    }

    // 可以通过 watchEffect 实现 bar() + watch(foo, bar) 的效果
    watchEffect(bar)
  },
})
```

#### 可用的监听选项

虽然用法和 watch 类似，但也简化了一些选项，它的监听选项 TS 类型如下：

```ts
// 只支持 base 类型
export declare interface WatchOptionsBase extends DebuggerOptions {
  flush?: 'pre' | 'post' | 'sync'
}
// ...

// 继承的 debugger 选项类型
export declare interface DebuggerOptions {
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}
// ...
```

对比 watch API ，它不支持 [deep](#监听选项之-deep) 和 [immediate](#监听选项之-immediate) ，请记住这一点，其他的用法是一样的。

`flush` 选项的使用详见 [监听选项之 flush](#监听选项之-flush) ，`onTrack` 和 `onTrigger` 详见 [监听的选项](#监听的选项) 部分内容。

### watchPostEffect

[watchEffect](#watchEffect) API 使用 `flush: 'post'` 选项时的别名，具体区别详见 [监听选项之 flush](#监听选项之-flush) 部分。

:::tip
Vue v3.2.0 及以上版本才支持该 API 。
:::

### watchSyncEffect

[watchEffect](#watchEffect) API 使用 `flush: 'sync'` 选项时的别名，具体区别详见 [监听选项之 flush](#监听选项之-flush) 部分。

:::tip
Vue v3.2.0 及以上版本才支持该 API 。
:::

## 数据的计算{new}

和 Vue 2.0 一样，数据的计算也是使用 `computed` API ，它可以通过现有的响应式数据，去通过计算得到新的响应式变量，用过 Vue 2.0 的同学应该不会太陌生，但是在 Vue 3.0 ，在使用方式上也是变化非常大！

:::tip
这里的响应式数据，可以简单理解为通过 [ref](#响应式-api-之-ref-new) API 、 [reactive](#响应式-api-之-reactive-new) API 定义出来的数据，当然 Vuex 、Vue Router 等 Vue 数据也都具备响应式，可以戳 [响应式数据的变化](#响应式数据的变化-new) 了解。
:::

### 用法变化

我们先从一个简单的用例来看看在 Vue 新旧版本的用法区别：

假设你定义了两个分开的数据 `firstName` 名字和 `lastName` 姓氏，但是在 template 展示时，需要展示完整的姓名，那么你就可以通过 `computed` 来计算一个新的数据：

#### 回顾 2.x

在 Vue 2.0 ，`computed` 和 `data` 在同级配置，并且不可以和 `data` 里的数据同名重复定义：

```ts
// 在 Vue 2 的写法：
export default {
  data() {
    return {
      firstName: 'Bill',
      lastName: 'Gates',
    }
  },
  // 注意这里定义的变量，都要通过函数的形式来返回它的值
  computed: {
    // 普通函数可以直接通过熟悉的 this 来拿到 data 里的数据
    fullName() {
      return `${this.firstName} ${this.lastName}`
    },
    // 箭头函数则需要通过参数来拿到实例上的数据
    fullName2: (vm) => `${vm.firstName} ${vm.lastName}`,
  }
}
```

这样你在需要用到全名的地方，只需要通过 `this.fullName` 就可以得到 `Bill Gates` 。

#### 了解 3.x

在 Vue 3.0 ，跟其他 API 的用法一样，需要先导入 `computed` 才能使用：

```ts
// 在 Vue 3 的写法：
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  setup() {
    // 定义基本的数据
    const firstName = ref<string>('Bill')
    const lastName = ref<string>('Gates')

    // 定义需要计算拼接结果的数据
    const fullName = computed(() => `${firstName.value} ${lastName.value}`)

    // 2s 后改变某个数据的值
    setTimeout(() => {
      firstName.value = 'Petter'
    }, 2000)

    // template 那边在 2s 后也会显示为 Petter Gates
    return {
      fullName,
    }
  },
})
```

你可以把这个用法简单的理解为，传入一个回调函数，并 `return` 一个值，对，它需要有明确的返回值。

:::tip
需要注意的是：

1. 定义出来的 `computed` 变量，和 `ref` 变量的用法一样，也是需要通过 `.value` 才能拿到它的值

2. 但是区别在于， `computed` 的 `value` 是只读的

原因详见下方的 [类型定义](#类型定义) 。
:::

### 类型定义

我们之前说过，在 [defineComponent](#了解-definecomponent) 里，会自动帮我们推导 Vue API 的类型，所以一般情况下，你是不需要显式的去定义 `computed` 出来的变量类型的。

在确实需要手动指定的情况下，你也可以导入它的类型然后定义：

```ts
import { computed } from 'vue'
import type { ComputedRef } from 'vue'

// 注意这里添加了类型定义
const fullName: ComputedRef<string> = computed(
  () => `${firstName.value} ${lastName.value}`
)
```

你要返回一个字符串，你就写 `ComputedRef<string>` ；返回布尔值，就写 `ComputedRef<boolean>` ；返回一些复杂对象信息，你可以先定义好你的类型，再诸如 `ComputedRef<UserInfo>` 去写。

```ts
// 这是 ComputedRef 的类型定义：
export declare interface ComputedRef<T = any> extends WritableComputedRef<T> {
  readonly value: T;
  [ComoutedRefSymbol]: true;
}
```

### 优势对比和注意事项

在继续往下看之前，我们先来了解一下这个 API 的一些优势和注意事项（如果在 Vue 2.x 已经有接触过的话，可以跳过这一段，因为优势和需要注意的东西比较一致）。

#### 优势对比

看到这里，相信刚接触的同学可能会有疑问，既然 `computed` 也是通过一个函数来返回值，那么和普通的 `function` 有什么区别，或者说优势？

1. 性能优势

这一点在 [官网文档](https://v3.cn.vuejs.org/guide/computed.html#%E8%AE%A1%E7%AE%97%E5%B1%9E%E6%80%A7%E7%BC%93%E5%AD%98-vs-%E6%96%B9%E6%B3%95) 其实是有提到的：

>数据的计算是基于它们的响应依赖关系缓存的，只在相关响应式依赖发生改变时它们才会重新求值。

也就是说，只要原始数据没有发生改变，多次访问 `computed` ，都是会立即返回之前的计算结果，而不是再次执行函数；而普通的 `function` 调用多少次就执行多少次，每调用一次就计算一次。

至于为何要如此设计，官网文档也给出了原因：

> 我们为什么需要缓存？假设我们有一个性能开销比较大的计算数据 list，它需要遍历一个巨大的数组并做大量的计算。然后我们可能有其他的计算数据依赖于 list。如果没有缓存，我们将不可避免的多次执行 list 的 getter！如果你不希望有缓存，请用 function 来替代。

:::tip
在这部分内容里，我把官方文档的一些用词做了更换，比如把 method 都替换成了 function ，也把 “计算属性” 都换成了 “计算数据”，原因在于官网很多地方是基于 Options API 的写法去描述，而本文档是基于 Composition API 。

点击了解： [如何理解 JavaScript 中方法（method）和函数（function）的区别？](https://www.zhihu.com/question/22602023/answer/21935867) 
:::

2. 书写统一

我们假定 foo1 是 `ref` 变量， foo2 是 `computed` 变量， foo3 是普通函数返回值

看到这里的同学应该都已经清楚 Vue 3 的 `ref` 变量是通过 `foo1.value` 来拿到值的，而 `computed` 也是通过 `foo2.value` ，并且在 template 里都可以省略 `.value` ，在读取方面，他们是有一致的风格和简洁性。

而 foo3 不管是在 script 还是 template ，都需要通过 `foo3()` 才能拿到结果，相对来说会有那么一丢丢别扭。

当然，关于这一点，如果涉及到的数据不是响应式数据，那么还是老老实实的用函数返回值吧，原因请见下面的 [注意事项](#注意事项) 。

#### 注意事项

有优势当然也就有一定的 “劣势” ，当然这也是 Vue 框架的有意为之，所以在使用上也需要注意一些问题：

1. 只会更新响应式数据的计算

假设你要获取当前的时间信息，因为不是响应式数据，所以这种情况下你就需要用普通的函数去获取返回值，才能拿到最新的时间。

```ts
const nowTime = computed(() => new Date())
console.log(nowTime.value)
// 输出 Sun Nov 14 2021 21:07:00 GMT+0800 (GMT+08:00)

// 2s 后依然是跟上面一样的结果
setTimeout(() => {
  console.log(nowTime.value)
  // 还是输出 Sun Nov 14 2021 21:07:00 GMT+0800 (GMT+08:00)
}, 2000)
```

2. 数据是只读的

通过 computed 定义的数据，它是只读的，这一点在 [类型定义](#类型定义) 已经有所了解。

如果你直接赋值，不仅无法变更数据，而且会收获一个报错。

```bash
TS2540: Cannot assign to 'value' because it is a read-only property.
```

虽然无法直接赋值，但是在必要的情况下，你依然可以通过 `computed` 的 `setter` 来更新数据。

点击了解：[computed 的 setter 用法](#setter-的使用)

### setter 的使用

通过 computed 定义的变量默认都是只读的形式（只有一个 getter ），但是在必要的情况下，你也可以使用其 setter 属性来更新数据。

#### 基本格式

当你需要用到 setter 的时候， `computed` 就不再是一个传入 callback 的形式了，而是传入一个带有 2 个方法的对象。

```ts
// 注意这里computed接收的入参已经不再是函数
const foo = computed({
  // 这里需要明确的返回一个值
  get() {
    // ...
  },
  // 这里接收一个参数，代表修改 foo 时，赋值下来的新值
  set(newValue) {
    // ...
  },
})
```

这里的 `get` 就是 `computed` 的 getter ，跟原来传入 callback 的形式一样，是用于 `foo.value` 的读取，所以这里你必须有明确的返回值。

这里的 `set` 就是 `computed` 的 setter ，它会接收一个参数，代表新的值，当你通过 `foo.value = xxx` 赋值的时候，赋入的这个值，就会通过这个入参来传递进来，你可以根据你的业务需要，把这个值，赋给相关的数据源。

:::tip
请注意，必须使用 `get` 和 `set` 这 2 个方法名，也只接受这 2 个方法。
:::

在了解了基本格式后，可以查看下面的例子来了解具体的用法。

#### 使用示范

官网的 [例子](https://v3.cn.vuejs.org/guide/computed.html#%E8%AE%A1%E7%AE%97%E5%B1%9E%E6%80%A7%E7%9A%84-setter) 是一个 Options API 的案例，这里我们改成 Composition API 的写法来演示：

```ts
// 还是这2个数据源
const firstName = ref<string>('Bill')
const lastName = ref<string>('Gates')

// 这里我们配合setter的需要，改成了另外一种写法
const fullName = computed({
  // getter我们还是返回一个拼接起来的全名
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  // setter这里我们改成只更新firstName，注意参数也定义TS类型
  set(newFirstName: string) {
    firstName.value = newFirstName
  },
})
console.log(fullName.value) // 输出 Bill Gates

// 2s后更新一下数据
setTimeout(() => {
  // 对fullName的赋值，其实更新的是firstName
  fullName.value = 'Petter'

  // 此时firstName已经得到了更新
  console.log(firstName.value) // 会输出 Petter

  // 当然，由于firstName变化了，所以fullName的getter也会得到更新
  console.log(fullName.value) // 会输出 Petter Gates
}, 2000)
```

### 应用场景

计算 API 的作用，官网文档只举了一个非常简单的例子，那么在实际项目中，什么情况下用它会让我们更方便呢？

简单举几个比较常见的例子吧，加深一下对 `computed` 的理解。

#### 数据的拼接和计算

如上面的案例，与其每个用到的地方都要用到 `firstName + ' ' + lastName` 这样的多变量拼接，不如用一个 `fullName` 来的简单。

当然，不止是字符串拼接，数据的求和等操作更是合适，比如说你做一个购物车，购物车里有商品列表，同时还要显示购物车内的商品总金额，这种情况就非常适合用计算数据。

#### 复用组件的动态数据

在一个项目里，很多时候组件会涉及到复用，比如说：“首页的文章列表 vs 列表页的文章列表 vs 作者详情页的文章列表” ，特别常见于新闻网站等内容资讯站点，这种情况下，往往并不需要每次都重新写 UI 、数据渲染等代码，仅仅是接口 URL 的区别。

这种情况你就可以通过路由名称来动态获取你要调用哪个列表接口：

```ts
const route = useRoute()

// 定义一个根据路由名称来获取接口URL的计算数据
const apiUrl = computed(() => {
  switch (route.name) {
    // 首页
    case 'home':
      return '/api/list1'
    // 列表页
    case 'list':
      return '/api/list2'
    // 作者页
    case 'author':
      return '/api/list3'
    // 默认是随机列表
    default:
      return '/api/random'
  }
})

// 请求列表
const getArticleList = async (): Promise<void> => {
  // ...
  articleList.value = await axios({
    method: 'get',
    url: apiUrl.value,
    // ...
  })
  // ...
}
```

当然，这种情况你也可以在父组件通过 `props` 传递接口 URL ，如果你已经学到了 [组件通讯](communication.md) 一章的话。

#### 获取多级对象的值

你应该很经常的遇到要在 template 显示一些多级对象的字段，但是有时候又可能存在某些字段不一定有，需要做一些判断的情况，虽然有 `v-if` ，但是嵌套层级一多，你的模板会难以维护。

如果你把这些工作量转移给计算数据，结合 `try / catch` ，这样就无需在 template 里处理很多判断了。

```ts
// 例子比较极端，但在 Vuex 这种大型数据树上，也不是完全不可能存在
const foo = computed(() => {
  // 正常情况下返回需要的数据
  try {
    return store.state.foo3.foo2.foo1.foo
  }
  // 处理失败则返回一个默认值
  catch (e) {
    return ''
  }
})
```

这样你在 template 里要拿到 foo 的值，完全不需要关心中间一级又一级的字段是否存在，只需要区分是不是默认值。

#### 不同类型的数据转换

有时候你会遇到一些需求类似于，让用户在输入框里，按一定的格式填写文本，比如用英文逗号 `,` 隔开每个词，然后保存的时候，是用数组的格式提交给接口。

这个时候 `computed` 的 setter 就可以妙用了，只需要一个简单的 `computed` ，就可以代替 `input` 的 `change` 事件或者 `watch` 监听，可以减少很多业务代码的编写。

```vue
<template>
  <input
    type="text"
    v-model="tagsStr"
    placeholder="请输入标签，多个标签用英文逗号隔开"
  />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'

export default defineComponent({
  setup() {
    // 这个是最终要用到的数组
    const tags = ref<string[]>([])

    // 因为input必须绑定一个字符串
    const tagsStr = computed({
      // 所以通过getter来转成字符串
      get() {
        return tags.value.join(',')
      },
      // 然后在用户输入的时候，切割字符串转换回数组
      set(newValue: string) {
        tags.value = newValue.split(',')
      },
    })

    return {
      tagsStr,
    }
  },
})
</script>
```

## CSS 样式与预处理器

Vue 组件的 CSS 样式部分，3.x 保留着和 2.x 完全一样的写法。 

### 编写组件样式表

最基础的写法，就是在 Vue 文件里创建一个 `style` 标签，即可在里面写 CSS 代码了。

```vue
<style>
.msg {
  width: 100%;
}
.msg p {
  color: #333;
  font-size: 14px;
}
</style>
```

### 动态绑定 CSS

动态绑定 CSS ，在 Vue 2.x 就已经存在了，在此之前常用的是 `:class` 和 `:style` ，现在在 Vue 3.x ，还可以通过 `v-bind` 来动态修改了。

其实这一部分主要是想说一下 3.x 新增的 `<style> v-bind` 功能，不过既然写到这里，就把另外两个动态绑定方式也一起提一下。

#### 使用 :class 动态修改样式名

它是绑定在 DOM 元素上面的一个属性，跟 `class` 同级别，它非常灵活！

:::tip
使用 `:class` 是用来动态修改样式名，也就意味着你必须提前把样式名对应的样式表先写好！
:::

假设我们已经提前定义好了这几个变量：

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    const activeClass = 'active-class'
    const activeClass1 = 'active-class1'
    const activeClass2 = 'active-class2'
    const isActive = true

    return {
      activeClass,
      activeClass1,
      activeClass2,
      isActive,
    }
  }
})
</script>
```

如果只想绑定一个单独的动态样式，你可以传入一个字符串：

```vue
<template>
  <p :class="activeClass">Hello World!</p>
</template>
```

如果有多个动态样式，也可以传入一个数组：

```vue
<template>
  <p :class="[activeClass1, activeClass2]">Hello World!</p>
</template>
```

你还可以对动态样式做一些判断，这个时候传入一个对象：

```vue
<template>
  <p :class="{ 'active-class': isActive }">Hello World!</p>
</template>
```

多个判断的情况下，记得也用数组套起来：

```vue
<template>
  <p
    :class="[
      { activeClass1: isActive },
      { activeClass2: !isActive }
    ]"
  >
    Hello World!
  </p>
</template>
```

那么什么情况下会用到 `:class` 呢？

最常见的场景，应该就是导航、选项卡了，比如你要给一个当前选中的选项卡做一个突出高亮的状态，那么就可以使用 `:class` 来动态绑定一个样式。

```vue
<template>
  <ul class="list">
    <li
      class="item"
      :class="{ cur: index === curIndex }"
      v-for="(item, index) in 5"
      :key="index"
      @click="curIndex = index"
    >
      {{ item }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup () {
    const curIndex = ref<number>(0)

    return {
      curIndex,
    }
  }
})
</script>

<style scoped>
.cur {
  color: red;
}
</style>
```

这样就简单实现了一个点击切换选项卡高亮的功能。

#### 使用 :style 动态修改内联样式

如果你觉得使用 `:class` 需要提前先写样式，再去绑定样式名有点繁琐，有时候只想简简单单的修改几个样式，那么你可以通过 `:style` 来处理。

默认的情况下，我们都是传入一个对象去绑定：

- `key` 是符合 CSS 属性名的 “小驼峰式” 写法，或者套上引号的短横线分隔写法（原写法），例如在 CSS 里，定义字号是 `font-size` ，那么你需要写成 `fontSize` 或者 `'font-size'` 作为它的键。

- `value` 是 CSS 属性对应的 “合法值”，比如你要修改字号大小，可以传入 `13px` 、`0.4rem` 这种带合法单位字符串值，但不可以是 `13` 这样的缺少单位的值，无效的 CSS 值会被过滤不渲染。

```vue
<template>
  <p
    :style="{
      fontSize: '13px',
      'line-height': 2,
      color: '#ff0000',
      textAlign: 'center'
    }"
  >
    Hello World!
  </p>
</template>
```

如果有些特殊场景需要绑定多套 `style`，你需要在 `script` 先定义好各自的样式变量（也是符合上面说到的那几个要求的对象），然后通过数组来传入：

```vue
<template>
  <p
    :style="[style1, style2]"
  >
    Hello World!
  </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    const style1 = {
      fontSize: '13px',
      'line-height': 2,
    }
    const style2 = {
      color: '#ff0000',
      textAlign: 'center',
    }

    return {
      style1,
      style2,
    }
  }
})
</script>
```

#### 使用 v-bind 动态修改 style{new}

当然，以上两种形式都是关于 `<script />` 和 `<template />` 部分的相爱相杀，如果你觉得会给你的模板带来一定的维护成本的话，不妨考虑这个新方案，将变量绑定到 `<style />` 部分去。

:::tip
请注意这是一个在 `3.2.0` 版本之后才被归入正式队列的新功能！

如果需要使用它，请确保你的 `vue` 和 `@vue/compiler-sfc` 版本号在 `3.2.0` 以上，最好是保持最新的 `@next` 版本。
:::

我们先来看看基本的用法：

```vue
<template>
  <p class="msg">Hello World!</p>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup () {
    const fontColor = ref<string>('#ff0000')

    return {
      fontColor,
    }
  }
})
</script>

<style scoped>
.msg {
  color: v-bind(fontColor);
}
</style>
```

如上面的代码，你将渲染出一句红色文本的 `Hello World!`

这其实是利用了现代浏览器支持的 CSS 变量来实现的一个功能（所以如果你打算用它的话，需要提前注意一下兼容性噢，点击查看：[CSS Variables 兼容情况](https://caniuse.com/css-variables)）

它渲染到 DOM 上，其实也是通过绑定 `style` 来实现，我们可以看到渲染出来的样式是：

```html
<p
  class="msg"
  data-v-7eb2bc79=""
  style="--7eb2bc79-fontColor:#ff0000;"
>
  Hello World!
</p>
```

对应的 CSS 变成了：

```css
.msg[data-v-7eb2bc79] {
  color: var(--7eb2bc79-fontColor);
}
```

理论上 `v-bind` 函数可以在 Vue 内部支持任意的 JS 表达式，但由于可能包含在 CSS 标识符中无效的字符，因此官方是建议在大多数情况下，用引号括起来，如：

```css
.text {
  font-size: v-bind('theme.font.size');
}
```

由于 CSS 变量的特性，因此对 CSS 响应式属性的更改不会触发模板的重新渲染（这也是和 `:class` 与 `:style` 的最大不同）。

:::tip
不管你有没有开启 [\<style scoped\>](#style-scoped) ，使用 `v-bind` 渲染出来的 CSS 变量，都会带上 `scoped` 的随机 hash 前缀，避免样式污染（永远不会意外泄漏到子组件中），所以请放心使用！
:::

如果你对 CSS 变量的使用还不是很了解的话，可以先阅读一下相关的基础知识点。

相关阅读：[使用CSS自定义属性（变量） - MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)

### 样式表的组件作用域

CSS 不像 JS ，是没有作用域的概念的，一旦写了某个样式，直接就是全局污染。所以 [BEM 命名法](https://www.bemcss.com/) 等规范才应运而生。

但在 Vue 组件里，有两种方案可以避免出现这种污染问题。

一个是 Vue 2.x 就有的 `<style scoped>` ，一个是 Vue 3.x 新推出的 `<style module>` 。

#### style scoped

Vue 组件在设计的时候，就想到了一个很优秀的解决方案，通过 `scoped` 来支持创建一个 CSS 作用域，使这部分代码只运行在这个组件渲染出来的虚拟 DOM 上。

使用方式很简单，只需要在 `style` 后面带上 `scoped` 属性。

```vue
<style scoped>
.msg {
  width: 100%;
}
.msg p {
  color: #333;
  font-size: 14px;
}
</style>
```

编译后，虚拟 DOM 都会带有一个 `data-v-xxxxx` 这样的属性，其中 `xxxxx` 是一个随机生成的 hash ，同一个组件的 hash 是相同并且唯一的：

```html
<div class="msg" data-v-7eb2bc79>
  <p data-v-7eb2bc79>Hello World!</p>
</div>
```

而 CSS 则也会带上与 HTML 相同的属性，从而达到样式作用域的目的。

```css
.msg[data-v-7eb2bc79] {
  width: 100%;
}
.msg p[data-v-7eb2bc79] {
  color: #333;
  font-size: 14px;
}
```

使用 `scoped` 可以有效的避免全局样式污染，你可以在不同的组件里面都使用相同的 className，而不必担心会相互覆盖，不必再定义很长很长的样式名来防止冲突了。

:::tip
添加 `scoped` 生成的样式，只作用于当前组件中的元素，并且权重高于全局 CSS ，可以覆盖全局样式
:::

#### style module{new}

这是在 Vue 3.x 才推出的一个新方案，和 `<style scoped>` 不同，scoped 是通过给 DOM 元素添加自定义属性的方式来避免冲突，而 `<style module>` 则更为激进，将会编译成 [CSS Modules](https://github.com/css-modules/css-modules) 。

对于 CSS Modules 的处理方式，我们也可以通过一个小例子来更直观的了解它：

```css
/* 编译前 */
.title {
  color: red;
}

/* 编译后 */
._3zyde4l1yATCOkgn-DBWEL {
  color: red;
}
```

可以看出，是通过比较 “暴力” 的方式，把我们编写的 “好看的” 样式名，直接改写成一个随机 hash 样式名，来避免样式互相污染。

>上面的案例来自阮老师的博文 [CSS Modules 用法教程](https://www.ruanyifeng.com/blog/2016/06/css_modules.html) 

所以我们回到 Vue 这边，看看 `<style module>` 是怎么操作的。

```vue
<template>
  <p :class="$style.msg">Hello World!</p>
</template>

<style module>
.msg {
  color: #ff0000;
}
</style>
```

于是，你将渲染出一句红色文本的 `Hello World!` 。

:::tip
1. 使用这个方案，需要了解如何 [使用 :class 动态修改样式名](#使用-class-动态修改样式名) 

2. 如果单纯只使用 `<style module>` ，那么在绑定样式的时候，是默认使用 `$style` 对象来操作的

3. 必须显示的指定绑定到某个样式，比如 `$style.msg` ，才能生效

4. 如果单纯的绑定 `$style` ，并不能得到 “把全部样式名直接绑定” 的期望结果

5. 如果你指定的 className 是短横杆命名，比如 `.user-name` ，那么需要通过 `$style['user-name']` 去绑定
:::

你也可以给 `module` 进行命名，然后就可以通过你命名的 “变量名” 来操作：

```vue
<template>
  <p :class="classes.msg">Hello World!</p>
</template>

<style module="classes">
.msg {
  color: #ff0000;
}
</style>
```

:::tip
需要注意的一点是，一旦开启 `<style module>` ，那么在 `<style module>` 里所编写的样式，都必须手动绑定才能生效，没有被绑定的样式，会被编译，但不会主动生效到你的 DOM 上。

原因是编译出来的样式名已经变化，而你的 DOM 未指定对应的样式名，或者指定的是编译前的命名，所以并不能匹配到正确的样式。
:::

#### useCssModule{new}

这是一个全新的 API ，面向在 script 部分操作 CSS Modules 。

在上面的 [CSS Modules](#style-module-new) 部分可以知道，你可以在 `style` 定义好样式，然后在 `template` 部分通过变量名来绑定样式。

那么如果有一天有个需求，你需要通过 `v-html` 来渲染 HTML 代码，那这里的样式岂不是凉凉了？当然不会！

Vue 3.x 提供了一个 Composition API `useCssModule` 来帮助你在 `setup` 函数里操作你的 CSS Modules （对，只能在 [setup](#全新的-setup-函数-new) 或者 [script setup](efficient.md#script-setup-new) 里使用）。

**基本用法：**

我们绑定多几个样式，再来操作：

```vue
<template>
  <p :class="$style.msg">
    <span :class="$style.text">Hello World!</span>
  </p>
</template>

<script lang="ts">
import { defineComponent, useCssModule } from 'vue'

export default defineComponent({
  setup () {
    const style = useCssModule()
    console.log(style)
  }
})
</script>

<style module>
.msg {
  color: #ff0000;
}
.text {
  font-size: 14px;
}
</style>
```

可以看到打印出来的 `style` 是一个对象：

- `key` 是你在 `<style modules>` 里定义的原始样式名

- `value` 则是编译后的新样式名

```js
{
  msg: 'home_msg_37Xmr',
  text: 'home_text_2woQJ'
}
```

所以我们来配合 [模板字符串](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals) 的使用，看看刚刚说的，要通过 `v-html` 渲染出来的内容应该如何绑定样式：

```vue
<template>
  <div v-html="content"></div>
</template>

<script lang="ts">
import { defineComponent, useCssModule } from 'vue'

export default defineComponent({
  setup () {
    // 获取样式
    const style = useCssModule()

    // 编写模板内容
    const content = `<p class="${style.msg}">
      <span class="${style.text}">Hello World! —— from v-html</span>
    </p>`

    return {
      content,
    }
  }
})
</script>

<style module>
.msg {
  color: #ff0000;
}
.text {
  font-size: 14px;
}
</style>
```

是不是也非常简单？可能刚开始不太习惯，但写多几次其实也蛮好玩的这个功能！

**另外，需要注意的是，如果你是指定了 modules 的名称，那么必须传入对应的名称作为入参才可以正确拿到这些样式：**

比如指定了一个 classes 作为名称：

```vue
<style module="classes">
/* ... */
</style>
```

那么需要通过传入 classes 这个名称才能拿到样式，否则会是一个空对象：

```ts
const style = useCssModule('classes')
```

:::tip
在 `const style = useCssModule()` 的时候，命名是随意的，跟你在 `<style module="classes">` 这里指定的命名没有关系。
:::

### 深度操作符{new}

在 [样式表的组件作用域](#样式表的组件作用域) 部分我们了解到，使用 scoped 后，父组件的样式将不会渗透到子组件中，但也不能直接修改子组件的样式。

如果确实需要进行修改子组件的样式，必须通过 `::v-deep`（完整写法） 或者 `:deep`（快捷写法） 操作符来实现。

:::tip
1. 旧版的深度操作符是 `>>>` 、 `/deep/` 和 `::v-deep`，现在 `>>>` 和 `/deep/` 已进入弃用阶段（虽然暂时还没完全移除）

2. 同时需要注意的是，旧版 `::v-deep` 的写法是作为组合器的方式，写在样式或者元素前面，如：`::v-deep .class-name { /* ... */ }`，现在这种写法也废弃了。
:::

现在不论是 `::v-deep` 还是 `:deep` ，使用方法非常统一，我们来假设 .b 是子组件的样式名：

```vue
<style scoped>
.a :deep(.b) {
  /* ... */
}
</style>
```

编译后：

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

:::tip
可以看到，新的 deep 写法是作为一个类似 JS “函数” 那样去使用，需要深度操作的样式或者元素名，作为 “入参” 去传入。
:::

同理，如果你使用 Less 或者 Stylus 这种支持嵌套写法的预处理器，也是可以这样去深度操作的：

```less
.a {
  :deep(.b) {
    /* ... */
  }
}
```

另外，除了操作子组件的样式，那些通过 `v-html` 创建的 DOM 内容，也不受作用域内的样式影响，也可以通过深度操作符来实现样式修改。

### 使用 CSS 预处理器

在工程化的现在，可以说前端都几乎不写 CSS 了，都是通过 `sass`、`less`、`stylus` 等 CSS 预处理器来完成样式的编写。

为什么要用 CSS 预处理器？放一篇关于三大预处理器的点评，新同学可以做个简单了解，具体的用法在对应的官网上有非常详细的说明。

可以查看了解：[浅谈css预处理器，Sass、Less和Stylus](https://zhuanlan.zhihu.com/p/23382462)

在 Vue 组件里使用预处理器非常简单，`Vue CLI`内置了 `stylus`，如果打算使用其他的预处理器，需要先安装。

这里以 `stylus` 为例，只需要通过 `lang="stylus"` 属性来指定使用哪个预处理器，即可直接编写对应的代码：

```vue
<style lang="stylus">
// 定义颜色变量
$color-black = #333
$color-red = #ff0000

// 编写样式
.msg
  width 100%
  p
    color $color-black
    font-size 14px
    span
      color $color-red
</style>
```

编译后的css代码：

```css
.msg {
  width: 100%;
}
.msg p {
  color: #333;
  font-size: 14px;
}
.msg p span {
  color: #ff0000;
}
```

预处理器也支持 `scoped`，用法请查阅 [样式表的组件作用域](#样式表的组件作用域) 部分。

## 本章结语

来到这里，关于组件的基础构成和写法风格，以及数据、函数的定义和使用，相信大家基本上有一定的了解了。

这一章内容不多，但非常重要，了解组件的基础写法关系着你后续在开发过程中，能否合理的掌握数据获取和呈现之间的关系，以及什么功能应该放在哪个生命周期调用等等，所谓磨刀不误砍柴工。

<!-- 谷歌广告 -->
<ClientOnly>
  <google-adsense />
</ClientOnly>
<!-- 谷歌广告 -->

<!-- 评论 -->
<ClientOnly>
  <gitalk-comment
    :issueId="46"
  />
</ClientOnly>
<!-- 评论 -->
