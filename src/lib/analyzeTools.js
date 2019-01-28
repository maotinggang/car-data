import collection from 'lodash/collection'
import insider from 'point-in-polygon'
import dateTime from 'date-time'
import math from 'lodash/math'
import array from 'lodash/array'

/**
 * @description 根据数据库查询到的区域信息进行处理
 * @param {Array} data
 */
const getZone = data => {
  let allZone = { border: [], speed: [] }
  collection.forEach(data, zone => {
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
  // 根据速度排序
  if (allZone.speed[0]) {
    allZone.speed = collection.sortBy(allZone.speed, ['speed'])
  }
  return allZone
}

/**
 *@description 根据单点和区域初始估计值
 * @param {Object} point
 */
const estimateInit = data => {
  let { point, zones } = data
  let estimate = 0
  // 定位
  if (point.state === 'True') estimate += 30
  // 卫星数
  if (point.stano > 20) estimate += 30
  else if (point.stano > 10) estimate += 20
  else if (point.stano > 4) estimate += 10
  if (point.alert === '超速') {
    // 超速大小
    let over = point.speed - point.limit
    if (over > 50) estimate -= 40
    else if (over > 40) estimate -= 30
    else if (over > 30) estimate -= 20
    else if (over > 20) estimate += 5
    else if (over > 10) estimate += 20
    else estimate += 10
    // 超速值大于大限速
    // 2个限速区
    if (zones.speed.length > 1) {
      over = point.speed - zones.speed[1].speed
      if (over > 20) {
        estimate -= 10
      } else if (over > 0) {
        estimate += 30
      }
    }
    // 3个限速区
    if (zones.speed.length > 2) {
      over = point.speed - zones.speed[2].speed
      if (over > 20) {
        estimate -= 10
      } else if (over > 0) {
        estimate += 30
      }
    }

    collection.forEach(zones.speed, value => {
      if (value.speed > point.limit) {
        // 限速区域重叠，同时出现在两个区域,速度大于大限速+20，否则-10
        if (insider([point.lng, point.lat], value.polygon)) {
          if (point.speed > value.speed) {
            estimate += 20
          } else {
            estimate -= 10
          }
        }
        // 高速区点漂移到低速区
        over = point.speed - value.speed
        if (over > 10) estimate += 20
        else if (over > 0) estimate += 10
        else estimate -= 10
      }
      // TODO 点漂移到高速区，漏警
    })
  }
  return estimate
}

/**
 * @description 筛选1分钟内最大超速，删除其他点
 * @param {Object} points
 */
const data60sFilter = points => {
  let newPoints = []
  let pointsLength = points.length
  for (let index = 0; index < pointsLength; index++) {
    const value = points[0]
    if (!value) break
    let pointTime = new Date(value.time)
    let now = dateTime({ date: pointTime })
    let next60s = dateTime({
      date: new Date(pointTime.getTime() + 60 * 1000)
    })
    let ret = array.remove(points, o => {
      return (
        o.time >= now &&
        o.time < next60s &&
        o.alert === '超速' &&
        o.id === value.id
      )
    })
    newPoints.push(math.maxBy(ret, 'speed'))
  }
  return newPoints
}
export { getZone, estimateInit, data60sFilter }
