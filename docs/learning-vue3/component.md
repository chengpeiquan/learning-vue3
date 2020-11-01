# 3.x 组件变化

## 使用ts创建一个组件

项目搭好了，第一个要了解的肯定是组件的变化。

出于对Vue3的尊敬，以及前端的发展趋势，我们这一次是打算直接使用 `TypeScript` 来编写组件，对ts不太熟悉的同学，建议先对ts有一定的了解，然后一边写一边加深印象。

## 组件的基本写法

这不是一段废话，如果你是从 2.x 就开始写ts的话，应该知道在 2.x 的时候就已经有了 `extend` 和 `class component` 的基础写法，现在的3.x还推出了 `defineComponent` + `composition api`。

加上视图的 `template` 和 `tsx` 写法、以及3.x对不同版本的生命周期兼容，累计下来，在Vue里写ts，至少有9种不同的组合方式（我的认知内，未有更多的尝试），堪比孔乙己的回字（甚至吊打回字……

所以，只有一开始理清楚 3.x 最好使用哪种写法，才能避免回头又要改来改去，我们先来回顾一下这些写法组合分别是什么：

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

所以，每种组合的示范就不写了，从这一节开始，都会以 `defineComponent` + `composition api` + `template` 的写法来作为示范案例。

## 使用 composition api 编写组件

未完待续。

官方文档：[](https://composition-api.vuejs.org/zh/)