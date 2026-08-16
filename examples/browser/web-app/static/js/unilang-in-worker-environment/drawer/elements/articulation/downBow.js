'use strict'

import path from '/js/unilang-in-worker-environment/drawer/elements/basic/path.js'
import articulationShouldBeAboveOrUnderStemLine from '/js/unilang-in-worker-environment/drawer/elements/articulation/articulationShouldBeAboveOrUnderStemLine.js'
import moveElementAbovePointWithInterval from '/js/unilang-in-worker-environment/drawer/elements/basic/moveElementAbovePointWithInterval.js'
import moveElementBelowPointWithInterval from '/js/unilang-in-worker-environment/drawer/elements/basic/moveElementBelowPointWithInterval.js'
import moveElementInTheCenterBetweenPoints from '/js/unilang-in-worker-environment/drawer/elements/basic/moveElementInTheCenterBetweenPoints.js'

export default function (drawnSingleUnit, articulationIndex, currentArticulationParams, topOfCurrentStave, bottomOfCurrentStave, styles) {
  const { downBow, fontColor } = styles
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
  const downBowSymbol = path(
    direction === 'up' ? downBow.upPoints : downBow.downPoints,
    null,
    fontColor,
    0,
    startYPosition
  )
  if (direction === 'up') {
    moveElementAbovePointWithInterval(
      downBowSymbol,
      startYPosition,
      downBow.yOffset
    )
  } else {
    moveElementBelowPointWithInterval(
      downBowSymbol,
      startYPosition,
      downBow.yOffset
    )
  }
  if (shouldBeAboveOrUnderStemLine) {
    moveElementInTheCenterBetweenPoints(
      downBowSymbol,
      drawnSingleUnit.stemLeft,
      drawnSingleUnit.stemRight
    )
  } else {
    moveElementInTheCenterBetweenPoints(
      downBowSymbol,
      leftEdge,
      rightEdge
    )
  }
  return downBowSymbol
}
