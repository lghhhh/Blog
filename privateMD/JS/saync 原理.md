# async 原理
async 是generator的语法糖，本质上是将Generator函数与自动执行器包装在一个函数内。
```js
async function fn(args){

}
// 等同于

function fn(args){
    // spawn 自动执行器
    return spawn(function *(){
        // xxx
    })
}
```
自动执行器
```js
function spawn(genF){
    return new Promise( function(resolve,reject){
        const gen = genF;
        function step( nextF){
            let next;
            try{
                next= nextF()
            }catch(e){
                return reject(e) //async 函数内报错则终止函数执行并返回
            }
            if(next.done){
                return resolve(next.value)
            }

            Promise.resolve(next.value).then(function(v){
                step(function(){return gen.next(v)})
            },function(e){
                step(function(){return gen.throw(e)})
            });
        }
        //执行
        step(function (){return  gen.next(undefined)})
    })
}
```