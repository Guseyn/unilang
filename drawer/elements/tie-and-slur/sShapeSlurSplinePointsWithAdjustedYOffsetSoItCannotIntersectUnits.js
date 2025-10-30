'use strict'

const stretchedSlurSplineSoItCannotIntersectItsSingleUnitsExceptMaybeSomeUnitAtTheStartAndAtTheEndToAvoidBigStretching = require('./stretchedSlurSplineSoItCannotIntersectItsSingleUnitsExceptMaybeSomeUnitAtTheStartAndAtTheEndToAvoidBigStretching')
const twoIntersectionPointsInFirstAndSecondHalfsOfSlurWhereSlurCreatesBiggestGapsWithSingleUnitTopOrBottomPositionsInEachHalfRespectivelyDependingOnSlurDirection = require('./twoIntersectionPointsInFirstAndSecondHalfsOfSlurWhereSlurCreatesBiggestGapsWithSingleUnitTopOrBottomPositionsInEachHalfRespectivelyDependingOnSlurDirection')

module.exports = (slurSplinePoints, intersectionPointsOfSlurWithItsSingleUnits, yOffset, isSlurFirstPart, isSlurLastPart, slurDirection, extendedFromLeftSide, extendedToRightSide, leftYCorrection, rightYCorrection, styles) => {
  const slurSplinePointsCopy = slurSplinePoints.slice()
  if (!isSlurFirstPart) {
    slurSplinePointsCopy[2] += yOffset
    slurSplinePointsCopy[5] += yOffset
    slurSplinePointsCopy[7] += yOffset
    slurSplinePointsCopy[9] += yOffset
    if (!isSlurLastPart) {
      slurSplinePointsCopy[12] += yOffset
    }
  }
  if (!isSlurLastPart) {
    if (!isSlurFirstPart) {
      slurSplinePointsCopy[14] += yOffset
    }
    slurSplinePointsCopy[16] += yOffset
    slurSplinePointsCopy[19] += yOffset
    slurSplinePointsCopy[21] += yOffset
    slurSplinePointsCopy[23] += yOffset
  }
  if (isSlurFirstPart || isSlurLastPart) {
    const calculatedTwoIntersectionPointsInFirstAndSecondHalfsOfSlurWhereSlurCreatesBiggestGapsWithSingleUnitTopOrBottomPositionsInEachHalfRespectivelyDependingOnSlurDirection = twoIntersectionPointsInFirstAndSecondHalfsOfSlurWhereSlurCreatesBiggestGapsWithSingleUnitTopOrBottomPositionsInEachHalfRespectivelyDependingOnSlurDirection(
      slurSplinePointsCopy,
      intersectionPointsOfSlurWithItsSingleUnits,
      extendedFromLeftSide,
      extendedToRightSide,
      slurDirection
    )
    const stretchedSlurSpline = stretchedSlurSplineSoItCannotIntersectItsSingleUnitsExceptMaybeSomeUnitAtTheStartAndAtTheEndToAvoidBigStretching(slurSplinePointsCopy, calculatedTwoIntersectionPointsInFirstAndSecondHalfsOfSlurWhereSlurCreatesBiggestGapsWithSingleUnitTopOrBottomPositionsInEachHalfRespectivelyDependingOnSlurDirection, slurDirection, styles)
    slurSplinePointsCopy[12] = stretchedSlurSpline[12]
    slurSplinePointsCopy[14] = stretchedSlurSpline[14]
  }
  leftYCorrection = (leftYCorrection || 0) * styles.intervalBetweenStaveLines
  rightYCorrection = (rightYCorrection || 0) * styles.intervalBetweenStaveLines
  if (isSlurFirstPart) {
    slurSplinePointsCopy[2] += leftYCorrection
    slurSplinePointsCopy[5] += leftYCorrection
    slurSplinePointsCopy[7] += leftYCorrection
    slurSplinePointsCopy[9] += leftYCorrection
    slurSplinePointsCopy[12] += leftYCorrection
  }
  if (isSlurLastPart) {
    slurSplinePointsCopy[14] += rightYCorrection
    slurSplinePointsCopy[16] += rightYCorrection
    slurSplinePointsCopy[19] += rightYCorrection
    slurSplinePointsCopy[21] += rightYCorrection
    slurSplinePointsCopy[23] += rightYCorrection
  }
  return slurSplinePointsCopy
}
