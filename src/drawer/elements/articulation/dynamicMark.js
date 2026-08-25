'use strict'

import text from '#msq/drawer/elements/basic/text.js'
import path from '#msq/drawer/elements/basic/path.js'
import group from '#msq/drawer/elements/basic/group.js'
import articulationShouldBeAboveOrUnderStemLine from '#msq/drawer/elements/articulation/articulationShouldBeAboveOrUnderStemLine.js'
import moveElementInTheCenterBetweenPoints from '#msq/drawer/elements/basic/moveElementInTheCenterBetweenPoints.js'
import moveElementAbovePointWithInterval from '#msq/drawer/elements/basic/moveElementAbovePointWithInterval.js'
import moveElementBelowPointWithInterval from '#msq/drawer/elements/basic/moveElementBelowPointWithInterval.js'

export default function (drawnSingleUnit, articulationIndex, currentArticulationParams, topOfCurrentStave, bottomOfCurrentStave, styles) {
  const components = []
  const { dynamicTextFontOptions, dynamicYOffset, dynamicLetters, fontColor } = styles
  const tunedDynamicTextFontOptions = Object.assign({}, dynamicTextFontOptions)
  const { direction, textValue } = currentArticulationParams
  const shouldBeAboveOrUnderStemLine = articulationShouldBeAboveOrUnderStemLine(drawnSingleUnit, direction)
  const leftEdge = drawnSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.left
  const rightEdge = drawnSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.right
  const startYPosition = direction === 'up'
    ? Math.min(drawnSingleUnit.top, topOfCurrentStave)
    : Math.max(drawnSingleUnit.bottom, bottomOfCurrentStave)
  const dynamicText = dynamicLetters[textValue]
    ? path(
      dynamicLetters[textValue].points,
      null,
      fontColor,
      0,
      startYPosition
    )
    : text(
      textValue || '??', tunedDynamicTextFontOptions
    )(styles, 0, startYPosition)
  components.push(
    dynamicText
  )
  let groupedDynamicText = group(
    'dynamicText',
    components
  )
  if (shouldBeAboveOrUnderStemLine) {
    moveElementInTheCenterBetweenPoints(
      groupedDynamicText,
      drawnSingleUnit.stemLeft,
      drawnSingleUnit.stemRight
    )
  } else {
    moveElementInTheCenterBetweenPoints(
      groupedDynamicText,
      leftEdge,
      rightEdge
    )
  }
  if (!groupedDynamicText.isEmpty) {
    if (direction === 'up') {
      moveElementAbovePointWithInterval(
        groupedDynamicText,
        startYPosition,
        dynamicYOffset
      )
    } else {
      moveElementBelowPointWithInterval(
        groupedDynamicText,
        startYPosition,
        dynamicYOffset
      )
    }
  }
  return groupedDynamicText
}
