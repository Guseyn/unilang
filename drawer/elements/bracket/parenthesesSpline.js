'use strict'

import slurSplinePoints from './../tie-and-slur/slurSplinePoints.js'
import path from './../basic/path.js'

const parenthesesJunctionPhantomPoint = (point, xSideSign, ySideSign, epsilon = 0.0001) => {
  return {
    x: point.x + xSideSign * epsilon,
    y: point.y + ySideSign * epsilon
  }
}

const parenthesesRoundCoefficientByYRangeOfSlur = (yRangeOfParentheses, styles, minValue = 0.9, maxValue = 1.0) => {
  const { correlationIntervalOfYRangeForParenthesesRoundCoefficient } = styles
  const stepForParenthesesRoundCoefficient = 0.01
  return Math.max(maxValue - Math.ceil(yRangeOfParentheses / correlationIntervalOfYRangeForParenthesesRoundCoefficient) * stepForParenthesesRoundCoefficient, minValue)
}

const additionalPathPointsForParenthesesToMakeItBulk = (slurSplinePoints, xSideSign, styles) => {
  const p0 = { x: slurSplinePoints[1], y: slurSplinePoints[2] }
  const p1 = { x: slurSplinePoints[11], y: slurSplinePoints[12] }
  const p2 = { x: slurSplinePoints[13], y: slurSplinePoints[14] }
  return [
    'C',
    p2.x + xSideSign * styles.parenthesesBulkCoefficient, p2.y,
    p1.x + xSideSign * styles.parenthesesBulkCoefficient, p1.y,
    p0.x, p0.y
  ]
}

export default function (topPoint, bottomPoint, side, styles) {
  const { parenthesesStrokeOptions } = styles
  const yLengthOfBracket = bottomPoint.y - topPoint.y
  const xSideSign = side === 'left' ? -1 : +1
  const topPhantomPoint = parenthesesJunctionPhantomPoint(topPoint, xSideSign, +1)
  const bottomPhantomPoint = parenthesesJunctionPhantomPoint(bottomPoint, xSideSign, -1)
  const roundCoefficient = parenthesesRoundCoefficientByYRangeOfSlur(yLengthOfBracket, styles)
  const calculatedParenthesesSplinePoints = slurSplinePoints(
    topPoint,
    topPhantomPoint,
    bottomPhantomPoint,
    bottomPoint,
    roundCoefficient
  )
  const generatedAdditionalPathPointsForParenthesesToMakeItBulk = additionalPathPointsForParenthesesToMakeItBulk(
    calculatedParenthesesSplinePoints,
    xSideSign,
    styles
  )
  return path(
    [
      ...calculatedParenthesesSplinePoints,
      ...generatedAdditionalPathPointsForParenthesesToMakeItBulk
    ],
    parenthesesStrokeOptions,
    true,
    0
  )
}
