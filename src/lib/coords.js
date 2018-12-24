const pi = 3.14159265358979324
const a = 6378245.0
const ee = 0.00669342162296594323
const xPi = (3.14159265358979324 * 3000.0) / 180.0

// 世界大地坐标转为百度坐标
const wgs2bd = (lat, lon) => {
  let wgs2gcjR = wgs2gcj(lat, lon)
  let gcj2bdR = gcj2bd(wgs2gcjR[0], wgs2gcjR[1])
  return gcj2bdR
}

function gcj2bd(lat, lon) {
  let x = lon
  let y = lat
  let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * xPi)
  let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * xPi)
  let bdLon = z * Math.cos(theta) + 0.0065
  let bdLat = z * Math.sin(theta) + 0.006
  let result = []
  result.push(bdLat)
  result.push(bdLon)
  return result
}

function wgs2gcj(lat, lon) {
  let dLat = transformLat(lon - 105.0, lat - 35.0)
  let dLon = transformLon(lon - 105.0, lat - 35.0)
  let radLat = (lat / 180.0) * pi
  let magic = Math.sin(radLat)
  magic = 1 - ee * magic * magic
  let sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * pi)
  dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * pi)
  let mgLat = lat + dLat
  let mgLon = lon + dLon
  let result = []
  result.push(mgLat)
  result.push(mgLon)
  return result
}

function transformLat(lat, lon) {
  let ret =
    -100.0 +
    2.0 * lat +
    3.0 * lon +
    0.2 * lon * lon +
    0.1 * lat * lon +
    0.2 * Math.sqrt(Math.abs(lat))
  ret +=
    ((20.0 * Math.sin(6.0 * lat * pi) + 20.0 * Math.sin(2.0 * lat * pi)) *
      2.0) /
    3.0
  ret +=
    ((20.0 * Math.sin(lon * pi) + 40.0 * Math.sin((lon / 3.0) * pi)) * 2.0) /
    3.0
  ret +=
    ((160.0 * Math.sin((lon / 12.0) * pi) + 320 * Math.sin((lon * pi) / 30.0)) *
      2.0) /
    3.0
  return ret
}

function transformLon(lat, lon) {
  let ret =
    300.0 +
    lat +
    2.0 * lon +
    0.1 * lat * lat +
    0.1 * lat * lon +
    0.1 * Math.sqrt(Math.abs(lat))
  ret +=
    ((20.0 * Math.sin(6.0 * lat * pi) + 20.0 * Math.sin(2.0 * lat * pi)) *
      2.0) /
    3.0
  ret +=
    ((20.0 * Math.sin(lat * pi) + 40.0 * Math.sin((lat / 3.0) * pi)) * 2.0) /
    3.0
  ret +=
    ((150.0 * Math.sin((lat / 12.0) * pi) +
      300.0 * Math.sin((lat / 30.0) * pi)) *
      2.0) /
    3.0
  return ret
}

export default wgs2bd
