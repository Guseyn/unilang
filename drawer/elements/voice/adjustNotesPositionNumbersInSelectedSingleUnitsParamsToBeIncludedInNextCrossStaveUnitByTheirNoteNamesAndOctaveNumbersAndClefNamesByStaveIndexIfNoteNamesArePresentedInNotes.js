'use strict'

import notePositionNumber from './../note/notePositionNumber.js'

export default function (selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit, clefNamesAuraByStaveIndexes) {
  for (let singleUnitParamsIndex = 0; singleUnitParamsIndex < selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit.length; singleUnitParamsIndex++) {
    const currentSingleUnitParams = selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit[singleUnitParamsIndex]
    for (let noteIndex = 0; noteIndex < currentSingleUnitParams.notes.length; noteIndex++) {
      const noteParams = currentSingleUnitParams.notes[noteIndex]
      noteParams.positionNumber = notePositionNumber(noteParams, clefNamesAuraByStaveIndexes)
    }
    for (let keyIndex = 0; keyIndex < currentSingleUnitParams.keysParams.length; keyIndex++) {
      const keyParams = currentSingleUnitParams.keysParams[keyIndex]
      keyParams.positionNumber = notePositionNumber(keyParams, clefNamesAuraByStaveIndexes)
    }
  }
}
