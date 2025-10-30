'use strict'

const octaveSignText = require('./../octave-sign/octaveSignText')
const articulationShouldBeAboveOrUnderStemLine = require('./articulationShouldBeAboveOrUnderStemLine')
const moveElement = require('./../basic/moveElement')
const moveElementAbovePointWithInterval = require('./../basic/moveElementAbovePointWithInterval')
const moveElementBelowPointWithInterval = require('./../basic/moveElementBelowPointWithInterval')
const moveElementInTheCenterBetweenPoints = require('./../basic/moveElementInTheCenterBetweenPoints')

module.exports = (drawnSingleUnit, articulationIndex, currentArticulationParams, topOfCurrentStave, bottomOfCurrentStave, styles) => {
  const { octaveSignYOffset, octaveSignXCorrection, twoOctavesSignXCorrection } = styles
  const xCorrectionForOctaveSign = {
    '8': octaveSignXCorrection,
    '15': twoOctavesSignXCorrection
  }
  const { direction, textValue, subTextValue } = currentArticulationParams
  const shouldBeAboveOrUnderStemLine = articulationShouldBeAboveOrUnderStemLine(drawnSingleUnit, direction)
  const leftEdge = drawnSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.left
  const rightEdge = drawnSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.right
  const startYPosition = direction === 'up'
    ? Math.min(drawnSingleUnit.top, topOfCurrentStave)
    : Math.max(drawnSingleUnit.bottom, bottomOfCurrentStave)
  let drawnOctaveSignText = octaveSignText(textValue, subTextValue, direction)(styles, 0, startYPosition)
  if (shouldBeAboveOrUnderStemLine) {
    moveElementInTheCenterBetweenPoints(
      drawnOctaveSignText,
      drawnSingleUnit.stemLeft,
      drawnSingleUnit.stemRight
    )
  } else {
    moveElementInTheCenterBetweenPoints(
      drawnOctaveSignText,
      leftEdge,
      rightEdge
    )
  }
  moveElement(
    drawnOctaveSignText,
    xCorrectionForOctaveSign[textValue]
  )
  if (direction === 'up') {
    moveElementAbovePointWithInterval(
      drawnOctaveSignText,
      startYPosition,
      octaveSignYOffset
    )
  } else {
    moveElementBelowPointWithInterval(
      drawnOctaveSignText,
      startYPosition,
      octaveSignYOffset
    )
  }
  return drawnOctaveSignText
}
