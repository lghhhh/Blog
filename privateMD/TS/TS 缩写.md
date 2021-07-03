### Typescript 使用Class的简写形式

```ts
class testClass{
  private name:string;
  constructor(name:string){
    this.name=name
  }
}
//简写
class TestClass{
  //使用简写需要在constructor的参数 前带上 public、private、protected
  constructor(private name:string){}
}
//如果只在constructor函数使用readonly修饰符，那它默认是public的。如果需要改变需要带上 private 、protected 。如 protected readonly

```

