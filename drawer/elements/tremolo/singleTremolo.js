'use strict'

const calculatedNumberOfBeamLinesByDuration = require('./../beam/calculatedNumberOfBeamLinesByDuration')
const path = require('./../basic/path')
const group = require('./../basic/group')

module.exports = (singleUnit, styles) => {
  const pointsOfTremoloStrokes = []
  const { yDistanceBetweenSingleTremoloStrokes, singleTremoloStrokeNormalWidth, singleTremoloStrokeWithFlagsNormalWidth, tremoloStrokeLineAngleHeight, tremoloStrokeOptions, singleTremoloStrokesYStartOffsetFromStemEdgeInBeamedSingleUnits, singleTremoloStrokesStartOffsetFromBody, singleTremoloStrokesYStartOffsetFromSingleUnitBodyWithTopFlags, singleTremoloStrokesYStartOffsetFromSingleUnitBodyWithOneTopFlag, singleTremoloStrokesYStartOffsetFromSingleUnitBodyWithBottomFlags, singleTremoloStrokesYStartOffsetFromSingleUnitBodyWithOneBottomFlag, intervalBetweenBarLines, singleTremoloStrokeNormalVerticalWidth, noteSquareStemStrokeOptions, noteBeamStrokeOptions, graceElementsScaleFactor } = styles
  const graceFactor = singleUnit.isGrace ? graceElementsScaleFactor : 1
  if (singleUnit.numberOfTremoloStrokes > 0 && singleUnit.tremoloDurationFactor === 1) {
    const xCenterOfStrokes = singleUnit.stemless
      ? (singleUnit.bodyLeft + singleUnit.bodyRight) / 2
      : singleUnit.stemLeft
    const numberOfBeamLinesInCaseIfTheyAreDrawn = calculatedNumberOfBeamLinesByDuration(singleUnit.unitDuration)
    const stemWidth = noteSquareStemStrokeOptions.width
    const beamLineHeightNormal = Math.sqrt(Math.pow(singleTremoloStrokeNormalVerticalWidth, 2) - Math.pow(stemWidth, 2))
    const yStartOfSingleTremoloStrokes = (singleUnit.beamedWithNext || singleUnit.beamedWithPrevious)
      ? singleUnit.stemDirection === 'up'
        ? (singleUnit.stemTop + (singleTremoloStrokesYStartOffsetFromStemEdgeInBeamedSingleUnits + numberOfBeamLinesInCaseIfTheyAreDrawn * beamLineHeightNormal + numberOfBeamLinesInCaseIfTheyAreDrawn * intervalBetweenBarLines + numberOfBeamLinesInCaseIfTheyAreDrawn * noteBeamStrokeOptions.width) * graceFactor)
        : (singleUnit.stemBottom - (singleTremoloStrokesYStartOffsetFromStemEdgeInBeamedSingleUnits + numberOfBeamLinesInCaseIfTheyAreDrawn * beamLineHeightNormal + numberOfBeamLinesInCaseIfTheyAreDrawn * intervalBetweenBarLines + numberOfBeamLinesInCaseIfTheyAreDrawn * noteBeamStrokeOptions.width) * graceFactor)
      : singleUnit.stemDirection === 'up'
        ? singleUnit.withFlags
          ? (singleUnit.numberOfTremoloStrokes === 1)
            ? singleUnit.bodyTop - singleTremoloStrokesYStartOffsetFromSingleUnitBodyWithOneTopFlag * graceFactor
            : singleUnit.bodyTop - singleTremoloStrokesYStartOffsetFromSingleUnitBodyWithTopFlags * graceFactor
          : singleUnit.bodyTop - singleTremoloStrokesStartOffsetFromBody * graceFactor
        : singleUnit.withFlags
          ? (singleUnit.numberOfTremoloStrokes === 1)
            ? singleUnit.bodyBottom + (singleTremoloStrokesYStartOffsetFromSingleUnitBodyWithOneBottomFlag + beamLineHeightNormal) * graceFactor
            : singleUnit.bodyBottom + (singleTremoloStrokesYStartOffsetFromSingleUnitBodyWithBottomFlags + beamLineHeightNormal) * graceFactor
          : singleUnit.bodyBottom + (singleTremoloStrokesStartOffsetFromBody + beamLineHeightNormal) * graceFactor
    const tremoloYDirectionSing = (singleUnit.beamedWithNext || singleUnit.beamedWithPrevious)
      ? singleUnit.stemDirection === 'up' ? +1 : -1
      : singleUnit.stemDirection === 'up' ? -1 : +1
    for (let strokeIndex = 0; strokeIndex < singleUnit.numberOfTremoloStrokes; strokeIndex++) {
      const yLeftStart = yStartOfSingleTremoloStrokes + strokeIndex * tremoloYDirectionSing * (beamLineHeightNormal + yDistanceBetweenSingleTremoloStrokes) * graceFactor
      const yLeftEnd = yStartOfSingleTremoloStrokes + strokeIndex * tremoloYDirectionSing * (beamLineHeightNormal + yDistanceBetweenSingleTremoloStrokes) * graceFactor + tremoloYDirectionSing * beamLineHeightNormal * graceFactor
      const yRightStart = yLeftStart - tremoloStrokeLineAngleHeight * graceFactor
      const yRightEnd = yLeftEnd - tremoloStrokeLineAngleHeight * graceFactor
      const singleTremoloStrokeNormalWidthConsideringFlags = singleUnit.withFlags
        ? singleTremoloStrokeWithFlagsNormalWidth
        : singleTremoloStrokeNormalWidth
      pointsOfTremoloStrokes.push(
        'M',
        xCenterOfStrokes - singleTremoloStrokeNormalWidthConsideringFlags * graceFactor / 2,
        yLeftStart,
        'L',
        xCenterOfStrokes - singleTremoloStrokeNormalWidthConsideringFlags * graceFactor / 2,
        yLeftEnd,
        'L',
        xCenterOfStrokes + singleTremoloStrokeNormalWidthConsideringFlags * graceFactor / 2,
        yRightEnd,
        'L',
        xCenterOfStrokes + singleTremoloStrokeNormalWidthConsideringFlags * graceFactor / 2,
        yRightStart
      )
    }
  }
  if (pointsOfTremoloStrokes.length === 0) {
    return null
  }
  return group(
    'singleTremoloStrokes',
    [
      path(pointsOfTremoloStrokes, tremoloStrokeOptions)
    ]
  )
}
