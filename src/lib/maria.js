import mariadb from 'mariadb'
import readConfig from './config'

const pool = mariadb.createPool(readConfig('mariadb'))

/**
 * @description 根据表名查询所有数据
 * @param {String} data
 * @returns {Array}
 */
const asyncSelectAll = async data => {
  let conn
  try {
    conn = await pool.getConnection()
    const res = await conn.query(`SELECT * FROM ${data}`)
    return res
  } catch (err) {
    console.log({
      code: 'maria.select',
      call: 'maria.asyncSelectAll',
      info: err
    })
  } finally {
    if (conn) conn.destroy()
  }
}

/**
 * @description 查询所有分析数据
 * @param {String} data
 * @returns {Array}
 */
const asyncSelectAllAnalyze = async data => {
  let conn
  try {
    conn = await pool.getConnection()
    const res = await conn.query(
      'SELECT * FROM `analyze` WHERE start=' + `'${data}'`
    )
    return res
  } catch (err) {
    console.log(err)
  } finally {
    if (conn) conn.destroy()
  }
}

/**
 * @description 根据表名查询所有数据
 * @param {Object} data
 * @returns {Array}
 */
async function asyncSelectCar(data) {
  let conn
  let sql = ''
  if (data.datetime) {
    sql = `SELECT * FROM fengjie_1_3 WHERE id='${data.id}' AND time >= '${
      data.datetime.start
    }' AND time < '${data.datetime.end}'`
  } else {
    sql = `SELECT * FROM fengjie_1_3 WHERE id='${data.id}'`
  }
  try {
    conn = await pool.getConnection()
    const res = await conn.query(sql)
    return res
  } catch (err) {
    console.log({
      code: 'maria.select',
      call: 'maria.asyncSelectAll',
      info: err
    })
  } finally {
    if (conn) conn.destroy()
  }
}

/**
 * @description 根据车辆查询区域
 * @param {String} data
 * @returns {Array}
 */
async function asyncSelectZone(data) {
  let conn
  let sql = ''
  if (data.type === 'all') {
    sql = `SELECT * FROM zone WHERE id='${data.id}'`
  } else {
    sql = `SELECT * FROM zone WHERE id='${data.id}' AND type='${data.type}'`
  }
  try {
    conn = await pool.getConnection()
    let res = await conn.query(sql)
    return res
  } catch (err) {
    console.log({
      code: 'maria.select',
      call: 'maria.asyncSelectAll',
      info: err
    })
  } finally {
    if (conn) conn.destroy()
  }
}

/**
 * @description 存储单点分析数据
 * @param {String} data
 * @returns {Array}
 */
async function asyncSaveAnalyze(data) {
  let conn
  let sql =
    'INSERT INTO `analyze` VALUES ' +
    `('${data.id}','${data.time}','${data.start}',${data.lng},${data.lat},${
      data.speed
    },${data.over},${data.direction},'${data.state}',${data.stano})`
  try {
    conn = await pool.getConnection()
    conn.query(sql)
    return // FIXME 一定要加返回，不然后续操作错误
  } catch (err) {
    console.log(JSON.stringify(err))
  } finally {
    if (conn) conn.destroy()
  }
}

export {
  asyncSelectAll,
  asyncSelectCar,
  asyncSelectZone,
  asyncSaveAnalyze,
  asyncSelectAllAnalyze
}
