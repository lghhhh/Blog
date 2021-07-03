## 基础

### 基本使用

```html
<!-- 链接地址 渲染后变成一个 带有href属性的 a标签 -->
<router-link to="/path"></router-link>
<!-- 路由地址 映射的组件渲染到下面的标签-->
<router-view></router-view>
```

```js
// 1. 定义路由组件.
// 也可以从其他文件导入
const Home = { template: '<div>Home</div>' }

```

