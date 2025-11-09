'use strict'

import path from '#unilang/drawer/elements/basic/path.js'
import group from '#unilang/drawer/elements/basic/group.js'
import articulationShouldBeAboveOrUnderStemLine from '#unilang/drawer/elements/articulation/articulationShouldBeAboveOrUnderStemLine.js'
import moveElementInTheCenterBetweenPoints from '#unilang/drawer/elements/basic/moveElementInTheCenterBetweenPoints.js'
import moveElementAbovePointWithInterval from '#unilang/drawer/elements/basic/moveElementAbovePointWithInterval.js'
import articulationKeysInVerticalLine from '#unilang/drawer/elements/articulation/articulationKeysInVerticalLine.js'

export default function (drawnSingleUnit, articulationIndex, currentArticulationParams, topOfCurrentStave, bottomOfCurrentStave, styles) {
  const components = []
  const { mordent, mordentInverted, fontColor } = styles
  const { keyAbove, keyBelow, inverted } = currentArticulationParams
  const shouldBeAboveOrUnderStemLine = articulationShouldBeAboveOrUnderStemLine(drawnSingleUnit)
  const leftEdge = drawnSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.left
  const rightEdge = drawnSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.right
  const startYPosition = Math.min(drawnSingleUnit.top, topOfCurrentStave)
  let mordentSymbol
  if (inverted) {
    mordentSymbol = path(
      mordentInverted.points,
      null,
      fontColor,
      0,
      startYPosition
    )
  } else {
    mordentSymbol = path(
      mordent.points,
      null,
      fontColor,
      0,
      startYPosition
    )
  }
  components.push(
    mordentSymbol
  )
  if (keyAbove) {
    components.push(
      articulationKeysInVerticalLine(drawnSingleUnit, articulationIndex, keyAbove, mordentSymbol, 'above', styles)
    )
  }
  if (keyBelow) {
    components.push(
      articulationKeysInVerticalLine(drawnSingleUnit, articulationIndex, keyBelow, mordentSymbol, 'below', styles)
    )
  }
  let groupedMordent = group(
    'upMordent',
    components
  )
  if (shouldBeAboveOrUnderStemLine) {
    moveElementInTheCenterBetweenPoints(
      groupedMordent,
      drawnSingleUnit.stemLeft,
      drawnSingleUnit.stemRight
    )
  } else {
    moveElementInTheCenterBetweenPoints(
      groupedMordent,
      leftEdge,
      rightEdge
    )
  }
  moveElementAbovePointWithInterval(
    groupedMordent,
    startYPosition,
    mordent.yOffset
  )
  return groupedMordent
}
