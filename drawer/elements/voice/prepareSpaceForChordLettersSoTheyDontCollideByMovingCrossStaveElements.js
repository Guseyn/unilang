'use strict'

import chordLetterText from './../chord-letter/chordLetterText.js'
import moveElement from './../basic/moveElement.js'
import moveCrossStaveElementsThatAttachedToCrossStaveUnit from './moveCrossStaveElementsThatAttachedToCrossStaveUnit.js'

export default function (
  chordLetterElementsOnPageLineToPrepareSpaceBeforeDrawingThem,
  drawnVoices,
  styles
) {
  const { minXDistanceBetweenChordLetters } = styles
  const {
    drawnMidMeasureClefsForCrossStaveUnits,
    drawnMidMeasureKeySignaturesForCrossStaveUnits,
    drawnBreathMarksBeforeCrossStaveUnits,
    drawnOnlyNoteLettersBeforeApreggiatedWavesForCrossStaveUnits,
    drawnArpeggiatedWavesForCrossStaveUnits,
    drawnKeysForCrossStaveUnits,
    drawnCrossStaveUnits
  } = drawnVoices
  for (let crossStaveUnitIndex = 0; crossStaveUnitIndex < drawnCrossStaveUnits.length; crossStaveUnitIndex++) {
    const currentCrossStaveUnit = drawnCrossStaveUnits[crossStaveUnitIndex]
    const relatedChordLetter = currentCrossStaveUnit.chordLetter
    const prevChordLetterOnPageLine = chordLetterElementsOnPageLineToPrepareSpaceBeforeDrawingThem[chordLetterElementsOnPageLineToPrepareSpaceBeforeDrawingThem.length - 1]
    if (relatedChordLetter) {
      if (relatedChordLetter.textValue) {
        const drawnChordLetterText = chordLetterText(relatedChordLetter.textValue)(styles, currentCrossStaveUnit.left, 0)
        if (prevChordLetterOnPageLine) {
          if ((drawnChordLetterText.left - prevChordLetterOnPageLine.right) < minXDistanceBetweenChordLetters) {
            const xDistanceToMove = prevChordLetterOnPageLine.right - drawnChordLetterText.left + minXDistanceBetweenChordLetters
            moveElement(drawnChordLetterText, xDistanceToMove)
            for (let crossStaveUnitIndexAfter = crossStaveUnitIndex; crossStaveUnitIndexAfter < drawnCrossStaveUnits.length; crossStaveUnitIndexAfter++) {
              moveCrossStaveElementsThatAttachedToCrossStaveUnit(
                drawnMidMeasureClefsForCrossStaveUnits[crossStaveUnitIndexAfter],
                drawnMidMeasureKeySignaturesForCrossStaveUnits[crossStaveUnitIndexAfter],
                drawnBreathMarksBeforeCrossStaveUnits[crossStaveUnitIndexAfter],
                drawnOnlyNoteLettersBeforeApreggiatedWavesForCrossStaveUnits[crossStaveUnitIndexAfter],
                drawnArpeggiatedWavesForCrossStaveUnits[crossStaveUnitIndexAfter],
                drawnKeysForCrossStaveUnits[crossStaveUnitIndexAfter],
                drawnCrossStaveUnits[crossStaveUnitIndexAfter],
                xDistanceToMove
              )
            }
            drawnVoices.voicesBody.right += xDistanceToMove
            drawnVoices.right += xDistanceToMove
          }
        }
        chordLetterElementsOnPageLineToPrepareSpaceBeforeDrawingThem.push(drawnChordLetterText)
      }
    }
  }
}
