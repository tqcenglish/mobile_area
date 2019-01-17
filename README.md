Node.js 数据操作

## 来电区域信息

data/mobile-area.txt 包含了手机号前缀所在区域信息, 可用于查询号码归属地/外呼添加特点前缀功能。 

通过 **insertToMysql.js** 将 信息解析插入 mysql 数据库。
通过 **insertSqlite.js** 将 信息解析插入 sqlite.db 数据库。

``` javascript
node insertToMysql.js
node insertSqlite.js
```

## sqlite.db

**sqlite.db** 已包含了解析信息