# 了解 3.x 组件的基本变化

项目搭好了，第一个要了解的肯定是组件的变化，由于这部分篇幅会非常大，所以会分成很多个小节，一部分一部分按照开发顺序来逐步了解。

btw: 出于对Vue3的尊敬，以及前端的发展趋势，我们这一次是打算直接使用 `TypeScript` 来编写组件，对ts不太熟悉的同学，建议先对ts有一定的了解，然后一边写一边加深印象。

## 组件的生命周期

### 升级变化

写组件之前，需要先了解组件的生命周期，从 2.x 升级到 3.x，生命周期也有了一定的调整。

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

其中，在3.x，`setup` 的执行时机比 2.x 的 `beforeCreate` 和 `created` 还早，可以完全代替原来的这2个钩子函数。

另外，被包含在 `<keep-alive>` 中的组件，会多出两个生命周期钩子函数：

2.x 生命周期|3.x 生命周期|执行时间说明
:-:|:-:|:-:
activated|onActivated|被激活时执行
deactivated|onDeactivated|切换组件后，原组件消失前执行

最后，虽然 3.x 依然支持 2.x 的生命周期，但是不建议混搭使用，**请尽快熟悉并完全使用 3.x 的生命周期来编写你的组件**。

### 如何使用

在3.x，每个生命周期函数都要先导入才可以使用，并且所有生命周期函数统一放在 `setup` 里运行。

如果你需要在达到2.x的 `beforeCreate` 和 `created` 目的的话，直接把函数执行在 `setup` 里即可。

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

这不是一段废话，如果你是从 2.x 就开始写ts的话，应该知道在 2.x 的时候就已经有了 `extend` 和 `class component` 的基础写法；3.x在保留class写法的同时，还推出了 `defineComponent` + `composition api`的新写法。

加上视图部分又有 `template` 和 `tsx` 的写法、以及3.x对不同版本的生命周期兼容，累计下来，在Vue里写ts，至少有9种不同的组合方式（我的认知内，未有更多的尝试），堪比孔乙己的回字（甚至吊打回字……

所以，只有一开始理清楚 3.x 最好使用哪种写法，才能避免回头又要改来改去。

我们先来回顾一下这些写法组合分别是什么：

### 回顾2.x

在2.x，为了更好的ts推导，用的最多的还是 `class component` 的写法。

适用版本|基本写法|视图写法
:-:|:-:|:-:
2.x|Vue.extend|template
2.x|class component|template
2.x|class component|tsx

### 了解3.x

目前3.x从官方对版本升级的态度来看， `defineComponent` 就是为了解决之前2.x对ts推导不完善等问题而推出的，尤大也是更希望大家习惯 `defineComponent` 的使用。

适用版本|基本写法|视图写法|生命周期版本|官方是否推荐
:-:|:-:|:-:|:-:|:-:
3.x|class component|template|2.x|×
3.x|defineComponent|template|2.x|×
3.x|defineComponent|template|3.x|√
3.x|class component|tsx|2.x|×
3.x|defineComponent|tsx|2.x|×
3.x|defineComponent|tsx|3.x|√

btw: 我本来还想把每种写法都演示一遍，但写到这里，看到这么多种组合，我累了……

所以，每种组合的示范就不写了，从这一节开始，都会以 `defineComponent` + `composition api` + `template` 的写法，按照3.x生命周期来作为示范案例。

## 编写一个完整的组件

接下来，使用 composition api 来编写组件，先来实现一个最简单的 `Hello World!`。

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

`style` 则是根据你熟悉的预处理器或者原生css来写的，完全没有变化。

变化最大的就是 `script` 部分了。

## 本节结语

这一节内容不多，但非常重要，组件的生命周期关系着你后续在开发过程中，数据获取和呈现之间的关系，以及什么功能应该放在哪个阶段调用，所谓磨刀不误砍柴工。