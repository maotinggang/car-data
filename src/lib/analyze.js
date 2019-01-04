import { EventBus } from './event'
import collection from 'lodash/collection'
import dateTime from 'date-time'
import insider from 'point-in-polygon'
import { series } from 'async'
import { wgs2gcj } from './coords'
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'microgram',
    database: 'car_data'
  },
  pool: { min: 0, max: 7 }
})
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
  let intervalTime = 24 * 60 * 60 * 1000
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
      .map(value => {
        let ret = { state: '', speed: '', raw: '', estimate: 0 }
        // 根据状态和卫星数判断，量化准确率
        // 定位30
        if (value.state === 'True') ret.estimate += 30
        // 卫星数10,20,30
        if (value.stano > 15) ret.estimate += 30
        else if (value.stano > 8) ret.estimate += 15
        else if (value.stano > 4) ret.estimate += 5
        // 速度5
        if (value.speed > 0) ret.estimate += 5
        // 方向5
        if (value.direction !== 0) ret.estimate += 5

        // wgs 转 高德
        let coord = wgs2gcj(value.lng, value.lat)
        // 判断是否越界
        if (data.type.border && data.zone.border[0]) {
          ret.state = '越界'
          ret.raw = value
          collection.some(data.zone.border, border => {
            if (insider(coord, border.polygon)) {
              ret.state = ''
              ret.raw = ''
              return true
            }
          })
        }
        // 判断是否超速
        if (data.type.speed && data.zone.speed[0]) {
          // 大于最小限速
          if (value.speed > data.zone.speed[0].speed) {
            let overlap = 0
            let zoneCount = data.zone.speed.length
            for (let i = 0; i < zoneCount; i++) {
              const speed = data.zone.speed[i]
              // 限速区域判断
              let over = value.speed - speed.speed
              if (over > 0 && insider(coord, speed.polygon)) {
                ret.state = '超速'
                ret.speed = speed.speed
                ret.raw = value
                // 超速大小判断
                if (over > 50) ret.estimate -= 30
                else if (over > 30) ret.estimate -= 10
                else if (over > 20) ret.estimate -= 5
                else if (over > 10) ret.estimate += 10
                else if (over > 5) ret.estimate += 5
                else ret.estimate -= 5
                // 区域重叠，同时出现在两个区域
                overlap++
                if (overlap > 1) ret.estimate -= 10
                // 误差引起的区域错误
                // 点漂移到低速区
                if (i < zoneCount - 1) {
                  let nextZone = data.zone.speed[i + 1]
                  over = value.speed - nextZone.speed
                  if (over > 10) ret.estimate += 20
                  else if (over > 0) ret.estimate += 10
                  else ret.estimate -= 10
                }
              }
            }
          }
          // TODO 点漂移到高速区，漏警
        }

        if (ret.state) {
          let saveData = ret.raw
          saveData.start = data.start
          if (ret.speed) saveData.over = ret.speed
          else saveData.over = null
          saveData.estimate = ret.estimate
          saveData.state = ret.state
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
}

/**
 * @description 对每一个车单独进行分析，采用async/eachSeries控制流程
 * @param {Object} data
 */
const pointAnalyze = data => {
  // 按照顺序同步分析每一辆车，找出有问题点暂存数据库，等待下一步总体分析
  // 查找设备越界和超速区域，无结果时不进行分析，在分析文件标注
  for (let i = 0; i < data.id.length; i++) {
    const value = data.id[i]
    knex('zone')
      .select()
      .where('id', value)
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
          } else {
            // 根据速度排序
            allZone.speed = collection.sortBy(allZone.speed, ['speed'])
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
}

/**
 * @description 进一步分析单点数据，将结果保存到文件,采用async控制流程
 * @param {Object} data
 */
const statistics = data => {
  collection.forEach(data, value => {
    // 获取区域数据
    knex('zone')
      .select()
      .where('id', value.id)
      .then(result => {
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
        // 超速进一步分析
        if (value.over > 0) {
          overSpeedAnalyze({ value: value, zone: allZone.speed })
        }
      })
      .catch(err => {
        console.error(err)
      })
  })
}

/**
 * @description 判断超速正确性
 * @param {Object} data
 */
const overSpeedAnalyze = data => {
  // 获取前后一分钟数据
  let now = new Date(data.value.time)
  now.setMinutes(now.getMinutes() - 1)
  let start = dateTime({ date: now })
  now.setMinutes(now.getMinutes() + 2)
  let end = dateTime({ date: now })
  let estimate = data.value.extimate - 10
  knex('fengjie_1_3')
    .select()
    .where({ id: data.value.id })
    .andWhereBetween('time', [start, end])
    .then(values => {
      collection.forEach(values, value => {
        // 判断前后一分钟是否有超速
        if (value.speed > data.value.over) estimate += 10
      })
      // TODO 判断前后一分钟是否有区域变化
      let overCount = 0
      let zoneCount = data.zone.length
      for (let i = 0; i < zoneCount; i++) {
        const speed = data.zone[i]
        // 限速区域判断
        if (insider(coord, speed.polygon)) {
          }
        }
      }
      // 通过坐标计算平均速度
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
        pointAnalyze(data)
        callback()
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
export { multiCar, historyAnalyze, statistics, overSpeedAnalyze }
