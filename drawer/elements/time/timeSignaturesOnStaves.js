'use strict'

import topOffsetForCurrentStave from './../stave/topOffsetForCurrentStave.js'
import timeSignature from './timeSignature.js'
import group from './../basic/group.js'
import addPropertiesToElement from './../basic/addPropertiesToElement.js'

export default function (numberOfStaves, numberOfStaveLines, numerator, denominator, cMode, isClefBefore, isKeySignatureBefore, isFirstMeasureOnPageLine, measureIndexInGeneral, timeSignatureForEachLineId) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaves, intervalBetweenStaveLines } = styles
    const timeSignaturesOnStaves = []
    for (let staveIndex = 0; staveIndex < numberOfStaves; staveIndex++) {
      const calculatedTopOffsetForCurrentStave = topOffsetForCurrentStave(topOffset, staveIndex, intervalBetweenStaves, intervalBetweenStaveLines, numberOfStaveLines)
      const drawnTimeSignature = timeSignature(numberOfStaveLines, numerator, denominator, cMode, isClefBefore, isKeySignatureBefore)(styles, leftOffset, calculatedTopOffsetForCurrentStave)
      if (measureIndexInGeneral !== undefined) {
        addPropertiesToElement(
          drawnTimeSignature,
          {
            'ref-ids': `time-signature-${measureIndexInGeneral + 1}`
          }
        )
      }
      if (isFirstMeasureOnPageLine && timeSignatureForEachLineId !== undefined) {
        addPropertiesToElement(
          drawnTimeSignature,
          {
            'ref-ids': `time-signature-for-each-line-${timeSignatureForEachLineId}`
          }
        )
      }
      timeSignaturesOnStaves.push(drawnTimeSignature)
    }
    return group(
      'timeSignaturesOnStaves',
      timeSignaturesOnStaves
    )
  }
}
