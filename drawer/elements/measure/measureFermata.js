'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')
const moveElement = require('./../basic/moveElement')
const moveElementAbovePointWithInterval = require('./../basic/moveElementAbovePointWithInterval')

module.exports = (drawnBarLine, isLastMeasureOnPageLine, styles) => {
  const { fermata, measureFermataOffsetY, fontColor } = styles
  const startYPosition = drawnBarLine.top
  const fermataSymbol = group(
    'measure-fermata',
    [
      path(
        fermata.upPoints,
        null,
        fontColor,
        0,
        startYPosition
      )
    ]
  )
  moveElementAbovePointWithInterval(
    fermataSymbol,
    startYPosition,
    measureFermataOffsetY
  )
  const fermataSymbolWidth = fermataSymbol.right - fermataSymbol.left
  moveElement(
    fermataSymbol,
    drawnBarLine.xCenter - (isLastMeasureOnPageLine ? fermataSymbolWidth : fermataSymbolWidth / 2)
  )
  return fermataSymbol
}
