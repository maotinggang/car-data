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

export { asyncSelectAll }
