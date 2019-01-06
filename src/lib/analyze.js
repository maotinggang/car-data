import { EventBus } from './event'
import collection from 'lodash/collection'
import dateTime from 'date-time'
import insider from 'point-in-polygon'
import { series, auto, each, eachSeries } from 'async'
import { wgs2gcj } from './coords'
import { getZone, estimateInit } from './analyzeTools'
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'microgram',
    database: 'car_data'
  },
  // acquireTimeoutMillis: 60000,
  // idleTimeoutMillis: 10000,
  pool: { min: 10, max: 100 }
})
const analyzePoint = {
  id: '',
  time: '',
  start: '',
  lng: null,
  lat: null,
  speed: null,
  limit: null,
  direction: null,
  state: '',
  alert: null,
  estimate: null,
  stano: null
}
/**
 * @description 对单辆车进行数据处理
 * @param {Object} data
 * @param {Object} callback
 * @returns {Object} err data
 */
const singalCar = data => {
  // 按照每24小时间隔进行分析
  let intervalTime = 24 * 7 * 60 * 60 * 1000
  let startTime = new Date(data.datetime.start)
  let endTime = new Date(data.datetime.end)
  let startMill = startTime.getTime()
  let endMill = endTime.getTime()
  let count = Math.ceil((endMill - startMill) / intervalTime)
  let start, end
  for (let index = 0; index < count; index++) {
    start = startMill + index * intervalTime
    end = startMill + (index + 1) * intervalTime
    if (index === count - 1) {
      end = endMill
    }
    knex('fengjie_1_3')
      .select()
      .where({ id: data.id })
      .andWhereBetween('time', [
        dateTime({ date: new Date(start) }),
        dateTime({ date: new Date(end) })
      ])
      .then(values => {
        eachSeries(
          values,
          (value, callback) => {
            let ret = { alert: '', limit: '', raw: '' }
            // wgs 转 高德
            let coord = wgs2gcj(value.lng, value.lat)
            // 判断是否越界
            if (data.type.border && data.zone.border[0]) {
              ret.alert = '越界'
              ret.raw = value
              collection.some(data.zone.border, border => {
                if (insider(coord, border.polygon)) {
                  ret.alert = ''
                  ret.raw = ''
                  return true
                }
              })
            }
            // 判断是否超速
            if (data.type.speed && data.zone.speed[0]) {
              // 大于最小限速
              if (value.speed > data.zone.speed[0].speed) {
                let zoneCount = data.zone.speed.length
                for (let i = 0; i < zoneCount; i++) {
                  const speed = data.zone.speed[i]
                  // 限速区域判断
                  let over = value.speed - speed.speed
                  if (over > 0 && insider(coord, speed.polygon)) {
                    ret.alert = '超速'
                    ret.limit = speed.speed
                    ret.raw = value
                  }
                }
              }
            }

            if (ret.alert) {
              let saveData = ret.raw
              saveData.start = data.start
              if (ret.limit) saveData.limit = ret.limit
              else saveData.limit = null
              saveData.alert = ret.alert
              knex('analyze')
                .insert(saveData)
                .asCallback(() => {
                  callback()
                })
                .catch(err => {
                  console.error(err)
                })
            } else callback()
          },
          err => {
            if (err) {
              console.error(err)
            }
          }
        )
      })
      .catch(err => {
        console.error(err)
      })
  }
}

/**
 * @description 对每一个车单独进行分析，采用async/eachSeries控制流程
 * @param {Object} data
 */
const pointAnalyze = (data, callback) => {
  // 按照顺序同步分析每一辆车，找出有问题点暂存数据库，等待下一步总体分析
  // 查找设备越界和超速区域，无结果时不进行分析，在分析文件标注
  for (let i = 0; i < data.id.length; i++) {
    const value = data.id[i]
    // eachSeries(
    //   data.id,
    //   (value, callback) => {

    //   },
    //   err => {
    //     if (err) {
    //       console.error(err)
    //     }
    //   }
    // )
    knex('zone')
      .select()
      .where('id', value)
      .then(result => {
        if (result[0]) {
          // 采用高德坐标系，区域坐标不进行转换
          // 将字符串经纬度转换为数字数组
          let allZone = getZone(result)
          // 无越界或限速边界时处理
          if (!allZone.speed[0] && data.type.speed && data.type.zone) {
            // 存储到分析数据库
            let saveData = analyzePoint
            saveData.id = value
            saveData.time = 0
            saveData.start = data.start
            saveData.state = '无限速区'
            knex('analyze')
              .insert(saveData)
              .catch(err => {
                console.error(err)
              })
          }
          if (!allZone.border[0] && data.type.border && data.type.zone) {
            let saveData = analyzePoint
            saveData.id = value
            saveData.time = 0
            saveData.start = data.start
            saveData.state = '无越界区'
            knex('analyze')
              .insert(saveData)
              .catch(err => {
                console.error(err)
              })
          }
          // 对单个车辆进行分析
          singalCar({
            id: value,
            datetime: data.datetime,
            start: data.start,
            type: data.type,
            zone: allZone
          })
        } else if (data.type.zone) {
          // 无越界和限速区域，不进行分析
          let saveData = analyzePoint
          saveData.id = value
          saveData.time = 0
          saveData.start = data.start
          saveData.state = '无区域'
          knex('analyze')
            .insert(saveData)
            .catch(err => {
              console.error(err)
            })
        }
      })
      .catch(err => {
        console.error(err)
      })
  }
  callback()
}

/**
 * @description 进一步分析单点数据，将结果保存到文件,采用async控制流程
 * @param {Object} data
 */
const statistics = data => {
  // 获取车辆初步分析数据
  collection.forEach(data.id, value => {
    auto(
      {
        get_points: callback => {
          knex('analyze')
            .select()
            .where({ id: value, start: data.start })
            .orderBy('time')
            // .then(result => {
            //   let err = null
            //   if (!result[0]) err = 'noData'
            //   callback(err, result)
            // })
            .asCallback((err, result) => {
              if (!result[0]) err = 'noData'
              callback(err, result)
            })
        },
        get_zone: callback => {
          knex('zone')
            .select()
            .where('id', value)
            .asCallback((err, result) => {
              if (!result[0]) err = 'noData'
              else result = getZone(result)
              callback(err, result)
            })
          // .then(result => {
          //   let err = null
          //   if (!result[0]) err = 'noData'
          //   else result = getZone(result)
          //   callback(err, result)
          // })
        },
        estimate: [
          'get_points',
          'get_zone',
          (results, callback) => {
            each(
              results.get_points,
              (value, callback) => {
                let coord = wgs2gcj(value.lng, value.lat)
                value.lng = coord[0]
                value.lat = coord[1]
                alertAnalyze({ point: value, zones: results.get_zone }, err => {
                  callback(err)
                })
              },
              err => {
                callback(err)
              }
            )
          }
        ]
      },
      err => {
        if (err && err !== 'noData') {
          console.error(err)
        }
      }
    )
  })
}

/**
 * @description 判断告警正确性
 * @param {Object} data
 */
const alertAnalyze = (data, callback) => {
  let estimate = estimateInit(data)
  // 获取前后一分钟数据
  let now = new Date(data.point.time)
  now.setMinutes(now.getMinutes() - 2)
  let start = dateTime({ date: now })
  now.setMinutes(now.getMinutes() + 4)
  let end = dateTime({ date: now })
  knex('fengjie_1_3')
    .select()
    .where({ id: data.point.id })
    .andWhereBetween('time', [start, end])
    .orderBy('time')
    .then(values => {
      // 超速判断
      if (data.point.alert === '超速') {
        let pointsChange = []
        collection.forEach(values, value => {
          // 判断前后一分钟是否有超速
          if (value.speed > data.point.limit) estimate += 10

          // 判断前后一分钟是区域跳变情况
          let coord = wgs2gcj(value.lng, value.lat)
          collection.some(data.zones.speed, zone => {
            if (insider(coord, zone.polygon)) {
              pointsChange.push(zone.speed)
              return true
            }
          })
        })
        // 统计区域跳变
        let count = 0
        let nowSpeed = 0
        collection.forEach(pointsChange, value => {
          if (nowSpeed !== value) {
            nowSpeed = value
            count++
          }
        })
        if (count === 1) {
          estimate += 10
        } else if (count === 2) {
          estimate -= 20
        } else if (count > 2) {
          estimate -= 30
        }
      }
      // TODO 越界判断

      // 更新数据库estimate
      if (estimate > 100) {
        estimate = 100
      } else if (estimate <= 0) {
        estimate = 0
      }
      knex('analyze')
        .where({
          id: data.point.id,
          time: data.point.time,
          start: data.point.start
        })
        .update({ estimate: estimate })
        .then(() => {
          callback()
        })
        .catch(err => {
          console.error(err)
        })
    })
    .catch(err => {
      console.error(err)
    })
}

/**
 * @description 多车辆任意时段数据分析,采用async/auto控制流程
 * @param {Object} data
 */
const multiCar = data => {
  series(
    [
      // 开始分析
      callback => {
        EventBus.$emit(
          'statistics-analyze-notice',
          `开始分析车辆数据 </br> 时间:${data.start}`,
          3
        )
        callback()
      },
      // 超速越界点筛选
      callback => {
        pointAnalyze(data, () => {
          callback()
        })
      },
      // 分析完成
      callback => {
        // TODO 完成通知不起作用，异步
        data.end = dateTime()
        EventBus.$emit('statistics-analyze-done', data)
        // EventBus.$emit(
        //   'statistics-analyze-notice',
        //   `完成车辆数据分析 </br> 时间:${data.end}`,
        //   3
        // )
        callback()
      }
    ],
    err => {
      if (err) {
        console.log(JSON.stringify(err))
      }
    }
  )
}

/**
 * @description 查询历史记录后对查询数据进行分析
 * @param {Object} data
 */
const historyAnalyze = data => {}
export { multiCar, historyAnalyze, statistics }
