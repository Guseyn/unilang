'use strict'

import text from '#unilang/drawer/elements/basic/text.js'
import pathWithOutline from '#unilang/drawer/elements/basic/pathWithOutline.js'
import articulationShouldBeAboveOrUnderStemLine from '#unilang/drawer/elements/articulation/articulationShouldBeAboveOrUnderStemLine.js'
import moveElementInTheCenterBetweenPoints from '#unilang/drawer/elements/basic/moveElementInTheCenterBetweenPoints.js'
import moveElementAbovePointWithInterval from '#unilang/drawer/elements/basic/moveElementAbovePointWithInterval.js'
import moveElementBelowPointWithInterval from '#unilang/drawer/elements/basic/moveElementBelowPointWithInterval.js'
import group from '#unilang/drawer/elements/basic/group.js'

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
