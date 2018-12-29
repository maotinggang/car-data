import { EventBus } from './event'
import collection from 'lodash/collection'
import math from 'lodash/math'
import dateTime from 'date-time'
import { asyncSelectCar, asyncSelectZone, asyncSaveAnalyze } from './maria'
// import { isInner } from './zone'
import insider from 'point-in-polygon'
import { saveNoAnalyze } from './save'
import { each, series } from 'async'
import { wgs2gcj } from './coords'
// EventBus.$emit('analyze-notice', `已完成车辆--${data.id}--数据分析`)
// saveStartDevice({ id: value, file: data.file }) // 开始分析此设备
const analyzePoint = {
  id: '',
  time: '',
  start: '',
  lng: null,
  lat: null,
  speed: null,
  over: null,
  direction: null,
  state: '',
  stano: null
}
/**
 * @description 对单辆车进行数据处理
 * @param {Object} data
 * @param {Object} callback
 * @returns {Object} err data
 */
const singalCar = (data, callback) => {
  // 按照每24小时间隔进行分析
  let intervalTime = 24 * 60 * 60 * 1000
  let startTime = new Date(data.datetime.start)
  let endTime = new Date(data.datetime.end)
  let startMill = startTime.getTime()
  let endMill = endTime.getTime()
  let count = Math.ceil((endMill - startMill) / intervalTime)
  for (let index = 0; index < count; index++) {
    let start = startMill + index * intervalTime
    let end = startMill + (index + 1) * intervalTime
    if (index === count - 1) {
      end = endMill
    }

    asyncSelectCar({
      id: data.id,
      datetime: {
        start: dateTime({ date: new Date(start) }),
        end: dateTime({
          date: new Date(end)
        })
      }
    })
      .then(result => {
        each(
          result,
          (value, callback) => {
            // wgs 转 高德
            let coord = wgs2gcj(value.lng, value.lat)
            let ret = {
              state: '',
              speed: '',
              raw: ''
            }
            series(
              [
                callback => {
                  // 判断是否越界
                  if (data.zone.border[0]) {
                    // each(
                    //   data.zone.border,
                    //   (border, callback) => {
                    //     if (!insider(coord, border.polygon)) {
                    //       ret.state = 'B'
                    //       ret.raw = value
                    //     }
                    //     callback()
                    //   },
                    //   err => {
                    //     callback(err)
                    //   }
                    // )
                    collection.some(data.zone.border, border => {
                      if (!insider(coord, border.polygon)) {
                        ret.state = '越界'
                        ret.raw = value
                        return true
                      }
                    })
                    callback()
                  } else {
                    callback()
                  }
                },
                callback => {
                  // 判断是否超速
                  if (data.zone.speed[0]) {
                    if (value.speed <= data.zone.speed[0].speed) {
                      // 最小最小值
                      callback()
                    } else {
                      collection.some(data.zone.speed, speed => {
                        if (
                          value.speed > speed.speed &&
                          insider(coord, speed.polygon)
                        ) {
                          ret.state = '超速'
                          ret.speed = math.floor(
                            ((value.speed - speed.speed) / speed.speed) * 100,
                            1
                          )
                          ret.raw = value
                          return true
                        }
                      })
                      callback()

                      // each(
                      //   data.zone.speed,
                      //   (speed, callback) => {
                      //     // 判断是否超速
                      //     if (value.speed > speed.speed) {
                      //       // 是否在此区域
                      //       if (insider(coord, speed.polygon)) {
                      //         ret.state += 'S'
                      //         ret.speed = math.floor(
                      //           ((value.speed - speed.speed) / speed.speed) *
                      //             100,
                      //           1
                      //         )
                      //         ret.raw = value
                      //       }
                      //       callback()
                      //     } else {
                      //       callback()
                      //     }
                      //   },
                      //   err => {
                      //     callback(err)
                      //   }
                      // )
                    }
                  } else {
                    callback()
                  }
                },
                callback => {
                  // 存储结果数据到数据库
                  if (ret.state) {
                    let saveData = ret.raw
                    saveData.start = data.start
                    if (ret.speed) saveData.over = ret.speed
                    else saveData.over = null
                    saveData.state = ret.state
                    asyncSaveAnalyze(saveData)
                  }
                  callback()
                }
              ],
              err => {
                callback(err)
              }
            )
          },
          err => {
            callback(err)
          }
        )
      })
      .catch(err => {
        callback(err)
      })
  }
}

/**
 * @description 对每一个车单独进行分析，采用async/eachSeries控制流程
 * @param {Object} data
 */
const pointAnalyze = (data, callback) => {
  // 按照顺序同步分析每一辆车，找出有问题点暂存数据库，等待下一步总体分析
  each(
    data.id,
    (value, callback) => {
      // EventBus.$emit('analyze-notice', `开始进行--${value}--数据分析`)
      // 查找设备越界和超速区域，无结果时不进行分析，在分析文件标注
      asyncSelectZone({
        id: value,
        type: 'all'
      })
        .then(result => {
          if (result[0]) {
            // 采用高德坐标系，区域坐标不进行转换
            // 将字符串经纬度转换为数字数组
            let allZone = { border: [], speed: [] }
            collection.forEach(result, zone => {
              let lngs = zone.lng.split(',')
              let lats = zone.lat.split(',')
              let polygon = []
              for (let index = 0; index < lngs.length; index++) {
                polygon.push([Number(lngs[index]), Number(lats[index])])
              }
              let speed = 0
              try {
                speed = Number(zone.speed)
              } catch (err) {}
              if (speed) {
                allZone.speed.push({
                  id: zone.id,
                  name: zone.name,
                  type: zone.type,
                  speed: speed,
                  polygon: polygon
                })
              } else {
                allZone.border.push({
                  id: zone.id,
                  name: zone.name,
                  type: zone.type,
                  polygon: polygon
                })
              }
            })
            // 无越界或限速边界时处理
            if (!allZone.speed[0]) {
              // 存储到分析数据库
              let saveData = analyzePoint
              saveData.id = value
              saveData.time = 0
              saveData.start = data.start
              saveData.state = '无限速区'
              asyncSaveAnalyze(saveData)
            } else {
              // 根据速度排序
              allZone.speed = collection.sortBy(allZone.speed, ['speed'])
            }
            if (!allZone.border[0]) {
              let saveData = analyzePoint
              saveData.id = value
              saveData.time = 0
              saveData.start = data.start
              saveData.state = '无越界区'
              asyncSaveAnalyze(saveData)
            }
            // 对单个车辆进行分析
            singalCar(
              {
                id: value,
                datetime: data.datetime,
                start: data.start,
                zone: allZone
              },
              err => {
                callback(err)
              }
            )
          } else {
            // 不进行分析，直接存储结果
            saveNoAnalyze(data)
            callback()
          }
        })
        .catch(err => {
          callback(err)
        })
    },
    err => {
      callback(err)
    }
  )
}
/**
 * @description 进一步分析单点数据，将结果保存到文件,采用async控制流程
 * @param {Object} data
 */
const allAnalyze = (data, callback) => {
  callback()
}

/**
 * @description 多车辆任意时段数据分析,采用async/auto控制流程
 * @param {Object} data
 */
const multiCar = data => {
  series(
    [
      callback => {
        EventBus.$emit(
          'statistics-analyze-notice',
          `开始分析车辆数据 </br> 时间:${data.start}`,
          0
        )
        callback()
      },
      callback => {
        pointAnalyze(data, err => {
          callback(err)
        })
      },
      callback => {
        allAnalyze(data, err => {
          callback(err)
        })
      }
    ],
    err => {
      if (err) {
        console.log(JSON.stringify(err))
      } else {
        data.end = dateTime()
        EventBus.$emit(
          'statistics-analyze-notice',
          `已完成所有车辆分析 </br> 时间:${data.end}`,
          0
        )
        EventBus.$emit('statistics-analyze-done', data)
      }
    }
  )
}

/**
 * @description 查询历史记录后对查询数据进行分析
 * @param {Object} data
 */
const historyAnalyze = data => {}
export { multiCar, historyAnalyze }
