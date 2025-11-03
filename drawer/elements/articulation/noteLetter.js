'use strict'

import text from './../basic/text.js'
import pathWithOutline from './../basic/pathWithOutline.js'
import articulationShouldBeAboveOrUnderStemLine from './articulationShouldBeAboveOrUnderStemLine.js'
import moveElementInTheCenterBetweenPoints from './../basic/moveElementInTheCenterBetweenPoints.js'
import moveElementAbovePointWithInterval from './../basic/moveElementAbovePointWithInterval.js'
import moveElementBelowPointWithInterval from './../basic/moveElementBelowPointWithInterval.js'
import group from './../basic/group.js'

export default function (drawnSingleUnit, articulationIndex, currentArticulationParams, topOfCurrentStave, bottomOfCurrentStave, styles) {
  const { noteLetterArticulationFontOptions, noteLetterArticulationOffsetY, noteLetters } = styles
  const { direction, textValue, fontColor } = currentArticulationParams
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
  const noteLetterArticulation = group(
    'noteLetter',
    [
      noteLetters[textValue]
        ? pathWithOutline(
          noteLetters[textValue].points,
          null,
          fontColor,
          noteLetterArticulationFontOptions.outlinePadding,
          noteLetterArticulationFontOptions.outlineColor,
          noteLetterArticulationFontOptions.outlineRadius,
          0,
          startYPosition
        )
        : text(
          textValue,
          noteLetterArticulationFontOptions
        )(styles, 0, startYPosition)
    ]
  )
  if (shouldBeAboveOrUnderStemLine) {
    moveElementInTheCenterBetweenPoints(
      noteLetterArticulation,
      drawnSingleUnit.stemLeft,
      drawnSingleUnit.stemRight
    )
  } else {
    moveElementInTheCenterBetweenPoints(
      noteLetterArticulation,
      leftEdge,
      rightEdge
    )
  }
  if (direction === 'up') {
    moveElementAbovePointWithInterval(
      noteLetterArticulation,
      startYPosition,
      noteLetterArticulationOffsetY
    )
  } else {
    moveElementBelowPointWithInterval(
      noteLetterArticulation,
      startYPosition,
      noteLetterArticulationOffsetY
    )
  }
  return noteLetterArticulation
}
