# mongoDB 4.4基本使用

## 插入数据
如果插入的document未指定 _id 字段,mongoDB会自动给 _id 添加一个值.
- 插入一条数据  
db.collection.insertOne() 插入document  
```db.collectionName.insertOne({item:'canvas',tag:[111,222,333],size: { h: 14, w: 21, uom: "cm" }})``` 
- 插入多条数据  
db.collection.insertMany() 插入一个数组包含多个document   
```db.collcetionName.insertMany([{item:'canvas',tag:[111,222] },{item:'canva2',tag:[222,333] }])```
- 插入一条或多条数据
db.collection.insert()
## 查询数据
 
``` db.collection.find( { <field1>:{<operator1>:<value1>},.... } )```
1. 查询    
    - 使用查询运算符  “in”  查询同一个字段(name)等于A 或B的所有数据  
    ``` db.collection.find( { name:{ $in : ['A','B'] } )```
2. 复合查询
    - AND 隐式地使用逻辑AND连接两个条件  
    ``` db.collection.find({条件1},{条件2})```
    - OR  使用$or运算符  查询至少匹配一个条件的文档  
    ``` db.collection.find( { $or:[ {status:"A"} , {qty:{$lt:30}} ] } )```
    - AND OR 混用  
    ```db.collection.find({ status:'A' , $or:[{status:'B'} , {qty:{$lt:30}}] })```
3. 查询嵌套  
    ```
    db.inventory.insertMany( [
        { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
        { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "A" },
        { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
        { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
        { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" }
    ]);
    ```
     - 查询文档中嵌套的内容，指定的条件必须完全匹配 (顺序、内容)  
     ```db.collection.find({ size:{ h: 14, w: 21, uom: "cm" })```
     - 查询文档嵌套内容中的字段可以用点符号(.)  
     ```db.collection.find({ size.h:{ $lt:20 })```
4. 查询数组  
    ```
    db.inventory.insertMany([
        { item: "journal", qty: 25, tags: ["blank", "red"], dim_cm: [ 14,21 ] },
        { item: "notebook", qty: 50, tags: ["red", "blank"], dim_cm: [ 14,21 ] },
        { item: "paper", qty: 100, tags: ["red", "blank", "plain"], dim_cm: [ 14,21 ] },
        { item: "planner", qty: 75, tags: ["blank", "red"], dim_cm: [ 22.85,30 ] },
        { item: "postcard", qty: 45, tags: ["blue"], dim_cm: [ 10, 15.25 ] }
    ]);
    ```
    - 查询数组元素---单条件
        - 全匹配 与查询嵌套类似，包括数组顺序与值全部匹配   
        ``` db.collection.find({tags:['red',"blank"]})```
        - 忽略查询顺序，只要求包含内容即可 使用 $all 运算符  
        ``` db.collection.find({ tags:{$all:['red',"blank"]} })```
        - 查询数组包含某个值  
        ``` db.collection.find({ tags:'red'})``` 
    - 查询数组元素---多重条件
        - 数组某种组合满足条件，例如一个元素满足条件A，另外一个元素满足条件B，或者一个条件同时满足A和B条件  
        ``` db.collection.find({ tag:{ $gt:15,$lt:20} })```
        - 数组某种组合满足条件，但是必须有一个元素同时满足A、B两个条件,使用$elemMatch 运算符  
        ``` db.collection.find({ tag:{ $elemMatch:{$gt:15,$lt:20}} })```
    - 查询数组索引(index)位置---使用点(.)表示法  
        ``` db.collection.find({ 'tag.0':"red"})``` 
    - 查询符合长度的数组---使用$size 运算符  
        ``` db.collection.find({ 'tag':{ $size:3}})``` 
5. 查询数组中的嵌套document 
    ```
    db.inventory.insertMany( [
       { item: "journal", instock: [ { warehouse: "A", qty: 5 }, { warehouse: "C", qty: 15 } ] },
       { item: "notebook", instock: [ { warehouse: "C", qty: 5 } ] },
       { item: "paper", instock: [ { warehouse: "A", qty: 60 }, { warehouse: "B", qty: 15 } ] },
       { item: "planner", instock: [ { warehouse: "A", qty: 40 }, { warehouse: "B", qty: 5 } ] },
       { item: "postcard", instock: [ { warehouse: "B", qty: 15 }, { warehouse: "C", qty: 35 } ] }
    ]);
    ```
    - 查询 嵌套document 字段 - - - 全匹配  
    ```db.inventory.find( { "instock": { warehouse: "A", qty: 5 } } )```
    - 查询 嵌套document 字段  
    ```db.inventory.find( { "instock.qty":{$lt:10}} )```
    - 查询 数组索引处嵌套document 字段  
    ```db.inventory.find( { "instock.0.qty":{$lt:10}} )```
    - 查询 嵌套document 字段- - -无关顺序、满足 全部条件、同一个嵌入document  
    ```db.inventory.find( { "instock":{ $elemMatch :{qty:5,warehouse:'A'}}} )```
    - 查询 嵌套document 字段- - -无关顺序、满足一个条件即可  
    ``` db.inventory.find({"instock.qty":{$gt:10,$lt:20}})```
    - 查询 嵌套document 字段 - - -不限定同个嵌入文档、 满足一个条件即可
    ``` db.inventory.find( { "instock.qty": 5, "instock.warehouse": "A" } )```
6. 查询数据 限定返回的字段  
    - 返回所有字段  
    ```db.inventory.find( {查询条件} )```
    - 返回 限定字段 ， 默认添加 "_id" 字段  
     ```db.inventory.find( {查询条件},{返回字段名：1} )```
    - 返回 排除字段 外的所有字段 
     ```db.inventory.find( {查询条件},{排除字段名：0} )```
    - 返回 选中 嵌套document的字段 
    ```db.inventory.find( {查询条件},{"嵌套document.字段"：1} )```
    - 返回 排除 嵌套document的字段 
    ```db.inventory.find( {查询条件},{"嵌套document.字段"：0} )```
    - 返回 选中 数组中的嵌套document的字段 --- 同上 嵌套document一样
    - 返回 排除 数组中的嵌套document的字段 --- 同上 嵌套document一样
    - 返回 数组中嵌套document 最后一个数组项的document ---$slice参数： +/-：方向 number：个数
     ```db.inventory.find( {查询条件},{"嵌套document"：{$slice：-1}} )```
7. 查询空字段 OR 不存在字段
    ```
    db.inventory.insertMany([
       { _id: 1, item: null },
       { _id: 2 }
    ])
    ```
    - 平等过滤 --- 字段值为null 或者不存在该字段
    ```db.collection.find({item:null})```
    - 类型检查 -- 根据 BSON Type的值判断
    ```db.collection.find({item:{$type:10}})```
    - 存在性检测 
    ```db.collection.find({item:{$exists:false}})```
8. mongo Shell 游标迭代 （略）



    
## 更新数据  
更新方法  
```sql
db.collection.updateOne(<filter>, <update>, <options>)
db.collection.updateMany(<filter>, <update>, <options>)
db.collection.replaceOne(<filter>, <update>, <options>)
//  <option> = {upsert : true} 表示查询不到数据时，添加新的数据 
```

- updateOne  
更新筛选到第一个document，使用$set 更新值，$currentDate更新时间  
    ```
    db.inventory.updateOne({ item: "paper" },{$set: { "size.uom": "cm", status: "P" },$currentDate: { lastModified: true }})
    ```
- updateMany
    ```
    db.inventory.updateMany(
       { "qty": { $lt: 50 } },
       {
         $set: { "size.uom": "in", status: "P" },
         $currentDate: { lastModified: true }
       }
    )
    ```
- replaceOne  
    除了_id不变，其他的字段由新的值代替
    ```
    db.inventory.replaceOne(
       { item: "paper" },
       { item: "paper", instock: [ { warehouse: "A", qty: 60 }, { warehouse: "B", qty: 40 } ] }
    )
    ```

## 删除数据
与查询类似，查询出来-> 删掉
```
db.collection.deleteMany()
db.collection.deleteOne()
```
- 删除所有数据  
```db.inventory.deleteMany({})```
- 删除 匹配到的所有数据  
```db.inventory.deleteMany({<field1>: { <operator1>: <value1> }})```