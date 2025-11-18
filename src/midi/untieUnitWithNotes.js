'use strict'

export default function (unitParams) {
  unitParams.tiedWithNext = undefined
  unitParams.tiedAfter = undefined
  unitParams.tiedAfterMeasure = undefined
  unitParams.tiedBefore = undefined
  unitParams.tiedBeforeMeasure = undefined
  for (let noteIndex = 0; noteIndex < unitParams.notes.length; noteIndex++) {
    const note = unitParams.notes[noteIndex]
    note.unitIsTiedWithNext = undefined
    note.unitIsTiedAfter = undefined
    note.unitIsTiedAfterMeasure = undefined
    note.unitIsTiedBefore = undefined
    note.unitIsTiedBeforeMeasure = undefined
    note.unitIsTiedFromLeftSide = undefined
    note.unitIsTiedFromRightSide = undefined
  }
}
