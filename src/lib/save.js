// TODO 存储分析结果到文件
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

const saveStart = data => {
  let saveData = `#############分析数据开始#############
  开始时间：${dateTime()}
  保存文件：${data.file}
  分析时段：${dateTime({
    date: new Date(data.datetime.start)
  })}---${dateTime({ date: new Date(data.datetime.end) })}
  分析设备：${data.id}
  ##################################/n
  `
  fs.appendFile(data.file, saveData, err => {
    if (err) {
      console.log(err)
    }
  })
}
const saveEnd = data => {
  let saveData = ''
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
export { saveResults, saveStart, saveEnd, saveStartDevice }
