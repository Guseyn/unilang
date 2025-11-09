'use strict'

import measure from '#unilang/drawer/elements/measure/measure.js'
import line from '#unilang/drawer/elements/basic/line.js'

import measuresInformationAboutContainingBrokenConnectionsWhileAdjustingThemWithAdditionalUsefulInformation from '#unilang/drawer/elements/measure/measuresInformationAboutContainingBrokenConnectionsWhileAdjustingThemWithAdditionalUsefulInformation.js'

import additionalStaveLines from '#unilang/drawer/elements/measure/additionalStaveLines.js'
import graceCrushLines from '#unilang/drawer/elements/measure/graceCrushLines.js'
import ties from '#unilang/drawer/elements/measure/ties.js'
import slurs from '#unilang/drawer/elements/measure/slurs.js'
import lyrics from '#unilang/drawer/elements/measure/lyrics.js'
import tuplets from '#unilang/drawer/elements/measure/tuplets.js'
import glissandos from '#unilang/drawer/elements/measure/glissandos.js'
import articulationsAttachedToSingleUnits from '#unilang/drawer/elements/measure/articulationsAttachedToSingleUnits.js'
import articulationsAboveOrBelowStave from '#unilang/drawer/elements/measure/articulationsAboveOrBelowStave.js'
import chordLetters from '#unilang/drawer/elements/measure/chordLetters.js'
import octaveSigns from '#unilang/drawer/elements/measure/octaveSigns.js'
import group from '#unilang/drawer/elements/basic/group.js'
import elementWithAdditionalInformation from '#unilang/drawer/elements/basic/elementWithAdditionalInformation.js'
import correctTopAndBottomOfVoicesBodyAccordingToSingleUnitsTheyContain from '#unilang/drawer/elements/voice/correctTopAndBottomOfVoicesBodyAccordingToSingleUnitsTheyContain.js'
import correctTopAndBottomOfMeasuresAccordingToTheirVoicesBodies from '#unilang/drawer/elements/measure/correctTopAndBottomOfMeasuresAccordingToTheirVoicesBodies.js'
import voltas from '#unilang/drawer/elements/measure/voltas.js'
import repetitionNotes from '#unilang/drawer/elements/measure/repetitionNotes.js'
import codas from '#unilang/drawer/elements/measure/codas.js'
import signs from '#unilang/drawer/elements/measure/signs.js'
import tempoMarks from '#unilang/drawer/elements/measure/tempoMarks.js'
import pedals from '#unilang/drawer/elements/measure/pedals.js'
import dynamicChanges from '#unilang/drawer/elements/measure/dynamicChanges.js'
import tremoloBetweenStemlessSingleUnits from '#unilang/drawer/elements/measure/tremoloBetweenStemlessSingleUnits.js'
import beams from '#unilang/drawer/elements/measure/beams.js'
import singleTremolos from '#unilang/drawer/elements/measure/singleTremolos.js'
import measureFermatas from '#unilang/drawer/elements/measure/measureFermatas.js'

export default function (measuresParams, pageLineMaxWidth) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, intervalBetweenStaves, intervalBetweenPageLines, pageMaxWidthLineStrokeOptions } = styles
    const clefNamesAuraByStaveIndexes = {}

    const drawnMeasures = []
    const drawnMeasuresOnPageLine = []
    const topOfFirstStave = topOffset
    const durationsAccumulatorsForEachVoice = []
    const drawnElementsOnPageLineToCompleteMeasuresContent = []
    const lyricsWordsElementsWithMaxWidthAmongAllLyricsWordsForEachCrossStaveUnitOnPageLineToPrepareSpaceBeforeDrawingThem = []
    const chordLetterElementsOnPageLineToPrepareSpaceBeforeDrawingThem = []
    const drawnVoicesOnPageLine = []
    const voicesBodiesOnPageLine = []
    const informationAboutBrokenConnectionsInMeasures = measuresInformationAboutContainingBrokenConnectionsWhileAdjustingThemWithAdditionalUsefulInformation(measuresParams)

    let affectingTupletValuesByStaveAndVoiceIndexes = {}
    let nextLeftOffset = leftOffset
    let nextTopOffset = topOffset
    let bottomOfLastPageLineConsideringOnlyStaves = nextTopOffset
    let maxNumberOfStavesOnPageLine = 0
    let maxNumberOfStaveLinesOnPageLine = 0
    let beamingStatusesForEachVoiceOnPageLine = {}
    let similesInformationByStaveAndVoiceIndexes = {}
    let measureIndexOnPageLine = 0
    let pageLineNumber = 0
    let atLeastOnePageLineInGreaterThanItShouldBe = false
    let currentPageLineWidth = 0

    measuresParams.forEach(
      (measureParams, measureIndex) => {
        if (measureParams) {
          const isFirstMeasureOnPageLine = measureIndexOnPageLine === 0
          const isLastMeasureInGeneral = measureIndex === measuresParams.length - 1
          if (isLastMeasureInGeneral) {
            measureParams.isLastMeasureOnPageLine = true
          }

          const { currentMeasureContainsBreakingConnectionsThatStartBefore, currentMeasureContainsBreakingConnectionsThatFinishAfter } = informationAboutBrokenConnectionsInMeasures[pageLineNumber][measureIndexOnPageLine]
          measureParams.stavesParams = measureParams.stavesParams || []

          const drawnMeasure = measure({
            pageLineNumber,
            pageLineMaxWidth,
            measureIndexOnPageLine,
            measureIndexInGeneral: measureIndex,
            maxNumberOfStavesInThisAndNextMeasures: measureParams.maxNumberOfStavesInThisAndNextMeasures,
            numberOfStaveLines: measureParams.numberOfStaveLines || 5,
            connectionsParams: measureParams.connectionsParams,
            instrumentTitlesParams: measureParams.instrumentTitlesParams,
            withoutStartBarLine: measureParams.withoutStartBarLine,
            keySignatureName: measureParams.keySignatureName,
            keySignatureNameForEachLineId: measureParams.keySignatureNameForEachLineId,
            timeSignatureParams: measureParams.timeSignatureParams,
            stavesParams: measureParams.stavesParams,
            openingBarLineName: measureParams.openingBarLineName,
            closingBarLineName: measureParams.closingBarLineName,
            repeatDotsMarkAtTheStart: measureParams.repeatDotsMarkAtTheStart,
            repeatDotsMarkAtTheEnd: measureParams.repeatDotsMarkAtTheEnd,
            containsAtLeastOneVoiceWithMoreThanOneUnit: measureParams.containsAtLeastOneVoiceWithMoreThanOneUnit,
            containsFullMeasureUnitsThatShouldBeCentralized: measureParams.containsFullMeasureUnitsThatShouldBeCentralized,
            isFirstMeasureOnPageLine,
            isLastMeasureOnPageLine: measureParams.isLastMeasureOnPageLine,
            isLastMeasureInGeneral,
            currentPageLineWidth,
            showMeasureNumber: measureParams.showMeasureNumber,
            directionOfMeasureNumber: measureParams.directionOfMeasureNumber,
            lyricsUnderStaveIndex: measureParams.lyricsUnderStaveIndex,
            compressUnitsByNTimes: measureParams.compressUnitsByNTimes,
            stretchUnitsByNTimes: measureParams.stretchUnitsByNTimes,
            isHidden: measureParams.isHidden,
            minUnitDurationOnPageLine: measureParams.minUnitDurationOnPageLine,
            durationsAccumulatorsForEachVoice,
            similesInformationByStaveAndVoiceIndexes,
            clefNamesAuraByStaveIndexes,
            beamingStatusesForEachVoiceOnPageLine,
            affectingTupletValuesByStaveAndVoiceIndexes,
            currentMeasureContainsBreakingConnectionsThatStartBefore,
            currentMeasureContainsBreakingConnectionsThatFinishAfter,
            measureContainsFermataOverBarline: measureParams.endsWithFermata,
            prevMeasureContainsFermataOverBarline: measuresParams[measureIndex - 1] && measuresParams[measureIndex - 1].endsWithFermata,
            voltaMark: measureParams.voltaMark,
            repetitionNote: measureParams.repetitionNote,
            coda: measureParams.coda,
            sign: measureParams.sign,
            tempoMark: measureParams.tempoMark,
            isMeasureRest: measureParams.isMeasureRest,
            multiMeasureRestCount: measureParams.multiMeasureRestCount,
            similePreviousMeasureCount: measureParams.similePreviousMeasureCount,
            simileTwoPreviousMeasuresCount: measureParams.simileTwoPreviousMeasuresCount,
            previousMeasure: drawnMeasures[drawnMeasures.length - 1],
            measureBeforePreviousMeasure: drawnMeasures[drawnMeasures.length - 2],
            simileYCorrection: measureParams.simileYCorrection,
            lyricsWordsElementsWithMaxWidthAmongAllLyricsWordsForEachCrossStaveUnitOnPageLineToPrepareSpaceBeforeDrawingThem,
            chordLetterElementsOnPageLineToPrepareSpaceBeforeDrawingThem
          })(styles, nextLeftOffset, nextTopOffset)
          drawnMeasures.push(drawnMeasure)
          drawnMeasuresOnPageLine.push(drawnMeasure)
          if (
            drawnMeasure.drawnVoicesOnMultipleStavesWithStavesPiece &&
            drawnMeasure.drawnVoicesOnMultipleStavesWithStavesPiece.drawnVoices &&
            drawnMeasure.drawnVoicesOnMultipleStavesWithStavesPiece.drawnVoices.voicesBody &&
            !drawnMeasure.drawnVoicesOnMultipleStavesWithStavesPiece.drawnVoices.voicesBody.isEmpty
          ) {
            const drawnVoicesInCurrentMeasure = drawnMeasure.drawnVoicesOnMultipleStavesWithStavesPiece.drawnVoices
            voicesBodiesOnPageLine.push(drawnVoicesInCurrentMeasure.voicesBody)
            drawnVoicesOnPageLine.push(drawnVoicesInCurrentMeasure)
          } else {
            drawnVoicesOnPageLine.push({
              withoutVoices: true
            })
            if (drawnMeasure.isHidden) {
              drawnMeasure.properties['visibility'] = 'hidden'
            }
          }
          currentPageLineWidth += (drawnMeasure.right - drawnMeasure.measureStartXPosition)
          if (drawnMeasure.numberOfStaves > maxNumberOfStavesOnPageLine) {
            maxNumberOfStavesOnPageLine = drawnMeasure.numberOfStaves
          }
          if (drawnMeasure.numberOfStaveLines > maxNumberOfStaveLinesOnPageLine) {
            maxNumberOfStaveLinesOnPageLine = drawnMeasure.numberOfStaveLines
          }

          if (measureParams.isLastMeasureOnPageLine || isLastMeasureInGeneral) {
            if (drawnMeasure.pageLineInGreaterThanItShouldBe) {
              atLeastOnePageLineInGreaterThanItShouldBe = true
            }

            drawnElementsOnPageLineToCompleteMeasuresContent.push(
              ...measureFermatas(drawnMeasuresOnPageLine, styles),
              ...beams(drawnVoicesOnPageLine, styles),
              ...graceCrushLines(drawnVoicesOnPageLine, styles),
              ...ties(drawnVoicesOnPageLine, voicesBodiesOnPageLine, styles),
              ...glissandos(drawnVoicesOnPageLine, voicesBodiesOnPageLine, drawnMeasuresOnPageLine, styles),
              ...singleTremolos(drawnVoicesOnPageLine, styles),
              ...articulationsAttachedToSingleUnits(drawnVoicesOnPageLine, true, false, styles),
              ...tremoloBetweenStemlessSingleUnits(drawnVoicesOnPageLine, styles),
              ...tuplets(drawnVoicesOnPageLine, voicesBodiesOnPageLine, styles),
              ...slurs(drawnVoicesOnPageLine, styles),
              ...octaveSigns(drawnVoicesOnPageLine, styles),
              ...articulationsAboveOrBelowStave(drawnVoicesOnPageLine, true, false, styles)
            )

            drawnVoicesOnPageLine.forEach(drawnVoicesOnPageLineForCurrentMeasure => {
              const { measureIndexOnPageLine, drawnSingleUnitsInVoices, withoutVoices } = drawnVoicesOnPageLineForCurrentMeasure
              if (!withoutVoices) {
                correctTopAndBottomOfVoicesBodyAccordingToSingleUnitsTheyContain(
                  voicesBodiesOnPageLine[measureIndexOnPageLine],
                  drawnSingleUnitsInVoices
                )
              }
            })
            correctTopAndBottomOfMeasuresAccordingToTheirVoicesBodies(drawnMeasuresOnPageLine, voicesBodiesOnPageLine)

            drawnElementsOnPageLineToCompleteMeasuresContent.push(
              ...lyrics(drawnVoicesOnPageLine, drawnMeasuresOnPageLine, voicesBodiesOnPageLine, styles),
              ...chordLetters(drawnVoicesOnPageLine, drawnMeasuresOnPageLine, voicesBodiesOnPageLine, styles),
              ...pedals(drawnVoicesOnPageLine, drawnMeasuresOnPageLine, styles),
              ...dynamicChanges(drawnVoicesOnPageLine, drawnMeasuresOnPageLine, styles),
              ...articulationsAttachedToSingleUnits(drawnVoicesOnPageLine, false, true, styles),
              ...articulationsAboveOrBelowStave(drawnVoicesOnPageLine, false, true, styles)
            )

            drawnVoicesOnPageLine.forEach(drawnVoicesOnPageLineForCurrentMeasure => {
              const { measureIndexOnPageLine, drawnSingleUnitsInVoices, withoutVoices } = drawnVoicesOnPageLineForCurrentMeasure
              if (!withoutVoices) {
                correctTopAndBottomOfVoicesBodyAccordingToSingleUnitsTheyContain(
                  voicesBodiesOnPageLine[measureIndexOnPageLine],
                  drawnSingleUnitsInVoices
                )
              }
            })
            correctTopAndBottomOfMeasuresAccordingToTheirVoicesBodies(drawnMeasuresOnPageLine, voicesBodiesOnPageLine)

            drawnElementsOnPageLineToCompleteMeasuresContent.push(
              ...repetitionNotes(drawnMeasuresOnPageLine, styles),
              ...codas(drawnMeasuresOnPageLine, styles),
              ...signs(drawnMeasuresOnPageLine, styles),
              ...voltas(drawnMeasuresOnPageLine, voicesBodiesOnPageLine, styles),
              ...tempoMarks(drawnMeasuresOnPageLine, voicesBodiesOnPageLine, styles)
            )

            const groupedDrawnElementsOnPageLineToCompleteMeasuresContent = group(
              'additionalMeasureElementsOnPageLine',
              drawnElementsOnPageLineToCompleteMeasuresContent
            )
            drawnMeasures.push(groupedDrawnElementsOnPageLineToCompleteMeasuresContent)
            const groupedAdditionalStaveLinesOnPageLine = group(
              'additionalStaveLinesOnPageLine',
              additionalStaveLines(drawnVoicesOnPageLine, styles)
            )
            drawnMeasures.unshift(groupedAdditionalStaveLinesOnPageLine)
            bottomOfLastPageLineConsideringOnlyStaves = nextTopOffset + maxNumberOfStavesOnPageLine * (maxNumberOfStaveLinesOnPageLine - 1) * intervalBetweenStaveLines + (maxNumberOfStavesOnPageLine - 1) * intervalBetweenStaves
            nextTopOffset = bottomOfLastPageLineConsideringOnlyStaves + intervalBetweenPageLines
            nextLeftOffset = leftOffset

            drawnVoicesOnPageLine.splice(0)
            drawnMeasuresOnPageLine.splice(0)
            drawnElementsOnPageLineToCompleteMeasuresContent.splice(0)
            lyricsWordsElementsWithMaxWidthAmongAllLyricsWordsForEachCrossStaveUnitOnPageLineToPrepareSpaceBeforeDrawingThem.splice(0)
            chordLetterElementsOnPageLineToPrepareSpaceBeforeDrawingThem.splice(0)
            voicesBodiesOnPageLine.splice(0)
            measureIndexOnPageLine = 0
            maxNumberOfStavesOnPageLine = 0
            maxNumberOfStaveLinesOnPageLine = 0
            currentPageLineWidth = 0
            beamingStatusesForEachVoiceOnPageLine = {}
            affectingTupletValuesByStaveAndVoiceIndexes = {}
            similesInformationByStaveAndVoiceIndexes = {}
            pageLineNumber += 1
          } else {
            nextLeftOffset = drawnMeasure.right
            measureIndexOnPageLine += 1
          }
        }
      }
    )
    if (atLeastOnePageLineInGreaterThanItShouldBe) {
      drawnMeasures.push(
        line(leftOffset + pageLineMaxWidth, topOfFirstStave, leftOffset + pageLineMaxWidth, bottomOfLastPageLineConsideringOnlyStaves, pageMaxWidthLineStrokeOptions)
      )
    }
    return elementWithAdditionalInformation(
      group(
        'measures',
        drawnMeasures
      ),
      {
        topOfFirstStave,
        bottomOfLastPageLineConsideringOnlyStaves
      }
    )
  }
}
