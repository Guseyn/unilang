'use strict'

import minTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex from './minTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex.js'
import text from './../basic/text.js'
import line from './../basic/line.js'
import group from './../basic/group.js'
import addPropertiesToElement from './../basic/addPropertiesToElement.js'

const lyricsUnderscoreLine = (width, xStartPosition, yPosition, strokeOptions) => {
  return line(xStartPosition, yPosition, xStartPosition + width, yPosition, strokeOptions, 0, 0, 'lyricUnderscore')
}

export default function (drawnVoicesOnPageLine, drawnMeasuresOnPageLine, voicesBodiesOnPageLine, styles) {
  const { intervalBetweenStaveLines, lyricsFirstYOffset, lyricsYOffset, lyricsFontOptions, lyricsUnderscoreStrokeOptions, lyricsUnderscoreDefaultLength, lyricsEmptyTextHeight, lastDashOfLyricsXOffset, underscoreOfLyricsXOffset, lyricsLastDashFontOptions } = styles
  const drawnLyrics = []
  const lyricsState = []
  if (drawnVoicesOnPageLine) {
    let calculatedMaxBottomOfCrossVoicesUnitsOnSpecifiedStaveForAllMeasures
    for (let measureIndex = 0; measureIndex < drawnVoicesOnPageLine.length; measureIndex++) {
      if (drawnVoicesOnPageLine[measureIndex]) {
        const { drawnSingleUnitsInVoices, topOffsetsForEachStave, numberOfStaveLines, withoutVoices } = drawnVoicesOnPageLine[measureIndex]
        const currentMeasure = drawnMeasuresOnPageLine[measureIndex]
        if (!withoutVoices) {
          const calculatedMaxBottomOfCrossVoicesUnitsOnSpecifiedStaveForCurrentMeasure = minTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex(drawnSingleUnitsInVoices, topOffsetsForEachStave, numberOfStaveLines, currentMeasure.lyricsUnderStaveIndex, styles).max
          if (calculatedMaxBottomOfCrossVoicesUnitsOnSpecifiedStaveForAllMeasures === undefined || calculatedMaxBottomOfCrossVoicesUnitsOnSpecifiedStaveForCurrentMeasure > calculatedMaxBottomOfCrossVoicesUnitsOnSpecifiedStaveForAllMeasures) {
            calculatedMaxBottomOfCrossVoicesUnitsOnSpecifiedStaveForAllMeasures = calculatedMaxBottomOfCrossVoicesUnitsOnSpecifiedStaveForCurrentMeasure
          }
        }
      }
    }
    const allSingleUnitsThatNeedAdjustmentAfterDrawingLyrics = []
    const allCrossStaveUnitsWhereSingleUnitsThatNeedAdjustmentAfterDrawingLyrics = []
    for (let measureIndex = 0; measureIndex < drawnVoicesOnPageLine.length; measureIndex++) {
      if (drawnVoicesOnPageLine[measureIndex]) {
        const { drawnCrossStaveUnits, drawnSingleUnitsInVoices, isOnLastMeasureOfPageLine, withoutVoices } = drawnVoicesOnPageLine[measureIndex]
        if (!withoutVoices) {
          const lyricsUnderStaveIndex = drawnSingleUnitsInVoices[drawnMeasuresOnPageLine[measureIndex].lyricsUnderStaveIndex]
            ? drawnMeasuresOnPageLine[measureIndex].lyricsUnderStaveIndex
            : 0
          let relatedLyricsForLastCrossStaveUnitOnPageLine
          let thereAreNoCrossStaveUnitsInMeasuresAfter = true
          for (let measureIndexAfter = measureIndex + 1; measureIndexAfter < drawnVoicesOnPageLine.length; measureIndexAfter++) {
            if (drawnVoicesOnPageLine[measureIndexAfter]) {
              const { drawnCrossStaveUnits, withoutVoices } = drawnVoicesOnPageLine[measureIndexAfter]
              if (!withoutVoices && (drawnCrossStaveUnits.length !== 0)) {
                thereAreNoCrossStaveUnitsInMeasuresAfter = false
                break
              }
            }
          }
          for (let crossStaveUnitIndex = 0; crossStaveUnitIndex < drawnCrossStaveUnits.length; crossStaveUnitIndex++) {
            const currentCrossStaveUnit = drawnCrossStaveUnits[crossStaveUnitIndex]
            const isLastCrossStaveUnitOnPageLine = (isOnLastMeasureOfPageLine || thereAreNoCrossStaveUnitsInMeasuresAfter) && !drawnCrossStaveUnits[crossStaveUnitIndex + 1]
            if (currentCrossStaveUnit.lyrics) {
              const relatedLyrics = currentCrossStaveUnit.lyrics
              if (isLastCrossStaveUnitOnPageLine) {
                relatedLyricsForLastCrossStaveUnitOnPageLine = relatedLyrics
              }
              for (let lyricsIndex = 0; lyricsIndex < relatedLyrics.length; lyricsIndex++) {
                if (!lyricsState[lyricsIndex]) {
                  lyricsState[lyricsIndex] = {
                    lyricsIndex: relatedLyrics[lyricsIndex].lyricsIndex
                  }
                }
                if (relatedLyrics[lyricsIndex].textValue) {
                  const yCorrection = relatedLyrics[lyricsIndex].yCorrection || lyricsState[lyricsIndex].yCorrection || 0
                  lyricsState[lyricsIndex].yCorrection = yCorrection
                  if (lyricsIndex > 0 && !lyricsState[lyricsIndex - 1].yPosition) {
                    lyricsState[lyricsIndex - 1].yPosition = calculatedMaxBottomOfCrossVoicesUnitsOnSpecifiedStaveForAllMeasures + lyricsFirstYOffset
                  }
                  const yPosition = lyricsIndex === 0
                    ? calculatedMaxBottomOfCrossVoicesUnitsOnSpecifiedStaveForAllMeasures + lyricsFirstYOffset + yCorrection * intervalBetweenStaveLines
                    : lyricsState[lyricsIndex - 1].yPosition + lyricsYOffset + yCorrection * intervalBetweenStaveLines
                  lyricsState[lyricsIndex].yPosition = yPosition
                  const xCenterOfCurrentCrossStaveUnit = (currentCrossStaveUnit.left + currentCrossStaveUnit.right) / 2
                  const lyricsText = text(relatedLyrics[lyricsIndex].textValue, lyricsFontOptions)(
                    styles, xCenterOfCurrentCrossStaveUnit, yPosition
                  )
                  lyricsText.value = relatedLyrics[lyricsIndex].textValue
                  addPropertiesToElement(
                    lyricsText,
                    {
                      'ref-ids': `lyrics,lyrics-${relatedLyrics[lyricsIndex].measureIndexInGeneral + 1}-${relatedLyrics[lyricsIndex].staveIndex + 1}-${relatedLyrics[lyricsIndex].voiceIndex + 1}-${relatedLyrics[lyricsIndex].singleUnitIndex + 1}-${relatedLyrics[lyricsIndex].lyricsIndex + 1},lyrics-text-${relatedLyrics[lyricsIndex].measureIndexInGeneral + 1}-${relatedLyrics[lyricsIndex].staveIndex + 1}-${relatedLyrics[lyricsIndex].voiceIndex + 1}-${relatedLyrics[lyricsIndex].singleUnitIndex + 1}-${relatedLyrics[lyricsIndex].lyricsIndex + 1}`
                    }
                  )
                  drawnLyrics.push(lyricsText)
                  if (lyricsState[lyricsIndex].textBeforeUnderscoreOrDash && relatedLyrics[lyricsIndex].underscoreFinishes && lyricsState[lyricsIndex].underscoreStarts) {
                    const lyricsUnderscoreLineWidth = Math.max(
                      lyricsText.left - lyricsState[lyricsIndex].textBeforeUnderscoreOrDash.right,
                      lyricsUnderscoreDefaultLength
                    )
                    const underscoreLine = lyricsUnderscoreLine(
                      lyricsUnderscoreLineWidth - 2 * underscoreOfLyricsXOffset,
                      lyricsState[lyricsIndex].textBeforeUnderscoreOrDash.right + underscoreOfLyricsXOffset,
                      lyricsState[lyricsIndex].textBeforeUnderscoreOrDash.bottom - lyricsUnderscoreStrokeOptions.width / 2,
                      lyricsUnderscoreStrokeOptions
                    )
                    addPropertiesToElement(
                      underscoreLine,
                      {
                        'ref-ids': `lyrics,lyrics-${relatedLyrics[lyricsIndex].measureIndexInGeneral + 1}-${relatedLyrics[lyricsIndex].staveIndex + 1}-${relatedLyrics[lyricsIndex].voiceIndex + 1}-${relatedLyrics[lyricsIndex].singleUnitIndex + 1}-${relatedLyrics[lyricsIndex].lyricsIndex + 1},lyrics-underscore-starts-${lyricsState[lyricsIndex].measureIndexInGeneralWhereUnderscoreStarts + 1}-${lyricsState[lyricsIndex].staveIndexWhereUnderscoreStarts + 1}-${lyricsState[lyricsIndex].voiceIndexWhereUnderscoreStarts + 1}-${lyricsState[lyricsIndex].singleUnitIndexWhereUnderscoreStarts + 1}-${lyricsState[lyricsIndex].lyricsIndex + 1},lyrics-underscore-finishes-${relatedLyrics[lyricsIndex].measureIndexInGeneral + 1}-${relatedLyrics[lyricsIndex].staveIndex + 1}-${relatedLyrics[lyricsIndex].voiceIndex + 1}-${relatedLyrics[lyricsIndex].singleUnitIndex + 1}-${relatedLyrics[lyricsIndex].lyricsIndex + 1}`
                      }
                    )
                    drawnLyrics.push(underscoreLine)
                  }
                  lyricsState[lyricsIndex].underscoreStarts = false
                  lyricsState[lyricsIndex].measureIndexInGeneralWhereUnderscoreStarts = undefined
                  lyricsState[lyricsIndex].staveIndexWhereUnderscoreStarts = undefined
                  lyricsState[lyricsIndex].voiceIndexWhereUnderscoreStarts = undefined
                  lyricsState[lyricsIndex].singleUnitIndexWhereUnderscoreStarts = undefined
                  if (relatedLyrics[lyricsIndex].underscoreStarts) {
                    lyricsState[lyricsIndex].underscoreStarts = true
                    lyricsState[lyricsIndex].measureIndexInGeneralWhereUnderscoreStarts = relatedLyrics[lyricsIndex].measureIndexInGeneral
                    lyricsState[lyricsIndex].staveIndexWhereUnderscoreStarts = relatedLyrics[lyricsIndex].staveIndex
                    lyricsState[lyricsIndex].voiceIndexWhereUnderscoreStarts = relatedLyrics[lyricsIndex].voiceIndex
                    lyricsState[lyricsIndex].singleUnitIndexWhereUnderscoreStarts = relatedLyrics[lyricsIndex].singleUnitIndex
                  }
                  if (lyricsState[lyricsIndex].dashAfter) {
                    const xCenterBetweenThisTextAndPreviousOne = (lyricsText.left + lyricsState[lyricsIndex].textBeforeUnderscoreOrDash.right) / 2
                    const dashText = text('-', lyricsFontOptions)(
                      styles, xCenterBetweenThisTextAndPreviousOne, lyricsState[lyricsIndex].yPosition
                    )
                    addPropertiesToElement(
                      dashText,
                      {
                        'ref-ids': `lyrics,lyrics-${relatedLyrics[lyricsIndex].measureIndexInGeneral + 1}-${relatedLyrics[lyricsIndex].staveIndex + 1}-${relatedLyrics[lyricsIndex].voiceIndex + 1}-${relatedLyrics[lyricsIndex].singleUnitIndex + 1}-${relatedLyrics[lyricsIndex].lyricsIndex + 1},lyrics-dash-${relatedLyrics[lyricsIndex].measureIndexInGeneral + 1}-${relatedLyrics[lyricsIndex].staveIndex + 1}-${relatedLyrics[lyricsIndex].voiceIndex + 1}-${relatedLyrics[lyricsIndex].singleUnitIndex + 1}-${relatedLyrics[lyricsIndex].lyricsIndex + 1}`
                      }
                    )
                    drawnLyrics.push(dashText)
                    lyricsState[lyricsIndex].dashAfter = false
                  }
                  if (relatedLyrics[lyricsIndex].dashAfter) {
                    lyricsState[lyricsIndex].dashAfter = true
                  }
                  lyricsState[lyricsIndex].textBeforeUnderscoreOrDash = lyricsText
                }
                if (!relatedLyrics[lyricsIndex].textValue) {
                  const yCorrection = relatedLyrics[lyricsIndex].yCorrection || lyricsState[lyricsIndex].yCorrection || 0
                  lyricsState[lyricsIndex].yCorrection = yCorrection
                  if (lyricsIndex > 0 && !lyricsState[lyricsIndex - 1].yPosition) {
                    lyricsState[lyricsIndex - 1].yPosition = calculatedMaxBottomOfCrossVoicesUnitsOnSpecifiedStaveForAllMeasures + lyricsFirstYOffset
                  }
                  const yPosition = lyricsIndex === 0
                    ? calculatedMaxBottomOfCrossVoicesUnitsOnSpecifiedStaveForAllMeasures + lyricsFirstYOffset + yCorrection * intervalBetweenStaveLines
                    : lyricsState[lyricsIndex - 1].yPosition + lyricsYOffset + yCorrection * intervalBetweenStaveLines
                  lyricsState[lyricsIndex].yPosition = yPosition
                  if (!relatedLyrics[lyricsIndex].underscoreFinishes) {
                    lyricsState[lyricsIndex].textBeforeUnderscoreOrDash = {
                      value: '',
                      right: currentCrossStaveUnit.left,
                      left: currentCrossStaveUnit.left,
                      top: yPosition,
                      bottom: yPosition + lyricsEmptyTextHeight
                    }
                  }
                  if (relatedLyrics[lyricsIndex].underscoreFinishes && lyricsState[lyricsIndex].underscoreStarts) {
                    const textBeforeUnderscoreOrDashStartXPoint = lyricsState[lyricsIndex].textBeforeUnderscoreOrDash.value === ''
                      ? lyricsState[lyricsIndex].textBeforeUnderscoreOrDash.left
                      : lyricsState[lyricsIndex].textBeforeUnderscoreOrDash.right
                    const lyricsUnderscoreLineWidth = Math.max(
                      currentCrossStaveUnit.right - textBeforeUnderscoreOrDashStartXPoint,
                      lyricsUnderscoreDefaultLength
                    )
                    const underscoreLine = lyricsUnderscoreLine(
                      lyricsUnderscoreLineWidth - 2 * underscoreOfLyricsXOffset,
                      textBeforeUnderscoreOrDashStartXPoint + underscoreOfLyricsXOffset,
                      lyricsState[lyricsIndex].textBeforeUnderscoreOrDash.bottom - lyricsUnderscoreStrokeOptions.width / 2,
                      lyricsUnderscoreStrokeOptions
                    )
                    addPropertiesToElement(
                      underscoreLine,
                      {
                        'ref-ids': `lyrics,lyrics-${relatedLyrics[lyricsIndex].measureIndexInGeneral + 1}-${relatedLyrics[lyricsIndex].staveIndex + 1}-${relatedLyrics[lyricsIndex].voiceIndex + 1}-${relatedLyrics[lyricsIndex].singleUnitIndex + 1}-${relatedLyrics[lyricsIndex].lyricsIndex + 1},lyrics-underscore-starts-${lyricsState[lyricsIndex].measureIndexInGeneralWhereUnderscoreStarts + 1}-${lyricsState[lyricsIndex].staveIndexWhereUnderscoreStarts + 1}-${lyricsState[lyricsIndex].voiceIndexWhereUnderscoreStarts + 1}-${lyricsState[lyricsIndex].singleUnitIndexWhereUnderscoreStarts + 1}-${relatedLyrics[lyricsIndex].lyricsIndex + 1},lyrics-underscore-finishes-${relatedLyrics[lyricsIndex].measureIndexInGeneral + 1}-${relatedLyrics[lyricsIndex].staveIndex + 1}-${relatedLyrics[lyricsIndex].voiceIndex + 1}-${relatedLyrics[lyricsIndex].singleUnitIndex + 1}-${relatedLyrics[lyricsIndex].lyricsIndex + 1}`
                      }
                    )
                    drawnLyrics.push(underscoreLine)
                    lyricsState[lyricsIndex].underscoreStarts = false
                    lyricsState[lyricsIndex].measureIndexInGeneralWhereUnderscoreStarts = undefined
                    lyricsState[lyricsIndex].staveIndexWhereUnderscoreStarts = undefined
                    lyricsState[lyricsIndex].voiceIndexWhereUnderscoreStarts = undefined
                    lyricsState[lyricsIndex].singleUnitIndexWhereUnderscoreStarts = undefined
                  }
                }
              }
            }
            if (isLastCrossStaveUnitOnPageLine) {
              for (let lyricsIndex = 0; lyricsIndex < lyricsState.length; lyricsIndex++) {
                if (lyricsState[lyricsIndex].underscoreStarts && lyricsState[lyricsIndex].textBeforeUnderscoreOrDash) {
                  const textBeforeUnderscoreOrDashStartXPoint = (
                    lyricsState[lyricsIndex].textBeforeUnderscoreOrDash.value === ''
                      ? lyricsState[lyricsIndex].textBeforeUnderscoreOrDash.left
                      : lyricsState[lyricsIndex].textBeforeUnderscoreOrDash.right
                  )
                  const lyricsUnderscoreLineWidth = Math.max(
                    currentCrossStaveUnit.right - textBeforeUnderscoreOrDashStartXPoint,
                    lyricsUnderscoreDefaultLength
                  )
                  const underscoreLine = lyricsUnderscoreLine(
                    lyricsUnderscoreLineWidth - underscoreOfLyricsXOffset,
                    textBeforeUnderscoreOrDashStartXPoint + underscoreOfLyricsXOffset,
                    lyricsState[lyricsIndex].textBeforeUnderscoreOrDash.bottom - lyricsUnderscoreStrokeOptions.width / 2,
                    lyricsUnderscoreStrokeOptions
                  )
                  addPropertiesToElement(
                    underscoreLine,
                    {
                      'ref-ids': `lyrics,lyrics-${lyricsState[lyricsIndex].measureIndexInGeneral + 1}-${lyricsState[lyricsIndex].staveIndex + 1}-${lyricsState[lyricsIndex].voiceIndex + 1}-${lyricsState[lyricsIndex].singleUnitIndex + 1}-${lyricsState[lyricsIndex].lyricsIndex + 1},lyrics-underscore-starts-${lyricsState[lyricsIndex].measureIndexInGeneralWhereUnderscoreStarts + 1}-${lyricsState[lyricsIndex].staveIndexWhereUnderscoreStarts + 1}-${lyricsState[lyricsIndex].voiceIndexWhereUnderscoreStarts + 1}-${lyricsState[lyricsIndex].singleUnitIndexWhereUnderscoreStarts + 1}-${lyricsState[lyricsIndex].lyricsIndex + 1}`
                    }
                  )
                  drawnLyrics.push(underscoreLine)
                  lyricsState[lyricsIndex].underscoreStarts = false
                  lyricsState[lyricsIndex].measureIndexInGeneralWhereUnderscoreStarts = undefined
                  lyricsState[lyricsIndex].staveIndexWhereUnderscoreStarts = undefined
                  lyricsState[lyricsIndex].voiceIndexWhereUnderscoreStarts = undefined
                  lyricsState[lyricsIndex].singleUnitIndexWhereUnderscoreStarts = undefined
                }
              }
              if (relatedLyricsForLastCrossStaveUnitOnPageLine) {
                for (let lyricsIndex = 0; lyricsIndex < relatedLyricsForLastCrossStaveUnitOnPageLine.length; lyricsIndex++) {
                  if (lyricsState[lyricsIndex].textBeforeUnderscoreOrDash) {
                    const textBeforeUnderscoreOrDashStartXPoint = (
                      lyricsState[lyricsIndex].textBeforeUnderscoreOrDash.value === ''
                        ? lyricsState[lyricsIndex].textBeforeUnderscoreOrDash.left
                        : lyricsState[lyricsIndex].textBeforeUnderscoreOrDash.right
                    )
                    if (relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].dashAfter) {
                      const dashText = text(' - ', lyricsLastDashFontOptions)(
                        styles, textBeforeUnderscoreOrDashStartXPoint + lastDashOfLyricsXOffset, lyricsState[lyricsIndex].yPosition
                      )
                      addPropertiesToElement(
                        dashText,
                        {
                          'ref-ids': `lyrics,lyrics-${relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].measureIndexInGeneral + 1}-${relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].staveIndex + 1}-${relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].voiceIndex + 1}-${relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].singleUnitIndex + 1}-${relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].lyricsIndex + 1},lyrics-dash-${relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].measureIndexInGeneral + 1}-${relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].staveIndex + 1}-${relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].voiceIndex + 1}-${relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].singleUnitIndex + 1}-${relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].lyricsIndex + 1}`
                        }
                      )
                      drawnLyrics.push(dashText)
                    }
                    if (relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].underscoreStarts) {
                      const underscoreLine = lyricsUnderscoreLine(
                        lyricsUnderscoreDefaultLength - underscoreOfLyricsXOffset,
                        textBeforeUnderscoreOrDashStartXPoint + underscoreOfLyricsXOffset,
                        lyricsState[lyricsIndex].textBeforeUnderscoreOrDash.bottom - lyricsUnderscoreStrokeOptions.width / 2,
                        lyricsUnderscoreStrokeOptions
                      )
                      addPropertiesToElement(
                        underscoreLine,
                        {
                          'ref-ids': `lyrics,lyrics-${relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].measureIndexInGeneral + 1}-${relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].staveIndex + 1}-${relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].voiceIndex + 1}-${relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].singleUnitIndex + 1}-${relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].lyricsIndex + 1},lyrics-underscore-starts-${relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].measureIndexInGeneral + 1}-${relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].staveIndex + 1}-${relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].voiceIndex + 1}-${relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].singleUnitIndex + 1}-${relatedLyricsForLastCrossStaveUnitOnPageLine[lyricsIndex].lyricsIndex + 1}`
                        }
                      )
                      drawnLyrics.push(underscoreLine)
                    }
                  }
                }
              }
            }
            if (currentCrossStaveUnit.lyrics || lyricsState.some(lyrics => lyrics.underscoreStarts) || lyricsState.some(lyrics => lyrics.dashAfter)) {
              allSingleUnitsThatNeedAdjustmentAfterDrawingLyrics.push(...currentCrossStaveUnit.singleUnitsByStaveIndexes[lyricsUnderStaveIndex])
              allCrossStaveUnitsWhereSingleUnitsThatNeedAdjustmentAfterDrawingLyrics.push(currentCrossStaveUnit)
            }
          }
        }
      }
    }
    const tmpGroupForLyrics = group(
      'tmpLyrics', drawnLyrics
    )
    allSingleUnitsThatNeedAdjustmentAfterDrawingLyrics.forEach(singleUnit => {
      singleUnit.bottom = tmpGroupForLyrics.bottom
    })
    allCrossStaveUnitsWhereSingleUnitsThatNeedAdjustmentAfterDrawingLyrics.forEach((crossStaveUnit) => {
      const { measureIndexOnPageLine } = crossStaveUnit
      if (voicesBodiesOnPageLine[measureIndexOnPageLine]) {
        voicesBodiesOnPageLine[measureIndexOnPageLine].bottom = Math.max(voicesBodiesOnPageLine[measureIndexOnPageLine].bottom, tmpGroupForLyrics.bottom)
      }
      if (drawnMeasuresOnPageLine[measureIndexOnPageLine].bottom) {
        drawnMeasuresOnPageLine[measureIndexOnPageLine].bottom = Math.max(drawnMeasuresOnPageLine[measureIndexOnPageLine].bottom, tmpGroupForLyrics.bottom)
      }
    })
  }
  return drawnLyrics
}
