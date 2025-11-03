'use strict'

import path from './../basic/path.js'
import articulationShouldBeAboveOrUnderStemLine from './articulationShouldBeAboveOrUnderStemLine.js'
import moveElementInTheCenterBetweenPoints from './../basic/moveElementInTheCenterBetweenPoints.js'
import moveElementAbovePointWithInterval from './../basic/moveElementAbovePointWithInterval.js'
import moveElementBelowPointWithInterval from './../basic/moveElementBelowPointWithInterval.js'

export default function (drawnSingleUnit, articulationIndex, currentArticulationParams, topOfCurrentStave, bottomOfCurrentStave, styles) {
  const { marcato, fontColor } = styles
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
  const marcatoSymbol = path(
    direction === 'up' ? marcato.upPoints : marcato.downPoints,
    null,
    fontColor,
    0,
    startYPosition
  )
  if (direction === 'up') {
    moveElementAbovePointWithInterval(
      marcatoSymbol,
      startYPosition,
      marcato.yOffset
    )
  } else {
    moveElementBelowPointWithInterval(
      marcatoSymbol,
      startYPosition,
      marcato.yOffset
    )
  }
  if (shouldBeAboveOrUnderStemLine) {
    moveElementInTheCenterBetweenPoints(
      marcatoSymbol,
      drawnSingleUnit.stemLeft,
      drawnSingleUnit.stemRight
    )
  } else {
    moveElementInTheCenterBetweenPoints(
      marcatoSymbol,
      leftEdge,
      rightEdge
    )
  }
  return marcatoSymbol
}
