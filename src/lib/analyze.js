// TODO 单车辆数据分析
import { EventBus } from './event'
import collection from 'lodash/collection'
import dateTime from 'date-time'
import { asyncSelectCar, asyncSelectZone } from './maria'
import { isInner } from './zone'
import { saveResults, saveStart, saveStartDevice } from './save'
// EventBus.$emit('analyze-notice', `已完成车辆--${data.id}--数据分析`)
/**
 * @description 单次数据处理
 * @param {Object} data
 * @param {Object} callback
 * @returns {Object} err data
 */
const singalProcess = (data, callback) => {
  asyncSelectCar({ id: data.id, datetime: data.datetime })
    .then(result => {
      collection.forEach(result, value => {
        let ret = {
          border: { state: false, value: '' },
          speed: { state: false, value: '' },
          raw: ''
        }
        // 判断是否越界
        if (data.border[0]) {
          collection.some(data.border, border => {
            if (isInner(value.lng, value.lat, border.lng, border.lat)) {
              ret.border.state = true
              ret.raw = value
              return true
            }
          })
        }
        // 判断是否超速
        if (data.speed[0]) {
          let maxSpeed = data.speed[data.speed.length - 1].speed
          if (value.speed <= data.speed[0].speed) {
            // 最小最小值
          } else if (value.speed > maxSpeed) {
            // 大于最大值
            ret.speed.state = true
            ret.speed.value = (value.speed - maxSpeed) / maxSpeed
            ret.raw = value
          } else {
            collection.some(data.speed, speed => {
              // 判断是否超速
              if (value.speed > speed.speed) {
                // 是否在此区域
                if (isInner(value.lng, value.lat, speed.lng, speed.lat)) {
                  ret.speed.state = true
                  ret.speed.value = (value.speed - speed.speed) / speed.speed
                  ret.raw = value
                  return true
                }
              }
            })
          }
        }
        callback(null, ret)
      })
    })
    .catch(err => {
      console.log(JSON.stringify(err))
    })
}

/**
 * @description 多车辆任意时段数据分析
 * @param {Object} data
 */
const multiCar = async data => {
  saveStart(data) // 分析记录开始
  let intervalTime = 24 * 60 * 60 * 1000
  let startTime = new Date(data.datetime.start)
  let endTime = new Date(data.datetime.end)
  let startMill = startTime.getTime()
  let endMill = endTime.getTime()
  let count = Math.ceil((endMill - startMill) / intervalTime)
  EventBus.$emit('analyze-notice', '开始进行所有车辆分析', 0)
  collection.forEach(data.id, value => {
    saveStartDevice({ id: value, file: data.file }) // 开始分析此设备
    // 查找设备越界和超速区域，无结果时不进行分析，在分析文件标注
    asyncSelectZone({ id: value, type: 'all' })
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
            let speed = ''
            try {
              speed = Number(zone.speed)
              allZone.speed.push({
                id: zone.id,
                name: zone.name,
                type: zone.type,
                speed: speed,
                lng: lngNum,
                lat: latNum
              })
            } catch (err) {
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
            saveResults({ id: value, speed: false, file: data.file })
          } else {
            // 根据速度排序
            allZone.speed = collection.sortBy(allZone.speed, ['speed'])
          }
          if (!allZone.border[0]) {
            saveResults({ id: value, border: false, file: data.file })
          }

          // 按照每24小时进行分析
          for (let index = 0; index < count; index++) {
            let start = startMill + index * intervalTime
            let end = startMill + (index + 1) * intervalTime
            if (index === count - 1) {
              end = endMill
            }
            start = dateTime({ date: new Date(start) })
            end = dateTime({ date: new Date(end) })
            singalProcess(
              {
                id: value,
                datetime: { start: start, end: end },
                zone: allZone
              },
              (err, results) => {
                if (err) {
                  console.log(JSON.stringify(err))
                } else {
                  saveResults({
                    id: value,
                    border: true,
                    speed: true,
                    results: results,
                    file: data.file
                  })
                }
              }
            )
          }
        } else {
          // 不进行分析，存储结果
          saveResults({
            id: value,
            border: false,
            speed: false,
            file: data.file
          })
        }
      })
      .catch(err => {
        console.log(JSON.stringify(err))
      })
  })
}
export { singalProcess, multiCar }
