'use strict'

import path from '#repertoire/drawer/elements/basic/path.js'
import articulationShouldBeAboveOrUnderStemLine from '#repertoire/drawer/elements/articulation/articulationShouldBeAboveOrUnderStemLine.js'
import group from '#repertoire/drawer/elements/basic/group.js'
import moveElement from '#repertoire/drawer/elements/basic/moveElement.js'
import moveElementInTheCenterBetweenPoints from '#repertoire/drawer/elements/basic/moveElementInTheCenterBetweenPoints.js'
import moveElementAbovePointWithInterval from '#repertoire/drawer/elements/basic/moveElementAbovePointWithInterval.js'
import articulationKeysInVerticalLine from '#repertoire/drawer/elements/articulation/articulationKeysInVerticalLine.js'

export default function (drawnSingleUnit, articulationIndex, currentArticulationParams, topOfCurrentStave, bottomOfCurrentStave, styles) {
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
