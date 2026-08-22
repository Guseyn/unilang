'use strict'

import path from '#repertoire/drawer/elements/basic/path.js'
import articulationShouldBeAboveOrUnderStemLine from '#repertoire/drawer/elements/articulation/articulationShouldBeAboveOrUnderStemLine.js'
import moveElementInTheCenterBetweenPoints from '#repertoire/drawer/elements/basic/moveElementInTheCenterBetweenPoints.js'
import moveElementAbovePointWithInterval from '#repertoire/drawer/elements/basic/moveElementAbovePointWithInterval.js'
import moveElementBelowPointWithInterval from '#repertoire/drawer/elements/basic/moveElementBelowPointWithInterval.js'

export default function (drawnSingleUnit, articulationIndex, currentArticulationParams, topOfCurrentStave, bottomOfCurrentStave, styles) {
  const { fermata, fontColor } = styles
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
  const fermataSymbol = path(
    direction === 'up' ? fermata.upPoints : fermata.downPoints,
    null,
    fontColor,
    0,
    startYPosition
  )
  if (direction === 'up') {
    moveElementAbovePointWithInterval(
      fermataSymbol,
      startYPosition,
      fermata.yOffset
    )
  } else {
    moveElementBelowPointWithInterval(
      fermataSymbol,
      startYPosition,
      fermata.yOffset
    )
  }
  if (shouldBeAboveOrUnderStemLine) {
    moveElementInTheCenterBetweenPoints(
      fermataSymbol,
      drawnSingleUnit.stemLeft,
      drawnSingleUnit.stemRight
    )
  } else {
    moveElementInTheCenterBetweenPoints(
      fermataSymbol,
      leftEdge,
      rightEdge
    )
  }
  return fermataSymbol
}
