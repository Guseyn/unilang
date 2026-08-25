'use strict'

import path from '/js/e-msq/msq-worker/drawer/elements/basic/path.js'
import group from '/js/e-msq/msq-worker/drawer/elements/basic/group.js'
import moveElement from '/js/e-msq/msq-worker/drawer/elements/basic/moveElement.js'
import moveElementAbovePointWithInterval from '/js/e-msq/msq-worker/drawer/elements/basic/moveElementAbovePointWithInterval.js'

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
