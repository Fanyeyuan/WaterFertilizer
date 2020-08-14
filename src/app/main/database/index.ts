import log from '@/app/common/log'
import sqlite3 from 'sqlite3'
import path from 'path'

function obj2str (obj: { [key: string]: any }, con: string) {
  const keys = Object.keys(obj)
  let str = ''
  for (let i = 0; i < keys.length; i++) {
    str += `${keys[i]} = ? ${i + 1 === keys.length ? '' : con} `
  }
  return str
}

enum tables {
  device = 'xph_device',
  element = 'xph_element',
  log = 'xph_log',
  logControl = 'xph_log_control',
  logLoraSignal = 'xph_log_lora_signal',
  relay = 'xph_relay',
  reals = 'xph_reals',
  history = 'xph_history'
}

const dbPath = path.join(__dirname, 'db.db')
const db = new sqlite3.Database(dbPath)
// this.db = new sqlite3.Database('db.db');       //临时目录  调试下可用，build后用不了
// this.db = new sqlite3.Database(':memory:');    //保存在内存中
log.info('sqlite 数据库地址:' + dbPath)

/**
 * 查询符合条件的第一条内容
 * @param tableName 表名
 * @param obj 要查询的条件 如果不传该参数，获取该表第一条数据
 * @param op 条件连接符
 */
const get = (
  tableName: tables,
  obj: { [key: string]: any },
  op = 'and'
): Promise<any> => {
  const values = Object.values(obj)
  const flag = obj2str(obj, op)
  const sql = 'select * from ' + tableName + ' where ' + flag
  log.info(sql)
  return new Promise((resolve, reject) => {
    db.get(sql, values, (err: Error, row: any) => {
      !err ? resolve(row) : reject(err)
    })
  })
}

/**
 * 查询符合条件的所有内容
 * @param tableName 表名
 * @param obj 要查询的条件 如果不传该参数，获取该表所有的数据
 * @param op 条件连接符
 */
const all = (
  tableName: tables,
  obj?: { [key: string]: any },
  op = 'and'
): Promise<any> => {
  let sql = ''
  if (obj) {
    const values = Object.values(obj)
    const flag = obj2str(obj, op)
    sql = 'select * from ' + tableName + ' where ' + flag
    log.info(sql, values)
    return new Promise((resolve, reject) => {
      db.all(sql, values, (err: Error, row: any) => {
        !err ? resolve(row) : reject(err)
      })
    })
  } else {
    sql = 'select * from ' + tableName
    log.info(sql)
    return new Promise((resolve, reject) => {
      db.all(sql, (err: Error, row: any) => {
        !err ? resolve(row) : reject(err)
      })
    })
  }
}

/**
 * 向表中插入数据，默认主键为 id
 * @param tableName 表名称
 * @param data 插入数据
 */
const insert = (
  tableName: tables,
  data: { [key: string]: any }
): Promise<any> => {
  !!data.id && delete data.id // 删除 主键id

  const keys = Object.keys(data)
  const values = Object.values(data)
  const sql = `insert into ${tableName} (${keys.toString()}) values (${values.map(
    value => '?'
  )})`
  log.info(sql)
  return new Promise((resolve, reject) => {
    db.run(sql, values, (err: Error, row: any) => {
      !err ? resolve(row) : reject(err)
    })
  })
}

/**
 * 更新表中的数据，默认主键为id
 * @param tableName 表名称
 * @param data 修改的数据
 * @param condition 指定修改的条件
 * @param op 指定条件之间的连接方式
 */
const update = (
  tableName: tables,
  data: { [key: string]: any },
  condition: { [key: string]: any },
  op = 'and'
): Promise<any> => {
  !!data.id && delete data.id // 删除 主键id

  const set = obj2str(data, ',')
  const flag = obj2str(condition, op)
  const sql = `update ${tableName} set ${set} where ${flag}`
  log.info(sql)
  const values = Object.values(data).concat(Object.values(condition))
  return new Promise((resolve, reject) => {
    db.run(sql, values, (err: Error, row: any) => {
      !err ? resolve(row) : reject(err)
    })
  })
}

/**
 * 删除表中数据，如果没有指定删除条件，则清空表
 * @param tableName 表名称
 * @param obj 要删除的条件
 * @param op 条件连接符
 */
const del = (tableName: tables, obj?: { [key: string]: any }, op = 'and') => {
  if (obj) {
    const values = Object.values(obj)
    const flag = obj2str(obj, op)
    const sql = 'delete from ' + tableName + ' where ' + flag
    log.info(sql)
    return new Promise((resolve, reject) => {
      db.all(sql, values, (err: Error, row: any) => {
        !err ? resolve(row) : reject(err)
      })
    })
  } else {
    // const sql = "delete from sqlite_sequence where name ='" + tableName + "'";
    const sql =
      "update sqlite_sequence set seq = 0 where name= '" + tableName + "'"
    log.info(sql)
    return new Promise((resolve, reject) => {
      db.run('delete from ' + tableName, (err: Error) => {
        if (!err) {
          db.run(sql, (err: Error, row: any) => {
            !err ? resolve(row) : reject(err)
          })
        }
      })
    })
  }
}

export { db, get, all, insert, update, del, tables }
