'use strict'

const spaceAfterCrossStaveUnitByMinUnitDurationOnPageLineAndItsMinDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit = require('./spaceAfterCrossStaveUnitByMinUnitDurationOnPageLineAndItsMinDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit')
const allNotesInSingleUnitParamsAreOnNextStave = require('./allNotesInSingleUnitParamsAreOnNextStave')
const allNotesInSingleUnitParamsAreOnPrevStave = require('./allNotesInSingleUnitParamsAreOnPrevStave')
const moveElement = require('./../basic/moveElement')
const scaleElementAroundPoint = require('./../basic/scaleElementAroundPoint')
const group = require('./../basic/group')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')
const clefShape = require('./../clef/clefShape')

const MID_MEASURE_CLEF_SCALE = 2 / 3

module.exports = (selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit, numberOfStaves, clefNamesAuraByStaveIndexes, drawnCrossStaveUnits, minUnitDurationOnPageLine, compressUnitsByNTimes, stretchUnitsByNTimes, styles, leftOffset, topOffsetsForEachStave, containsDrawnCrossStaveElementsBesideCrossStaveUnits) => {
  const { clefShapeNameByClefName, yCorrectionsForMidMeasureClefs, leftOffsetOfFirstCrossStaveUnit } = styles
  const clefNames = []
  const drawnClefs = []
  let isFollowedByMidMeasureSpecifiedKeySignature = false
  let singleUnitParamsWhereClefBeforeApplies
  const staveIndexesWhereWeHaveSingleUnitsInNextCrossStaveUnit = {}
  for (let singleUnitParamsIndex = 0; singleUnitParamsIndex < selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit.length; singleUnitParamsIndex++) {
    const currentSingleUnitParams = selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit[singleUnitParamsIndex]
    if (currentSingleUnitParams.containsNotesOnCurrentStave) {
      staveIndexesWhereWeHaveSingleUnitsInNextCrossStaveUnit[currentSingleUnitParams.staveIndex] = true
    }
    if (currentSingleUnitParams.containsNotesOnPrevStave) {
      staveIndexesWhereWeHaveSingleUnitsInNextCrossStaveUnit[currentSingleUnitParams.staveIndex - 1] = true
    }
    if (currentSingleUnitParams.containsNotesOnNextStave) {
      staveIndexesWhereWeHaveSingleUnitsInNextCrossStaveUnit[currentSingleUnitParams.staveIndex + 1] = true
    }
    if (currentSingleUnitParams.clefBefore) {
      let staveIndexOfCurrentSingleUnitParamsConsideringItsNotesStavePositions = currentSingleUnitParams.staveIndex
      const areAllNotesInSingleUnitParamsAreOnNextStave = allNotesInSingleUnitParamsAreOnNextStave(currentSingleUnitParams)
      const areAllNotesInSingleUnitParamsAreOnPrevStave = allNotesInSingleUnitParamsAreOnPrevStave(currentSingleUnitParams)
      if (areAllNotesInSingleUnitParamsAreOnNextStave) {
        staveIndexOfCurrentSingleUnitParamsConsideringItsNotesStavePositions += 1
      } else if (areAllNotesInSingleUnitParamsAreOnPrevStave) {
        staveIndexOfCurrentSingleUnitParamsConsideringItsNotesStavePositions -= 1
      }
      if (!clefNames[staveIndexOfCurrentSingleUnitParamsConsideringItsNotesStavePositions]) {
        clefNames[staveIndexOfCurrentSingleUnitParamsConsideringItsNotesStavePositions] = currentSingleUnitParams.clefBefore
        clefNamesAuraByStaveIndexes[staveIndexOfCurrentSingleUnitParamsConsideringItsNotesStavePositions] = currentSingleUnitParams.clefBefore
        singleUnitParamsWhereClefBeforeApplies = currentSingleUnitParams
      }
      if (currentSingleUnitParams.keySignatureBefore && !isFollowedByMidMeasureSpecifiedKeySignature) {
        isFollowedByMidMeasureSpecifiedKeySignature = true
      }
    }
  }
  if (isFollowedByMidMeasureSpecifiedKeySignature) {
    for (let staveIndex = 0; staveIndex < numberOfStaves; staveIndex++) {
      if (!clefNames[staveIndex]) {
        clefNames[staveIndex] = clefNamesAuraByStaveIndexes[staveIndex]
      }
    }
  }
  let rightOfLastCrossStaveUnitBodyConsideringStavesThatContainNotesForLastAndCurrentCrossStaveUnits
  let rightOfLastCrossStaveUnitBodyConsideringAllStaves
  if (drawnCrossStaveUnits[drawnCrossStaveUnits.length - 1]) {
    const allSingleUnitsInLastCrossStaveUnit = drawnCrossStaveUnits[drawnCrossStaveUnits.length - 1].singleUnitsByStaveIndexes.flat()
    for (let singleUnitIndex = 0; singleUnitIndex < allSingleUnitsInLastCrossStaveUnit.length; singleUnitIndex++) {
      const rightPointOfSingleUnitBody = allSingleUnitsInLastCrossStaveUnit[singleUnitIndex].parenthesesRight || allSingleUnitsInLastCrossStaveUnit[singleUnitIndex].dotsRight || allSingleUnitsInLastCrossStaveUnit[singleUnitIndex].bodyRight
      if (rightOfLastCrossStaveUnitBodyConsideringStavesThatContainNotesForLastAndCurrentCrossStaveUnits === undefined || rightOfLastCrossStaveUnitBodyConsideringStavesThatContainNotesForLastAndCurrentCrossStaveUnits < rightPointOfSingleUnitBody) {
        if (
          (staveIndexesWhereWeHaveSingleUnitsInNextCrossStaveUnit[allSingleUnitsInLastCrossStaveUnit[singleUnitIndex].staveIndex] && allSingleUnitsInLastCrossStaveUnit[singleUnitIndex].containsNotesOnCurrentStave) ||
          (staveIndexesWhereWeHaveSingleUnitsInNextCrossStaveUnit[allSingleUnitsInLastCrossStaveUnit[singleUnitIndex].staveIndex - 1] && allSingleUnitsInLastCrossStaveUnit[singleUnitIndex].containsNotesOnPrevStave) ||
          (staveIndexesWhereWeHaveSingleUnitsInNextCrossStaveUnit[allSingleUnitsInLastCrossStaveUnit[singleUnitIndex].staveIndex + 1] && allSingleUnitsInLastCrossStaveUnit[singleUnitIndex].containsNotesOnNextStave)
        ) {
          rightOfLastCrossStaveUnitBodyConsideringStavesThatContainNotesForLastAndCurrentCrossStaveUnits = rightPointOfSingleUnitBody
        }
        rightOfLastCrossStaveUnitBodyConsideringAllStaves = rightPointOfSingleUnitBody
      }
    }
    if (rightOfLastCrossStaveUnitBodyConsideringStavesThatContainNotesForLastAndCurrentCrossStaveUnits === undefined) {
      rightOfLastCrossStaveUnitBodyConsideringStavesThatContainNotesForLastAndCurrentCrossStaveUnits = rightOfLastCrossStaveUnitBodyConsideringAllStaves
    }
    drawnCrossStaveUnits[drawnCrossStaveUnits.length - 1].rightPositionConsideringParenthesesAndDotsAndConsideringStavesThatContainNotesForNextCrossStaveUnit = rightOfLastCrossStaveUnitBodyConsideringStavesThatContainNotesForLastAndCurrentCrossStaveUnits
  }
  const startXPositionOfClefs = (drawnCrossStaveUnits.length === 0)
    ? leftOffset + leftOffsetOfFirstCrossStaveUnit
    : rightOfLastCrossStaveUnitBodyConsideringStavesThatContainNotesForLastAndCurrentCrossStaveUnits +
      spaceAfterCrossStaveUnitByMinUnitDurationOnPageLineAndItsMinDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit(drawnCrossStaveUnits[drawnCrossStaveUnits.length - 1], minUnitDurationOnPageLine, compressUnitsByNTimes, stretchUnitsByNTimes, styles)
  if (clefNames.length === 0) {
    return {
      isEmpty: true,
      name: 'g',
      properties: {
        'data-name': 'midMeasureClefsForCurrentCrossStaveUnit'
      },
      transformations: [],
      top: topOffsetsForEachStave[0],
      right: startXPositionOfClefs,
      bottom: topOffsetsForEachStave[topOffsetsForEachStave.length - 1],
      left: startXPositionOfClefs
    }
  }
  containsDrawnCrossStaveElementsBesideCrossStaveUnits.value = true
  let maxClefWidth = 0
  for (let staveIndex = 0; staveIndex < clefNames.length; staveIndex++) {
    if (styles[clefShapeNameByClefName[clefNames[staveIndex]]]) {
      const drawnClef = clefShape(clefShapeNameByClefName[clefNames[staveIndex]])(styles, startXPositionOfClefs, topOffsetsForEachStave[staveIndex])
      scaleElementAroundPoint(
        drawnClef,
        MID_MEASURE_CLEF_SCALE,
        MID_MEASURE_CLEF_SCALE,
        {
          x: drawnClef.left,
          y: drawnClef.top
        }
      )
      moveElement(
        drawnClef,
        0,
        yCorrectionsForMidMeasureClefs[clefNames[staveIndex]]
      )
      const drawnClefWidth = drawnClef.right - drawnClef.left
      drawnClefs.push(drawnClef)
      addPropertiesToElement(
        drawnClef,
        {
          'ref-ids': `clef-before-${singleUnitParamsWhereClefBeforeApplies.measureIndexInGeneral + 1}-${singleUnitParamsWhereClefBeforeApplies.staveIndex + 1}-${singleUnitParamsWhereClefBeforeApplies.voiceIndex + 1}-${singleUnitParamsWhereClefBeforeApplies.singleUnitIndex + 1}`
        }
      )
      if (maxClefWidth < drawnClefWidth) {
        maxClefWidth = drawnClefWidth
      }
    }
  }
  const centerOfClefWithMaxWidth = (startXPositionOfClefs + (startXPositionOfClefs + maxClefWidth)) / 2
  drawnClefs.forEach(drawnClef => {
    const drawnClefCenter = (drawnClef.right + drawnClef.left) / 2
    moveElement(drawnClef, centerOfClefWithMaxWidth - drawnClefCenter)
  })
  return group(
    'midMeasureClefsForCurrentCrossStaveUnit',
    drawnClefs
  )
}
