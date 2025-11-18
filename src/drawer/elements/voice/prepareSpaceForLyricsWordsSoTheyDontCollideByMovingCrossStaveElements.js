'use strict'

import text from '#unilang/drawer/elements/basic/text.js'
import moveElement from '#unilang/drawer/elements/basic/moveElement.js'
import moveCrossStaveElementsThatAttachedToCrossStaveUnit from '#unilang/drawer/elements/voice/moveCrossStaveElementsThatAttachedToCrossStaveUnit.js'

export default function (
  lyricsWordsElementsWithMaxWidthAmongAllLyricsWordsForEachCrossStaveUnitOnPageLineToPrepareSpaceBeforeDrawingThem,
  drawnVoices,
  styles
) {
  const { minXDistanceBetweenLyricsWords, minXDistanceBetweenLyricsWordsWithDashOrUnderscoreBetweenThem, lyricsFontOptions } = styles
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
    const xCenterOfCurrentCrossStaveUnit = (currentCrossStaveUnit.left + currentCrossStaveUnit.right) / 2
    const relatedLyrics = currentCrossStaveUnit.lyrics
    const prevLyricsWordOnPageLine = lyricsWordsElementsWithMaxWidthAmongAllLyricsWordsForEachCrossStaveUnitOnPageLineToPrepareSpaceBeforeDrawingThem[lyricsWordsElementsWithMaxWidthAmongAllLyricsWordsForEachCrossStaveUnitOnPageLineToPrepareSpaceBeforeDrawingThem.length - 1]
    if (relatedLyrics) {
      let lyricsWithMaxWidth
      for (let lyricsIndex = 0; lyricsIndex < relatedLyrics.length; lyricsIndex++) {
        if (relatedLyrics[lyricsIndex].textValue) {
          const lyricsText = text(relatedLyrics[lyricsIndex].textValue, lyricsFontOptions)(
            styles, xCenterOfCurrentCrossStaveUnit, 0
          )
          const lyricsTextWidth = lyricsText.right - lyricsText.left
          if ((lyricsWithMaxWidth === undefined) || (lyricsTextWidth > lyricsWithMaxWidth)) {
            lyricsWithMaxWidth = lyricsText
            if (relatedLyrics[lyricsIndex].dashAfter || relatedLyrics[lyricsIndex].underscoreStarts) {
              lyricsWithMaxWidth.dashAfterOrUnderscoreStarts = true
            }
          }
        }
      }
      if (lyricsWithMaxWidth) {
        if (prevLyricsWordOnPageLine) {
          if ((lyricsWithMaxWidth.left - prevLyricsWordOnPageLine.right) < minXDistanceBetweenLyricsWords) {
            const xDistanceToMove = prevLyricsWordOnPageLine.right - lyricsWithMaxWidth.left + (prevLyricsWordOnPageLine.dashAfterOrUnderscoreStarts ? minXDistanceBetweenLyricsWordsWithDashOrUnderscoreBetweenThem : minXDistanceBetweenLyricsWords)
            moveElement(lyricsWithMaxWidth, xDistanceToMove)
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
        lyricsWordsElementsWithMaxWidthAmongAllLyricsWordsForEachCrossStaveUnitOnPageLineToPrepareSpaceBeforeDrawingThem.push(lyricsWithMaxWidth)
      }
    }
  }
}
