'use strict'

import text from '#unilang/drawer/elements/basic/text.js'
import moveElement from '#unilang/drawer/elements/basic/moveElement.js'
import topOffsetForCurrentStave from '#unilang/drawer/elements/stave/topOffsetForCurrentStave.js'
import group from '#unilang/drawer/elements/basic/group.js'
import addPropertiesToElement from '#unilang/drawer/elements/basic/addPropertiesToElement.js'

export default function (instrumentTitlesParams, numberOfStaveLines, isFirstMeasureOnPageLine, measureIndexInGeneral) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, intervalBetweenStaves } = styles
    const combinedInstrumentTitles = []
    let maxWidthOfTitle
    for (let instrumentTitleIndex = 0; instrumentTitleIndex < instrumentTitlesParams.length; instrumentTitleIndex++) {
      const instrumentTitleParams = instrumentTitlesParams[instrumentTitleIndex]
      if (instrumentTitleParams.value) {
        if (instrumentTitleParams.staveStartNumber !== undefined && instrumentTitleParams.staveEndNumber !== undefined) {
          const numberOfStaves = instrumentTitleParams.staveEndNumber - instrumentTitleParams.staveStartNumber + 1
          const topOffsetForStartStave = topOffsetForCurrentStave(topOffset, instrumentTitleParams.staveStartNumber, intervalBetweenStaves, intervalBetweenStaveLines, numberOfStaveLines)
          const bottomOffsetForEndStave = topOffsetForStartStave + numberOfStaves * (numberOfStaveLines - 1) * intervalBetweenStaveLines + (numberOfStaves - 1) * intervalBetweenStaves
          const middle = (topOffsetForStartStave + bottomOffsetForEndStave) / 2
          instrumentTitleParams.value = instrumentTitleParams.value.trim()
          const drawnTitle = text(instrumentTitleParams.value, styles.instrumentTitleFontOptions)(styles, leftOffset, middle)
          const lastCharOfInstrumentTitleValue = instrumentTitleParams.value[instrumentTitleParams.value.length - 1]
          const drawnTitleAsJustLastCharOfOriginalInstrumentTitleSoItCanBeAlignedToCenterOfLetSayBraceConnection = text(lastCharOfInstrumentTitleValue, styles.instrumentTitleFontOptions)(styles, leftOffset, middle)
          const drawnTitleAsJustLastCharOfOriginalInstrumentTitleSoItCanBeAlignedToCenterOfLetSayBraceConnectionMiddle = (drawnTitleAsJustLastCharOfOriginalInstrumentTitleSoItCanBeAlignedToCenterOfLetSayBraceConnection.bottom + drawnTitleAsJustLastCharOfOriginalInstrumentTitleSoItCanBeAlignedToCenterOfLetSayBraceConnection.top) / 2
          moveElement(
            drawnTitle,
            0,
            (drawnTitleAsJustLastCharOfOriginalInstrumentTitleSoItCanBeAlignedToCenterOfLetSayBraceConnectionMiddle > middle) ? (middle - drawnTitleAsJustLastCharOfOriginalInstrumentTitleSoItCanBeAlignedToCenterOfLetSayBraceConnectionMiddle) : (drawnTitleAsJustLastCharOfOriginalInstrumentTitleSoItCanBeAlignedToCenterOfLetSayBraceConnectionMiddle - middle)
          )
          addPropertiesToElement(
            drawnTitle,
            {
              'ref-ids': `instrument-title-${measureIndexInGeneral + 1}-${instrumentTitleIndex + 1}`
            }
          )
          if (isFirstMeasureOnPageLine && instrumentTitleParams.forEachLineId !== undefined) {
            addPropertiesToElement(
              drawnTitle,
              {
                'ref-ids': `instrument-title-for-each-line-${instrumentTitleParams.forEachLineId}`
              }
            )
          }
          combinedInstrumentTitles.push(
            drawnTitle
          )
          const currentTitleWidth = drawnTitle.right - drawnTitle.left
          if (maxWidthOfTitle === undefined || maxWidthOfTitle < currentTitleWidth) {
            maxWidthOfTitle = currentTitleWidth
          }
        } else if (instrumentTitleParams.staveNumber !== undefined) {
          const calculatedTopOffsetForCurrentStave = topOffsetForCurrentStave(topOffset, instrumentTitleParams.staveNumber, intervalBetweenStaves, intervalBetweenStaveLines, numberOfStaveLines)
          const calculatedBottomOffsetForCurrentStave = calculatedTopOffsetForCurrentStave + (numberOfStaveLines - 1) * intervalBetweenStaveLines
          const middle = (calculatedTopOffsetForCurrentStave + calculatedBottomOffsetForCurrentStave) / 2 - intervalBetweenStaveLines / 2
          const drawnTitle = text(instrumentTitleParams.value, styles.instrumentTitleFontOptions)(styles, leftOffset, middle)
          combinedInstrumentTitles.push(
            drawnTitle
          )
          const currentTitleWidth = drawnTitle.right - drawnTitle.left
          if (maxWidthOfTitle === undefined || maxWidthOfTitle < currentTitleWidth) {
            maxWidthOfTitle = currentTitleWidth
          }
        }
      }
    }
    for (let instrumentTitleIndex = 0; instrumentTitleIndex < combinedInstrumentTitles.length; instrumentTitleIndex++) {
      moveElement(
        combinedInstrumentTitles[instrumentTitleIndex],
        maxWidthOfTitle - (combinedInstrumentTitles[instrumentTitleIndex].right - combinedInstrumentTitles[instrumentTitleIndex].left)
      )
    }
    return group(
      'combinedInstrumentTitles',
      combinedInstrumentTitles
    )
  }
}
