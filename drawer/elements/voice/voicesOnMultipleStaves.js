'use strict'

const topOffsetForCurrentStave = require('./../stave/topOffsetForCurrentStave')
const countersForEachVoiceLessThanTheirMaxValues = require('./countersForEachVoiceLessThanTheirMaxValues')
const minDurationAmongAccumulatorsForEachVoice = require('./minDurationAmongAccumulatorsForEachVoice')
const releaseDurationsAccumulatorsForEachVoiceWithMinDurationAmongThem = require('./releaseDurationsAccumulatorsForEachVoiceWithMinDurationAmongThem')
const midMeasureClefsForCurrentCrossStaveUnit = require('./midMeasureClefsForCurrentCrossStaveUnit')
const midMeasureKeySignaturesForCurrentCrossStaveUnit = require('./midMeasureKeySignaturesForCurrentCrossStaveUnit')
const breathMarkBeforeCurrentCrossStaveUnit = require('./breathMarkBeforeCurrentCrossStaveUnit')
const arpeggiatedWavesForCurrentCrossStaveUnit = require('./arpeggiatedWavesForCurrentCrossStaveUnit')
const keysForCurrentCrossStaveUnit = require('./keysForCurrentCrossStaveUnit')
const singleUnitsForCurrentCrossStaveUnit = require('./singleUnitsForCurrentCrossStaveUnit')
const crossVoiceUnitsOnAllStavesInCrossStaveUnit = require('./crossVoiceUnitsOnAllStavesInCrossStaveUnit')
const moveVoicesBodyHorizontally = require('./moveVoicesBodyHorizontally')
const singleUnitsParamsToBeIncludedInNextCrossStaveUnit = require('./singleUnitsParamsToBeIncludedInNextCrossStaveUnit')
const chordLetterValueForCurrentCrossStaveUnit = require('./chordLetterValueForCurrentCrossStaveUnit')
const lyricsValueForCurrentCrossStaveUnit = require('./lyricsValueForCurrentCrossStaveUnit')
const xCorrectionValueForCurrentCrossStaveUnit = require('./xCorrectionValueForCurrentCrossStaveUnit')
const adjustNotesPositionNumbersInSelectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnitByTheirNoteNamesAndOctaveNumbersAndClefNamesByStaveIndexIfNoteNamesArePresentedInNotes = require('./adjustNotesPositionNumbersInSelectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnitByTheirNoteNamesAndOctaveNumbersAndClefNamesByStaveIndexIfNoteNamesArePresentedInNotes')
const group = require('./../basic/group')
const elementWithAdditionalInformation = require('./../basic/elementWithAdditionalInformation')
const moveCrossStaveElementsThatAttachedToCrossStaveUnit = require('./moveCrossStaveElementsThatAttachedToCrossStaveUnit')

module.exports = ({
  pageLineNumber,
  measureIndexInGeneral,
  measureIndexOnPageLine,
  numberOfStaveLines,
  compressUnitsByNTimes,
  stretchUnitsByNTimes,
  containsFullMeasureUnitsThatShouldBeCentralized,
  voicesParamsForAllStaves,
  isOnLastMeasureOfPageLine,
  isOnLastMeasureInGeneral,
  minUnitDurationOnPageLine,
  durationsAccumulatorsForEachVoice,
  similesInformationByStaveAndVoiceIndexes,
  clefNamesAuraByStaveIndexes,
  beamingStatusesForEachVoiceOnPageLine,
  affectingTupletValuesByStaveAndVoiceIndexes,
  currentMeasureContainsBreakingConnectionsThatStartBefore,
  currentMeasureContainsBreakingConnectionsThatFinishAfter,
  prevMeasureContainsFermataOverBarline
}) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, intervalBetweenStaves, spaceForBreakingConnectionsThatStartBefore, additionalSpaceForBreakingConnectionsThatStartBeforeCrossStaveUnitWithCrossStaveElementsBefore, spaceForMeasureFermata, minSpaceReservedAfterCrossStaveChordAndBeforeOtherCrossStaveElements, minSpaceReservedAfterCrossStaveChordAndBeforeCrossStaveMidMeasureClefsAndBreathMarks, minSpaceReservedAfterCrossStaveChordAndBeforeOtherCrossStaveElementsForGraceCrossStaveUnit, minSpaceReservedAfterCrossStaveChordAndBeforeArpeggiatedWaves, minSpaceReservedAfterCrossStaveChordAndBeforeArpeggiatedWavesForGraceCrossStaveUnit } = styles
    const numberOfStaves = voicesParamsForAllStaves.length

    if (durationsAccumulatorsForEachVoice.length < numberOfStaves) {
      for (let staveIndex = durationsAccumulatorsForEachVoice.length; staveIndex < numberOfStaves; staveIndex++) {
        durationsAccumulatorsForEachVoice[staveIndex] = []
      }
    } else if (durationsAccumulatorsForEachVoice.length > numberOfStaves) {
      durationsAccumulatorsForEachVoice.splice(numberOfStaves)
    }
    const countersForEachVoice = new Array(numberOfStaves)
    let totalNumberOfVoices = 0
    const topOffsetsForEachStave = []
    for (let staveIndex = 0; staveIndex < numberOfStaves; staveIndex++) {
      totalNumberOfVoices += voicesParamsForAllStaves[staveIndex].length
      if (durationsAccumulatorsForEachVoice[staveIndex].length < voicesParamsForAllStaves[staveIndex].length) {
        for (let voiceIndex = durationsAccumulatorsForEachVoice[staveIndex].length; voiceIndex < voicesParamsForAllStaves[staveIndex].length; voiceIndex++) {
          durationsAccumulatorsForEachVoice[staveIndex][voiceIndex] = 0
        }
      } else if (durationsAccumulatorsForEachVoice[staveIndex].length > voicesParamsForAllStaves[staveIndex].length) {
        durationsAccumulatorsForEachVoice[staveIndex].splice(voicesParamsForAllStaves[staveIndex].length)
      }
      countersForEachVoice[staveIndex] = new Array(voicesParamsForAllStaves[staveIndex].length).fill(0)
      topOffsetsForEachStave[staveIndex] = topOffsetForCurrentStave(topOffset, staveIndex, intervalBetweenStaves, intervalBetweenStaveLines, numberOfStaveLines)
    }

    const drawnSingleUnitsInVoices = []
    const drawnCrossStaveUnits = []
    const drawnKeysForCrossStaveUnits = []
    const drawnArpeggiatedWavesForCrossStaveUnits = []
    const drawnMidMeasureClefsForCrossStaveUnits = []
    const drawnMidMeasureKeySignaturesForCrossStaveUnits = []
    const drawnBreathMarksBeforeCrossStaveUnits = []
    const drawnOnlyNoteLettersBeforeApreggiatedWavesForCrossStaveUnits = []
    const drawnSingleUnitsInAllCrossStaveUnits = []
    const numberOfUnfinishedVoices = { value: totalNumberOfVoices }
    const containsCollidedVoices = { value: false }
    const containsDrawnCrossStaveElementsBesideCrossStaveUnits = { value: false }
    const graceUnitsAccumulatorForEachStaveAndVoice = { value: undefined }
    const finishedVoices = {}

    for (let staveIndex = 0; staveIndex < numberOfStaves; staveIndex++) {
      for (let voiceIndex = 0; voiceIndex < voicesParamsForAllStaves[staveIndex].length; voiceIndex++) {
        if (voicesParamsForAllStaves[staveIndex][voiceIndex].length === 0) {
          numberOfUnfinishedVoices.value -= 1
          finishedVoices[`${staveIndex}-${voiceIndex}`] = true
        }
      }
    }

    let crossStaveUnitCount = 0
    let spaceForAllCrossStaveElementsForFirstCrossStaveUnit = 0
    while (countersForEachVoiceLessThanTheirMaxValues(countersForEachVoice, voicesParamsForAllStaves)) {
      const selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit = singleUnitsParamsToBeIncludedInNextCrossStaveUnit(measureIndexInGeneral, voicesParamsForAllStaves, durationsAccumulatorsForEachVoice, countersForEachVoice, finishedVoices, numberOfUnfinishedVoices, graceUnitsAccumulatorForEachStaveAndVoice, similesInformationByStaveAndVoiceIndexes)
      const isCurrentCrossStaveUnitGrace = selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit[0] && selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit[0].isGrace
      const allCrossStaveElementsForCurrentCrossStaveUnit = []
      const drawnMidMeasureClefsForCurrentCrossStaveUnit = midMeasureClefsForCurrentCrossStaveUnit(selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit, numberOfStaves, clefNamesAuraByStaveIndexes, drawnCrossStaveUnits, minUnitDurationOnPageLine, compressUnitsByNTimes, stretchUnitsByNTimes, styles, leftOffset, topOffsetsForEachStave, containsDrawnCrossStaveElementsBesideCrossStaveUnits)
      drawnMidMeasureClefsForCrossStaveUnits.push(drawnMidMeasureClefsForCurrentCrossStaveUnit)
      allCrossStaveElementsForCurrentCrossStaveUnit.push(drawnMidMeasureClefsForCurrentCrossStaveUnit)
      adjustNotesPositionNumbersInSelectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnitByTheirNoteNamesAndOctaveNumbersAndClefNamesByStaveIndexIfNoteNamesArePresentedInNotes(selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit, clefNamesAuraByStaveIndexes)
      const drawnMidMeasureKeySignaturesForCurrentCrossStaveUnit = midMeasureKeySignaturesForCurrentCrossStaveUnit(selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit, drawnMidMeasureClefsForCrossStaveUnits, numberOfStaves, numberOfStaveLines, clefNamesAuraByStaveIndexes, styles, leftOffset, topOffsetsForEachStave, containsDrawnCrossStaveElementsBesideCrossStaveUnits)
      drawnMidMeasureKeySignaturesForCrossStaveUnits.push(drawnMidMeasureKeySignaturesForCurrentCrossStaveUnit)
      allCrossStaveElementsForCurrentCrossStaveUnit.push(drawnMidMeasureKeySignaturesForCurrentCrossStaveUnit)
      const drawnBreathMarkBeforeCurrentCrossStaveUnit = breathMarkBeforeCurrentCrossStaveUnit(selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit, drawnMidMeasureClefsForCrossStaveUnits, drawnMidMeasureKeySignaturesForCrossStaveUnits, numberOfStaves, styles, leftOffset, topOffsetsForEachStave, containsDrawnCrossStaveElementsBesideCrossStaveUnits)
      drawnBreathMarksBeforeCrossStaveUnits.push(drawnBreathMarkBeforeCurrentCrossStaveUnit)
      allCrossStaveElementsForCurrentCrossStaveUnit.push(drawnBreathMarkBeforeCurrentCrossStaveUnit)
      const drawnOnlyNoteLettersBeforeArpeggiatedWavesForCurrentCrossStaveUnit = keysForCurrentCrossStaveUnit(selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit, measureIndexInGeneral, countersForEachVoice, numberOfStaveLines, drawnArpeggiatedWavesForCrossStaveUnits, drawnBreathMarksBeforeCrossStaveUnits, styles, leftOffset, topOffsetsForEachStave, 'before', containsDrawnCrossStaveElementsBesideCrossStaveUnits)
      drawnOnlyNoteLettersBeforeApreggiatedWavesForCrossStaveUnits.push(drawnOnlyNoteLettersBeforeArpeggiatedWavesForCurrentCrossStaveUnit)
      allCrossStaveElementsForCurrentCrossStaveUnit.push(drawnOnlyNoteLettersBeforeArpeggiatedWavesForCurrentCrossStaveUnit)
      const drawnArpeggiatedWavesForCurrentCrossStaveUnit = arpeggiatedWavesForCurrentCrossStaveUnit(selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit, drawnOnlyNoteLettersBeforeApreggiatedWavesForCrossStaveUnits, styles, leftOffset, topOffsetsForEachStave, numberOfStaveLines, containsDrawnCrossStaveElementsBesideCrossStaveUnits)
      drawnArpeggiatedWavesForCrossStaveUnits.push(drawnArpeggiatedWavesForCurrentCrossStaveUnit)
      allCrossStaveElementsForCurrentCrossStaveUnit.push(drawnArpeggiatedWavesForCurrentCrossStaveUnit)
      const drawnKeysForCurrentCrossStaveUnit = keysForCurrentCrossStaveUnit(selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit, measureIndexInGeneral, countersForEachVoice, numberOfStaveLines, drawnArpeggiatedWavesForCrossStaveUnits, drawnBreathMarksBeforeCrossStaveUnits, styles, leftOffset, topOffsetsForEachStave, 'after', containsDrawnCrossStaveElementsBesideCrossStaveUnits)
      drawnKeysForCrossStaveUnits.push(drawnKeysForCurrentCrossStaveUnit)
      allCrossStaveElementsForCurrentCrossStaveUnit.push(drawnKeysForCurrentCrossStaveUnit)
      const groupedAllCrossStaveElementsForCurrentCrossStaveUnit = group(
        'allCrossStaveElementsForCurrentCrossStaveUnit',
        allCrossStaveElementsForCurrentCrossStaveUnit
      )
      const drawnSingleUnitsForCurrentCrossStaveUnit = singleUnitsForCurrentCrossStaveUnit(selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit, numberOfStaves, numberOfStaveLines, pageLineNumber, measureIndexInGeneral, measureIndexOnPageLine, crossStaveUnitCount, drawnKeysForCrossStaveUnits, drawnSingleUnitsInVoices, beamingStatusesForEachVoiceOnPageLine, countersForEachVoice, durationsAccumulatorsForEachVoice, similesInformationByStaveAndVoiceIndexes, affectingTupletValuesByStaveAndVoiceIndexes, isOnLastMeasureOfPageLine, styles, topOffsetsForEachStave)
      const drawnCrossVoiceUnitsOnAllStavesInCrossStaveUnit = crossVoiceUnitsOnAllStavesInCrossStaveUnit(drawnSingleUnitsForCurrentCrossStaveUnit, voicesParamsForAllStaves, containsCollidedVoices, drawnKeysForCurrentCrossStaveUnit, drawnArpeggiatedWavesForCurrentCrossStaveUnit, isCurrentCrossStaveUnitGrace, topOffsetsForEachStave, numberOfStaveLines, styles)
      if (drawnCrossVoiceUnitsOnAllStavesInCrossStaveUnit.length !== 0) {
        const calculatedMinDurationAmongAccumulatorsForEachVoice = minDurationAmongAccumulatorsForEachVoice(durationsAccumulatorsForEachVoice)
        // const calculatedMinActualDurationAmongDrawnSingleUnitsInCrossStaveUnit = minActualDurationAmongDrawnSingleUnitsInCrossStaveUnit(drawnSingleUnitsForCurrentCrossStaveUnit)
        const drawnCurrentCrossStaveUnit = elementWithAdditionalInformation(
          group(
            'crossStaveUnit',
            drawnCrossVoiceUnitsOnAllStavesInCrossStaveUnit
          ),
          {
            measureIndexOnPageLine,
            singleUnitsByStaveIndexes: drawnSingleUnitsForCurrentCrossStaveUnit,
            crossVoiceUnitsOnAllStavesInCrossStaveUnit: drawnCrossVoiceUnitsOnAllStavesInCrossStaveUnit,
            minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit: isCurrentCrossStaveUnitGrace ? 0 : calculatedMinDurationAmongAccumulatorsForEachVoice,
            chordLetter: chordLetterValueForCurrentCrossStaveUnit(selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit),
            lyrics: lyricsValueForCurrentCrossStaveUnit(selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit)
          }
        )
        if (!groupedAllCrossStaveElementsForCurrentCrossStaveUnit.isEmpty) {
          if (drawnCrossStaveUnits[drawnCrossStaveUnits.length - 1]) {
            let xDistanceToMoveAllCrossStaveElementsForCurrentCrossStaveUnitToSaveSpaceBetweenCrossStaveUnits = 0
            const spaceForAllCrossStaveElementsForCurrentCrossStaveUnit = drawnCurrentCrossStaveUnit.left - groupedAllCrossStaveElementsForCurrentCrossStaveUnit.left
            const spaceBetweenCrossStaveElementsForCurrentCrossStaveUnitAndPreviousCrossStaveUnit = groupedAllCrossStaveElementsForCurrentCrossStaveUnit.left - drawnCrossStaveUnits[drawnCrossStaveUnits.length - 1].rightPositionConsideringParenthesesAndDotsAndConsideringStavesThatContainNotesForNextCrossStaveUnit
            const spaceBetweenCrossStaveElementsForCurrentCrossStaveUnitAndPreviousCrossStaveUnitThatWouldBeLeftIfWeMoveAllCrossStaveElementsAndCurrentCrossStaveUnit = spaceBetweenCrossStaveElementsForCurrentCrossStaveUnitAndPreviousCrossStaveUnit - spaceForAllCrossStaveElementsForCurrentCrossStaveUnit
            if (!drawnMidMeasureClefsForCurrentCrossStaveUnit.isEmpty || !drawnMidMeasureKeySignaturesForCurrentCrossStaveUnit.isEmpty || !drawnBreathMarkBeforeCurrentCrossStaveUnit.isEmpty) {
              if (spaceBetweenCrossStaveElementsForCurrentCrossStaveUnitAndPreviousCrossStaveUnitThatWouldBeLeftIfWeMoveAllCrossStaveElementsAndCurrentCrossStaveUnit > minSpaceReservedAfterCrossStaveChordAndBeforeCrossStaveMidMeasureClefsAndBreathMarks) {
                xDistanceToMoveAllCrossStaveElementsForCurrentCrossStaveUnitToSaveSpaceBetweenCrossStaveUnits = spaceForAllCrossStaveElementsForCurrentCrossStaveUnit
              } else {
                xDistanceToMoveAllCrossStaveElementsForCurrentCrossStaveUnitToSaveSpaceBetweenCrossStaveUnits = spaceBetweenCrossStaveElementsForCurrentCrossStaveUnitAndPreviousCrossStaveUnit - minSpaceReservedAfterCrossStaveChordAndBeforeCrossStaveMidMeasureClefsAndBreathMarks
              }
            } else if (!drawnArpeggiatedWavesForCurrentCrossStaveUnit.isEmpty && drawnOnlyNoteLettersBeforeArpeggiatedWavesForCurrentCrossStaveUnit.isEmpty) {
              if (isCurrentCrossStaveUnitGrace) {
                if (spaceBetweenCrossStaveElementsForCurrentCrossStaveUnitAndPreviousCrossStaveUnitThatWouldBeLeftIfWeMoveAllCrossStaveElementsAndCurrentCrossStaveUnit > minSpaceReservedAfterCrossStaveChordAndBeforeArpeggiatedWavesForGraceCrossStaveUnit) {
                  xDistanceToMoveAllCrossStaveElementsForCurrentCrossStaveUnitToSaveSpaceBetweenCrossStaveUnits = spaceForAllCrossStaveElementsForCurrentCrossStaveUnit
                } else {
                  xDistanceToMoveAllCrossStaveElementsForCurrentCrossStaveUnitToSaveSpaceBetweenCrossStaveUnits = spaceBetweenCrossStaveElementsForCurrentCrossStaveUnitAndPreviousCrossStaveUnit - minSpaceReservedAfterCrossStaveChordAndBeforeArpeggiatedWavesForGraceCrossStaveUnit
                }
              } else {
                if (spaceBetweenCrossStaveElementsForCurrentCrossStaveUnitAndPreviousCrossStaveUnitThatWouldBeLeftIfWeMoveAllCrossStaveElementsAndCurrentCrossStaveUnit > minSpaceReservedAfterCrossStaveChordAndBeforeArpeggiatedWaves) {
                  xDistanceToMoveAllCrossStaveElementsForCurrentCrossStaveUnitToSaveSpaceBetweenCrossStaveUnits = spaceForAllCrossStaveElementsForCurrentCrossStaveUnit
                } else {
                  xDistanceToMoveAllCrossStaveElementsForCurrentCrossStaveUnitToSaveSpaceBetweenCrossStaveUnits = spaceBetweenCrossStaveElementsForCurrentCrossStaveUnitAndPreviousCrossStaveUnit - minSpaceReservedAfterCrossStaveChordAndBeforeArpeggiatedWaves
                }
              }
            } else {
              if (isCurrentCrossStaveUnitGrace) {
                if (spaceBetweenCrossStaveElementsForCurrentCrossStaveUnitAndPreviousCrossStaveUnitThatWouldBeLeftIfWeMoveAllCrossStaveElementsAndCurrentCrossStaveUnit > minSpaceReservedAfterCrossStaveChordAndBeforeOtherCrossStaveElementsForGraceCrossStaveUnit) {
                  xDistanceToMoveAllCrossStaveElementsForCurrentCrossStaveUnitToSaveSpaceBetweenCrossStaveUnits = spaceForAllCrossStaveElementsForCurrentCrossStaveUnit
                } else {
                  xDistanceToMoveAllCrossStaveElementsForCurrentCrossStaveUnitToSaveSpaceBetweenCrossStaveUnits = spaceBetweenCrossStaveElementsForCurrentCrossStaveUnitAndPreviousCrossStaveUnit - minSpaceReservedAfterCrossStaveChordAndBeforeOtherCrossStaveElementsForGraceCrossStaveUnit
                }
              } else {
                if (spaceBetweenCrossStaveElementsForCurrentCrossStaveUnitAndPreviousCrossStaveUnitThatWouldBeLeftIfWeMoveAllCrossStaveElementsAndCurrentCrossStaveUnit > minSpaceReservedAfterCrossStaveChordAndBeforeOtherCrossStaveElements) {
                  xDistanceToMoveAllCrossStaveElementsForCurrentCrossStaveUnitToSaveSpaceBetweenCrossStaveUnits = spaceForAllCrossStaveElementsForCurrentCrossStaveUnit
                } else {
                  xDistanceToMoveAllCrossStaveElementsForCurrentCrossStaveUnitToSaveSpaceBetweenCrossStaveUnits = spaceBetweenCrossStaveElementsForCurrentCrossStaveUnitAndPreviousCrossStaveUnit - minSpaceReservedAfterCrossStaveChordAndBeforeOtherCrossStaveElements
                }
              }
            }
            moveCrossStaveElementsThatAttachedToCrossStaveUnit(
              drawnMidMeasureClefsForCurrentCrossStaveUnit,
              drawnMidMeasureKeySignaturesForCurrentCrossStaveUnit,
              drawnBreathMarkBeforeCurrentCrossStaveUnit,
              drawnOnlyNoteLettersBeforeArpeggiatedWavesForCurrentCrossStaveUnit,
              drawnArpeggiatedWavesForCurrentCrossStaveUnit,
              drawnKeysForCurrentCrossStaveUnit,
              drawnCurrentCrossStaveUnit,
              -1 * xDistanceToMoveAllCrossStaveElementsForCurrentCrossStaveUnitToSaveSpaceBetweenCrossStaveUnits
            )
          } else {
            spaceForAllCrossStaveElementsForFirstCrossStaveUnit = groupedAllCrossStaveElementsForCurrentCrossStaveUnit.right - groupedAllCrossStaveElementsForCurrentCrossStaveUnit.left
          }
        }
        const calculatedXCorrectionValueForCurrentCrossStaveUnit = xCorrectionValueForCurrentCrossStaveUnit(selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit, intervalBetweenStaveLines)
        if (calculatedXCorrectionValueForCurrentCrossStaveUnit !== 0) {
          moveCrossStaveElementsThatAttachedToCrossStaveUnit(
            drawnMidMeasureClefsForCurrentCrossStaveUnit,
            drawnMidMeasureKeySignaturesForCurrentCrossStaveUnit,
            drawnBreathMarkBeforeCurrentCrossStaveUnit,
            drawnOnlyNoteLettersBeforeArpeggiatedWavesForCurrentCrossStaveUnit,
            drawnArpeggiatedWavesForCurrentCrossStaveUnit,
            drawnKeysForCurrentCrossStaveUnit,
            drawnCurrentCrossStaveUnit,
            calculatedXCorrectionValueForCurrentCrossStaveUnit
          )
        }
        drawnCrossStaveUnits.push(drawnCurrentCrossStaveUnit)
        drawnSingleUnitsInAllCrossStaveUnits.push(drawnSingleUnitsForCurrentCrossStaveUnit)
        releaseDurationsAccumulatorsForEachVoiceWithMinDurationAmongThem(crossStaveUnitCount, isCurrentCrossStaveUnitGrace, measureIndexInGeneral, voicesParamsForAllStaves, durationsAccumulatorsForEachVoice, countersForEachVoice, calculatedMinDurationAmongAccumulatorsForEachVoice, finishedVoices, numberOfUnfinishedVoices)
      }
      crossStaveUnitCount++
    }

    const voicesBody = elementWithAdditionalInformation(
      group(
        'voicesBody',
        [
          ...drawnMidMeasureClefsForCrossStaveUnits,
          ...drawnMidMeasureKeySignaturesForCrossStaveUnits,
          ...drawnBreathMarksBeforeCrossStaveUnits,
          ...drawnOnlyNoteLettersBeforeApreggiatedWavesForCrossStaveUnits,
          ...drawnArpeggiatedWavesForCrossStaveUnits,
          ...drawnKeysForCrossStaveUnits,
          ...drawnCrossStaveUnits
        ]
      ),
      {
        measureIndexOnPageLine
      }
    )

    if (currentMeasureContainsBreakingConnectionsThatStartBefore) {
      let xDistanceToMove = spaceForAllCrossStaveElementsForFirstCrossStaveUnit || spaceForBreakingConnectionsThatStartBefore
      if (xDistanceToMove > spaceForBreakingConnectionsThatStartBefore) {
        xDistanceToMove = additionalSpaceForBreakingConnectionsThatStartBeforeCrossStaveUnitWithCrossStaveElementsBefore
      } else if (spaceForBreakingConnectionsThatStartBefore > xDistanceToMove) {
        xDistanceToMove = spaceForBreakingConnectionsThatStartBefore - xDistanceToMove + additionalSpaceForBreakingConnectionsThatStartBeforeCrossStaveUnitWithCrossStaveElementsBefore
      }
      moveVoicesBodyHorizontally(voicesBody, drawnSingleUnitsInVoices, xDistanceToMove, false)
    } else if (prevMeasureContainsFermataOverBarline) {
      moveVoicesBodyHorizontally(voicesBody, drawnSingleUnitsInVoices, spaceForMeasureFermata, false)
    }

    const voices = elementWithAdditionalInformation(
      group(
        'voices',
        [
          voicesBody
        ]
      ),
      {
        measureIndexOnPageLine,
        drawnCrossStaveUnits,
        drawnSingleUnitsInVoices,
        drawnKeysForCrossStaveUnits,
        drawnArpeggiatedWavesForCrossStaveUnits,
        drawnOnlyNoteLettersBeforeApreggiatedWavesForCrossStaveUnits,
        drawnBreathMarksBeforeCrossStaveUnits,
        drawnMidMeasureClefsForCrossStaveUnits,
        drawnMidMeasureKeySignaturesForCrossStaveUnits,
        spaceForBreakingConnectionsThatStartBefore,
        drawnSingleUnitsInAllCrossStaveUnits,
        topOffsetsForEachStave,
        numberOfStaveLines,
        voicesBody,
        isOnLastMeasureOfPageLine,
        isOnLastMeasureInGeneral,
        containsFullMeasureUnitsThatShouldBeCentralized,
        containsCollidedVoices: containsCollidedVoices.value,
        containsDrawnCrossStaveElementsBesideCrossStaveUnits: containsDrawnCrossStaveElementsBesideCrossStaveUnits.value,
        minDurationAmongAccumulatorsForEachVoiceInLastCrossStaveUnitCondideringCasesWhenItIsGraceCrossStaveUnit: drawnCrossStaveUnits[drawnCrossStaveUnits.length - 1] ? drawnCrossStaveUnits[drawnCrossStaveUnits.length - 1].minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit : (1 / 8)
      }
    )

    return voices
  }
}
