'use strict'

import moveCrossStaveElementsThatAttachedToCrossStaveUnit from './moveCrossStaveElementsThatAttachedToCrossStaveUnit.js'
import updateSingleUnitPartsCoordinates from './../unit/updateSingleUnitPartsCoordinates.js'
import moveElement from './../basic/moveElement.js'
import moveVoicesBodyHorizontally from './moveVoicesBodyHorizontally.js'

export default function (drawnVoices, drawnStavesPiece, containsAtLeastOneVoiceWithMoreThanOneUnit) {
  const {
    voicesBody,
    drawnSingleUnitsInVoices,
    drawnCrossStaveUnits,
    drawnKeysForCrossStaveUnits,
    drawnArpeggiatedWavesForCrossStaveUnits,
    drawnOnlyNoteLettersBeforeApreggiatedWavesForCrossStaveUnits,
    drawnBreathMarksBeforeCrossStaveUnits,
    drawnMidMeasureClefsForCrossStaveUnits,
    drawnMidMeasureKeySignaturesForCrossStaveUnits,
    containsCollidedVoices,
    containsDrawnCrossStaveElementsBesideCrossStaveUnits,
    containsFullMeasureUnitsThatShouldBeCentralized
  } = drawnVoices
  const xCenterOfDrawnStavePiece = (drawnStavesPiece.left + drawnStavesPiece.right) / 2
  const xCenterOfVoices = (drawnVoices.left + drawnVoices.right) / 2
  const xCenterOfTheOnlyCrossStaveUnit = (drawnCrossStaveUnits[0].left + drawnCrossStaveUnits[0].right) / 2
  const voicesBodyWithOnlyOneCrossStaveUnit = !containsAtLeastOneVoiceWithMoreThanOneUnit
  if (
    (containsCollidedVoices || containsDrawnCrossStaveElementsBesideCrossStaveUnits) &&
      voicesBodyWithOnlyOneCrossStaveUnit &&
      containsFullMeasureUnitsThatShouldBeCentralized
  ) {
    const xDistanceToMove = xCenterOfDrawnStavePiece - xCenterOfTheOnlyCrossStaveUnit
    moveCrossStaveElementsThatAttachedToCrossStaveUnit(
      drawnMidMeasureClefsForCrossStaveUnits[0],
      drawnMidMeasureKeySignaturesForCrossStaveUnits[0],
      drawnBreathMarksBeforeCrossStaveUnits[0],
      drawnOnlyNoteLettersBeforeApreggiatedWavesForCrossStaveUnits[0],
      drawnArpeggiatedWavesForCrossStaveUnits[0],
      drawnKeysForCrossStaveUnits[0],
      drawnCrossStaveUnits[0],
      xDistanceToMove
    )
  } else {
    const singleUnitsToCentralize = []
    for (let staveIndex = 0; staveIndex < drawnSingleUnitsInVoices.length; staveIndex++) {
      if (drawnSingleUnitsInVoices[staveIndex]) {
        for (let voiceIndex = 0; voiceIndex < drawnSingleUnitsInVoices[staveIndex].length; voiceIndex++) {
          if (drawnSingleUnitsInVoices[staveIndex][voiceIndex]) {
            const singleUnitPotentiallyToMove = drawnSingleUnitsInVoices[staveIndex][voiceIndex][0]
            if (
              containsCollidedVoices
              /*
                ||
                (
                  containsDrawnCrossStaveElementsBesideCrossStaveUnits &&
                  !singleUnitPotentiallyToMove.isOnlyUnitOnStaveWithoutMidMeasureElementsOrLyricsOrChordLettersOrSimilesOnThatStave
                )
              */
            ) {
              singleUnitPotentiallyToMove.isFullMeasureAndShouldBeCentralizedBecauseOfThat = false
              drawnVoices.containsFullMeasureUnitsThatShouldBeCentralized = false
            }
            if (singleUnitPotentiallyToMove.isFullMeasureAndShouldBeCentralizedBecauseOfThat) {
              singleUnitsToCentralize.push(
                singleUnitPotentiallyToMove
              )
            }
          }
        }
      }
    }
    if (singleUnitsToCentralize.length > 0) {
      const xDistanceToMove = xCenterOfDrawnStavePiece - xCenterOfVoices
      moveVoicesBodyHorizontally(voicesBody, drawnSingleUnitsInVoices, xDistanceToMove, false)
      for (let singleUnitIndex = 0; singleUnitIndex < singleUnitsToCentralize.length; singleUnitIndex++) {
        const xCenterOfSingleUnit = (singleUnitsToCentralize[singleUnitIndex].left + singleUnitsToCentralize[singleUnitIndex].right) / 2
        const xDistanceToMove = xCenterOfDrawnStavePiece - xCenterOfSingleUnit
        moveElement(singleUnitsToCentralize[singleUnitIndex], xDistanceToMove)
        updateSingleUnitPartsCoordinates(singleUnitsToCentralize[singleUnitIndex], xDistanceToMove)
      }
    }
  }
}
