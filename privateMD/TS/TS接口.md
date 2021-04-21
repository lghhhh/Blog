# TS 中的接口

###  1. 接口描述对象类型的 普通属性、可选属性与只读属性

接口关键字 interface，长的如下。用来检测一个值的结构里的属性类型，但是不检测顺序。

```ts
interface face{
  mouth:Number,
  hair？：Number， //可选属性
  readonly eye:Number, //只读属性
}

const f1: face = {mouth:1,eye:2}; //必须要有mouth、eye属性，且eye属性定义后不能修改。 hair属性可有可无
```

TS中有 ReadonlyArray<T>与Array<T>类似，但是ReadonlyArray<T>把所有的可变方法去掉了，因此可以保证数据创建后不会修改。 

ReadonlyArray<T>类型数据 也不能赋值到普通的数据，除非用断言重新编写。

```ts
arrs= ro as number[]
```

- 额外属性检查 ：如果传递了接口未定义的属性，TS会认为代码可能存在错误，进行报错
```ts
	interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    // ...
}
// error: 'colour' not expected in type 'SquareConfig'
let mySquare = createSquare({ colour: "red", width: 100 });
```
-  使用类型断言就可以绕开这些检查

```ts
let mySquare = createSquare({ colour: "red", width: 100 } as SquareConfig);
```

- 最佳方式绕开而外属性检查的方式是： 是添加一个字符串索引签名，前提是能够确定该对象有某些特殊用途的额外属性。 例如上面的SquareConfig 如果带了color和width属性，且有任意数量的其他属性可以像下面这样定义。

```ts
interface SquareConfig{
  color?:string;
  width:number;
  [propName:string]:any
}
```

-  将对象复制给另外一个变量也可以跳过检查，SquareOptions不会经过额外检查，编译器不会报错

```ts
let SquareOptions = { colour:'red', width:100 }
let mySquare = createSquare(SquareOptions)
```

### 2. 函数类型

接口除了描对象的属性还可以描述函数类型，如下 ，

```ts
interface SearchFunc{ //给接口定义一个调用名SerachFunc
  (source:sting,subString:string):boolean;//对函数的参数和返回值的定义
}
//使用 
const mySearch:SearchFunc; //创建了一个函数类型的变量
mySearch= function(source:string,subString:string){//将相同类型的函数赋值给上面定义的变量
  let result= source.search(subString)
  return result>-1
}
//使用2
const mySearch:SearchFunc; //。。。
mySearch= function(src:string,sub:string){//类型检查的时候 对应位置上的参数名不需要相同，但是参数类型必须相同 
  let result= source.search(subString)
  return result>-1
}
//使用3
const mySearch:SearchFunc; //。。。
mySearch= function(src,sub){//不指定类型，TS类型系统会推断出参数的类型，根据返回的结果推断出Boolean类型，如果返回的是number获string类型，类型检查起会警告返回值类型与接口定义不匹配。 
  let result= source.search(subString)
  return result>-1
}
```

### 3. 可索引类型

可索引类型描述的是，“能通过索引得到的类型”如 a [ 0 ] 或 ageMap [ "daniel" ]。

接口中会定义一个*索引签名*，前面描述对象索引的类型，索引返回值类型。

```ts
interface StringArray{ 
  [index:number]:string;//该索引签名表示，当用户使用number索引StringArray时会得到string类型的返回值
}
let myArray:StringArray;
myArray=["Bob","Fred"];
let myStr:string=myArray[0];
```

**???** TS支持的索引签名：字符串、数字。可同时使用两种索引，数字型返回的必须是 字符串索引返回值类型的子类型，应为使用number来索引会被JS转成string类型然后在去索引对象。

 ```ts
class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}
// 错误：使用数值型的字符串索引，有时会得到完全不同的Animal!
interface NotOkay {
    [x: number]: Animal;//数字索引类型“Animal”不能赋给字符串索引类型“Dog”。
    [x: string]: Dog;
}
// 正确用法
interface NotOkay {
    [x: number]: Dog;
    [x: string]: Animal;
}
 ```

另外一个例子

```ts
interface NumberDictionary {
  [index: string]: number;  //使用了字符串索引类型 返回值为number类型
  length: number;    // 可以，length是number类型
  name: string       // 错误，`name`是一个字符串的类型但是与上面定义的索引类型返回值的类型不匹配
}
```

### 4. 类(Class)类型

可以强制规定一个Class符合某些规定，接口定义了类的公共部分，用implements 关键字实现。如果类需要实现多个接口，在implements后面 多个接口用逗号隔开。

```ts
interface ClockInterface{//接口规定了Class 的公共部分
  currentTime:Date;
  setTime(d:Date)
}
class Clock implements ClockInterface{
  currentTime:Date;
  setTime(d:Date){
    this.currentTime=d;
  }
  constructor(h:number,m:number){
    //.....
  }
}
```

- 类的静态部分与实例部分的区别
- 

### 5. 继承接口

​	接口与接口之间可以是继承关系

```ts

interface A{
	alert():void
}

interface B extends A{
  lightOn():void;
  lightOff():void:
}
```



### 6. 混合类型
### 7. 接口继承类

​	一般在OOP中接口是不能继承类的，但在TS中可以。

```ts
class Point{
  x:number;
  y:number;
  constructor(x:number,y:number){
    this.x=x;
    this.y=y;
  }
}

interface Point3d extends Point{
  z:number
}
let point3d:Point3d={ x:1,y:2,z:3}
```





