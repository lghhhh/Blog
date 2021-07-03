Less 快速入门

## 变量

1. 值变量（常量）` @definedClolr: rgb(255,255,255)`

2. 使用选择器变量
    ```css
    @selector: #idselector;
    @{selector}{ //变量名需要用大括号包裹
    	color:#000;
    }
    ```
    
3. 属性变量

    ```css
    @borderStyle: border;
    @Solid:solid;
    .classstyle{
    	@{borderStyle}:@Solid //变量名需要用大括号包裹
    }
    ```

4. url变量
    ```css
    @imgUrl: "../img";
    .classstyle{
    background-image:url("@{imgUrl}/cat.jpg") //变量名需要用大括号包裹
    }
    ```

5. 声明变量

   - 命名结构 ：@name:{属性:值;};

   - 使用：@name()

     ```css
     @background:{ background:red;};
     #main{
       @background();
     }
     ```
   
6. 变量运算

    - 加减法时 以第一个单位为基准
    - 乘除法单位要统一

    ```css
    @width:300px;
    @color:#222;
    #main{
      width:@width-20;
      height:@width-20*5;
      margin:(@width-20)*5;
      color:@color*2;
      background-color:@color+#111;
    }
    //生成的css
    #main{
      width:280px;
      height:200px;
      margin:1400px;
      color:#444;
      background-color:#333;
    }
    ```

    

7. 变量作用域

    就近原则，现在本地和mixins中找变量，找不到再到父级找

    ```css
    @var:red;
    #page{
      #header{
    		color:@var;// 最后结果 color：blue
      }
       @var:blue; //变量不要求在使用前定义好
    }
    ```
    
8. 用变量定义变量

    less中 ，可以用另外一个变量定义一个变量的名称。

    通俗的讲，现有一个已经定义的变量A `@A:blue;`，创建一个变量B `@B:A;`，可以看到变量B的值A 。这就用了一个变量定义另外一个变量，当需要获取变量A的值可以通过下面的方式，由B来获取 A的值。`@@B`

    ```css
    @A:blue;
    .section{
    		@B:A;
    		.element{
    			color:@@B; //编译结果 color:blue;
    		}
    } 
    ```
## 嵌套

​	less中使用嵌套代替层叠，并且可以使用 其他符号，灵活的嵌套。

```css
#header{
  color:black;
}
#header .navigation{
  font-size:12px;
}
#header .logo{
  font-size:12px;
}
// 在less中使用嵌套可以写成下面的形式
#header{
  color:black;
  .navigation{
  	font-size:12px;
	}
  .logo{
  	font-size:12px;
	}
}
```



1. &符号 ：用来表示上一层选择器的名字。可以与伪类选择器连用等

   ```css
   #header{  
     color:black;  
     &:after{
       font-size:12px;
     }  
     &-logo{    
       font-size:12px; 
     }
   }
   //编译结果
   #header{  
     color:black;  
   }
    #header:after{  // &其实等于上曾选择器的名
       font-size:12px;
    }  
    #header-logo{    
       font-size:12px; 
    }
   ```
   
2. @规则嵌套和冒泡： @规则可以和选择器以和选择器一样进行嵌套，同一规则集中其他元素的相对顺序保持不变（冒泡）。 嵌套的每个元素都会编译出自己的@media 声明。

   ```css
   .component{
     width:300px;
     @media(min-width:786px){
       width:600px;
       @media(min-resolution:192dpi){
         background-image:url(/img/retina2X.png);
       }
     }
     @media(min-width:1280px){
       width:800px;
     }
   }
   //编译后
   .component {
     width: 300px;
   }
   @media (min-width: 768px) {
     .component {
       width: 600px;
     }
   }
   @media (min-width: 768px) and (min-resolution: 192dpi) {
     .component {
       background-image: url(/img/retina2x.png);
     }
   }
   @media (min-width: 1280px) {
     .component {
       width: 800px;
     }
   }
   ```
## 混合方法 Mixins

​	Mixins 是一个方法，可以吧一组属性从一个规则集混入另一个规则集。

   

   