'use strict'

const path = require('./../basic/path')
const articulationShouldBeAboveOrUnderStemLine = require('./articulationShouldBeAboveOrUnderStemLine')
const moveElementAbovePointWithInterval = require('./../basic/moveElementAbovePointWithInterval')
const moveElementBelowPointWithInterval = require('./../basic/moveElementBelowPointWithInterval')
const moveElementInTheCenterBetweenPoints = require('./../basic/moveElementInTheCenterBetweenPoints')

module.exports = (drawnSingleUnit, articulationIndex, currentArticulationParams, topOfCurrentStave, bottomOfCurrentStave, styles) => {
  const { leftHandPizzicato, fontColor } = styles
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
  const leftHandPizzicatoSymbol = path(
    leftHandPizzicato.points,
    null,
    fontColor,
    0,
    startYPosition
  )
  if (direction === 'up') {
    moveElementAbovePointWithInterval(
      leftHandPizzicatoSymbol,
      startYPosition,
      leftHandPizzicato.yOffset
    )
  } else {
    moveElementBelowPointWithInterval(
      leftHandPizzicatoSymbol,
      startYPosition,
      leftHandPizzicato.yOffset
    )
  }
  if (shouldBeAboveOrUnderStemLine) {
    moveElementInTheCenterBetweenPoints(
      leftHandPizzicatoSymbol,
      drawnSingleUnit.stemLeft,
      drawnSingleUnit.stemRight
    )
  } else {
    moveElementInTheCenterBetweenPoints(
      leftHandPizzicatoSymbol,
      leftEdge,
      rightEdge
    )
  }
  return leftHandPizzicatoSymbol
}
