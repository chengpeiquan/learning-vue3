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

## 响应式数据的变化{new}

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

## 数据的监听与计算{new}

监听数据变化也是组件里的一项重要工作，比如监听路由变化、监听参数变化等等。

Vue 3.x 在保留原来的 `watch` 功能之外，还新增了一个 `watchEffect` 帮助我们更简单的进行监听。

### watch

但是新版的 `watch` 和旧版对比，在使用方式上变化非常大！旧版是这样用的，和 `data` 、 `methods` 都在同级配置：

```ts
// 旧版的写法：
export default {
  watch: {
    // ...
  },
  data () {
    return {
      // ...
    }
  },
  methods: {
    // ...
  }
}
```

新版的 `watch` 需要在 `setup` 里使用，在使用之前，**还需要先导入该组件**。

```ts
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  setup () {
    const name = ref<string>('Petter');

    // 2s后改变数据
    setTimeout(() => {
      name.value = 'Tom';
    }, 2000);

    // 你可以监听一个响应式对象
    watch( name, () => {
      console.log('监听整个 ref ', name.value);
    })

    // 也可以监听对象里面的某个值（此时需要写成 getter 函数）
    watch( () => name.value, () => {
      console.log('只监听 value ', name.value);
    })
  }
})
```

需要注意的是，你只能监听响应式数据，如果通过 `let` 定义一个普通的字符串变量，然后去改变字符串内容，这样是无法监听的。

另外，默认情况下，`watch` 是惰性的，即只有当被侦听的源发生变化时才执行回调。

:::tip
新的 `watch` 默认是深度监听，无需再手动指定 `deep` 。
:::

另外， `watch` 可以接受两个参数：

参数|类型|作用
:--|:--|:--
newVal|any|变化后的新值
oldVal|any|变化前的旧值

这里返回的参数类型并没有特定限制，取决于你监听的数据类型变化。

```ts
export default defineComponent({
  setup () {
    const name = ref<string>('Petter');

    // 2s后改变数据
    setTimeout(() => {
      name.value = 'Tom';
    }, 2000);

    // 你可以监听一个响应式对象
    watch( name, (newVal, oldVal) => {
      console.log('打印变化前后的值', { oldVal, newVal });
    })

    return {
      name
    }
  }
})
```

注意：第一个参数是新值，第二个才是原来的旧值！

### watchEffect

如果一个函数里包含了多个需要监听的数据，一个一个数据去监听太麻烦了，在 3.x ，你可以直接使用 `watchEffect` 来简化你的操作。

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

虽然理论上 `watchEffect` 是 `watch` 的一个简化操作，但他们也有一定的区别：

:::tip
1. `watch` 可以访问侦听状态变化前后的值，而 `watchEffect` 没有。

2. `watch` 是在属性改变的时候才执行，而 `watchEffect` 则默认会执行一次，然后在属性改变的时候也会执行。
:::

### computed

`computed` 也是一个实用的 api，他可以通过现有的响应式数据，去通过计算得到新的响应式变量。

和 `watch` 一样，新版的 `computed` 和旧版对比，在使用方式上也是变化非常大！

假设你定义了两个分开的数据 `firstName` 名字和 `lastName` 姓氏，但是在 `template` 展示时，需要展示完整的姓名，那么你就可以通过 `computed` 来计算一个新的数据：

旧版是这样用的，和 `data` 在同级配置，并且不可以和 `data` 重复定义：

```ts
// 旧版的写法：
export default {
  data () {
    return {
      firstName: 'Bill',
      lastName: 'Gates',
    }
  },
  computed {
    name () {
      return this.firstName + this.lastName
    }
  }
}
```

新版则需要先导入 `computed` 组件，然后在 `setup` 里启用它：

```ts
import { defineComponent, ref, computed, ComputedRef } from 'vue'

export default defineComponent({
  setup () {
    // 定义基本的数据
    const firstName = ref<string>('Bill');
    const lastName = ref<string>('Gates');

    // 定义需要拼接的数据
    const name: ComputedRef<string> = computed( () => `${firstName.value} ${lastName.value}`);

    // 2s后改变某个数据的值
    setTimeout(() => {
      firstName.value = 'Petter';
    }, 2000);

    // template那边也会跟着从Bill Gates显示为Petter Gates
    return {
      name
    }
  }
})
```

虽然你也可以写成来获取完整的姓名：

```ts
const name = ():string => `${firstName.value} ${lastName.value}`;
```

但通过 `computed` 得到的是一个响应式的 `ref` 变量，而通过 `() => ` 得到的只是一个普通的函数返回值。

在你需要继续使用响应式数据的情况下，使用 `computed` 可以让你更好的去完成需求。

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

### 样式表的组件作用域

CSS 不像 JS ，是没有作用域的概念的，一旦写了某个样式，直接就是全局污染。

但 Vue 组件在设计的时候，就想到了一个很优秀的解决方案，通过 `scoped` 来支持创建一个 CSS 作用域，使这部分代码只运行在这个组件渲染出来的虚拟 DOM 上。

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

### 深度操作符

所以，需要注意一个问题就是，使用 scoped 后，父组件的样式将不会渗透到子组件中，但也不能直接修改子组件的样式，必须通过 `>>>` 或者 `/deep/` 操作符来实现。

假设 .b 是子组件的样式名：

```vue
<style scoped>
.a >>> .b {
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

通过 `v-html` 创建的 DOM 内容也不受作用域内的样式影响，也可以通过深度操作符来实现样式修改。

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

## 本节结语

来到这里，关于组件的基础构成和写法风格，以及数据、函数的定义和使用，相信大家基本上有一定的了解了。

这一节内容不多，但非常重要，了解组件的基础写法关系着你后续在开发过程中，能否合理的掌握数据获取和呈现之间的关系，以及什么功能应该放在哪个生命周期调用等等，所谓磨刀不误砍柴工。

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