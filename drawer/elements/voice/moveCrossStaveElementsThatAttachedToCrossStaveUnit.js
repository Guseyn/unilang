'use strict'

const moveElement = require('./../basic/moveElement')
const updateSingleUnitPartsCoordinates = require('./../unit/updateSingleUnitPartsCoordinates')

module.exports = (
  drawnMidMeasureClefsForCrossStaveUnit,
  drawnMidMeasureKeySignaturesForCrossStaveUnit,
  drawnBreathMarksBeforeCrossStaveUnit,
  drawnOnlyNoteLettersBeforeApreggiatedWavesForCrossStaveUnit,
  drawnArpeggiatedWavesForCrossStaveUnit,
  drawnKeysForCrossStaveUnit,
  drawnCrossStaveUnit,
  xDistanceToMove = 0,
  yDistanceToMove = 0
) => {
  moveElement(drawnMidMeasureClefsForCrossStaveUnit, xDistanceToMove, yDistanceToMove)
  moveElement(drawnMidMeasureKeySignaturesForCrossStaveUnit, xDistanceToMove, yDistanceToMove)
  moveElement(drawnBreathMarksBeforeCrossStaveUnit, xDistanceToMove, yDistanceToMove)
  moveElement(drawnOnlyNoteLettersBeforeApreggiatedWavesForCrossStaveUnit, xDistanceToMove, yDistanceToMove)
  moveElement(drawnArpeggiatedWavesForCrossStaveUnit, xDistanceToMove, yDistanceToMove)
  moveElement(drawnKeysForCrossStaveUnit, xDistanceToMove, yDistanceToMove)
  moveElement(drawnCrossStaveUnit, xDistanceToMove, yDistanceToMove)
  const singleUnitsByStaveIndexes = drawnCrossStaveUnit.singleUnitsByStaveIndexes
  for (let staveIndex = 0; staveIndex < singleUnitsByStaveIndexes.length; staveIndex++) {
    for (let singleUnitIndex = 0; singleUnitIndex < singleUnitsByStaveIndexes[staveIndex].length; singleUnitIndex++) {
      const currentSingleUnit = singleUnitsByStaveIndexes[staveIndex][singleUnitIndex]
      updateSingleUnitPartsCoordinates(currentSingleUnit, xDistanceToMove, yDistanceToMove)
    }
  }
}
