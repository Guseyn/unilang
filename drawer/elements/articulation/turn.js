'use strict'

const path = require('./../basic/path')
const articulationShouldBeAboveOrUnderStemLine = require('./articulationShouldBeAboveOrUnderStemLine')
const group = require('./../basic/group')
const moveElement = require('./../basic/moveElement')
const moveElementInTheCenterBetweenPoints = require('./../basic/moveElementInTheCenterBetweenPoints')
const moveElementAbovePointWithInterval = require('./../basic/moveElementAbovePointWithInterval')
const articulationKeysInVerticalLine = require('./articulationKeysInVerticalLine')

module.exports = (drawnSingleUnit, articulationIndex, currentArticulationParams, topOfCurrentStave, bottomOfCurrentStave, styles) => {
  const components = []
  const { turn, turnInverted, fontColor } = styles
  const { keyAbove, keyBelow, followedAfter, inverted } = currentArticulationParams
  const leftEdge = drawnSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.left
  const rightEdge = drawnSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.right
  const shouldBeAboveOrUnderStemLine = articulationShouldBeAboveOrUnderStemLine(drawnSingleUnit)
  const startYPosition = currentArticulationParams.aboveBelowOverUnderStaveLines
    ? Math.min(drawnSingleUnit.top, topOfCurrentStave)
    : drawnSingleUnit.top
  let turnSymbol
  if (inverted) {
    turnSymbol = path(
      turnInverted.points,
      null,
      fontColor,
      0,
      startYPosition
    )
  } else {
    turnSymbol = path(
      turn.points,
      null,
      fontColor,
      0,
      startYPosition
    )
  }
  if (shouldBeAboveOrUnderStemLine) {
    moveElementInTheCenterBetweenPoints(
      turnSymbol,
      drawnSingleUnit.stemLeft,
      drawnSingleUnit.stemRight
    )
  } else {
    moveElementInTheCenterBetweenPoints(
      turnSymbol,
      leftEdge,
      rightEdge
    )
  }
  components.push(turnSymbol)
  if (keyAbove) {
    components.push(
      articulationKeysInVerticalLine(drawnSingleUnit, articulationIndex, keyAbove, turnSymbol, 'above', styles)
    )
  }
  if (keyBelow) {
    components.push(
      articulationKeysInVerticalLine(drawnSingleUnit, articulationIndex, keyBelow, turnSymbol, 'below', styles)
    )
  }
  const groupedTurn = group(
    'turn',
    components
  )
  if (followedAfter) {
    const turnSymbolWidth = turnSymbol.right - turnSymbol.left
    moveElement(
      groupedTurn,
      turnSymbolWidth
    )
  }
  moveElementAbovePointWithInterval(
    groupedTurn,
    startYPosition,
    turn.yOffset
  )
  return groupedTurn
}
