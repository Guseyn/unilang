'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')
const moveElement = require('./../basic/moveElement')
const moveElementAbovePointWithInterval = require('./../basic/moveElementAbovePointWithInterval')

module.exports = (measure, styles) => {
  const { intervalBetweenStaveLines, coda, fontColor } = styles
  measure.coda.measurePosition = measure.coda.measurePosition || 'start'
  const xCenterOfCoda = measure.coda.measurePosition === 'start'
    ? (measure.stavesLeft || measure.left)
    : (measure.stavesRight || measure.right)
  const codaShape = path(
    coda.points,
    null,
    fontColor,
    xCenterOfCoda,
    0
  )
  moveElementAbovePointWithInterval(
    codaShape,
    measure.top,
    coda.yOffset
  )
  const drawnCoda = group(
    'coda',
    [
      codaShape
    ]
  )
  const drawnCodaWidth = drawnCoda.right - drawnCoda.left
  moveElement(
    drawnCoda,
    (measure.coda.measurePosition === 'start')
      ? 0
      : -drawnCodaWidth,
    (measure.coda.yCorrection || 0) * intervalBetweenStaveLines
  )
  measure.top = Math.min(measure.top, drawnCoda.top)
  measure.bottom = Math.max(measure.bottom, drawnCoda.bottom)
  return drawnCoda
}
