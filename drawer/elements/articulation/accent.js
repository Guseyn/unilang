'use strict'

const path = require('./../basic/path')
const articulationShouldBeAboveOrUnderStemLine = require('./articulationShouldBeAboveOrUnderStemLine')
const moveElementAbovePointWithInterval = require('./../basic/moveElementAbovePointWithInterval')
const moveElementBelowPointWithInterval = require('./../basic/moveElementBelowPointWithInterval')
const moveElementInTheCenterBetweenPoints = require('./../basic/moveElementInTheCenterBetweenPoints')

module.exports = (drawnSingleUnit, articulationIndex, currentArticulationParams, topOfCurrentStave, bottomOfCurrentStave, styles) => {
  const { fontColor, accent } = styles
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
  const accentSymbol = path(
    accent.points,
    accent.strokeOptions,
    fontColor,
    0,
    startYPosition
  )
  if (direction === 'up') {
    moveElementAbovePointWithInterval(
      accentSymbol,
      startYPosition,
      accent.yOffset
    )
  } else {
    moveElementBelowPointWithInterval(
      accentSymbol,
      startYPosition,
      accent.yOffset
    )
  }
  if (shouldBeAboveOrUnderStemLine) {
    moveElementInTheCenterBetweenPoints(
      accentSymbol,
      drawnSingleUnit.stemLeft,
      drawnSingleUnit.stemRight
    )
  } else {
    moveElementInTheCenterBetweenPoints(
      accentSymbol,
      leftEdge,
      rightEdge
    )
  }
  return accentSymbol
}
