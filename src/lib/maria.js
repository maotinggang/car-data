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
    if (conn) conn.end()
  }
}

/**
 * @description 根据表名查询所有数据
 * @param {Object} data
 * @returns {Array}
 */
const asyncSelectCar = async data => {
  let conn
  try {
    conn = await pool.getConnection()
    let sql = ''
    if (data.datetime) {
      sql = `SELECT * FROM fengjie_1_3 WHERE id='${data.id}' AND time > '${
        data.datetime.start
      }' AND time < '${data.datetime.end}'`
    } else {
      sql = `SELECT * FROM fengjie_1_3 WHERE id='${data.id}'`
    }
    const res = await conn.query(sql)
    return res
  } catch (err) {
    console.log({
      code: 'maria.select',
      call: 'maria.asyncSelectAll',
      info: err
    })
  } finally {
    if (conn) conn.end()
  }
}

export { asyncSelectAll, asyncSelectCar }
