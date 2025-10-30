'use strict'

const topOffsetForCurrentStave = require('./../stave/topOffsetForCurrentStave')
const timeSignature = require('./timeSignature')
const group = require('./../basic/group')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

module.exports = (numberOfStaves, numberOfStaveLines, numerator, denominator, cMode, isClefBefore, isKeySignatureBefore, isFirstMeasureOnPageLine, measureIndexInGeneral, timeSignatureForEachLineId) => {
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
