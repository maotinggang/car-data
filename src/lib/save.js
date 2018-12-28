import fs from 'fs'
import dateTime from 'date-time'

const saveResults = data => {
  let saveData = ''
  if (!data.border) {
  }
  if (!data.speed) {
  }
  if (data.border && data.speed) {
  }
  fs.appendFile(data.file, saveData, err => {
    if (err) {
      console.log(err)
    }
  })
}

/**
 * @description 未查询到超速和越界区域时直接存储
 * @param {Object} data
 */
const saveNoAnalyze = data => {
  let saveData = `/n-------------${data.id}-------------/n
  未找到该车辆的限速和越界区域信息`
  fs.appendFile(data.file, saveData, err => {
    if (err) {
      console.log(err)
    }
  })
}

const saveStart = data => {
  let saveData = `#################分析数据开始#################\r\n
  开始时间：${data.now}\r\n
  保存文件：${data.file}\r\n
  分析时段：${dateTime({
    date: new Date(data.datetime.start)
  })}---${dateTime({ date: new Date(data.datetime.end) })}\r\n
  分析设备：${data.id}\r\n
#############################################\r\n
  `
  fs.appendFile(data.file, saveData, err => {
    if (err) {
      console.log(err)
    }
  })
}
const saveEnd = data => {
  let saveData = `#############分析数据结束#############
  结束时间：${data.now}
  ##################################/n
  `
  fs.appendFile(data.file, saveData, err => {
    if (err) {
      console.log(err)
    }
  })
}
const saveStartDevice = data => {
  let saveData = `/n-------------${data.id}-------------/n`
  fs.appendFile(data.file, saveData, err => {
    if (err) {
      console.log(err)
    }
  })
}
export { saveResults, saveStart, saveEnd, saveStartDevice, saveNoAnalyze }
