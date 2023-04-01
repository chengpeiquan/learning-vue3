---
outline: 'deep'
---

# 快速上手 TypeScript

如果已经看完 [工程化的起步准备](guide.md) 一章，相信此时的已经对 Node 工程项目有了足够的认识了，在此之前的所有代码都是使用 JavaScript 编写的，接下来这一节，将开始介绍 TypeScript ，这是一门新的语言，但是上手非常简单。

TypeScript 简称 TS ，既是一门新语言，也是 JS 的一个超集，它是在 JavaScript 的基础上增加了一套类型系统，它支持所有的 JS 语句，为工程化开发而生，最终在编译的时候去掉类型和特有的语法，生成 JS 代码。

虽然带有类型系统的前端语言不止 TypeScript （例如 Facebook 推出的 [Flow.js](https://github.com/facebook/flow) ），但从目前整个 [开源社区的流行趋势](https://octoverse.github.com/#top-languages-over-the-years) 看， TypeScript 无疑是更好的选择。

<ClientOnly>
  <ImgWrap
    src="/assets/img/github-top-languages.jpg"
    dark="/assets/img/github-top-languages-dark.jpg"
    alt="TypeScript 的流行程度（来自 GitHub 年度统计报告）"
  />
</ClientOnly>

而且只要本身已经学会了 JS ，并且经历过很多协作类的项目，那么使用 TS 编程是一个很自然而然的过程。

## 为什么需要类型系统

要想知道自己为什么要用 TypeScript ，得先从 JavaScript 有什么不足说起，举一个非常小的例子：

```js
function getFirstWord(msg) {
  console.log(msg.split(' ')[0])
}

getFirstWord('Hello World') // 输出 Hello

getFirstWord(123) // TypeError: msg.split is not a function
```

这里定义了一个用空格切割字符串的方法，并打印出第一个单词：

1. 第一次执行时，字符串支持 `split` 方法，所以成功获取到了第一个单词 `Hello`
2. 第二次执行时，由于数值不存在 `split` 方法，所以传入 `123` 引起了程序崩溃

这就是 JavaScript 的弊端，过于灵活，没有类型的约束，很容易因为类型的变化导致一些本可避免的 BUG 出现，而且这些 BUG 通常需要在程序运行的时候才会被发现，很容易引发生产事故。

虽然可以在执行 `split` 方法之前执行一层判断或者转换，但很明显增加了很多工作量。

TypeScript 的出现，在编译的时候就可以执行检查来避免掉这些问题，而且配合 VSCode 等编辑器的智能提示，可以很方便的知道每个变量对应的类型。

## Hello TypeScript

将继续使用 [Hello Node](guide.md#hello-node) 这个 demo ，或者可以再建一个新 demo ，依然是在 `src` 文件夹下，创建一个 `ts` 文件夹归类本次的测试文件，然后创建一个 `index.ts` 文件在 `ts` 文件夹下。

:::tip
TypeScript 语言对应的文件扩展名是 `.ts` 。
:::

然后在命令行通过 `cd` 命令进入项目所在的目录路径，安装 TypeScript 开发的两个主要依赖包：

1. [typescript](https://www.npmjs.com/package/typescript) 这个包是用 TypeScript 编程的语言依赖包

2. [ts-node](https://www.npmjs.com/package/ts-node) 是让 Node 可以运行 TypeScript 的执行环境

```bash
npm install -D typescript ts-node
```

这次添加了一个 `-D` 参数，因为 TypeScript 和 TS-Node 是开发过程中使用的依赖，所以将其添加到 package.json 的 `devDependencies` 字段里。

然后修改 scripts 字段，增加一个 `dev:ts` 的 script ：

```json{9,19-22}
{
  "name": "hello-node",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev:cjs": "node src/cjs/index.cjs",
    "dev:esm": "node src/esm/index.mjs",
    "dev:ts": "ts-node src/ts/index.ts",
    "compile": "babel src/babel --out-dir compiled",
    "serve": "node server/index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "md5": "^2.3.0"
  },
  "devDependencies": {
    "ts-node": "^10.7.0",
    "typescript": "^4.6.3"
  }
}
```

准备工作完毕！

:::tip
请注意， `dev:ts` 这个 script 是用了 `ts-node` 来代替原来在用的 `node` ，因为使用 `node` 无法识别 TypeScript 语言。
:::

把 [为什么需要类型系统](#为什么需要类型系统) 里面提到的例子放到 `src/ts/index.ts` 里：

```ts
// src/ts/index.ts
function getFirstWord(msg) {
  console.log(msg.split(' ')[0])
}

getFirstWord('Hello World')

getFirstWord(123)
```

然后在命令行运行 `npm run dev:ts` 来看看这次的结果：

```bash
TSError: ⨯ Unable to compile TypeScript:
src/ts/index.ts:1:23 - error TS7006: Parameter 'msg' implicitly has an 'any' type.

1 function getFirstWord(msg) {
                        ~~~
```

这是告知 `getFirstWord` 的入参 `msg` 带有隐式 any 类型，这个时候可能还不了解 any 代表什么意思，没关系，来看下如何修正这段代码：

```ts{2}
// src/ts/index.ts
function getFirstWord(msg: string) {
  console.log(msg.split(' ')[0])
}

getFirstWord('Hello World')

getFirstWord(123)
```

留意到没有，现在函数的入参 `msg` 已经变成了 `msg: string` ，这是 TypeScript 指定参数为字符串类型的一个写法。

现在再运行 `npm run dev:ts` ，上一个错误提示已经不再出现，取而代之的是一个新的报错：

```bash
TSError: ⨯ Unable to compile TypeScript:
src/ts/index.ts:7:14 - error TS2345:
Argument of type 'number' is not assignable to parameter of type 'string'.

7 getFirstWord(123)
               ~~~
```

这次的报错代码是在 `getFirstWord(123)` 这里，告诉 `number` 类型的数据不能分配给 `string` 类型的参数，也就是故意传入一个会报错的数值进去，被 TypeScript 检查出来了！

可以再仔细留意一下控制台的信息，会发现没有报错的 `getFirstWord('Hello World')` 也没有打印出结果，这是因为 TypeScript 需要先被编译成 JavaScript ，然后再执行。

这个机制让有问题的代码能够被及早发现，一旦代码出现问题，编译阶段就会失败。

移除会报错的那行代码，只保留如下：

```ts
// src/ts/index.ts
function getFirstWord(msg: string) {
  console.log(msg.split(' ')[0])
}

getFirstWord('Hello World')
```

再次运行 `npm run dev:ts` ，这次完美运行！

```ts
npm run dev:ts

> demo@1.0.0 dev:ts
> ts-node src/ts/index.ts

Hello
```

在这个例子里，相信已经感受到 TypeScript 的魅力了！接下来来认识一下不同的 JavaScript 类型，在 TypeScript 里面应该如何定义。

## 常用的 TS 类型定义

在 [Hello TypeScript](#hello-typescript) 的体验中，相信能够感受到 TypeScript 编程带来的好处了，代码的健壮性得到了大大的提升！

并且应该也能够大致了解到， TS 类型并不会给的编程带来非常高的门槛或者说开发阻碍，它是以一种非常小的成本换取大收益的行为。

:::tip
如果还没有体验这个 demo ，建议先按教程跑一下，然后来讲解不同的 JavaScript 类型应该如何在 TypeScript 里定义，接下来的时间里，可以一边看，一边在 demo 里实践。
:::

### 原始数据类型

[原始数据类型](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive) 是一种既非对象也无方法的数据，刚才演示代码里，函数的入参使用的字符串 String 就是原始数据类型之一。

除了 String ，另外还有数值 Number 、布尔值 Boolean 等等，它们在 TypeScript 都有统一的表达方式，列个表格对比，能够更直观的了解：

| 原始数据类型 | JavaScript | TypeScript |
| :----------: | :--------: | :--------: |
|    字符串    |   String   |   string   |
|     数值     |   Number   |   number   |
|    布尔值    |  Boolean   |  boolean   |
|    大整数    |   BigInt   |   bigint   |
|     符号     |   Symbol   |   symbol   |
|    不存在    |    Null    |    null    |
|    未定义    | Undefined  | undefined  |

有没有发现窍门？对！ TypeScript 对原始数据的类型定义真的是超级简单，就是转为全小写即可！

举几个例子：

```ts
// 字符串
const str: string = 'Hello World'

// 数值
const num: number = 1

// 布尔值
const bool: boolean = true
```

不过在实际的编程过程中，原始数据类型的类型定义是可以省略的，因为 TypeScript 会根据声明变量时赋值的类型，自动推导变量类型，也就是可以跟平时写 JavaScript 一样：

```ts
// 这样也不会报错，因为 TS 会推导它们的类型
const str = 'Hello World'
const num = 1
const bool = true
```

### 数组

除了原始数据类型之外， JavaScript 还有引用类型，数组 Array 就是其中的一种。

之所以先讲数组，是因为它在 TS 类型定义的写法上面，可能是最接近原始数据的一个类型了，为什么这么说？还是列个表格，来看一下如何定义数组：

| 数组里的数据 | 类型写法 1  |     类型写法 2     |
| :----------: | :---------: | :----------------: |
|    字符串    |  string[]   |  Array\<string\>   |
|     数值     |  number[]   |  Array\<number\>   |
|    布尔值    |  boolean[]  |  Array\<boolean\>  |
|    大整数    |  bigint[]   |  Array\<bigint\>   |
|     符号     |  symbol[]   |  Array\<symbol\>   |
|    不存在    |   null[]    |   Array\<null\>    |
|    未定义    | undefined[] | Array\<undefined\> |

是吧！就只是在原始数据类型的基础上变化了一下书写格式，就成为了数组的定义！

笔者最常用的就是 `string[]` 这样的格式，只需要追加一个方括号 `[]` ，另外一种写法是基于 TS 的泛型 `Array<T>` ，两种方式定义出来的类型其实是一样的。

举几个例子：

```ts
// 字符串数组
const strs: string[] = ['Hello World', 'Hi World']

// 数值数组
const nums: number[] = [1, 2, 3]

// 布尔值数组
const bools: boolean[] = [true, true, false]
```

在实际的编程过程中，如果的数组一开始就有初始数据（数组长度不为 0 ），那么 TypeScript 也会根据数组里面的项目类型，正确自动帮推导这个数组的类型，这种情况下也可以省略类型定义：

```ts
// 这种有初始项目的数组， TS 也会推导它们的类型
const strs = ['Hello World', 'Hi World']
const nums = [1, 2, 3]
const bools = [true, true, false]
```

但是！如果一开始是 `[]` ，那么就必须显式的指定数组类型（取决于的 [tsconfig.json](#了解-tsconfig-json) 的配置，可能会引起报错）：

```ts
// 这个时候会认为是 any[] 或者 never[] 类型
const nums = []

// 这个时候再 push 一个 number 数据进去，也不会使其成为 number[]
nums.push(1)
```

而对于复杂的数组，比如数组里面的 item 都是对象，其实格式也是一样，只不过把原始数据类型换成 [对象的类型](#对象-接口) 即可，例如 `UserItem[]` 表示这是一个关于用户的数组列表。

### 对象（接口）

看完了数组，接下来看看对象的用法，对象也是引用类型，在 [数组](#数组) 的最后提到了一个 `UserItem[]` 的写法，这里的 `UserItem` 就是一个对象的类型定义。

如果熟悉 JavaScript ，那么就知道对象的 “键值对” 里面的值，可能是由原始数据、数组、对象组成的，所以在 TypeScript ，类型定义也是需要根据值的类型来确定它的类型，因此定义对象的类型应该是第一个比较有门槛的地方。

#### 如何定义对象的类型

对象的类型定义有两个语法支持： `type` 和 `interface` 。

先看看 `type` 的写法：

```ts
type UserItem = {
  // ...
}
```

再看看 `interface` 的写法：

```ts
interface UserItem {
  // ...
}
```

可以看到它们表面上的区别是一个有 `=` 号，一个没有，事实上在一般的情况下也确实如此，两者非常接近，但是在特殊的时候也有一定的区别。

#### 了解接口的使用

为了降低学习门槛，统一使用 `interface` 来做入门教学，它的写法与 Object 更为接近，事实上它也被用的更多。

对象的类型 `interface` 也叫做接口，用来描述对象的结构。

:::tip
对象的类型定义通常采用 Upper Camel Case 大驼峰命名法，也就是每个单词的首字母大写，例如 `UserItem` 、 `GameDetail` ，这是为了跟普通变量进行区分（变量通常使用 Lower Camel Case 小驼峰写法，也就是第一个单词的首字母小写，其他首字母大写，例如 `userItem` ）。
:::

这里通过一些举例来带举一反三，随时可以在 demo 里进行代码实践。

以这个用户信息为例子，比如要描述 Petter 这个用户，他的最基础信息就是姓名和年龄，那么定义为接口就是这么写：

```ts
// 定义用户对象的类型
interface UserItem {
  name: string
  age: number
}

// 在声明变量的时候将其关联到类型上
const petter: UserItem = {
  name: 'Petter',
  age: 20,
}
```

如果需要添加数组、对象等类型到属性里，按照这样继续追加即可。

#### 可选的接口属性

注意，上面这样定义的接口类型，表示 `name` 和 `age` 都是必选的属性，不可以缺少，一旦缺少，代码运行起来就会报错！

在 `src/ts/index.ts` 里敲入以下代码，也就是在声明变量的时候故意缺少了 `age` 属性，来看看会发生什么：

```ts
// 注意！这是一段会报错的代码

interface UserItem {
  name: string
  age: number
}

const petter: UserItem = {
  name: 'Petter',
}
```

运行 `npm run dev:ts` ，会看到控制台给的报错信息，缺少了必选的属性 `age` ：

```bash
src/ts/index.ts:6:7 - error TS2741:
Property 'age' is missing in type '{ name: string; }'
but required in type 'UserItem'.

6 const petter: UserItem = {
        ~~~~~~

  src/ts/index.ts:3:3
    3   age: number
        ~~~
    'age' is declared here.
```

在实际的业务中，有可能会出现一些属性并不是必须的，就像这个年龄，可以将其设置为可选属性，通过添加 `?` 来定义。

请注意下面代码的第三行， `age` 后面紧跟了一个 `?` 号再接 `:` 号，这是 TypeScript 对象对于可选属性的一个定义方式，这一次这段代码是可以成功运行的！

```ts{3-4}
interface UserItem {
  name: string
  // 这个属性变成了可选
  age?: number
}

const petter: UserItem = {
  name: 'Petter',
}
```

#### 调用自身接口的属性

如果一些属性的结构跟本身一致，也可以直接引用，比如下面例子里的 `friendList` 属性，用户的好友列表，它就可以继续使用 `UserItem` 这个接口作为数组的类型：

```ts{5-6,13-26}
interface UserItem {
  name: string
  age: number
  enjoyFoods: string[]
  // 这个属性引用了本身的类型
  friendList: UserItem[]
}

const petter: UserItem = {
  name: 'Petter',
  age: 18,
  enjoyFoods: ['rice', 'noodle', 'pizza'],
  friendList: [
    {
      name: 'Marry',
      age: 16,
      enjoyFoods: ['pizza', 'ice cream'],
      friendList: [],
    },
    {
      name: 'Tom',
      age: 20,
      enjoyFoods: ['chicken', 'cake'],
      friendList: [],
    }
  ],
}
```

#### 接口的继承

接口还可以继承，比如要对用户设置管理员，管理员信息也是一个对象，但要比普通用户多一个权限级别的属性，那么就可以使用继承，它通过 `extends` 来实现：

```ts{8-11,31}
interface UserItem {
  name: string
  age: number
  enjoyFoods: string[]
  friendList: UserItem[]
}

// 这里继承了 UserItem 的所有属性类型，并追加了一个权限等级属性
interface Admin extends UserItem {
  permissionLevel: number
}

const admin: Admin = {
  name: 'Petter',
  age: 18,
  enjoyFoods: ['rice', 'noodle', 'pizza'],
  friendList: [
    {
      name: 'Marry',
      age: 16,
      enjoyFoods: ['pizza', 'ice cream'],
      friendList: [],
    },
    {
      name: 'Tom',
      age: 20,
      enjoyFoods: ['chicken', 'cake'],
      friendList: [],
    }
  ],
  permissionLevel: 1,
}
```

如果觉得这个 `Admin` 类型不需要记录这么多属性，也可以在继承的过程中舍弃某些属性，通过 `Omit` 帮助类型来实现，`Omit` 的类型如下：

```ts
type Omit<T, K extends string | number | symbol>
```

其中 `T` 代表已有的一个对象类型， `K` 代表要删除的属性名，如果只有一个属性就直接是一个字符串，如果有多个属性，用 `|` 来分隔开，下面的例子就是删除了两个不需要的属性：

```ts{8-11}
interface UserItem {
  name: string
  age: number
  enjoyFoods: string[]
  friendList?: UserItem[]
}

// 这里在继承 UserItem 类型的时候，删除了两个多余的属性
interface Admin extends Omit<UserItem, 'enjoyFoods' | 'friendList'> {
  permissionLevel: number
}

// 现在的 admin 就非常精简了
const admin: Admin = {
  name: 'Petter',
  age: 18,
  permissionLevel: 1,
}
```

看到这里并实际体验过的话，在业务中常见的类型定义已经难不倒了！

### 类

类是 JavaScript ES6 推出的一个概念，通过 `class` 关键字，可以定义一个对象的模板，如果对类还比较陌生的话，可以先阅读一下阮一峰老师的 ES6 文章：[Class 的基本语法](https://es6.ruanyifeng.com/#docs/class) 。

在 TypeScript ，通过类得到的变量，它的类型就是这个类，可能这句话看起来有点难以理解，来看个例子，可以在 demo 里运行它：

```ts
// 定义一个类
class User {
  // constructor 上的数据需要先这样定好类型
  name: string

  // 入参也要定义类型
  constructor(userName: string) {
    this.name = userName
  }

  getName() {
    console.log(this.name)
  }
}

// 通过 new 这个类得到的变量，它的类型就是这个类
const petter: User = new User('Petter')
petter.getName() // Petter
```

类与类之间可以继承：

```ts
// 这是一个基础类
class UserBase {
  name: string
  constructor(userName: string) {
    this.name = userName
  }
}

// 这是另外一个类，继承自基础类
class User extends UserBase {
  getName() {
    console.log(this.name)
  }
}

// 这个变量拥有上面两个类的所有属性和方法
const petter: User = new User('Petter')
petter.getName()
```

类也可以提供给接口去继承：

```ts
// 这是一个类
class UserBase {
  name: string
  constructor(userName: string) {
    this.name = userName
  }
}

// 这是一个接口，可以继承自类
interface User extends UserBase {
  age: number
}

// 这样这个变量就必须同时存在两个属性
const petter: User = {
  name: 'Petter',
  age: 18,
}
```

如果类上面本身有方法存在，接口在继承的时候也要相应的实现，当然也可以借助在 [对象（接口）](#对象-接口) 提到的 `Omit` 帮助类型来去掉这些方法。

```ts{6-9,12-15}
class UserBase {
  name: string
  constructor(userName: string) {
    this.name = userName
  }
  // 这是一个方法
  getName() {
    console.log(this.name)
  }
}

// 接口继承类的时候也可以去掉类上面的方法
interface User extends Omit<UserBase, 'getName'> {
  age: number
}

// 最终只保留数据属性，不带有方法
const petter: User = {
  name: 'Petter',
  age: 18,
}
```

### 联合类型

阅读到这里，对 JavaScript 的数据和对象如何在 TypeScript 定义类型相信没有太大问题了吧！

所以这里先插入一个知识点，在介绍 [对象（接口）](#对象-接口) 和 [类](#类) 的类型定义时，提到 `Omit` 的帮助类型，它的类型里面有一个写法是 `string | number | symbol` ，这其实是 TypeScript 的一个联合类型。

当一个变量可能出现多种类型的值的时候，可以使用联合类型来定义它，类型之间用 `|` 符号分隔。

举一个简单的例子，下面这个函数接收一个代表 “计数” 的入参，并拼接成一句话打印到控制台，因为最终打印出来的句子是字符串，所以参数没有必要非得是数值，传字符串也是可以的，所以就可以使用联合类型：

```ts{2}
// 可以在 demo 里运行这段代码
function counter(count: number | string) {
  console.log(`The current count is: ${count}.`)
}

// 不论传数值还是字符串，都可以达到的目的
counter(1)  // The current count is: 1.
counter('2')  // The current count is: 2.
```

:::tip
注意在上面 `counter` 函数的 `console.log` 语句里，使用了一个 `{{ templateLiterals }}` 符号来定义字符串，这是 ES6 语法里的 [模板字符串](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals) ，它和传统的单引号 / 双引号相比更为灵活，特别是遇到字符串需要配合多变量拼接和换行的情况。

对 JavaScript 后面推出的新语法不太熟悉的话，很容易和单引号混淆，在学名上，它也被称之为 “反引号” （ Backquote ） ，可以使用标准键盘的 `ESC` 键下方、也就是 `1` 左边的那个按键打出来。
:::

在实际的业务场景中，例如 Vue 的路由在不同的数据结构里也有不同的类型，有时候需要通过路由实例来判断是否符合要求的页面，也需要用到这种联合类型：

```ts{5}
// 注意：这不是完整的代码，只是一个使用场景示例
import type { RouteRecordRaw, RouteLocationNormalizedLoaded } from 'vue-router'

function isArticle(
  route: RouteRecordRaw | RouteLocationNormalizedLoaded
): boolean {
  // ...
}

```

再举个例子，是用 Vue 做页面，会涉及到子组件或者 DOM 的操作，当它们还没有渲染出来时，获取到的是 null ，渲染后才能拿到组件或者 DOM 结构，这种场景也可以使用联合类型：

```ts
// querySelector 拿不到 DOM 的时候返回 null
const ele: HTMLElement | null = document.querySelector('.main')
```

最后这个使用场景在 Vue 单组件的 [DOM 元素与子组件](component.md#dom-元素与子组件) 一节里也有相关的讲解。

当决定使用联合类型的时候，大部分情况下可能需要对变量做一些类型判断再写逻辑，当然有时候也可以无所谓，就像第一个例子拼接字符串那样。

这一小节在这里做简单了解即可，因为下面会继续配合不同的知识点把这个联合类型再次拿出来讲，比如 [函数的重载](#函数的重载) 部分。

### 函数

函数是 JavaScript 里最重要的成员之一，所有的功能实现都是基于函数。

#### 函数的基本的写法

在 JavaScript ，函数有很多种写法：

```js
// 注意：这是 JavaScript 代码

// 写法一：函数声明
function sum1(x, y) {
  return x + y
}

// 写法二：函数表达式
const sum2 = function (x, y) {
  return x + y
}

// 写法三：箭头函数
const sum3 = (x, y) => x + y

// 写法四：对象上的方法
const obj = {
  sum4(x, y) {
    return x + y
  },
}

// 还有很多……
```

但其实离不开两个最核心的操作：输入与输出，也就是对应函数的 “入参” 和 “返回值” ，在 TypeScript ，函数本身和 TS 类型有关系的也是在这两个地方。

函数的入参是把类型写在参数后面，返回值是写在圆括号后面，把上面在 JavaScript 的这几个写法，转换成 TypeScript 看看区别在哪里：

```ts{4,9,14,18}
// 注意：这是 TypeScript 代码

// 写法一：函数声明
function sum1(x: number, y: number): number {
  return x + y
}

// 写法二：函数表达式
const sum2 = function(x: number, y: number): number {
  return x + y
}

// 写法三：箭头函数
const sum3 = (x: number, y: number): number => x + y

// 写法四：对象上的方法
const obj = {
  sum4(x: number, y: number): number {
    return x + y
  }
}

// 还有很多……
```

是不是一下子 Get 到了技巧！函数的类型定义也是非常的简单，掌握这个技巧可以让解决大部分常见的函数。

#### 函数的可选参数

实际业务中会遇到有一些函数入参是可选，可以用和 [对象（接口）](#对象-接口) 一样，用 `?` 来定义：

```ts
// 注意 isDouble 这个入参后面有个 ? 号，表示可选
function sum(x: number, y: number, isDouble?: boolean): number {
  return isDouble ? (x + y) * 2 : x + y
}

// 这样传参都不会报错，因为第三个参数是可选的
sum(1, 2) // 3
sum(1, 2, true) // 6
```

:::tip
需要注意的是，可选参数必须排在必传参数的后面。
:::

#### 无返回值的函数

除了有返回值的函数，更多时候是不带返回值的，例如下面这个例子，这种函数用 `void` 来定义它的返回，也就是空。

```ts{2}
// 注意这里的返回值类型
function sayHi(name: string): void {
  console.log(`Hi, ${name}!`)
}

sayHi('Petter') // Hi, Petter!
```

需要注意的是， `void` 和 `null` 、 `undefined` 不可以混用，如果的函数返回值类型是 `null` ，那么是真的需要 `return` 一个 `null` 值：

```ts{2,4}
// 只有返回 null 值才能定义返回类型为 null
function sayHi(name: string): null {
  console.log(`Hi, ${name}!`)
  return null
}
```

有时候要判断参数是否合法，不符合要求时需要提前终止执行（比如在做一些表单校验的时候），这种情况下也可以用 `void` ：

```ts{2-3}
function sayHi(name: string): void {
  // 这里判断参数不符合要求则提前终止运行，但它没有返回值
  if (!name) return

  // 否则正常运行
  console.log(`Hi, ${name}!`)
}
```

#### 异步函数的返回值

对于异步函数，需要用 `Promise<T>` 类型来定义它的返回值，这里的 `T` 是泛型，取决于的函数最终返回一个什么样的值（ `async / await` 也适用这个类型）。

例如这个例子，这是一个异步函数，会 `resolve` 一个字符串，所以它的返回类型是 `Promise<string>` （假如没有 `resolve` 数据，那么就是 `Promise<void>` ）。

```ts{2,5}
// 注意这里的返回值类型
function queryData(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Hello World')
    }, 3000)
  })
}

queryData().then((data) => console.log(data))
```

#### 函数本身的类型

细心的开发者可能会有个疑问，通过函数表达式或者箭头函数声明的函数，这样写好像只对函数体的类型进行了定义，而左边的变量并没有指定。

没错，确实是没有为这个变量指定类型：

```ts
// 这里的 sum ，确实是没有指定类型
const sum = (x: number, y: number): number => x + y
```

这是因为，通常 TypeScript 会根据函数体自动推导，所以可以省略这里的定义。

如果确实有必要，可以这样来定义等号左边的类型：

```ts
const sum: (x: number, y: number) => number = (x: number, y: number): number =>
  x + y
```

这里出现了 2 个箭头 `=>` ，注意第一个箭头是 TypeScript 的，第二个箭头是 JavaScript ES6 的。

实际上上面这句代码是分成了三部分：

1. `const sum: (x: number, y: number) => number` 是这个函数的名称和类型
2. `= (x: number, y: number)` 这里是指明了函数的入参和类型
3. `: number => x + y` 这里是函数的返回值和类型

第 2 和 3 点相信从上面的例子已经能够理解了，所以注意力放在第一点：

TypeScript 的函数类型是以 `() => void` 这样的形式来写的：左侧圆括号是函数的入参类型，如果没有参数，就只有一个圆括号，如果有参数，就按照参数的类型写进去；右侧则是函数的返回值。

事实上由于 TypeScript 会推导函数类型，所以很少会显式的去写出来，除非在给对象定义方法：

```ts{3-4,9-11}
// 对象的接口
interface Obj {
  // 上面的方法就需要显式的定义出来
  sum: (x: number, y: number) => number
}

// 声明一个对象
const obj: Obj = {
  sum(x: number, y: number): number {
    return x + y
  }
}
```

#### 函数的重载

在未来的实际开发中，可能会接触到一个 API 有多个 TS 类型的情况，比如 Vue 的 [watch API](component.md#api-的-ts-类型) 。

Vue 的这个 watch API 在被调用时，需要接收一个数据源参数，当侦听单个数据源时，它匹配了类型 1 ，当传入一个数组侦听多个数据源时，它匹配了类型 2 。

这个知识点其实就是 TypeScript 里的函数重载。

先来看下不用重载的时候，的代码应该怎么写：

```ts
// 对单人或者多人打招呼
function greet(name: string | string[]): string | string[] {
  if (Array.isArray(name)) {
    return name.map((n) => `Welcome, ${n}!`)
  }
  return `Welcome, ${name}!`
}

// 单个问候语
const greeting = greet('Petter')
console.log(greeting) // Welcome, Petter!

// 多个问候语
const greetings = greet(['Petter', 'Tom', 'Jimmy'])
console.log(greetings)
// [ 'Welcome, Petter!', 'Welcome, Tom!', 'Welcome, Jimmy!' ]
```

:::tip
注意这里的入参和返回值使用了 TypeScript 的 [联合类型](#联合类型) ，不了解的话请先重温知识点。
:::

虽然代码逻辑部分还是比较清晰的，区分了入参的数组类型和字符串类型，返回不同的结果，但是，在入参和返回值的类型这里，却显得非常乱。

并且这样子写，下面在调用函数时，定义的变量也无法准确的获得它们的类型：

```ts
// 此时这个变量依然可能有多个类型
const greeting: string | string[]
```

如果要强制确认类型，需要使用 TS 的 [类型断言](#类型断言) （留意后面的 `as` 关键字）：

```ts
const greeting = greet('Petter') as string
const greetings = greet(['Petter', 'Tom', 'Jimmy']) as string[]
```

这无形的增加了编码时的心智负担。

此时，利用 TypeScript 的函数重载就非常有用！来看一下具体如何实现：

```ts{2-4}
// 这一次用了函数重载
function greet(name: string): string  // TS 类型
function greet(name: string[]): string[]  // TS 类型
function greet(name: string | string[]) {
  if (Array.isArray(name)) {
    return name.map((n) => `Welcome, ${n}!`)
  }
  return `Welcome, ${name}!`
}

// 单个问候语，此时只有一个类型 string
const greeting = greet('Petter')
console.log(greeting) // Welcome, Petter!

// 多个问候语，此时只有一个类型 string[]
const greetings = greet(['Petter', 'Tom', 'Jimmy'])
console.log(greetings)
// [ 'Welcome, Petter!', 'Welcome, Tom!', 'Welcome, Jimmy!' ]
```

上面是利用函数重载优化后的代码，可以看到一共写了 3 行 `function greet …` ，区别如下：

第 1 行是函数的 TS 类型，告知 TypeScript ，当入参为 `string` 类型时，返回值也是 `string` ;

第 2 行也是函数的 TS 类型，告知 TypeScript ，当入参为 `string[]` 类型时，返回值也是 `string[]` ;

第 3 行开始才是真正的函数体，这里的函数入参需要把可能涉及到的类型都写出来，用以匹配前两行的类型，并且这种情况下，函数的返回值类型可以省略，因为在第 1 、 2 行里已经定义过返回类型了。

### 任意值

如果实在不知道应该如何定义一个变量的类型， TypeScript 也允许使用任意值。

还记得在 [为什么需要类型系统](#为什么需要类型系统) 的用的那个例子吗？再次放到 `src/ts/index.ts` 里：

```ts
// 这段代码在 TS 里运行会报错
function getFirstWord(msg) {
  console.log(msg.split(' ')[0])
}

getFirstWord('Hello World')

getFirstWord(123)
```

运行 `npm run dev:ts` 的时候，会得到一句报错 `Parameter 'msg' implicitly has an 'any' type.` ，意思是这个参数带有隐式 any 类型。

这里的 any 类型，就是 TypeScript 任意值。

既然报错是 “隐式” ，那 “显式” 的指定就可以了，当然，为了程序能够正常运行，还提高一下函数体内的代码健壮性：

```ts{2,4}
// 这里的入参显式指定了 any
function getFirstWord(msg: any) {
  // 这里使用了 String 来避免程序报错
  console.log(String(msg).split(' ')[0])
}

getFirstWord('Hello World')

getFirstWord(123)
```

这次就不会报错了，不论是传 `string` 还是 `number` 还是其他类型，都可以正常运行。

:::tip
使用 any 的目的是让在开发的过程中，可以不必在无法确认类型的地方消耗太多时间，不代表不需要注意代码的健壮性。

一旦使用了 any ，代码里的逻辑请务必考虑多种情况进行判断或者处理兼容。
:::

### npm 包

虽然现在从 npm 安装的包都基本自带 TS 类型了，不过也存在一些包没有默认支持 TypeScript ，比如前面提到的 [md5](https://www.npmjs.com/package/md5) 。

在 TS 文件里导入并使用这个包的时候，会编译失败，比如在前面的 [Hello TypeScript](#hello-typescript) demo 里敲入以下代码：

```ts
// src/ts/index.ts
import md5 from 'md5'
console.log(md5('Hello World'))
```

在命令行执行 `npm run dev:ts` 之后，会得到一段报错信息：

```bash
src/ts/index.ts:1:17 - error TS7016:
Could not find a declaration file for module 'md5'.
'D:/Project/demo/hello-node/node_modules/md5/md5.js' implicitly has an 'any' type.
  Try `npm i --save-dev @types/md5` if it exists
  or add a new declaration (.d.ts) file
  containing `declare module 'md5';`

1 import md5 from 'md5'
                  ~~~~~
```

这是因为缺少 md5 这个包的类型定义，根据命令行的提示，安装 `@types/md5` 这个包。

这是因为这些包是很早期用 JavaScript 编写的，因为功能够用作者也没有进行维护更新，所以缺少相应的 TS 类型，因此开源社区推出了一套 @types 类型包，专门处理这样的情况。

@types 类型包的命名格式为 `@types/<package-name>` ，也就是在原有的包名前面拼接 `@types` ，日常开发要用到的知名 npm 包都会有相应的类型包，只需要将其安装到 package.json 的 `devDependencies` 里即可解决该问题。

来安装一下 md5 的类型包：

```bash
npm install -D @types/md5
```

再次运行就不会报错了！

```bash
npm run dev:ts

> demo@1.0.0 dev:ts
> ts-node src/ts/index.ts

b10a8db164e0754105b7a99be72e3fe5
```

### 类型断言

在讲解 [函数的重载](#函数的重载) 的时候，提到了一个用法：

```ts
const greeting = greet('Petter') as string
```

这里的 `值 as 类型` 就是 TypeScript 类型断言的语法，它还有另外一个语法是 `<类型>值` 。

当一个变量应用了 [联合类型](#联合类型) 时，在某些时候如果不显式的指明其中的一种类型，可能会导致后续的代码运行报错。

这个时候就可以通过类型断言强制指定其中一种类型，以便程序顺利运行下去。

#### 常见的使用场景

把函数重载时最开始用到的那个例子，也就是下面的代码放到 `src/ts/index.ts` 里：

```ts{9-11}
// 对单人或者多人打招呼
function greet(name: string | string[]): string | string[] {
  if (Array.isArray(name)) {
    return name.map((n) => `Welcome, ${n}!`)
  }
  return `Welcome, ${name}!`
}

// 虽然已知此时应该是 string[]
// 但 TypeScript 还是会认为这是 string | string[]
const greetings = greet(['Petter', 'Tom', 'Jimmy'])

// 会导致无法使用 join 方法
const greetingSentence = greetings.join(' ')
console.log(greetingSentence)
```

执行 `npm run dev:ts` ，可以清楚的看到报错原因，因为 `string` 类型不具备 `join` 方法。

```bash
src/ts/index.ts:11:31 - error TS2339:
Property 'join' does not exist on type 'string | string[]'.
  Property 'join' does not exist on type 'string'.

11 const greetingStr = greetings.join(' ')
                                 ~~~~
```

此时利用类型断言就可以达到目的：

```ts{9-10}
// 对单人或者多人打招呼
function greet(name: string | string[]): string | string[] {
  if (Array.isArray(name)) {
    return name.map((n) => `Welcome, ${n}!`)
  }
  return `Welcome, ${name}!`
}

// 已知此时应该是 string[] ，所以用类型断言将其指定为 string[]
const greetings = greet(['Petter', 'Tom', 'Jimmy']) as string[]

// 现在可以正常使用 join 方法
const greetingSentence = greetings.join(' ')
console.log(greetingSentence)
```

#### 需要注意的事情

但是，请不要滥用类型断言，只在能够确保代码正确的情况下去使用它，来看一个反例：

```ts
// 原本要求 age 也是必须的属性之一
interface User {
  name: string
  age: number
}

// 但是类型断言过程中，遗漏了
const petter = {} as User
petter.name = 'Petter'

// TypeScript 依然可以运行下去，但实际上的数据是不完整的
console.log(petter) // { name: 'Petter' }
```

:::tip
使用类型断言可以让 TypeScript 不检查的代码，它会认为是对的。

所以，请务必保证自己的代码真的是对的！
:::

### 类型推论

还记得在讲 [原始数据类型](#原始数据类型) 的时候，最后提到的：

> 不过在实际的编程过程中，原始数据类型的类型定义是可以省略的，因为 TypeScript 会根据声明变量时赋值的类型，自动帮推导变量类型

这其实是 TypeScript 的类型推论功能，当在声明变量的时候可以确认它的值，那么 TypeScript 也可以在这个时候帮推导它的类型，这种情况下就可以省略一些代码量。

下面这个变量这样声明是 OK 的，因为 TypeScript 会推导 `msg` 是 `string` 类型。

```ts
// 相当于 msg: string
let msg = 'Hello World'

// 所以要赋值为 number 类型时会报错
msg = 3 // Type 'number' is not assignable to type 'string'
```

下面这段代码也是可以正常运行的，因为 TypeScript 会根据 `return` 的结果推导 `getRandomNumber` 的返回值是 `number` 类型，从而推导变量 `num` 也是 `number` 类型。

```ts
// 相当于 getRandomNumber(): number
function getRandomNumber() {
  return Math.round(Math.random() * 10)
}

// 相当于 num: number
const num = getRandomNumber()
```

类型推论的前提是变量在声明时有明确的值，如果一开始没有赋值，那么会被默认为 `any` 类型。

```ts
// 此时相当于 foo: any
let foo

// 所以可以任意改变类型
foo = 1 // 1
foo = true // true
```

类型推论可以节约很多书写工作量，在确保变量初始化有明确的值的时候，可以省略其类型，但必要的时候，该写上的还是要写上。

## 如何编译为 JavaScript 代码

学习到这里，对于 TypeScript 的入门知识已经学到了吧！

前面学习的时候，一直是基于 `dev:ts` 命令，它调用的是 `ts-node` 来运行的 TS 文件：

```json
{
  // ...
  "scripts": {
    // ...
    "dev:ts": "ts-node src/ts/index.ts"
  }
  // ...
}
```

但最终可能需要的是一个 JS 文件，比如要通过 `<script src>` 来放到 HTML 页面里，这就涉及到对 TypeScript 的编译。

来看看如何把一个 TS 文件编译成 JS 文件，让其从 TypeScript 变成 JavaScript 代码。

### 编译单个文件

先在 package.json 里增加一个 build script ：

```json{10}
{
  "name": "hello-node",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev:cjs": "node src/cjs/index.cjs",
    "dev:esm": "node src/esm/index.mjs",
    "dev:ts": "ts-node src/ts/index.ts",
    "build": "tsc src/ts/index.ts --outDir dist",
    "compile": "babel src/babel --out-dir compiled",
    "serve": "node server/index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "md5": "^2.3.0"
  },
  "devDependencies": {
    "@types/md5": "^2.3.2",
    "ts-node": "^10.7.0",
    "typescript": "^4.6.3"
  }
}
```

这样在命令行运行 `npm run build` 的时候，就会把 `src/ts/index.ts` 这个 TS 文件编译，并输出到项目下与 src 文件夹同级的 dist 目录下。

其中 `tsc` 是 TypeScript 用来编译文件的命令， `--outDir` 是它的一个选项，用来指定输出目录，如果不指定，则默认生成到源文件所在的目录下面。

把之前在 [函数的重载](#函数的重载) 用过的这个例子放到 `src/ts/index.ts` 文件里，因为它是一段比较典型的、包含了多个知识点的 TypeScript 代码：

```ts
// 对单人或者多人打招呼
function greet(name: string): string
function greet(name: string[]): string[]
function greet(name: string | string[]) {
  if (Array.isArray(name)) {
    return name.map((n) => `Welcome, ${n}!`)
  }
  return `Welcome, ${name}!`
}

// 单个问候语
const greeting = greet('Petter')
console.log(greeting)

// 多个问候语
const greetings = greet(['Petter', 'Tom', 'Jimmy'])
console.log(greetings)
```

可以先执行 `npm run dev:ts` 测试它的可运行性，当然，如果期间的代码运行有问题，在编译阶段也会给报错。

现在来编译它，现在在命令行输入 `npm run build` 并回车执行。

可以看到多了一个 dist 文件夹，里面多了一个 `index.js` 文件。

```bash{2-5}
hello-node
│ # 构建产物
├─dist
│ │ # 编译后的 JS 文件
│ └─index.js
│ # 依赖文件夹
├─node_modules
│ # 源码文件夹
├─src
│ # 锁定安装依赖的版本号
├─package-lock.json
│ # 项目清单
└─package.json
```

`index.js` 文件里面的代码如下：

```js
function greet(name) {
  if (Array.isArray(name)) {
    return name.map(function (n) {
      return 'Welcome, '.concat(n, '!')
    })
  }
  return 'Welcome, '.concat(name, '!')
}
// 单个问候语
var greeting = greet('Petter')
console.log(greeting)
// 多个问候语
var greetings = greet(['Petter', 'Tom', 'Jimmy'])
console.log(greetings)
```

可以看到已经成功把 TypeScript 代码编译成 JavaScript 代码了。

在命令行执行 `node dist/index.js` ，像之前测试 JS 文件一样使用 `node` 命令，运行 dist 目录下的 `index.js` 文件，它可以正确运行：

```bash
node dist/index.js
Welcome, Petter!
[ 'Welcome, Petter!', 'Welcome, Tom!', 'Welcome, Jimmy!' ]
```

### 编译多个模块

刚才只是编译一个 `index.ts` 文件，如果 `index.ts` 里引入了其他模块，此时 `index.ts` 是作为入口文件，入口文件 `import` 进来使用的模块也会被 TypeScript 一并编译。

拆分一下模块，把 `greet` 函数单独抽离成一个模块文件 `src/ts/greet.ts` ：

```ts
// src/ts/greet.ts
function greet(name: string): string
function greet(name: string[]): string[]
function greet(name: string | string[]) {
  if (Array.isArray(name)) {
    return name.map((n) => `Welcome, ${n}!`)
  }
  return `Welcome, ${name}!`
}

export default greet
```

在 `src/ts/index.ts` 这边，把这个模块导进来：

```ts
// src/ts/index.ts
import greet from './greet'

// 单个问候语
const greeting = greet('Petter')
console.log(greeting)

// 多个问候语
const greetings = greet(['Petter', 'Tom', 'Jimmy'])
console.log(greetings)
```

的 build script 无需修改，依然只编译 `index.ts` ，但因为导入了 `greet.ts` ，所以 TypeScript 也会一并编译，来试一下运行 `npm run build` ， 现在 dist 目录下有两个文件了：

```bash{2-5}
hello-node
│ # 构建产物
├─dist
│ ├─greet.js  # 多了这个文件
│ └─index.js
│
│ # 其他文件这里省略...
└─package.json
```

来看看这一次的编译结果：

先看看 `greet.js` ：

```js
// dist/greet.js
'use strict'
exports.__esModule = true
function greet(name) {
  if (Array.isArray(name)) {
    return name.map(function (n) {
      return 'Welcome, '.concat(n, '!')
    })
  }
  return 'Welcome, '.concat(name, '!')
}
exports['default'] = greet
```

再看看 `index.js` ：

```js
// dist/index.js
'use strict'
exports.__esModule = true
var greet_1 = require('./greet')
// 单个问候语
var greeting = (0, greet_1['default'])('Petter')
console.log(greeting)
// 多个问候语
var greetings = (0, greet_1['default'])(['Petter', 'Tom', 'Jimmy'])
console.log(greetings)
```

这个代码风格有没有觉得似曾相识？是的，就是前面提到的 [CommonJS](#用-commonjs-设计模块) 模块代码。

其实在 [编译单个文件](#编译单个文件) 代码的时候，它也是 CommonJS ，只不过因为只有一个文件，没有涉及到模块化，所以第一眼看不出来。

还是在命令行执行 `node dist/index.js` ，虽然也是运行 dist 目录下的 `index.js` 文件，但这次它的作用是充当一个入口文件了，引用到的 `greet.js` 模块文件也会被调用。

这次一样可以得到正确的结果：

```bash
node dist/index.js
Welcome, Petter!
[ 'Welcome, Petter!', 'Welcome, Tom!', 'Welcome, Jimmy!' ]
```

### 修改编译后的 JS 版本

还可以修改编译配置，让 TypeScript 编译成不同的 JavaScript 版本。

修改 package.json 里的 build script ，在原有的命令后面增加一个 `--target` 选项：

```json
{
  // ...
  "scripts": {
    // ...
    "build": "tsc src/ts/index.ts --outDir dist --target es6"
  }
  // ...
}
```

`--target` 选项的作用是控制编译后的 JavaScript 版本，可选的值目前有： `es3` ， `es5` ， `es6` ， `es2015` ， `es2016` ， `es2017` ， `es2018` ， `es2019` ， `es2020` ， `es2021` ， `es2022` ， `esnext` ，分别对应不同的 JS 规范（所以未来的可选值会根据 JS 规范一起增加）。

之前编译出来的 JavaScript 是 [CommonJS 规范](#用-commonjs-设计模块) ，本次配置的是 `es6` ，这是支持 [ES Module 规范](#用-es-module-设计模块) 的版本。

:::tip
通常还需要配置一个 `--module` 选项，用于决定编译后是 CJS 规范还是 ESM 规范，但如果缺省，会根据 `--target` 来决定。
:::

再次在命令行运行 `npm run build` ，这次看看变成了什么：

先看看 `greet.js` ：

```js
// dist/greet.js
function greet(name) {
  if (Array.isArray(name)) {
    return name.map((n) => `Welcome, ${n}!`)
  }
  return `Welcome, ${name}!`
}
export default greet
```

再看看 `index.js` ：

```js
// dist/index.js
import greet from './greet'
// 单个问候语
const greeting = greet('Petter')
console.log(greeting)
// 多个问候语
const greetings = greet(['Petter', 'Tom', 'Jimmy'])
console.log(greetings)
```

这次编译出来的都是基于 ES6 的 JavaScript 代码，因为涉及到 ESM 模块，所以不能直接在 node 运行它了，可以手动改一下扩展名，改成 `.mjs` （包括 index 文件里 `import` 的 greet 文件名也要改），然后再运行 `node dist/index.mjs` 。

### 其他事项

在尝试 [编译单个文件](#编译单个文件) 和 [编译多个模块](#编译多个模块) 的时候，相信各位开发者应该没有太大的疑问，但是来到 [修改编译后的 JS 版本](#修改编译后的-js-版本) 这里，事情就开始变得复杂了起来，应该能感觉到编译的选项和测试成本都相应的增加了很多。

事实上刚才编译的 JS 文件，因为涉及到 ESM 模块化，是无法通过普通的 `<script />` 标签在 HTML 页面里使用的（单个文件可以，因为没有涉及模块），不仅需要加上 ESM 模块所需的 `<script type="module" />`  属性，本地开发还需要启动本地服务器通过 HTTP 协议访问页面，才允许在浏览器里使用 ESM 模块（详见： [在浏览器里访问 ESM](guide.md#在浏览器里访问-esm) 一节）。

因此在实际的项目开发中，需要借助 [构建工具](#工程化的构建工具) 来处理很多编译过程中的兼容性问题，降低开发成本。

而刚才用到的诸如 `--target` 这样的选项，可以用一个更简单的方式来管理，类似于 package.json 项目清单， TypeScript 也有一份适用于项目的配置清单，请看 [了解 tsconfig.json](#了解-tsconfig-json) 部分。

## 了解 tsconfig.json

TypeScript 项目一般都会有一个 tsconfig.json 文件，放置于项目的根目录下，这个文件的作用是用来管理 TypeScript 在编译过程中的一些选项配置。

在开始之前，需要全局安装一下 TypeScript ：

```bash
npm install -g typescript
```

这样就可以使用 TypeScript 提供的全局功能，可以直接在命令行里使用 `tsc` 命令了（之前本地安装的时候，需要封装成 package.json 的 script 才能调用它）。

依然是用的 [Hello TypeScript](#hello-typescript) demo ，记得先通过 `cd` 命令进入项目所在的目录。

在命令行输入 `tsc --init` ，这是 TypeScript 提供的初始化功能，会生成一个默认的 tsconfig.json 文件。

```bash
tsc --init

Created a new tsconfig.json with:
                                                                               TS
  target: es2016
  module: commonjs
  strict: true
  esModuleInterop: true
  skipLibCheck: true
  forceConsistentCasingInFileNames: true


You can learn more at https://aka.ms/tsconfig.json
```

现在的目录结构是这样子，多了一个 tsconfig.json 文件：

```bash{12-13}
hello-node
│ # 构建产物
├─dist
│ # 依赖文件夹
├─node_modules
│ # 源码文件夹
├─src
│ # 锁定安装依赖的版本号
├─package-lock.json
│ # 项目清单
├─package.json
│ # TypeScript 配置
└─tsconfig.json
```

每一个 `tsc` 的命令行的选项，都可以作为这个 JSON 的一个字段来管理，例如刚才的 `--outDir` 和 `--target` 选项，在这个 JSON 文件里对应的就是：

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "es6",
    "outDir": "./dist"
  }
}
```

可以直接在生成的 tsconfig.json 上面修改。

来试试效果，这一次不需要用到 package.json 里的 build script 了，直接在命令行运行 `tsc` ，它现在会根据配置的 tsconfig.json 文件，按照的要求来编译。

可以看到它依然按照要求在 dist 目录下生成编译后的 JS 文件，而且这一次的编译结果，和在 build script 里使用的 `tsc src/ts/index.ts --outDir dist --target es6` 这一长串命令是一样的。

所以正常工作中，都是使用 tsconfig.json 来管理 TypeScript 的配置的。

完整的选项可以查看 TypeScript 官网： [tsconfig - typescriptlang](https://www.typescriptlang.org/tsconfig/)

不过实际工作中的项目都是通过一些脚手架创建的，例如 [Vue CLI](https://github.com/vuejs/vue-cli) ，或者现在的 [Create Vue](https://github.com/vuejs/create-vue) 或者 [Create Preset](https://github.com/awesome-starter/create-preset) ，都会在创建项目模板的时候，提前配置好通用的选项，只需要在不满足条件的情况下去调整。

<script setup>
const templateLiterals = '``'
</script>

<!-- 评论 -->
<ClientOnly>
  <GitalkComment
    :issueId="193"
  />
</ClientOnly>
<!-- 评论 -->
