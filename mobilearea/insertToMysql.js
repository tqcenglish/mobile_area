#!/usr/local/bin/node
/***
 * 解析信息到 mysql 数据库
 */
let mysql = require('mysql')
const readline = require('readline')
const fs = require('fs')

let con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'abcd'
})

con.querySync = async (sql) => {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        console.error(err)
        return resolve(null, err)
      } else {
        return resolve(result)
      }
    })
  })
}

con.connectSync = async () => {
  return new Promise((resolve, reject) => {
    con.connect(err => {
      if (err) {
        return reject(err)
      } else {
        return resolve(err)
      }
    })
  })
}

async function run () {
  await con.connectSync()
  await con.querySync(`CREATE DATABASE IF NOT EXISTS  mobile_area`)
  await con.querySync(`USE mobile_area`)
  await con.querySync(`CREATE TABLE IF NOT EXISTS mobile_area (phone VARCHAR(255), areanumber VARCHAR(255), areaname VARCHAR(255), note VARCHAR(255))`)

  // 插入数据
  const rl = readline.createInterface({
    input: fs.createReadStream(`${__dirname}/../data/mobile-area.txt`)
  })
  let subSqls = []
  await new Promise((resolve, reject) => {
    rl.on('line', async (line) => {
      if (!line.includes('手机前缀')) {
        const [phone, areanumber, areaname, note] = line.split('|')
        const subSql = `(${phone}, ${areanumber}, '${areaname}', '${note}')`
        subSqls.push(subSql)
      }
    })
    rl.on('close', async () => {
      resolve()
    })
  })

  // 不要放在 rl.on 中
  let chunk = 2000
  for (let i = 0, j = subSqls.length; i < j; i += chunk) {
    const sql = `INSERT INTO mobile_area.mobile_area (phone, areanumber, areaname, note) VALUES ${subSqls.slice(i, i + chunk).join(',')}`
    await con.querySync(sql)
  }
  process.exit(1)
}
try {
  run()
} catch (err) {
  console.error(err)
}
