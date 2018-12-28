import math from 'lodash/math'
/**
 *@description 判断点是否在多边形内
 * @param {Object} data
 * @returns {Boolean}
 */
const isInner = (testPointX, testPointY, pointsX, pointsY, callback) => {
  let ptNum = pointsX.length
  let result = false
  let pointMinX = math.min(pointsX)
  let pointMinY = math.min(pointsY)
  let pointMaxX = math.max(pointsX)
  let pointMaxY = math.max(pointsY)
  if (
    testPointX < pointMinX ||
    testPointX > pointMaxX ||
    testPointY < pointMinY ||
    testPointY > pointMaxY
  ) {
    return callback(result)
  }

  for (let i = 0, j = ptNum - 1; i < ptNum; j = i++) {
    if (
      ((pointsY[i] > testPointY && pointsY[j] < testPointY) ||
        (pointsY[j] > testPointY && pointsY[i] < testPointY)) &&
      testPointX <
        ((pointsX[j] - pointsX[i]) * (testPointY - pointsY[i])) /
          (pointsY[j] - pointsY[i] + pointsX[i])
    ) {
      result = !result
    }
    if (i === ptNum - 1) {
      return callback(result)
    }
  }
}

function isInPolygon(checkPoint, polygonPoints) {
  var counter = 0
  var i
  var xinters
  var p1, p2
  var pointCount = polygonPoints.length
  p1 = polygonPoints[0]

  for (i = 1; i <= pointCount; i++) {
    p2 = polygonPoints[i % pointCount]
    if (
      checkPoint[0] > Math.min(p1[0], p2[0]) &&
      checkPoint[0] <= Math.max(p1[0], p2[0])
    ) {
      if (checkPoint[1] <= Math.max(p1[1], p2[1])) {
        if (p1[0] !== p2[0]) {
          xinters =
            ((checkPoint[0] - p1[0]) * (p2[1] - p1[1])) / (p2[0] - p1[0]) +
            p1[1]
          if (p1[1] === p2[1] || checkPoint[1] <= xinters) {
            counter++
          }
        }
      }
    }
    p1 = p2
  }
  if (counter % 2 === 0) {
    return false
  } else {
    return true
  }
}

export { isInner, isInPolygon }
