# 来电区域信息

mobilearea.txt 包含了手机号前缀所在区域信息, 可用于查询号码归属地。
insertToMysql.js 将 mobilearea.txt  信息解析插入 mysql 数据库。

``` javascript
node insertToMysql.js
```