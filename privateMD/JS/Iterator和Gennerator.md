# Iterator 和 Generator
## Iterator是啥？ 
- Iterator是一种遍历的机制，一种接口。面对不同的数据结构时提供统一的访问接口。

## 为啥要Iterator？
- 通常使用*循环*进行数据遍历。但是一般遍历需要提前知道遍历对象的数据结构才能进行遍历。
- 遍历顺序不是数据结构固有的，一般的通过索引访问数据适用于类数组的结构，别的结构不一定样适用。  

## 如何实现一个Iterator
实现一个迭代器（Iterator）需要两个东西，一个可迭代对象（实现了Iterable接口的结构）、一个是迭代器（Iterator）。
## 如何实现一个可迭代对象（iterable）
实现iterable接口要满足两个条件：
1. 支持迭代的自我识别能力。 换句话说就是数据结构上需要有`Symbol.iterator`属性
2. 创建实现Iterator接口的对象的能力。也就是说数据结构上的`Symbol.iterator`属性是一个函数，遍历器调用后返回一个*迭代器*。
> ES6中内置了Iterator接口的有：Array、Map、Set、String、TypedArray、argument对象、NodeList等DOM集合类型
> 如果对象的原型链上父类实现了Iterable接口，那该对象也实现了这个接口

## 迭代器是个啥？
当对一个可以迭代对象（Iterable）进行迭代时，会返回一个一次性使用的迭代器。这个迭代器与创建它的可迭代对象相关联。  

## 什么地方会用到迭代器呢
- for-of循环
- 数组解构
    ```js
    let set = new Set().add('a').add('b').acc('c')
    let [x,y] = set //x='a',y='b'
    let [first,...rest]=set // first='a' rest=['b','c']
    ```
- 拓展运算符
    ```js
    let str = 'Tom'
    [...str] // ["T", "o", "m"]
    ```
- yield* 操作符，     在生成器中使用。 `yield*` 后可以跟着一个可遍历结构`yield*`
- Array.from
- Map()、Set()、WeakMap()、WeakSet()
- Promise.all()、Promise.race()
 
## 如何实现一个迭代器

迭代器是 遍历可迭代对象(iterable)时生成的一次性的对象。  
迭代器API使用`next()`方法获取可迭代对象中的遍历数据，调用个得到一个`IteratorResult`对象（`{done:fasle , value:'foo'}`） ，其中包含两个值， `done`布尔值表示是否可以通过next()继续调用下一个值， `value`表示可迭代对象的当前的值或者为`undefined`。
- - - 
**迭代器执行过程**  
1. 当对 Iterable对象遍历是返回一个指针对象（迭代器），指针指向 Iterable对象数据结构的起始位置。
2. 第一次调用`next()`方法，指针指向数据结构的第一个成员。
3. 第二次调用`next()`方法，指针指向数据结构的第二个成员。
3. 以此类推不停调用`next()`方法，直到指向数据结构的结束位置。返回`{{done:true , value:'undefined}`
>提示
>1. 对于同一个 *可迭代对象* 多次遍历返回的 *迭代器* 之间是没有关系的，每个*迭代器*都是独立的访问*可迭代对象*
>2. 迭代器不与可迭代对象的某个时刻的 快照 绑定，也就是说 *可迭代对象* 在迭代期间进行了改变，迭代器也回反应出相应的变化。
>3. 因为迭代器本质上是一个指针，回阻止垃圾回收程序回收可迭代对象
>3. 因为迭代器本身也实现了Iterable接口，对迭代器进行遍历会得到迭代器本身  

- - -
**迭代器提前中止**  
执行迭代的结构不想对`可迭代对象(Iterable)`遍历完全，可以调用`迭代器`中的retrun()方法可以提前中止迭代器。  
可能出现的情况：  
    1.  for-of 循环通过break、continue、return、throw提前退出  
    2. 解构操作并未消费的的所有值
`return()`方法必须返回一个IteratorResult对象，例如`{done:true}`,返回的对象只会用在`生成器`的上下文中。
>提示
> 1. 内置的语言结构在迭代结构内的数据时，如果不消费后续的值时，会自动调用return()方法。
> 1. 如果迭代器没有关闭`return {done：true}` ，那么在下一次调用迭代器时会从下一个位置继续迭代。
> 2. `return方法`是可选的，所以不是所有的迭代器都是关闭的。对于那些不可关闭的迭代器哪怕执行return方法也不会进去关闭状态


---
# Generator
Generator是es6 新增的数据结构，它可以在一个函数块内实现暂停和恢复代码执行。  这种数据结构可以自定义迭代器和实现协程。 
- - -
## 定义
generator的形式是一个函数，但是与一般函数有两个不同点：  
    1. function与函数名之间有一个星号`*`  
    2. 函数内部使用`yield`表达式表示不同状态
> 注意 箭头函数不能用来定义生成器函数  

调用generator函数返回一个`生成器对象`，生成器对象一开始处于暂停(suspended)执行的状态与迭代器对象类似,生成器也实现了`iterator`接口，具有next()方法。调用next()方法可以让生成器开始或回复执行。
> 生成器对象实现了`Iterable接口`，默认的迭代器是自引用的
```js
function * gen () {}
const genObj = gen()
console.log(gen)    //  ƒ * gen () {}
console.log(gen()[Symbol.iterator])   // ƒ [Symbol.iterator]() { [native code] }
console.log(genObj[Symbol.iterator]() === genObj)  // true
```
## yield
Gennerator实现在函数块内的暂停和恢复执行，`yield`就是函数块内的暂停标志。调用Gennerator函数返回一个生成器，调用生成器内的`next`方法会遍历下一个内部的状态。   
生成器的`next`方法执行逻辑：  
1. 遇到了`yield`就暂停执行后面的操作，把`yield` 后面表达式的值返回给`IteratorResult`对象的value属性
2. 再一次调用`next`方法时,继续执行直到遇到下一个`yield`表达式
3. 如果没有遇到`yield`表达式，就一直运行到程序结束，直到`return`语句位置，并返回`return`后面的表达式。如果没有return语句则返回undefined.

## next 方法参数
迭代器在调用`next`方法时可以带一个参数，这个参数会给当做上一个`yield`的返回值。
```js
function* gen(){
    // yield表达式在另外一个表达式中需要用括号括起来
    console.log('hello'+(yield 123))  
}
let a=gen()
a.next() //{done:false,value:123} 
// 生成器一开始处于suspended状态 执行next遇到第一个yield 返回 yield后面的值
a.next('777') 
// hello777 
// {done:true,value:undefined}
```
## Generator.prototype.throw()
Generator函数生成的生成器对象有一个`throw`方法，可以在函数外部抛出错误，在内部捕获错误。
> 前提 
>1. 内部有try...catch代码块，没有的话还是会抛出到函数体外部。
>2. 生成器对象至少执行一次next方法启动函数体内的方法。
1. 生成器对象通过`throw`抛出错误，函数内捕获完一次错误后就不会继续捕获第二个错误。
```js
function * gen () {
    try {
      yield
    } catch (e) {
      console.log('内部捕获', e)
    }
}
const i = gen()
i.next()
try {
  i.throw('a')
  i.throw('b')
} catch (e) {
  console.log('外部捕获', e)
}
// 内部捕获 a
// 外部捕获 b
```
2.  注意区分 生成器对象通的`throw`和全局的`throw`命令，后者抛出的错误不会在内部捕获。
3. Generator函数在捕获`throw`方法抛出的错误后会继续执行下一条`yield`表达式。等价于捕获后执行一次`next`方法
4. Generator函数在执行过程中抛出错误，**但是没有被内部捕获**，程序就不会继续执行下去。如果继续执行next方法返回一个`{done:true,value:undefined}`
