'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')
const moveElement = require('./../basic/moveElement')
const moveElementAbovePointWithInterval = require('./../basic/moveElementAbovePointWithInterval')

module.exports = (measure, styles) => {
  const { intervalBetweenStaveLines, sign, fontColor } = styles
  measure.sign.measurePosition = measure.sign.measurePosition || 'start'
  const signShape = path(
    sign.points,
    null,
    fontColor,
    (measure.sign.measurePosition === 'start')
      ? (measure.stavesLeft || measure.left)
      : (measure.stavesRight || measure.right),
    0
  )
  const signShapeWidth = signShape.right - signShape.left
  moveElement(
    signShape,
    (measure.sign.measurePosition === 'start')
      ? 0
      : -signShapeWidth
  )
  moveElementAbovePointWithInterval(
    signShape,
    measure.top,
    sign.yOffset
  )
  const drawnSign = group(
    'sign',
    [
      signShape
    ]
  )
  moveElement(
    drawnSign,
    0,
    (measure.sign.yCorrection || 0) * intervalBetweenStaveLines
  )
  measure.top = Math.min(measure.top, drawnSign.top)
  measure.bottom = Math.max(measure.bottom, drawnSign.bottom)
  return drawnSign
}
