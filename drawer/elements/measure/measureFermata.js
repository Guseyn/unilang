'use strict'

import path from './../basic/path.js'
import group from './../basic/group.js'
import moveElement from './../basic/moveElement.js'
import moveElementAbovePointWithInterval from './../basic/moveElementAbovePointWithInterval.js'

export default function (drawnBarLine, isLastMeasureOnPageLine, styles) {
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
