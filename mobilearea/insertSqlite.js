#!/usr/local/bin/node
/***
 * 解析信息到 mysql 数据库
 */
let sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('sqlite.db')

const readline = require('readline')
const fs = require('fs')

async function run () {
  db.run(`CREATE TABLE IF NOT EXISTS mobile_area (phone VARCHAR(255), areanumber VARCHAR(255), areaname VARCHAR(255), note VARCHAR(255))`)

  // 插入数据
  const rl = readline.createInterface({
    input: fs.createReadStream(`${__dirname}/mobilearea.txt`)
  })
  let subSQL = []
  await new Promise((resolve, reject) => {
    rl.on('line', async (line) => {
      if (!line.includes('手机前缀')) {
        const [phone, areanumber, areaname, note] = line.split('|')
        const subSql = `(${phone}, ${areanumber}, '${areaname}', '${note}')`
        subSQL.push(subSql)
      }
    })
    rl.on('close', async () => {
      resolve()
    })
  })

  // 不要放在 rl.on 中
  let chunk = 500
  for (let i = 0, j = subSQL.length; i < j; i += chunk) {
    const sql = `INSERT INTO mobile_area (phone, areanumber, areaname, note) VALUES ${subSQL.slice(i, i + chunk).join(',')}`
    db.exec(sql)
  }
  process.exit(1)
}
try {
  db.serialize(() => {
    run()
  })
} catch (err) {
  console.error(err)
}
