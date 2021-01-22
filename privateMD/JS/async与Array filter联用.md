# 
数组里的map、forEach、reduce、filter都是非常好用的函数，但是当这些函数遇到了async/await 结果往往出乎意料。


# async 与 reduce
数组的reduce函数会迭代的构造一个值，在迭代完成时返回它。

```js
const arr=[1,2,3]
const syncRes= arr.reduce((memo,e)=>{
  return memo+e
},0)
```
如果每次迭代执行的是异步函数的话，每次返回值都是一个Promise对象
```js

```
# async 与filter 联用
```js
async function sleep(time) {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('sleep 10');
      resolve();
    }, time);
  });
}

const arr = [ 1, 2, 3, 4 ];

console.log(arr.filter(async data => {
  await sleep(10);
  return data > 2;
}));

// 输入结果
// [ 1, 2, 3, 4 ]
// sleep 10
// sleep 10
// sleep 10
// sleep 10
```
当数组filter方法与async连用得不到预期结果，需要自己编写一个异步的filter函数

```js
const asyncFilter = async (arr, predicate) => {
  const result = await Promise.all(arr.map(predicate));
  return arr.filter((_v, index) => result[index]);
};


async function test() {
  const asyncRes = await asyncFilter(arr, async i => {

    return i > 2;
  });
  console.log(asyncRes);
}

// test();

```