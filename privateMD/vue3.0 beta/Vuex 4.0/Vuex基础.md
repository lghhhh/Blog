# 基础
每个`Vuex`应用核心都是`store`，`store`本质上是个容器。容器包含应用大部分状态（`state`）。  
Vuex和单纯的全局对象有两点区别：
    1. Vuex的状态存储是响应式的。
    2. 不能直接改变store中的状态。改变store状态的途径是 显示的提交（commit） mutation  
- - -
- 安装Vuex插件 （新）
```js
// -------------------v3版本---------------
import { createApp } from 'vue'
import { createStore } from 'vuex'
// Create a new store instance.
const store = createStore({
  state () {
    return {
      count: 0
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

const app = createApp({ /* your root component */ }) 
// Install the store instance as a plugin   V3不同的安装方法
app.use(store)
// -----------------v2版本--------
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex) 

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
```
- 更新数据方法 
```js
// 调用mutation的方法更新数据
store.commit('increment')
```
- vue component使用
```js
methods:{
    imcrement(){
        this.$store.commit.('increment')
    }
}
```


# 核心概念
## State
---
Vuex使用单一状态树，即用一个store实例对象包含全应用层级状态。**状态对象必须是纯文本**
- 在Vue组件中获取Vuex状态 --通常在组件的 计算属性 返回值，状态改变是会更新相关计算属性，进而更新关联的DOM
    ```js
    // 创建一个 Counter 组件
    const Counter = {
      template: `<div>{{ count }}</div>`,
      computed: {
        count () {
          return this.$store.state.count
        }
      }
    }
    ```
    Vuex通过vue插件系统`createApp.use(store)`，从根组件“注入”到所有的子组件中（vue2.x 的使用区别如上⬆️）。然后组件中可以通过`this.$store`调用相关的状态。
- mapState辅助函数  
当组件需要获取多状态时候，在计算属性重复声明显得冗余。辅助函数`mapState`可以自动帮我们生成计算属性。
```js
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // 箭头函数可使代码更简洁
    count: state => state.count,
   // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',
  // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```
如果映射的计算属性名称与状态名相同可以简写
```js
couputed:mapState({
    'count'
})
```
- 对象拓展运算符
mapState()函数返回的是一个对象，与组件内的计算属性混用可以写成下面方法
```js
couputed:{
   localComputed () { /* ... */ },
  // mix this into the outer object with the object spread operator
  ...mapState({
    // ...
  })
}
```
- 虽然使用Vuex，但是如果组件内有些状态严格属于组件的，最好放在组件内部，就不用使用vuex了。

## Getter
---
使用情况：当`store`中的状态使用时需要进行多一步的处理，且有多个组件都要使用这个`state`，那么这一步处理可以放在`getters`中。通过`this.$store.getters`调用。
- 有时候需要从原始的State派生出一些状态，例如过滤等。
    ```js
    computed: {
      doneTodosCount () {
        return this.$store.state.todos.filter(todo => todo.done).length
      }
    }
    ```
    如果多个组件都用到上面的过滤后的属性，那需要在每个子组件中都进行写一遍上面的代码。  
    所以`Vuex`允许在store中定义“getter”（理解为store的计算属性）。store中的getter不会和计算属性一样缓存（Vue3.0后补缓存）
    Getter接受state作为第一个参数：
    ```js
    const store= createStore({
        stata:{
            todos:[
                {id:1,text:'...',done:true},
                {id:2,text:'...',done:false}
            ]
        },
        getters:{
            doneTodos(state){
                return state.todos.filter(todo=>todo.done)
            }
        }
    })
    ```
- 通过属性访问
    - Getter会暴露为`store.getters`对象，可以以属性形式访问这些字
        ```js
        store.getters.doneTodos
        ```
    - Getter可以接受其他的getter作为第二参数：
        ```js
        getters:{
            doneTodosCount: (state, getters) => {
              return getters.doneTodos.length
            }
        }
        ```
- 通过方法访问  
    让getter返回一个函数，实现给getter传参。在需要检索state数组查询非常有用
    ```js
    getters:{
        getTodoById:(state)=>(id)=>{
            return state.todos.find(todo=>todo.id=id)
        }
    }
    //调用 
    store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
    ```
- mapGetters 辅助函数  
    仅仅是将store中的getter映射到局部计算属性
    ```js
    import { mapGetters } from 'vuex'
    export default {
      // ...
      computed: {
      // 使用对象展开运算符将 getter 混入 computed 对象中
        ...mapGetters([
            'doneTodosCount',
            'anotherGetter',
            // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount` 
            doneCount: 'doneTodosCount2'
        ])
      }
    }
    ```

## Mutations
---
1. mutation是什么东西？
改变`store`的唯一方法提交一个`mutation`, 每个`mutation`都拥有一个`type`和一个回调函数`handler`,并且回调函数固定接受`state`为第一个参数。
```js
const store=createStore({
  state:{
    count:1
  },
  mutations:{
    increment(state){ // 这个mutation type是 increment，回调函数是type后面的这个方法。
      state.count++     
    }
  }
})
```
2. 如何调用mutation，如何传参数？
  - 组件中通过`store.commit('imcrement',10)`调用`mutation`，无法直接调用`mutation`.   
  `commit`的第一个参数是mutation的type，第二个参数回传入mutationd作为回调函数的第二个参数（这个参数叫`Payload`）。  
  `Payload`最好是一个对象，这样可以包含多个字段且方便调用。
  - 以对象的方式调用
  ```js
  store.commit({
    type:'increment',
    amount

  })
  ```
  这种方式调用，`commit`里的整个对象会成为`mutation`的`payload`.

3. mutation函数必须为同步函数
4. 组件中提交`mutation`除了上面的方法，还可以用`mapMutations`把组件的`methods`的方法映射为`store.commit()`
  ```js
  export default{
    methods:{
      //传递数组
      ...mapMutations([
        'increment',   //映射 this.increment() => this.$store.commit('increment') 
        'incrementBy'   //映射 this.incrementBy(‘xx’) => this.$store.commit('increment','xx') 
      ]),
      ...mapMutation({
        add:'increment'  //映射 this.add() => this.$store.commit('increment') 
      })

    }
  }
  ```
## Actions
actions与mutations类似，但是actions不改变状态而是改变mutations。
actions可以执行任意异步操作。
```js
const store=createStore({
  state:{
    count:0
  },
  mutations:{
    increment(state){
      state.count++

    }
  },
  actions:{
    increment(context){
      context.commit('increment')

    }
  }
})
```