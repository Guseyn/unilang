'use strict'

import slurSplinePoints from './slurSplinePoints.js'
import slurJunctionPhantomPoint from './slurJunctionPhantomPoint.js'
import slurRoundCoefficientByXRangeOfSlur from './slurRoundCoefficientByXRangeOfSlur.js'
import intersectionPointsOfSlurWithItsSingleUnits from './intersectionPointsOfSlurWithItsSingleUnits.js'
import twoIntersectionPointsInFirstAndSecondHalfsOfSlurWhereSlurCreatesBiggestGapsWithSingleUnitTopOrBottomPositionsInEachHalfRespectivelyDependingOnSlurDirection from './twoIntersectionPointsInFirstAndSecondHalfsOfSlurWhereSlurCreatesBiggestGapsWithSingleUnitTopOrBottomPositionsInEachHalfRespectivelyDependingOnSlurDirection.js'
import stretchedSlurSplineSoItCannotIntersectItsSingleUnitsExceptMaybeSomeUnitAtTheStartAndAtTheEndToAvoidBigStretching from './stretchedSlurSplineSoItCannotIntersectItsSingleUnitsExceptMaybeSomeUnitAtTheStartAndAtTheEndToAvoidBigStretching.js'
import additionalPathPointsForSlurToMakeItBulk from './additionalPathPointsForSlurToMakeItBulk.js'
import yOffsetForSlurSoThatItCanBeAboveOrUnderAllNotes from './yOffsetForSlurSoThatItCanBeAboveOrUnderAllNotes.js'
import slurSplinePointsWithAdjustedYOffsetSoItCannotIntersectUnits from './slurSplinePointsWithAdjustedYOffsetSoItCannotIntersectUnits.js'

// const circle = require('./../basic/circle')

export default function (markedSlur, slurLeftPoint, slurRightPoint, slurDirection, voicesBody, extendedFromLeftSide, extendedToRightSide, styles) {
  const { intervalBetweenStaveLines, leftMarginForConnectionsThatStartBefore } = styles

  const slurDirectionSign = slurDirection === 'up' ? -1 : +1

  if (extendedFromLeftSide) {
    slurLeftPoint.x = markedSlur.voicesBodyThatSlurStartsBefore.left + leftMarginForConnectionsThatStartBefore
    slurLeftPoint.y += slurDirectionSign * styles.slurYOffsetForItsSidesWhenItBreakingForNextLine
  }
  slurLeftPoint.y += (markedSlur.leftYCorrection || 0) * intervalBetweenStaveLines
  if (extendedToRightSide) {
    slurRightPoint.x = voicesBody.right
    slurRightPoint.y += slurDirectionSign * styles.slurYOffsetForItsSidesWhenItBreakingForNextLine
  }
  slurRightPoint.y += (markedSlur.rightYCorrection || 0) * intervalBetweenStaveLines
  const slurRoundCoefficient = slurRoundCoefficientByXRangeOfSlur(slurRightPoint.x - slurLeftPoint.x, markedSlur.roundCoefficientFactor, styles)
  const slurLeftPhantomPoint = slurJunctionPhantomPoint(slurLeftPoint, 'left', slurDirection, styles)
  const slurRightPhantomPoint = slurJunctionPhantomPoint(slurRightPoint, 'right', slurDirection, styles)
  const calculatedSlurSplinePoints = slurSplinePoints(
    slurLeftPoint,
    slurLeftPhantomPoint,
    slurRightPhantomPoint,
    slurRightPoint,
    slurRoundCoefficient
  )

  const calculatedIntersectionPointsOfSlurWithItsSingleUnits = intersectionPointsOfSlurWithItsSingleUnits(
    markedSlur.allSingleUnitsOnTheWay,
    calculatedSlurSplinePoints,
    slurDirection,
    styles
  )

  /* const circles = []
  for (let index = 0; index < calculatedIntersectionPointsOfSlurWithItsSingleUnits.length; index++) {
    circles.push(
      circle(3, 'red', calculatedIntersectionPointsOfSlurWithItsSingleUnits[index].x, calculatedIntersectionPointsOfSlurWithItsSingleUnits[index].y),
      circle(3, 'blue', calculatedIntersectionPointsOfSlurWithItsSingleUnits[index].singleUnit.left, calculatedIntersectionPointsOfSlurWithItsSingleUnits[index].singleUnit.top),
    )
  }
  voicesBody.elements.push(
    ...circles
  ) */

  const calculatedTwoIntersectionPointsInFirstAndSecondHalfsOfSlurWhereSlurCreatesBiggestGapsWithSingleUnitTopOrBottomPositionsInEachHalfRespectivelyDependingOnSlurDirection = twoIntersectionPointsInFirstAndSecondHalfsOfSlurWhereSlurCreatesBiggestGapsWithSingleUnitTopOrBottomPositionsInEachHalfRespectivelyDependingOnSlurDirection(
    calculatedSlurSplinePoints,
    calculatedIntersectionPointsOfSlurWithItsSingleUnits,
    extendedFromLeftSide,
    extendedToRightSide,
    slurDirection
  )

  /* voicesBody.elements.push(
    circle(3, 'orange', calculatedTwoIntersectionPointsInFirstAndSecondHalfsOfSlurWhereSlurCreatesBiggestGapsWithSingleUnitTopOrBottomPositionsInEachHalfRespectivelyDependingOnSlurDirection.first.x, calculatedTwoIntersectionPointsInFirstAndSecondHalfsOfSlurWhereSlurCreatesBiggestGapsWithSingleUnitTopOrBottomPositionsInEachHalfRespectivelyDependingOnSlurDirection.first.y),
    circle(3, 'orange', calculatedTwoIntersectionPointsInFirstAndSecondHalfsOfSlurWhereSlurCreatesBiggestGapsWithSingleUnitTopOrBottomPositionsInEachHalfRespectivelyDependingOnSlurDirection.second.x, calculatedTwoIntersectionPointsInFirstAndSecondHalfsOfSlurWhereSlurCreatesBiggestGapsWithSingleUnitTopOrBottomPositionsInEachHalfRespectivelyDependingOnSlurDirection.second.y),
  ) */

  const calculatedStrechedSlurSplineSoItCannotIntersectItsSingleUnitsExceptMaybeSomeUnitAtTheStartAndAtTheEndToAvoidBigStretching = stretchedSlurSplineSoItCannotIntersectItsSingleUnitsExceptMaybeSomeUnitAtTheStartAndAtTheEndToAvoidBigStretching(
    calculatedSlurSplinePoints,
    calculatedTwoIntersectionPointsInFirstAndSecondHalfsOfSlurWhereSlurCreatesBiggestGapsWithSingleUnitTopOrBottomPositionsInEachHalfRespectivelyDependingOnSlurDirection,
    slurDirection,
    styles
  )

  const calculatedIntersectionPointsOfStretchedSlurWithItsSingleUnits = intersectionPointsOfSlurWithItsSingleUnits(
    markedSlur.allSingleUnitsOnTheWay,
    calculatedStrechedSlurSplineSoItCannotIntersectItsSingleUnitsExceptMaybeSomeUnitAtTheStartAndAtTheEndToAvoidBigStretching,
    slurDirection,
    styles
  )

  const weGotRightPlacementOrLeftAndRightPointYCorrectionsForSlurWhichMeansThatWeShouldNotAdjustYOffsetOfSlurSinceUserWantsCertainPositionOfRightPointOfSlur = markedSlur.rightPlacement || (markedSlur.leftYCorrection !== undefined) || (markedSlur.rightYCorrection !== undefined)

  const calculatedYOffsetForStretchedSlurSoThatItCanBeAboveOrUnderAllNotes = weGotRightPlacementOrLeftAndRightPointYCorrectionsForSlurWhichMeansThatWeShouldNotAdjustYOffsetOfSlurSinceUserWantsCertainPositionOfRightPointOfSlur
    ? 0
    : yOffsetForSlurSoThatItCanBeAboveOrUnderAllNotes(
      calculatedIntersectionPointsOfStretchedSlurWithItsSingleUnits,
      markedSlur.allSingleUnitsOnTheWay,
      slurDirection,
      styles
    )

  const calculatedStrechedSlurSplineWithYOffsetSoItCannotIntersectItsSingleUnits = weGotRightPlacementOrLeftAndRightPointYCorrectionsForSlurWhichMeansThatWeShouldNotAdjustYOffsetOfSlurSinceUserWantsCertainPositionOfRightPointOfSlur
    ? calculatedStrechedSlurSplineSoItCannotIntersectItsSingleUnitsExceptMaybeSomeUnitAtTheStartAndAtTheEndToAvoidBigStretching
    : slurSplinePointsWithAdjustedYOffsetSoItCannotIntersectUnits(
      calculatedStrechedSlurSplineSoItCannotIntersectItsSingleUnitsExceptMaybeSomeUnitAtTheStartAndAtTheEndToAvoidBigStretching,
      calculatedYOffsetForStretchedSlurSoThatItCanBeAboveOrUnderAllNotes
    )

  const generatedAdditionalPathPointsForSlurToMakeItBulk = additionalPathPointsForSlurToMakeItBulk(
    calculatedStrechedSlurSplineWithYOffsetSoItCannotIntersectItsSingleUnits,
    slurDirection,
    markedSlur.isGrace,
    styles
  )

  for (let slurUnitIndex = 0; slurUnitIndex < markedSlur.allSingleUnitsOnTheWay.length; slurUnitIndex++) {
    if (slurDirection === 'up') {
      markedSlur.allSingleUnitsOnTheWay[slurUnitIndex].top = Math.min(
        markedSlur.allSingleUnitsOnTheWay[slurUnitIndex].top,
        calculatedIntersectionPointsOfStretchedSlurWithItsSingleUnits[slurUnitIndex].y - calculatedYOffsetForStretchedSlurSoThatItCanBeAboveOrUnderAllNotes - styles.distanceBetweenSlurLayers
      )
    } else if (slurDirection === 'down') {
      markedSlur.allSingleUnitsOnTheWay[slurUnitIndex].bottom = Math.max(
        markedSlur.allSingleUnitsOnTheWay[slurUnitIndex].bottom,
        calculatedIntersectionPointsOfStretchedSlurWithItsSingleUnits[slurUnitIndex].y + calculatedYOffsetForStretchedSlurSoThatItCanBeAboveOrUnderAllNotes + styles.distanceBetweenSlurLayers
      )
    }
  }

  return [
    ...calculatedStrechedSlurSplineWithYOffsetSoItCannotIntersectItsSingleUnits,
    ...generatedAdditionalPathPointsForSlurToMakeItBulk
  ]
}
