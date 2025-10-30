'use strict'

const slurSplinePoints = require('./slurSplinePoints')
const path = require('./../basic/path')
const slurRoundCoefficientByXRangeOfSlur = require('./slurRoundCoefficientByXRangeOfSlur')
const timeInSlurSplinePointsBySomeXPointThere = require('./timeInSlurSplinePointsBySomeXPointThere')

const tieJunctionPhantomPoint = (point, sideSign, tieDirectionSign, epsilon = 0.0001) => {
  return {
    x: point.x + sideSign * epsilon,
    y: point.y + tieDirectionSign * epsilon
  }
}

const additionalPathPointsForSlurToMakeItBulk = (tieSplinePoints, tieDirection, isGrace, styles) => {
  const p0 = { x: tieSplinePoints[1], y: tieSplinePoints[2] }
  const p1 = { x: tieSplinePoints[11], y: tieSplinePoints[12] }
  const p2 = { x: tieSplinePoints[13], y: tieSplinePoints[14] }
  const tieDirectionSign = tieDirection === 'up' ? -1 : +1
  return [
    'C',
    p2.x, p2.y + tieDirectionSign * styles.slurBulkCoefficient * (isGrace ? styles.graceElementsScaleFactor : 1),
    p1.x, p1.y + tieDirectionSign * styles.slurBulkCoefficient * (isGrace ? styles.graceElementsScaleFactor : 1),
    p0.x, p0.y
  ]
}

const extremePointOfTie = (tieSplinePoints) => {
  const middleConstant = 0.5
  const tieStartX = tieSplinePoints[1]
  const tieEndX = tieSplinePoints[22]
  const p0 = { x: tieSplinePoints[1], y: tieSplinePoints[2] }
  const p1 = { x: tieSplinePoints[11], y: tieSplinePoints[12] }
  const p2 = { x: tieSplinePoints[13], y: tieSplinePoints[14] }
  const p3 = { x: tieSplinePoints[15], y: tieSplinePoints[16] }
  const sx = (tieStartX + tieEndX) * middleConstant
  const t = timeInSlurSplinePointsBySomeXPointThere(sx, tieStartX, tieEndX)
  return {
    x: sx,
    y: Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y
  }
}

module.exports = (startX, startY, endX, endY, tieDirection, leftSingleUnit, rightSingleUnit, roundCoefficientFactor, styles) => {
  const { tieStrokeOptions } = styles
  const tieDirectionSign = tieDirection === 'up' ? -1 : 1
  const xLengthOfTie = endX - startX
  const tieLeftPoint = { x: startX, y: startY }
  const tieRightPoint = { x: endX, y: endY }
  const tieLeftPhantomPoint = tieJunctionPhantomPoint(tieLeftPoint, +1, tieDirectionSign)
  const tieRightPhantomPoint = tieJunctionPhantomPoint(tieRightPoint, -1, tieDirectionSign)

  const calculatedTieSplinePoints = slurSplinePoints(
    tieLeftPoint,
    tieLeftPhantomPoint,
    tieRightPhantomPoint,
    tieRightPoint,
    slurRoundCoefficientByXRangeOfSlur(xLengthOfTie, roundCoefficientFactor, styles)
  )
  const generatedAdditionalPathPointsForTieToMakeItBulk = additionalPathPointsForSlurToMakeItBulk(
    calculatedTieSplinePoints,
    tieDirectionSign,
    ((leftSingleUnit && leftSingleUnit.isGrace) || (rightSingleUnit && rightSingleUnit.isGrace)),
    styles
  )
  const calculatedExtremePointOfTie = extremePointOfTie(calculatedTieSplinePoints)
  if (leftSingleUnit) {
    leftSingleUnit.top = Math.min(leftSingleUnit.top, calculatedExtremePointOfTie.y)
    leftSingleUnit.bottom = Math.max(leftSingleUnit.bottom, calculatedExtremePointOfTie.y)
  }
  if (rightSingleUnit) {
    rightSingleUnit.top = Math.min(rightSingleUnit.top, calculatedExtremePointOfTie.y)
    rightSingleUnit.bottom = Math.max(rightSingleUnit.bottom, calculatedExtremePointOfTie.y)
  }
  return path(
    [
      ...calculatedTieSplinePoints,
      ...generatedAdditionalPathPointsForTieToMakeItBulk
    ],
    tieStrokeOptions,
    true,
    0
  )
}
