'use strict'

import path from '/js/unilang-worker/drawer/elements/basic/path.js'
import articulationShouldBeAboveOrUnderStemLine from '/js/unilang-worker/drawer/elements/articulation/articulationShouldBeAboveOrUnderStemLine.js'
import group from '/js/unilang-worker/drawer/elements/basic/group.js'
import moveElement from '/js/unilang-worker/drawer/elements/basic/moveElement.js'
import moveElementInTheCenterBetweenPoints from '/js/unilang-worker/drawer/elements/basic/moveElementInTheCenterBetweenPoints.js'
import moveElementAbovePointWithInterval from '/js/unilang-worker/drawer/elements/basic/moveElementAbovePointWithInterval.js'
import articulationKeysInVerticalLine from '/js/unilang-worker/drawer/elements/articulation/articulationKeysInVerticalLine.js'

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
