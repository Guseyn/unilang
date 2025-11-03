'use strict'

import allNotesInSingleUnitParamsAreOnNextStave from './allNotesInSingleUnitParamsAreOnNextStave.js'
import allNotesInSingleUnitParamsAreOnPrevStave from './allNotesInSingleUnitParamsAreOnPrevStave.js'
import keySignaturesOnStaves from './../key/keySignaturesOnStaves.js'

export default function (selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit, drawnMidMeasureClefsForCrossStaveUnits, numberOfStaves, numberOfStaveLines, clefNamesAuraByStaveIndexes, styles, leftOffset, topOffsetsForEachStave, containsDrawnCrossStaveElementsBesideCrossStaveUnits) {
  const { spaceAfterMidMeasureClefsForMidMeasureKeySignatures } = styles
  const clefNames = []
  let keySignatureName
  let singleUnitParamsWhereKeySignatureBeforeApplies
  for (let singleUnitParamsIndex = 0; singleUnitParamsIndex < selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit.length; singleUnitParamsIndex++) {
    const currentSingleUnitParams = selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit[singleUnitParamsIndex]
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
      }
      if (currentSingleUnitParams.keySignatureBefore && !keySignatureName) {
        keySignatureName = currentSingleUnitParams.keySignatureBefore
        singleUnitParamsWhereKeySignatureBeforeApplies = currentSingleUnitParams
      }
    }
  }
  if (keySignatureName) {
    for (let staveIndex = 0; staveIndex < numberOfStaves; staveIndex++) {
      if (!clefNames[staveIndex]) {
        clefNames[staveIndex] = clefNamesAuraByStaveIndexes[staveIndex]
      }
    }
  }
  const startXPositionOfClefs = drawnMidMeasureClefsForCrossStaveUnits[drawnMidMeasureClefsForCrossStaveUnits.length - 1].right + (
    drawnMidMeasureClefsForCrossStaveUnits[drawnMidMeasureClefsForCrossStaveUnits.length - 1].isEmpty
      ? 0
      : spaceAfterMidMeasureClefsForMidMeasureKeySignatures
  )
  if (!keySignatureName) {
    return {
      isEmpty: true,
      name: 'g',
      properties: {
        'data-name': 'keySignaturesOnStaves'
      },
      transformations: [],
      top: topOffsetsForEachStave[0],
      right: startXPositionOfClefs,
      bottom: topOffsetsForEachStave[topOffsetsForEachStave.length - 1],
      left: startXPositionOfClefs
    }
  }
  containsDrawnCrossStaveElementsBesideCrossStaveUnits.value = true
  const {
    measureIndexInGeneral,
    staveIndex,
    voiceIndex,
    singleUnitIndex
  } = singleUnitParamsWhereKeySignatureBeforeApplies
  return keySignaturesOnStaves(numberOfStaveLines, clefNames, keySignatureName, undefined, measureIndexInGeneral, staveIndex, voiceIndex, singleUnitIndex)(styles, startXPositionOfClefs, topOffsetsForEachStave[0])
}
