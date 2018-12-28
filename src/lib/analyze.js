import { EventBus } from './event'
import collection from 'lodash/collection'
import math from 'lodash/math'
import dateTime from 'date-time'
import { asyncSelectCar, asyncSelectZone, asyncSaveAnalyze } from './maria'
import { isInner } from './zone'
import { saveStart, saveEnd, saveNoAnalyze } from './save'
import { eachSeries, each, series } from 'async'
import { wgs2gcj } from './coords'
// EventBus.$emit('analyze-notice', `已完成车辆--${data.id}--数据分析`)
// saveStartDevice({ id: value, file: data.file }) // 开始分析此设备
const analyzePoint = {
  id: '',
  time: '',
  now: '',
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
            let coord = wgs2gcj(value.lat, value.lng)
            value.lat = coord[0]
            value.lng = coord[1]

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
                    each(
                      data.zone.border,
                      (border, callback) => {
                        isInner(
                          value.lng,
                          value.lat,
                          border.lng,
                          border.lat,
                          result => {
                            console.log(result)

                            if (!result) {
                              ret.state = 'B'
                              ret.raw = value
                            }
                            callback()
                          }
                        )
                      },
                      err => {
                        callback(err)
                      }
                    )
                  } else {
                    callback()
                  }
                },
                callback => {
                  // 判断是否超速
                  if (data.zone.speed[0]) {
                    // console.log(JSON.stringify(value))
                    if (value.speed <= data.zone.speed[0].speed) {
                      // 最小最小值
                      callback()
                    } else {
                      each(
                        data.speed,
                        (speed, callback) => {
                          // 判断是否超速
                          if (value.speed > speed.speed) {
                            // 是否在此区域
                            isInner(
                              value.lng,
                              value.lat,
                              speed.lng,
                              speed.lat,
                              result => {
                                if (result) {
                                  ret.state += 'S'
                                  ret.speed = math.floor(
                                    ((value.speed - speed.speed) /
                                      speed.speed) *
                                      100,
                                    1
                                  )
                                  ret.raw = value
                                }
                                callback()
                              }
                            )
                          } else {
                            callback()
                          }
                        },
                        err => {
                          callback(err)
                        }
                      )
                    }
                  } else {
                    callback()
                  }
                },
                callback => {
                  // 存储结果数据到数据库
                  if (ret.state) {
                    let saveData = ret.raw
                    saveData.now = data.now
                    saveData.over = ret.speed
                    saveData.state = ret.state
                    console.log(saveData)
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
  eachSeries(
    data.id,
    (value, callback) => {
      EventBus.$emit('analyze-notice', `开始进行--${value}--数据分析`)
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
              let lngNum = []
              let latNum = []
              for (let index = 0; index < lngs.length; index++) {
                lngNum.push(Number(lngs[index]))
                latNum.push(Number(lats[index]))
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
                  lng: lngNum,
                  lat: latNum
                })
              } else {
                allZone.border.push({
                  id: zone.id,
                  name: zone.name,
                  type: zone.type,
                  lng: lngNum,
                  lat: latNum
                })
              }
            })
            // 无越界或限速边界时处理
            if (!allZone.speed[0]) {
              // 存储到分析数据库
              let saveData = analyzePoint
              saveData.id = value
              saveData.time = 0
              saveData.now = data.now
              saveData.state = 'NS'
              asyncSaveAnalyze(saveData)
            } else {
              // 根据速度排序
              allZone.speed = collection.sortBy(allZone.speed, ['speed'])
            }
            if (!allZone.border[0]) {
              let saveData = analyzePoint
              saveData.id = value
              saveData.time = 0
              saveData.now = data.now
              saveData.state = 'NB'
              asyncSaveAnalyze(saveData)
            }
            // 对单个车辆进行分析
            singalCar(
              {
                id: value,
                datetime: data.datetime,
                now: data.now,
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
const allAnalyze = (data, callback) => {}

/**
 * @description 多车辆任意时段数据分析,采用async/auto控制流程
 * @param {Object} data
 */
const multiCar = data => {
  series(
    [
      callback => {
        EventBus.$emit(
          'analyze-notice',
          `开始分析车辆数据 </br> 时间:${data.now}`,
          0
        )
        saveStart(data) // 分析记录开始
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
        data.now = dateTime(data)
        saveEnd(data)
        EventBus.$emit(
          'analyze-notice',
          `已完成所有车辆分析，结束时间:${data.now}`,
          0
        )
      }
    }
  )
}
export { singalCar, multiCar, pointAnalyze, allAnalyze }
