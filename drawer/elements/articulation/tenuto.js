'use strict'

import path from './../basic/path.js'
import articulationShouldBeAboveOrUnderStemLine from './articulationShouldBeAboveOrUnderStemLine.js'
import moveElementAbovePointWithInterval from './../basic/moveElementAbovePointWithInterval.js'
import moveElementBelowPointWithInterval from './../basic/moveElementBelowPointWithInterval.js'
import moveElementInTheCenterBetweenPoints from './../basic/moveElementInTheCenterBetweenPoints.js'

export default function (drawnSingleUnit, articulationIndex, currentArticulationParams, topOfCurrentStave, bottomOfCurrentStave, styles) {
  const { tenuto, fontColor } = styles
  const { direction } = currentArticulationParams
  const shouldBeAboveOrUnderStemLine = articulationShouldBeAboveOrUnderStemLine(drawnSingleUnit, direction)
  const leftEdge = drawnSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.left
  const rightEdge = drawnSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.right
  const startYPosition = currentArticulationParams.aboveBelowOverUnderStaveLines
    ? direction === 'up'
      ? Math.min(drawnSingleUnit.top, topOfCurrentStave)
      : Math.max(drawnSingleUnit.bottom, bottomOfCurrentStave)
    : direction === 'up'
      ? drawnSingleUnit.top
      : drawnSingleUnit.bottom
  const tenutoSymbol = path(
    tenuto.points,
    null,
    fontColor,
    0,
    startYPosition
  )
  if (direction === 'up') {
    moveElementAbovePointWithInterval(
      tenutoSymbol,
      startYPosition,
      tenuto.yOffset
    )
  } else {
    moveElementBelowPointWithInterval(
      tenutoSymbol,
      startYPosition,
      tenuto.yOffset
    )
  }
  if (shouldBeAboveOrUnderStemLine) {
    moveElementInTheCenterBetweenPoints(
      tenutoSymbol,
      drawnSingleUnit.stemLeft,
      drawnSingleUnit.stemRight
    )
  } else {
    moveElementInTheCenterBetweenPoints(
      tenutoSymbol,
      leftEdge,
      rightEdge
    )
  }
  return tenutoSymbol
}
