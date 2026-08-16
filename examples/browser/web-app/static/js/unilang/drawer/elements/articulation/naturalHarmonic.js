'use strict'

import path from '#unilang/drawer/elements/basic/path.js'
import articulationShouldBeAboveOrUnderStemLine from '#unilang/drawer/elements/articulation/articulationShouldBeAboveOrUnderStemLine.js'
import moveElementAbovePointWithInterval from '#unilang/drawer/elements/basic/moveElementAbovePointWithInterval.js'
import moveElementBelowPointWithInterval from '#unilang/drawer/elements/basic/moveElementBelowPointWithInterval.js'
import moveElementInTheCenterBetweenPoints from '#unilang/drawer/elements/basic/moveElementInTheCenterBetweenPoints.js'

export default function (drawnSingleUnit, articulationIndex, currentArticulationParams, topOfCurrentStave, bottomOfCurrentStave, styles) {
  const { naturalHarmonic, fontColor } = styles
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
  const naturalHarmonicSymbol = path(
    naturalHarmonic.points,
    null,
    fontColor,
    0,
    startYPosition
  )
  if (direction === 'up') {
    moveElementAbovePointWithInterval(
      naturalHarmonicSymbol,
      startYPosition,
      naturalHarmonic.yOffset
    )
  } else {
    moveElementBelowPointWithInterval(
      naturalHarmonicSymbol,
      startYPosition,
      naturalHarmonic.yOffset
    )
  }
  if (shouldBeAboveOrUnderStemLine) {
    moveElementInTheCenterBetweenPoints(
      naturalHarmonicSymbol,
      drawnSingleUnit.stemLeft,
      drawnSingleUnit.stemRight
    )
  } else {
    moveElementInTheCenterBetweenPoints(
      naturalHarmonicSymbol,
      leftEdge,
      rightEdge
    )
  }
  return naturalHarmonicSymbol
}
