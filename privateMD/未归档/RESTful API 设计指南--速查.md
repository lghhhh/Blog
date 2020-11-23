# Restful API 
Restful API:为了接口的设计更加简洁明了易懂,设计的一套API接口规范  
特点： 
- 面向资源：接口名类似 zoos 、animals，而不是 getAllAnimals 这样的接口
- 使用http的动词来表示行为： GET / POST / PUT / PATCH / DELETE / HEAD / OPTIONS

## HTTP动词
- GET      (select)   : 从服务器取出资源(一个或多个)
- POST     (create)   : 在服务器创建一个资源
- PUT      (update)   : 在服务器更新资源（客户端提供 改变后的完整的数据）
- PATCH    (update)   : 在服务器更新资源（客户端提供 改变的某些属性）
- DELETE   (delete)   : 从服务器删除资源  

- HEAD    : 获取资源的元数据
- OPTIONS : 获取信息,关于资源那些属性是客户端可以改变的
## 常见例子
- `GET    /zoos`       ：列出所有动物园
- `POST   /zoos`       ：新建一个动物园，返回创建的新资源对象
- `GET    /zoos/ID`    ：获取某个指定动物园的信息
- `PUT    /zoos/ID`    ：更新某个指定动物园的信息（提供该动物园的全部信息），返回完整动物园信息
- `PATCH  /zoos/ID`    ：更新某个指定动物园的信息（提供该动物园的部分信息），返回完整动物园信息
- `DELETE /zoos/ID`    ：删除某个动物园，返回空文档
- `GET    /zoos/ID/animals`    ：列出某个指定动物园的所有动物
- `DELETE /zoos/ID/animals/ID` ：删除某个指定动物园的指定动物
## 过滤信息
过滤数据： 每个API可以通过提供的参数，过滤返回的结果。
- `?limit=10` 指定返回的记录数量
- `?offset=10`  指定返回记录的开始位置
- `?page=2&per_page=100` 指定第几页，每一页记录的条数
- `?srotby=name&order=asc` 指定返回结果按照那个属性排序，及排序的顺序 
- `?animal_type_id=1` 指定赛选条件  

参数的设计允许存在冗余，即允许API路径和URL参数偶尔有重复。比如，GET /zoo/ID/animals 与 GET /animals?zoo_id=ID 的含义是相同的。

## 状态码

## 返回结果
- `GET    /zoos`       ：列出所有动物园
- `POST   /zoos`       ：新建一个动物园
- `GET    /zoos/ID`    ：获取某个指定动物园的信息
- `PUT    /zoos/ID`    ：更新某个指定动物园的信息（提供该动物园的全部信息）
- `PATCH  /zoos/ID`    ：更新某个指定动物园的信息（提供该动物园的部分信息）
- `DELETE /zoos/ID`    ：删除某个动物园
- `GET    /zoos/ID/animals`    ：列出某个指定动物园的所有动物
- `DELETE /zoos/ID/animals/ID` ：删除某个指定动物园的指定动物