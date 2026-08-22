'use strict'

import path from '#repertoire/drawer/elements/basic/path.js'
import articulationShouldBeAboveOrUnderStemLine from '#repertoire/drawer/elements/articulation/articulationShouldBeAboveOrUnderStemLine.js'
import moveElementAbovePointWithInterval from '#repertoire/drawer/elements/basic/moveElementAbovePointWithInterval.js'
import moveElementBelowPointWithInterval from '#repertoire/drawer/elements/basic/moveElementBelowPointWithInterval.js'
import moveElementInTheCenterBetweenPoints from '#repertoire/drawer/elements/basic/moveElementInTheCenterBetweenPoints.js'

export default function (drawnSingleUnit, articulationIndex, currentArticulationParams, topOfCurrentStave, bottomOfCurrentStave, styles) {
  const { spiccato, fontColor } = styles
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
  const spiccatoSymbol = path(
    direction === 'up' ? spiccato.upPoints : spiccato.downPoints,
    null,
    fontColor,
    0,
    startYPosition
  )
  if (direction === 'up') {
    moveElementAbovePointWithInterval(
      spiccatoSymbol,
      startYPosition,
      spiccato.yOffset
    )
  } else {
    moveElementBelowPointWithInterval(
      spiccatoSymbol,
      startYPosition,
      spiccato.yOffset
    )
  }
  if (shouldBeAboveOrUnderStemLine) {
    moveElementInTheCenterBetweenPoints(
      spiccatoSymbol,
      drawnSingleUnit.stemLeft,
      drawnSingleUnit.stemRight
    )
  } else {
    moveElementInTheCenterBetweenPoints(
      spiccatoSymbol,
      leftEdge,
      rightEdge
    )
  }
  return spiccatoSymbol
}
