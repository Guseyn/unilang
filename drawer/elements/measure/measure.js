'use strict'

const clefsOnStaves = require('./../clef/clefsOnStaves')
const keySignaturesOnStaves = require('./../key/keySignaturesOnStaves')
const timeSignaturesOnStaves = require('./../time/timeSignaturesOnStaves')
const voicesOnMultipleStavesWithStavesPiece = require('./../voice/voicesOnMultipleStavesWithStavesPiece')
const multiMeasureRest = require('./../rest/multiMeasureRest')
const similePreviousMeasure = require('./../simile/similePreviousMeasure')
const simileTwoPreviousMeasure = require('./../simile/simileTwoPreviousMeasure')
const barLines = {
  'barLine': require('./../line/barLine'),
  'boldDoubleBarLine': require('./../line/boldDoubleBarLine'),
  'dottedBarLine': require('./../line/dottedBarLine'),
  'doubleBarLine': require('./../line/doubleBarLine'),
  'startBarLine': require('./../line/startBarLine'),
  'startBoldDoubleBarLine': require('./../line/startBoldDoubleBarLine')
}
const measureNumber = require('./measureNumber')
const repeatDots = require('./repeatDots')
const combinedConnections = require('./../connection/combinedConnections')
const combinedInstrumentTitles = require('./../connection/combinedInstrumentTitles')
const moveElement = require('./../basic/moveElement')
const group = require('./../basic/group')
const elementWithAdditionalInformation = require('./../basic/elementWithAdditionalInformation')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

const KEY_SIGNATURE_WITHOUT_KEYS = 'c major|a minor'

module.exports = ({
  pageLineNumber,
  pageLineMaxWidth,
  measureIndexOnPageLine,
  measureIndexInGeneral,
  maxNumberOfStavesInThisAndNextMeasures,
  numberOfStaveLines,
  connectionsParams,
  instrumentTitlesParams,
  withoutStartBarLine,
  keySignatureName,
  keySignatureNameForEachLineId,
  timeSignatureParams,
  stavesParams,
  openingBarLineName,
  closingBarLineName,
  repeatDotsMarkAtTheStart,
  repeatDotsMarkAtTheEnd,
  containsAtLeastOneVoiceWithMoreThanOneUnit,
  containsFullMeasureUnitsThatShouldBeCentralized,
  isFirstMeasureOnPageLine,
  isLastMeasureOnPageLine,
  isLastMeasureInGeneral,
  currentPageLineWidth,
  showMeasureNumber,
  directionOfMeasureNumber,
  lyricsUnderStaveIndex,
  compressUnitsByNTimes,
  stretchUnitsByNTimes,
  isHidden,
  minUnitDurationOnPageLine,
  durationsAccumulatorsForEachVoice,
  similesInformationByStaveAndVoiceIndexes,
  clefNamesAuraByStaveIndexes,
  beamingStatusesForEachVoiceOnPageLine,
  affectingTupletValuesByStaveAndVoiceIndexes,
  currentMeasureContainsBreakingConnectionsThatStartBefore,
  currentMeasureContainsBreakingConnectionsThatFinishAfter,
  measureContainsFermataOverBarline,
  prevMeasureContainsFermataOverBarline,
  voltaMark,
  repetitionNote,
  coda,
  sign,
  tempoMark,
  isMeasureRest,
  multiMeasureRestCount,
  similePreviousMeasureCount,
  simileTwoPreviousMeasuresCount,
  previousMeasure,
  measureBeforePreviousMeasure,
  simileYCorrection,
  lyricsWordsElementsWithMaxWidthAmongAllLyricsWordsForEachCrossStaveUnitOnPageLineToPrepareSpaceBeforeDrawingThem,
  chordLetterElementsOnPageLineToPrepareSpaceBeforeDrawingThem
}) => {
  return (styles, leftOffset, topOffset) => {
    const measureStartXPosition = leftOffset
    let nextLeftOffset = leftOffset
    const numberOfStaves = stavesParams.length
    const drawnComponents = []
    let drawnFinishBarline
    let drawnFinishRepeatDots
    let stavesPieceWidthOfLastMeasureToCompletePageLine = 0
    let pageLineInGreaterThanItShouldBe = false
    let positionThatCanBeConsideredAsStartOfStaves
    let drawnVoicesOnMultipleStavesWithStavesPiece
    const noSpaceNeededForBarLine = !currentMeasureContainsBreakingConnectionsThatFinishAfter && (repeatDotsMarkAtTheEnd || isMeasureRest !== undefined || similePreviousMeasureCount !== undefined)
    if (instrumentTitlesParams && instrumentTitlesParams.length !== 0) {
      const drawnCombinedInstrumentTitles = combinedInstrumentTitles(instrumentTitlesParams, numberOfStaveLines, isFirstMeasureOnPageLine, measureIndexInGeneral)(styles, nextLeftOffset, topOffset)
      if (!drawnCombinedInstrumentTitles.isEmpty) {
        drawnComponents.push(drawnCombinedInstrumentTitles)
        nextLeftOffset = drawnCombinedInstrumentTitles.right + styles.distanceBetweenInstrumentTitleAndConnectionLine
      }
    }
    if (connectionsParams && connectionsParams.length !== 0) {
      const drawnCombinedConnections = combinedConnections(connectionsParams, numberOfStaves, numberOfStaveLines, isFirstMeasureOnPageLine, measureIndexInGeneral)(styles, nextLeftOffset, topOffset)
      drawnComponents.push(drawnCombinedConnections)
      nextLeftOffset = drawnCombinedConnections.right
    }
    if (((isFirstMeasureOnPageLine && !withoutStartBarLine) || openingBarLineName) && numberOfStaves !== 0) {
      if (isFirstMeasureOnPageLine && !openingBarLineName) {
        openingBarLineName = 'startBarLine'
      }
      const openingBarLineFunction = barLines[openingBarLineName]
      if (openingBarLineFunction && !((openingBarLineName === 'startBarLine') && (measureIndexOnPageLine > 0))) {
        let startBarLineNegativeOffset = 0
        if (measureIndexOnPageLine > 0) {
          startBarLineNegativeOffset = -styles.boldBarLineWidth
        }
        const drawnStartBarLine = barLines[openingBarLineName](numberOfStaves, numberOfStaveLines)(styles, nextLeftOffset + startBarLineNegativeOffset, topOffset)
        addPropertiesToElement(
          drawnStartBarLine,
          {
            'ref-ids': `opening-barline-${measureIndexInGeneral + 1}`
          }
        )
        drawnComponents.push(drawnStartBarLine)
        nextLeftOffset = drawnStartBarLine.right
        positionThatCanBeConsideredAsStartOfStaves = drawnStartBarLine.left
      }
    }
    if (repeatDotsMarkAtTheStart) {
      const drawnRepeatDots = repeatDots(numberOfStaves, numberOfStaveLines)(styles, nextLeftOffset, topOffset)
      addPropertiesToElement(
        drawnRepeatDots,
        {
          'ref-ids': `repeat-sign-${measureIndexInGeneral + 1},repeat-sign-at-the-start-${measureIndexInGeneral + 1}`
        }
      )
      drawnComponents.push(drawnRepeatDots)
      nextLeftOffset = drawnRepeatDots.right
      if (positionThatCanBeConsideredAsStartOfStaves === undefined) {
        positionThatCanBeConsideredAsStartOfStaves = drawnRepeatDots.left
      }
    }
    if (showMeasureNumber) {
      const drawnMeasureNumber = measureNumber(measureIndexInGeneral, directionOfMeasureNumber, numberOfStaves, numberOfStaveLines)(styles, nextLeftOffset, topOffset)
      drawnComponents.push(drawnMeasureNumber)
      nextLeftOffset = drawnMeasureNumber.right
    }
    const clefsNames = []
    const voicesParamsForAllStaves = []
    stavesParams.forEach((staveParams, staveIndex) => {
      clefNamesAuraByStaveIndexes[staveIndex] = clefNamesAuraByStaveIndexes[staveIndex] || 'treble'
      if (staveParams.clef) {
        clefsNames[staveIndex] = staveParams.clef
        clefNamesAuraByStaveIndexes[staveIndex] = staveParams.clef
      } else if (keySignatureName) {
        clefsNames[staveIndex] = clefNamesAuraByStaveIndexes[staveIndex]
      }
      voicesParamsForAllStaves.push(staveParams.voicesParams || [])
    })
    if (clefsNames.length !== 0) {
      const drawnClefsOnStaves = clefsOnStaves(numberOfStaves, numberOfStaveLines, clefsNames, measureIndexInGeneral)(styles, nextLeftOffset, topOffset)
      drawnComponents.push(drawnClefsOnStaves)
      nextLeftOffset = drawnClefsOnStaves.right
      if (positionThatCanBeConsideredAsStartOfStaves === undefined) {
        positionThatCanBeConsideredAsStartOfStaves = drawnClefsOnStaves.left
      }
      const drawnKeySignaturesOnStaves = keySignaturesOnStaves(numberOfStaveLines, clefsNames, keySignatureName, keySignatureNameForEachLineId, measureIndexInGeneral)(styles, nextLeftOffset, topOffset)
      drawnComponents.push(drawnKeySignaturesOnStaves)
      nextLeftOffset = drawnKeySignaturesOnStaves.right
      if (positionThatCanBeConsideredAsStartOfStaves === undefined) {
        positionThatCanBeConsideredAsStartOfStaves = drawnKeySignaturesOnStaves.left
      }
    }
    if (timeSignatureParams && timeSignatureParams.numerator && timeSignatureParams.denominator) {
      const isClefBefore = clefsNames.length !== 0
      const isKeySignatureBefore = keySignatureName !== undefined && keySignatureName !== KEY_SIGNATURE_WITHOUT_KEYS
      const drawnTimeSignaturesOnStaves = timeSignaturesOnStaves(numberOfStaves, numberOfStaveLines, timeSignatureParams.numerator, timeSignatureParams.denominator, timeSignatureParams.cMode, isClefBefore, isKeySignatureBefore, isFirstMeasureOnPageLine, measureIndexInGeneral, timeSignatureParams.forEachLineId)(styles, nextLeftOffset, topOffset)
      drawnComponents.push(drawnTimeSignaturesOnStaves)
      nextLeftOffset = drawnTimeSignaturesOnStaves.right
      if (positionThatCanBeConsideredAsStartOfStaves === undefined) {
        positionThatCanBeConsideredAsStartOfStaves = drawnTimeSignaturesOnStaves.left
      }
    }
    if (!isLastMeasureOnPageLine) {
      if (isMeasureRest !== undefined) {
        const drawnMultiMeasureRest = multiMeasureRest(numberOfStaves, numberOfStaveLines, multiMeasureRestCount, stavesPieceWidthOfLastMeasureToCompletePageLine, measureIndexInGeneral)(styles, nextLeftOffset, topOffset)
        drawnComponents.push(drawnMultiMeasureRest)
        nextLeftOffset = drawnMultiMeasureRest.right
      } else if (similePreviousMeasureCount !== undefined) {
        const drawnSimilePreviousMeasure = similePreviousMeasure(numberOfStaves, numberOfStaveLines, simileYCorrection || 0, similePreviousMeasureCount, stavesPieceWidthOfLastMeasureToCompletePageLine, measureIndexInGeneral, previousMeasure)(styles, nextLeftOffset, topOffset)
        drawnComponents.push(drawnSimilePreviousMeasure)
        nextLeftOffset = drawnSimilePreviousMeasure.right
      } else if (simileTwoPreviousMeasuresCount !== undefined) {
        const drawnSimileTwoPreviousMeasure = simileTwoPreviousMeasure(numberOfStaves, numberOfStaveLines, simileYCorrection || 0, simileTwoPreviousMeasuresCount, stavesPieceWidthOfLastMeasureToCompletePageLine, measureIndexInGeneral, previousMeasure, measureBeforePreviousMeasure)(styles, nextLeftOffset, topOffset)
        drawnComponents.push(drawnSimileTwoPreviousMeasure)
        nextLeftOffset = drawnSimileTwoPreviousMeasure.right
      } else if (voicesParamsForAllStaves.length !== 0) {
        drawnVoicesOnMultipleStavesWithStavesPiece = voicesOnMultipleStavesWithStavesPiece({ pageLineNumber, measureIndexInGeneral, measureIndexOnPageLine, numberOfStaveLines, noSpaceNeededForBarLine, compressUnitsByNTimes, stretchUnitsByNTimes, containsAtLeastOneVoiceWithMoreThanOneUnit, containsFullMeasureUnitsThatShouldBeCentralized, stavesPieceWidthOfLastMeasureToCompletePageLine, voicesParamsForAllStaves, isOnLastMeasureOfPageLine: isLastMeasureOnPageLine, isOnLastMeasureInGeneral: isLastMeasureInGeneral, minUnitDurationOnPageLine, durationsAccumulatorsForEachVoice, similesInformationByStaveAndVoiceIndexes, clefNamesAuraByStaveIndexes, beamingStatusesForEachVoiceOnPageLine, affectingTupletValuesByStaveAndVoiceIndexes, currentMeasureContainsBreakingConnectionsThatStartBefore, currentMeasureContainsBreakingConnectionsThatFinishAfter, prevMeasureContainsFermataOverBarline, lyricsWordsElementsWithMaxWidthAmongAllLyricsWordsForEachCrossStaveUnitOnPageLineToPrepareSpaceBeforeDrawingThem, chordLetterElementsOnPageLineToPrepareSpaceBeforeDrawingThem })(styles, nextLeftOffset, topOffset)
        drawnComponents.push(drawnVoicesOnMultipleStavesWithStavesPiece)
        nextLeftOffset = drawnVoicesOnMultipleStavesWithStavesPiece.right
      }
      if (repeatDotsMarkAtTheEnd) {
        drawnFinishRepeatDots = repeatDots(numberOfStaves, numberOfStaveLines)(styles, nextLeftOffset, topOffset)
        addPropertiesToElement(
          drawnFinishRepeatDots,
          {
            'ref-ids': `repeat-sign-${measureIndexInGeneral + 1},repeat-sign-at-the-end-${measureIndexInGeneral + 1}`
          }
        )
        drawnComponents.push(drawnFinishRepeatDots)
        nextLeftOffset = drawnFinishRepeatDots.right
      }
      if (barLines[closingBarLineName]) {
        drawnFinishBarline = barLines[closingBarLineName](numberOfStaves, maxNumberOfStavesInThisAndNextMeasures, numberOfStaveLines, noSpaceNeededForBarLine)(styles, nextLeftOffset, topOffset)
        addPropertiesToElement(
          drawnFinishBarline,
          {
            'ref-ids': `closing-barline-${measureIndexInGeneral + 1}`
          }
        )
        drawnComponents.push(
          drawnFinishBarline
        )
        nextLeftOffset = drawnFinishBarline.right
      }
      if (drawnVoicesOnMultipleStavesWithStavesPiece) {
        drawnVoicesOnMultipleStavesWithStavesPiece.drawnStavesPiece.elements.forEach(stave => {
          if (positionThatCanBeConsideredAsStartOfStaves !== undefined) {
            stave.left = positionThatCanBeConsideredAsStartOfStaves
          }
          stave.right = nextLeftOffset
        })
      }
    }
    if (isLastMeasureOnPageLine) {
      let rightPositionOfElementsThatSupposedToBeAtTheEndOfLastMeasureOnPageLineButDrawnFirstForPrecisePageLineWidthMeasure = nextLeftOffset
      if (repeatDotsMarkAtTheEnd) {
        drawnFinishRepeatDots = repeatDots(numberOfStaves, numberOfStaveLines)(styles, nextLeftOffset, topOffset)
        addPropertiesToElement(
          drawnFinishRepeatDots,
          {
            'ref-ids': `repeat-sign-${measureIndexInGeneral + 1},repeat-sign-at-the-end-${measureIndexInGeneral + 1}`
          }
        )
        drawnComponents.push(drawnFinishRepeatDots)
        // here we don't update nextLeftOffset because we don't want to have empty space after repeat dots position is adjusted
      }
      if (barLines[closingBarLineName]) {
        drawnFinishBarline = barLines[closingBarLineName](numberOfStaves, maxNumberOfStavesInThisAndNextMeasures, numberOfStaveLines, noSpaceNeededForBarLine)(styles, nextLeftOffset, topOffset)
        addPropertiesToElement(
          drawnFinishBarline,
          {
            'ref-ids': `closing-barline-${measureIndexInGeneral + 1}`
          }
        )
        drawnComponents.push(drawnFinishBarline)
        // here we don't update nextLeftOffset because we don't want to have empty space after finish bar line position is adjusted
      }
      const pageLineWidthBeforeLastMeasure = currentPageLineWidth +
        (nextLeftOffset - leftOffset) +
        (drawnFinishRepeatDots ? (drawnFinishRepeatDots.right - drawnFinishRepeatDots.left) : 0) +
        (drawnFinishBarline ? (drawnFinishBarline.right - drawnFinishBarline.left) : 0)
      stavesPieceWidthOfLastMeasureToCompletePageLine = Math.max(0, pageLineMaxWidth - pageLineWidthBeforeLastMeasure)
      if (isMeasureRest !== undefined) {
        const drawnMultiMeasureRest = multiMeasureRest(numberOfStaves, numberOfStaveLines, multiMeasureRestCount, stavesPieceWidthOfLastMeasureToCompletePageLine, measureIndexInGeneral)(styles, nextLeftOffset, topOffset)
        drawnComponents.push(drawnMultiMeasureRest)
        nextLeftOffset = drawnMultiMeasureRest.right
      } else if (similePreviousMeasureCount !== undefined) {
        const drawnSimilePreviousMeasure = similePreviousMeasure(numberOfStaves, numberOfStaveLines, simileYCorrection || 0, similePreviousMeasureCount, stavesPieceWidthOfLastMeasureToCompletePageLine, measureIndexInGeneral, previousMeasure)(styles, nextLeftOffset, topOffset)
        drawnComponents.push(drawnSimilePreviousMeasure)
        nextLeftOffset = drawnSimilePreviousMeasure.right
      } else if (simileTwoPreviousMeasuresCount !== undefined) {
        const drawnSimileTwoPreviousMeasure = simileTwoPreviousMeasure(numberOfStaves, numberOfStaveLines, simileYCorrection || 0, simileTwoPreviousMeasuresCount, stavesPieceWidthOfLastMeasureToCompletePageLine, measureIndexInGeneral, previousMeasure, measureBeforePreviousMeasure)(styles, nextLeftOffset, topOffset)
        drawnComponents.push(drawnSimileTwoPreviousMeasure)
        nextLeftOffset = drawnSimileTwoPreviousMeasure.right
      } else if (voicesParamsForAllStaves.length !== 0) {
        drawnVoicesOnMultipleStavesWithStavesPiece = voicesOnMultipleStavesWithStavesPiece({ pageLineNumber, measureIndexInGeneral, measureIndexOnPageLine, numberOfStaveLines, noSpaceNeededForBarLine, compressUnitsByNTimes, stretchUnitsByNTimes, containsAtLeastOneVoiceWithMoreThanOneUnit, containsFullMeasureUnitsThatShouldBeCentralized, stavesPieceWidthOfLastMeasureToCompletePageLine, voicesParamsForAllStaves, isOnLastMeasureOfPageLine: isLastMeasureOnPageLine, isOnLastMeasureInGeneral: isLastMeasureInGeneral, minUnitDurationOnPageLine, durationsAccumulatorsForEachVoice, similesInformationByStaveAndVoiceIndexes, clefNamesAuraByStaveIndexes, beamingStatusesForEachVoiceOnPageLine, affectingTupletValuesByStaveAndVoiceIndexes, currentMeasureContainsBreakingConnectionsThatStartBefore, currentMeasureContainsBreakingConnectionsThatFinishAfter, prevMeasureContainsFermataOverBarline, lyricsWordsElementsWithMaxWidthAmongAllLyricsWordsForEachCrossStaveUnitOnPageLineToPrepareSpaceBeforeDrawingThem, chordLetterElementsOnPageLineToPrepareSpaceBeforeDrawingThem })(styles, nextLeftOffset, topOffset)
        drawnComponents.push(drawnVoicesOnMultipleStavesWithStavesPiece)
        nextLeftOffset = drawnVoicesOnMultipleStavesWithStavesPiece.right
      }
      if (drawnFinishRepeatDots) {
        moveElement(
          drawnFinishRepeatDots,
          nextLeftOffset - rightPositionOfElementsThatSupposedToBeAtTheEndOfLastMeasureOnPageLineButDrawnFirstForPrecisePageLineWidthMeasure
        )
        nextLeftOffset = drawnFinishRepeatDots.right
      }
      if (drawnFinishBarline) {
        const xDistanceToMove = nextLeftOffset - rightPositionOfElementsThatSupposedToBeAtTheEndOfLastMeasureOnPageLineButDrawnFirstForPrecisePageLineWidthMeasure
        moveElement(
          drawnFinishBarline,
          xDistanceToMove
        )
        drawnFinishBarline.xCenter += xDistanceToMove
        nextLeftOffset = drawnFinishBarline.right
      }
      if (drawnVoicesOnMultipleStavesWithStavesPiece) {
        drawnVoicesOnMultipleStavesWithStavesPiece.drawnStavesPiece.elements.forEach(stave => {
          if (positionThatCanBeConsideredAsStartOfStaves !== undefined) {
            stave.left = positionThatCanBeConsideredAsStartOfStaves
          }
          stave.right = nextLeftOffset
        })
      }
      const finalPageLineWidth = currentPageLineWidth + nextLeftOffset - leftOffset
      const epsilon = 0.001
      if (finalPageLineWidth > pageLineMaxWidth + epsilon) {
        pageLineInGreaterThanItShouldBe = true
      }
    }

    const drawnMeasure = group(
      'measure',
      drawnComponents
    )
    addPropertiesToElement(
      drawnMeasure,
      {
        'ref-ids': `measure-${measureIndexInGeneral + 1},measure-${pageLineNumber + 1}-${measureIndexOnPageLine + 1},line-${pageLineNumber + 1}`
      }
    )
    if (measureIndexInGeneral > 0) {
      addPropertiesToElement(
        drawnMeasure,
        {
          'ref-ids': 'every-measure'
        }
      )
    }
    addPropertiesToElement(
      drawnMeasure,
      {
        'ref-ids': 'every-measure-including-index-0'
      }
    )

    if (isFirstMeasureOnPageLine) {
      if (measureIndexInGeneral > 0) {
        addPropertiesToElement(
          drawnMeasure,
          {
            'ref-ids': 'first-measure,first-or-last-measure'
          }
        )
      }
      addPropertiesToElement(
        drawnMeasure,
        {
          'ref-ids': 'first-measure-including-index-0'
        }
      )
    }
    if (isLastMeasureOnPageLine) {
      addPropertiesToElement(
        drawnMeasure,
        {
          'ref-ids': 'last-measure,first-or-last-measure'
        }
      )
    }
    if (isLastMeasureInGeneral) {
      addPropertiesToElement(
        drawnMeasure,
        {
          'ref-ids': 'last-measure-on-page'
        }
      )
    }

    drawnMeasure.left = leftOffset

    return elementWithAdditionalInformation(
      drawnMeasure,
      {
        pageLineNumber,
        drawnFinishBarline,
        prevMeasureContainsFermataOverBarline,
        measureContainsFermataOverBarline,
        numberOfStaveLines,
        numberOfStaves,
        measureIndexInGeneral,
        measureIndexOnPageLine,
        isFirstMeasureOnPageLine,
        isLastMeasureOnPageLine,
        isLastMeasureInGeneral,
        pageLineInGreaterThanItShouldBe,
        drawnVoicesOnMultipleStavesWithStavesPiece,
        voltaMark,
        repetitionNote,
        coda,
        sign,
        tempoMark,
        lyricsUnderStaveIndex,
        stavesLeft: drawnVoicesOnMultipleStavesWithStavesPiece ? drawnVoicesOnMultipleStavesWithStavesPiece.drawnStavesPiece.left : null,
        stavesRight: drawnVoicesOnMultipleStavesWithStavesPiece ? drawnVoicesOnMultipleStavesWithStavesPiece.drawnStavesPiece.right : null,
        measureStartXPosition,
        containsFullMeasureUnitsThatShouldBeCentralized,
        isHidden
      }
    )
  }
}
