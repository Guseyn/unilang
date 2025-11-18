'use strict'

import voicesOnMultipleStaves from '#unilang/drawer/elements/voice/voicesOnMultipleStaves.js'
import spaceAtEndOfVoicesByByMinUnitDurationOnPageLineAndMinDurationAmongAccumulatorsForEachVoiceInLastCrossStaveUnitCondideringCasesWhenItIsGraceCrossStaveUnit from '#unilang/drawer/elements/voice/spaceAtEndOfVoicesByByMinUnitDurationOnPageLineAndMinDurationAmongAccumulatorsForEachVoiceInLastCrossStaveUnitCondideringCasesWhenItIsGraceCrossStaveUnit.js'
import stavesPiece from '#unilang/drawer/elements/stave/stavesPiece.js'
import group from '#unilang/drawer/elements/basic/group.js'
import prepareSpaceForLyricsWordsSoTheyDontCollideByMovingCrossStaveElements from '#unilang/drawer/elements/voice/prepareSpaceForLyricsWordsSoTheyDontCollideByMovingCrossStaveElements.js'
import prepareSpaceForChordLettersSoTheyDontCollideByMovingCrossStaveElements from '#unilang/drawer/elements/voice/prepareSpaceForChordLettersSoTheyDontCollideByMovingCrossStaveElements.js'
import centralizeSingleUnitsInVoices from '#unilang/drawer/elements/voice/centralizeSingleUnitsInVoices.js'
import elementWithAdditionalInformation from '#unilang/drawer/elements/basic/elementWithAdditionalInformation.js'

export default function ({
  pageLineNumber,
  measureIndexInGeneral,
  measureIndexOnPageLine,
  numberOfStaveLines,
  compressUnitsByNTimes,
  stretchUnitsByNTimes,
  containsAtLeastOneVoiceWithMoreThanOneUnit,
  containsFullMeasureUnitsThatShouldBeCentralized,
  prevMeasureContainsFermataOverBarline,
  stavesPieceWidthOfLastMeasureToCompletePageLine,
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
  lyricsWordsElementsWithMaxWidthAmongAllLyricsWordsForEachCrossStaveUnitOnPageLineToPrepareSpaceBeforeDrawingThem,
  chordLetterElementsOnPageLineToPrepareSpaceBeforeDrawingThem
}) {
  return (styles, leftOffset, topOffset) => {
    const { emptyMeasureWidth } = styles
    const numberOfStaves = voicesParamsForAllStaves.length
    const drawnVoices = voicesOnMultipleStaves({ pageLineNumber, measureIndexInGeneral, measureIndexOnPageLine, numberOfStaveLines, compressUnitsByNTimes, stretchUnitsByNTimes, containsFullMeasureUnitsThatShouldBeCentralized, voicesParamsForAllStaves, isOnLastMeasureOfPageLine, isOnLastMeasureInGeneral, minUnitDurationOnPageLine, durationsAccumulatorsForEachVoice, similesInformationByStaveAndVoiceIndexes, clefNamesAuraByStaveIndexes, beamingStatusesForEachVoiceOnPageLine, affectingTupletValuesByStaveAndVoiceIndexes, currentMeasureContainsBreakingConnectionsThatStartBefore, currentMeasureContainsBreakingConnectionsThatFinishAfter, prevMeasureContainsFermataOverBarline })(styles, leftOffset, topOffset)
    prepareSpaceForLyricsWordsSoTheyDontCollideByMovingCrossStaveElements(
      lyricsWordsElementsWithMaxWidthAmongAllLyricsWordsForEachCrossStaveUnitOnPageLineToPrepareSpaceBeforeDrawingThem,
      drawnVoices,
      styles
    )
    prepareSpaceForChordLettersSoTheyDontCollideByMovingCrossStaveElements(
      chordLetterElementsOnPageLineToPrepareSpaceBeforeDrawingThem,
      drawnVoices,
      styles
    )
    let stavesPieceWidth
    if (drawnVoices.voicesBody.isEmpty) {
      stavesPieceWidth = Math.max(stavesPieceWidthOfLastMeasureToCompletePageLine, emptyMeasureWidth)
    } else {
      stavesPieceWidth = Math.max(stavesPieceWidthOfLastMeasureToCompletePageLine, drawnVoices.right - leftOffset +
        spaceAtEndOfVoicesByByMinUnitDurationOnPageLineAndMinDurationAmongAccumulatorsForEachVoiceInLastCrossStaveUnitCondideringCasesWhenItIsGraceCrossStaveUnit(drawnVoices.minDurationAmongAccumulatorsForEachVoiceInLastCrossStaveUnitCondideringCasesWhenItIsGraceCrossStaveUnit, minUnitDurationOnPageLine, compressUnitsByNTimes, stretchUnitsByNTimes, styles))
      if (stavesPieceWidth < emptyMeasureWidth) {
        stavesPieceWidth = emptyMeasureWidth
      }
    }
    const refParams = {
      pageLineNumber,
      measureIndexInGeneral,
      measureIndexOnPageLine
    }
    const drawnStavesPiece = stavesPiece(numberOfStaves, numberOfStaveLines, stavesPieceWidth, numberOfStaves, refParams)(styles, leftOffset, topOffset)
    if (containsFullMeasureUnitsThatShouldBeCentralized) {
      centralizeSingleUnitsInVoices(drawnVoices, drawnStavesPiece, containsAtLeastOneVoiceWithMoreThanOneUnit)
    }
    drawnVoices.right = Math.max(drawnVoices.right, drawnStavesPiece.right)
    drawnVoices.left = Math.min(drawnVoices.left, drawnStavesPiece.left)
    drawnVoices.voicesBody.right = Math.max(drawnVoices.voicesBody.right, drawnStavesPiece.right)
    drawnVoices.voicesBody.left = Math.min(drawnVoices.voicesBody.left, drawnStavesPiece.left)
    return elementWithAdditionalInformation(
      group(
        'voicesWithStaveLines',
        [
          drawnStavesPiece,
          drawnVoices
        ]
      ),
      {
        drawnStavesPiece,
        drawnVoices
      }
    )
  }
}
