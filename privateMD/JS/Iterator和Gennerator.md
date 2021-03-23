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
迭代器（Iterator）可以使用


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
- yield* 操作符，在生成器中使用。 `yield*` 后可以跟着一个可遍历结构`yield*`
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

