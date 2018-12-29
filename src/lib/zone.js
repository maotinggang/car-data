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

export { isInner }
