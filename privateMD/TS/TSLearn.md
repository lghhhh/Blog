# TS使用笔记
## TS基础类型
---

1. Boolean 类型
    ```ts
    let isDone：boolean=false
    ```
    
2. Number 类型

    TS的Number和JS的一样，都是IEEE 754 64位浮点数。但TS允许八进制和二进制
    ```ts
    let decLiteral: number = 6;
    let hexLiteral: number = 0xf00d;
    let binaryLiteral: number = 0b1010;
    let octalLiteral: number = 0o744;
    ```
    
3. String 类型
    ```ts
    let name: string = 'hoho';
    let age:number= 18
    let sentence: string=` hello,${name}.You're going to be ${age}.`
    ```
    
4. Array 类型 

    TS操作数组元素与JS一样，定义方式如下两种
    - 定义一个类型的数组,在元素类型加 []
        ```ts
        let list:Number[] = [1,2,3,4]
        ```
    - 使用数据泛型 Array<元素类型>
        ```ts
        let list:Array<number> = [1,2,3,4]
        ```
    
5. Tuple 元组

    Array 定义的数组必须是同类型的。Tuple则允许数据项的数据类型不同，但数组项类型需要和当前下标定义的类型相同。
    ```ts
    let x:[string,number]=['hellow',10] // OK

    let x:[string,number]=[10,'hellow'] // Error  
    ```
    访问越界元素时候，会使用联合类型代替
    ```ts
    x[3]='world'  // OK 字符串可以复值给（string|number）类型
    console.log(x[5].toString()); //ok string 和number类型都有toString方法
    x[6]=true // Error  boolean的值 不是（string|number）类型

    ```
    
6. enum 枚举

    enum是对Javascript基本类型的一个补充。可以用友好的名字来命名一系列的数值集合，换句话说枚举是一个命名元素的集合。
    ```ts
    enum Color {Red,Green,Bule};
    let c:Color =Color.Green;
    ```
    默认情况，从0开始为元素编号。也可以手动设置指定成员的数值。如果手动设置了成员的初始值，后续的成员会根据这个值自动增长（）。
    ```ts
    enum Color {Red=1,Green,Bule};
    let c:Color =Color[2];
    console.log(c) // Green
    ```
    
7. unknown（ 3.1的文档不在提及）

    编写程序时不知道变量是什么类型可以用 unknown 定义。
    ```ts
    let notSure: unknown = 4;
    notSure='maybe a string instead'; // ok
    notSure = false; // ok
    ```
    当 unknown 类型赋值给其他类型时候，unknown 类型的值只能赋值给 any类型和 unknown 类型
    ```ts
    let value:unknown

    let value1:unknow=value // ok
    let value2:any=value //ok
    let value3:boolean=value //error
    let value4:number=value //error
    let value5:string=value //error 
    let value6:object=value //error
    let value7:any[]=value //error
    let value8:Function=value //error
    ```
    当对 unknown 类型进行操作时候，因为设置为 unknown 类型，下面的操作都不认为是正确的操作。
    ```ts
    let value:unknown
    value.foo  // error
    value.trim() // error
    value() //error
    new value() // error
    value[0][1] // error
    ```
    
8. Any

   Any可以用来标记暂时还不清楚类型的变量，让检查器不进行检查让它们通过编译阶段。

   Any类型可以在编译时可选择的包含或除移类型检查，因此可以在Any类型的变量调用任意的方法或者赋予任何值。

   Any还可以在知道数据部分数据类型的时候使用.

   ```ts
   let list:any=['1',2,false]
   ```

9. Void 

    与Any 相反 ：根本没有任何类型。 通常视为无返回值的函数的类型。若是变量的定义，该变量只能赋值null 或者undefined。

10. Null 和 Undefined

    undefined 和null 在TS里分别属于 Undefined和Null类型，
    ```ts
    let u:undefined=undefined
    let n:null=null
    ```
    默认情况下，undefined和null是所有类型的 子类型，可以将null和undefined赋值给number类型的变量。如果指定了 --stictNullChecks 标记，null和undefined 只能赋值给void类型 和他们自身的类型。（指定标记还想赋值，可以用联合类型 string|null|undefined）

11. Never

     never表示永不存在的值类型。是始终抛出异常、永远不返回的异常表达式、箭头函数表达式的返回类型.
     ```ts
    //永远报错 
    function error(message:string):never{
         throw new Error(message);
     }
     //永远不返回
     function infiniteLoop():never{
         while(true){}
     }
     ```
     TS中，可以利用never类型特性来实现全面性检查，如下
     ```ts
     type foo= string|number;
     
     function cotrolFlowAnalysisWithNever(foo:foo){
         if(typeof foo ==='string'){
             // 这里foo限定为string类型
         }else if(typeof foo ==='number'){
             // 这里限定为number类型
         }else{
             // 这里foo是never
             const check:never=foo;
         }
     
     } 
     ```
     在else分支中吧收窄为never的foo赋值给一个显示声明的never变量。如果逻辑正确，这里的代码会编译通过。 如果有人搞了foo的类型，
     ```ts
         type Foo = string | number | boolean;
     ```
 但是没有改cotrolFlowAnalysisWithNever方法的控制流程的代码，boolean类型无法赋值给never类型，就会产生一个编译错误。
    
     so：使用never避免出现新增了联合类型没哟设置对应的实现，目的是写出类型绝对安全的代码。
    
12. Object
    
    Object表示非原始类型，即除 Number、String、Boolean、Symbol、Null、Undefined

## 类型断言
---
类型断言类似其他语言的类型转换，但不进行特殊的数据检查和结构。对运行时没影响，只在编阶段器作用。如果比编译器更加确定变量的类型就可以使用，代替TS执行了必要的特殊检查。

1. 尖括号语法

    ```ts
    let someValue:any='this is a string'
    let strlingth:number =(<Strig>somevalue).lenght
    ```
2. as 语法

    ```ts
    let someValue:any='this is a string'
    let strlingth:number =(somevalue as String).lenght
    ```
## 类型守卫
---
类型守卫是一种表达式，可以在执行运行时检查，确保该类型在一定范围内。换句话说，类型保护可以保证一个字符串是一个字符串，尽管它的值也可以是一个数值。类型保护与特性检测并不是完全不同，其主要思想是尝试检测属性、方法或原型，以确定如何处理值。目前主要有四种的方式来实现类型保护： 

1. in  关键字
    ```ts
    interface Admin{
        name:string;
        privileges:string[];
    }
    interface Employee{
        name:string;
        startDate:Date;
    }
    type UnKnownEmployee =Employee|Admin;

    function printEmployeeInformation(emp:UnKnownEmployee){

        console.log("Name:"+emp.name);
        if('privileges' in emp){
            console.log("Privileges: " + emp.privileges)
        }
        if('startDate' in emp){
            console.log("Start Date: " + emp.startDate);
        }
    }
    ```
2. typeof 关键字
    ```ts
    function padLeft(value: string, padding: string | number) {
        if (typeof padding === "number") {
            return Array(padding + 1).join(" ") + value;
        }
        if (typeof padding === "string") {
            return padding + value;
        }
        throw new Error(`Expected string or number, got '${padding}'.`);
    }
    ```
    typeof 只支持两种格式：
    - typeof v === "typename"
    - typeof v !== typename
    其中typename 只能是'number','string','boolean','symbol'。 但是TS不会阻止你和其他字符串比较，语言不会吧那些表达式识别为类型保护。
3. instanceof 关键字
    ```ts
    interface Padder {
      getPaddingString(): string;
    }

    class SpaceRepeatingPadder implements Padder {
      constructor(private numSpaces: number) {}
      getPaddingString() {
        return Array(this.numSpaces + 1).join(" ");
      }
    }

    class StringPadder implements Padder {
      constructor(private value: string) {}
      getPaddingString() {
        return this.value;
      }
    }

    let padder: Padder = new SpaceRepeatingPadder(6);

    if (padder instanceof SpaceRepeatingPadder) {
      // padder的类型收窄为 'SpaceRepeatingPadder'
    } 
    ```
4. 自定义类型保护的类型谓词
    ```ts
    function isNumber(x: any): x is number {
      return typeof x === "number";
    }
    
    function isString(x: any): x is string {
      return typeof x === "string";
    }
    ```
## 联合类型和类型别名
---
1. 联合类型

    联合类型通常与null 或 undefined 一起使用
    ```ts
    const sayHello= (name:string|undefined)=>{

    }
    ```
2.  Discriminated Unions 可辨别联合

    Discriminated Unions，也称为代数数据类型或标签联合类型。包含：可辨别、联合类型、类型守卫。

    - 可辨识
        > 可辨识 - 要求联合类型中每个元素都含有一个单例类型属性

        ```ts 
        enum CarTransmission{
            Automatic =200,
            manual = 300
        }
        interface MotorCycle{
            vType:'motorcycle',
            make:number
        }
        interface Car{
            vType:"car",
            transmission: CarTransmission
        }
        interface Truck{ 
            vType:"truck",
            capacity:number
        }
        ```
        定义的 MotoCycle、Car、Truck 三个接口，接口中都有vType属性，该属性称为可辨识属性，其它属性只和特性的接口相关。
    - 联合类型

        基于上面定义的三个接口，创建一个Vehicle联合类型
        
        ```ts
        type Vehicle= MotorCycle|Car|Truck
        ```
        创建的Vehicle联合类型，可以用来表示不同类型的车辆
    - 类型守卫

        定义一个evaluatePrice 方法，该方法用于车辆的类型、容量、评估因子来计算价格
        ```ts
        function evaluatePrice(vehicle:Vehicle){
            return vehicle.capacity
        }
        const myTruck:Truck={vType:"truck",capacity:9.5};
        evaluatePrice(myTruck);
        ```
        上面的代码TS编译器会报下面的错误
        ```
        Property 'capacity' does not exist on type 'Vehicle'.
        Property 'capacity' does not exist on type 'Motorcycle'.    
        ```
        因为在Motorcycle、Car接口中不存在capacity属性， 这种情况可以使用 类型守卫 确保安全反问vehicle对象中所包含的属性。
          ```ts
          // 重构的代码
        function evaluatePrice(vehicle:Vehicle){
            switch(vehicle.vType){
                case "car":return vehicle.transmission;
                case "truck":return vehicle.capacity;
                case "motorcycle":return vehicle.make;
            }
            
        }
        const myTruck:Truck={vType:"truck",capacity:9.5};
        evaluatePrice(myTruck);
          ```
3. 类型别名

    ```ts
    type Message=string|string[];
    let greet=(messsage:Message)=>{

    }
    ```
## 交叉类型
---
交叉类型是将多个类型合并成一个类型，让他包含所需的所有类型的特性。
```ts
interface IPerson{
    id:string;
    age:number;
}
interface IWorker{
    companyId:string;
}

type IStaff=IPerson&IWorker; // 交叉类型

const staff:IStaff={
    id:'e1006',
    age:18,
    companyId:'asd'
}
console.log(staff)
```
## TS函数
---
1. TS函数与JS函数区别

    |TypeScript | JavaScript|
    |--|--|
    |含有类型|无类型|
    |箭头函数|箭头函数 (ES2015)|
    |函数类型|无函数类型|
    |必填和可选函数|所有参数都是可选|
    |默认参数|默认参数|
    |剩余参数|剩余参数|
    |函数重载|无函数重载|

2. 箭头函数
    - 常见语法
        ```ts
        myBooks.forEach(() => console.log('reading'));

        myBooks.forEach(title => console.log(title));

        myBooks.forEach((title,index,arr) => console.log(index+'-'+title))

        myBooks.forEach((title,index,arr) =>{
            console.log(index+'-'+title)
        })
        ```
    - 使用示例
        ```ts
        // 未使用箭头函数
       function Book(){
           let self=this
           self.publishData=2016
           setInterval(function(){
               console.log(self.publishData)
           },1000)
       }
        // 使用箭头函数
      function Book(){
           this.publishData=2016
           setInterval(()=>{
               console.log(self.publishData)
           },1000)
       }
      ```
3. 参数类型和返回类型

    ```ts
    function createUserId(name:string,id:number):string {
        return name+id
    }
    ```
4. 函数类型

    ```ts
    let IdGenerator: (chars: string, nums: number) => string;

    function createUserId(name: string, id: number): string {
      return name + id;
    }

    IdGenerator = createUserId;
    ```
5. 可选参数及默认参数

    声明函数时，可通过 ? 来定义可选参数。实际运用时可选参数需要放置到普通参数后面，否则会导致编译错误。
    ```ts
    // 可选参数
     function createUserId(name:string,id:number,age?:number):string{
         return name+id
     }
     //默认参数
     function createUserId(
         name:string="tom",
         id:number,
         age?:number
         ):string{
         return name+id
     }
    ```
6. 剩余参数
    ```ts
     function push(arry,...items){
         items.forEach(function(item){
             array.push(item)
         })
     }
    ```
7. 函数重载

    - 函数重载：使用相同的方法名，但是拥有不同的参数或者类型。下面代码为add函数提供多个函数类型的定义，实现函数的重载。
    ```ts
    function add(a: number, b: number): number;
    function add(a: string, b: string): string;
    function add(a: string, b: number): string;
    function add(a: number, b: string): string;
    function add(a: Combinable, b: Combinable) {
      if (typeof a === "string" || typeof b === "string") {
        return a.toString() + b.toString();
      }
      return a + b;
    }
    ```


    ---
    - 类的重载：一个类中方法名相同，参数不同（类型、个数、类型个数相同但顺序不同），执行时会根据实参选择匹配的方法。
    
    ```ts
    class Calculator{
        add(a: number, b: number): number;
        add(a: string, b: string): string;
        add(a: string, b: number): string;
        add(a: number, b: string): string;
        add(a: Combinable, b: Combinable) {
            if (typeof a === "string" || typeof b === "string") {
              return a.toString() + b.toString();
            }
            return a + b;
        }
    }
    const calculator = new Calculator();
    const result = calculator.add("Tom","Jerry")
    ```
    TS编译器处理重载函数时，会查找重载列表，尝试第一个重载定义。如果匹配就使用。所以需要吧最精确的定义放在前面。 此外Calculator类中   add(a: Combinable, b: Combinable) 不是重载列表的一部分。
## TS数组
1. 数组解构
    ```ts
    let x:number;let y:number;let z:number;
    let five_array =[0,1,2,3,4]
    [x,y,z]=five_array;
    ```
2. 数组展开运算符
    ```ts
    let two_array =[0,1]
    let five_array =[... two_array,2,3,4]
    ```
3. 数组遍历 
    ```ts
    let colors:string[]=['red','green','blue']
    for(let i of colors){
        console.log(i)
    }
    ```
##  TypeScript对象
---

1. 对象解构
     ```ts
   let person={
       name:'Tom',
       gender:'Male'
   }
   let {name,gender}=person
   ```
2. 对象展开运算符
    ```ts
     let person={
       name:'Tom',
       gender:'Male',
       address:'xxx'
   }
   let personWithAge={...person,age:33}
   let {name,..rest}=person

   ```
## TS接口
---
TS核心原则是对子类型进行检查，接口可为这些字做类型限定。

1. 限定对象属性
    ```ts
    interface LabelledValue {
      label: string;
    }

    function printLabel(labelledObj: LabelledValue) {
      console.log(labelledObj.label);
    }

    let myObj = {size: 10, label: "Size 10 Object"};
    printLabel(myObj);
    ```
    上面代码接口来描述：必须包含一个label属性且类型为string。另外   TS类型检查器不会检查属性的顺序，只要存在对应的属性并且类型是对 的就行。

2. 可选 | 只读 属性
    ```ts
    interface SquareConfig {
        color?: string;
        width?: number;
    }
    ```
    可选属性的好处：
    - 可以对可能存在的属性进行预定义
    - 可以捕获引用了不存在属性时的错误
3. 只读属性
    ```ts
    interface SquareConfig {
        readonly color: string;
        width?: number;
    }
    ```
    对象的只读属性只能在创建的时候修改其值，或者用类型断言重写
    ```ts
    let a: number[] = [1, 2, 3, 4];
    let ro: ReadonlyArray<number> = a;
    ro[0] = 12; // error!
    ro.push(5); // error!
    ro.length = 100; // error!
    a = ro; // error!
    // 断言重写
    a = ro as number[]
    ```
4. 额外属性检查
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
    如上面代码传入的 对象字面量存在“目标类型（interface定义的）”不包含的属性会得到一个错误。
    
    解决办法：
    - 使用断言
        ```ts
        //断言
        let mySquare = createSquare({ colour: "red", width: 100 }   as SquareConfig );
        ```
    - 添加字符串索引签名
        ```ts
        interface SquareConfig {
        color?: string;
        width?: number;
        [propName: string]: any;
        }
        ```
        上面表示squareConfig 可以有任意数量的属性，只要不是color 和width 就无所谓他们是什么类型。

    - 赋值给一个变量再传递
        ```ts
        // 赋值后传递
        let config={ colour: "red", width: 100 }
        let mySquare = createSquare(config);
        ```
        因为这个对象赋值给另外一个变量就不会经过额外的属性检查，所以编  译器不会报错。  但不应该这样绕开检查，大部分情况额外的属性检查    错误是真正的bug，此时应该去检查类型声明。除非对象字面量中包含方 法、内部状态复杂，才可以考虑使用这个技巧。
    ---
5. 函数类型

    interface 可以描述普通对象外还可以描述函数类型。 定义后的函数类型的接口可以和普通接口一样使用
    ```ts
    interface SearchFunc {
        (source: string, subString: string): boolean;
    }

    let mySearch: SearchFunc;
    mySearch = function(source: string, subString: string) {
      let result = source.search(subString);
      return result > -1;
    }
    ```
    如上，定义了一个SearchFunc的接口，创建了函数类型变量同时将共同类型函数赋值给变量。
    对于函数类型的类型检查，函数的参数名不需要与接口定义的名字相匹配。
      ```ts
    interface SearchFunc {
        (source: string, subString: string): boolean;
    }

    let mySearch: SearchFunc;
    mySearch = function(src: string, sub: string): boolean {
    let result = src.search(sub);
    return result > -1;
    }
      ```
    如上，赋值给mySearch变量的函数里的参数名不与 interface SearchFunc中定义的相同，但是函数的参数会逐个进行检查，要求对应位置上的参数类型是兼容的（一样）。
    ```ts
    let mySearch: SearchFunc;
    mySearch = function(src, sub) {
        let result = src.search(sub);
        return result > -1;
    }
    ```
    如上，如果不指定类型TS类型系统会推断出参数类型，因为函数时赋值给 SerachFunc类型变量。同时函数返回值是通过其返回值判断出来的。如果返回的类型不与接口定义的相同，类型检查器会警告函数返回值与接口定义的不一样。
    
6. 可索引的类型

    描述那些能"通过索引获得"的类型,例如 `a[10]`或`ageMap['daniel']`。 可索引类型具有一个 索引签名 ，描述了对象索引（本身）的类型，以及对应索引返回值的类型。
    ```ts
    interface StringArray {
      [index: number]: string;
    }
    
    let myArray: StringArray;
    myArray = ["Bob", "Fred"];
    
    let myStr: string = myArray[0];
    ```
    如上，定义StringArray接口，其中索引签名表示用number类型去索引StringArray时会得到string的类型返回值。
    
    TS支持两种索引签名： 字符串 和 数字。可以同时使用两类类型的索引，但数字索引的返回值必须是字符串索引返回值的子类型。因为使用number类型来索引时，JS回将他转换成 String类型再去索引对象，例如用 number 100 去进行索引会给转换成string “100”去索引，因此两者要保持一致。