'use strict'

const topOffsetForCurrentStave = require('./../stave/topOffsetForCurrentStave')
const stavePiece = require('./../stave/stavePiece')
const keySignature = require('./keySignature')
const group = require('./../basic/group')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

module.exports = (numberOfStaveLines, clefsNames, keySignatureName, keySignatureNameForEachLineId, measureIndexInGeneralOfRefId, staveIndexOfRefId, voiceIndexOfRefId, singleUnitIndexOfRefId) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaves, intervalBetweenStaveLines } = styles
    const keySignaturesOnStaves = []
    for (let staveIndex = 0; staveIndex < clefsNames.length; staveIndex++) {
      const calculatedTopOffsetForCurrentStave = topOffsetForCurrentStave(topOffset, staveIndex, intervalBetweenStaves, intervalBetweenStaveLines, numberOfStaveLines)
      const clefName = clefsNames[staveIndex]
      if (!clefName) {
        const tmpKeySignature = keySignature(numberOfStaveLines, 'treble', keySignatureName)(styles, leftOffset, calculatedTopOffsetForCurrentStave)
        const tmpKeySignatureWidth = tmpKeySignature.right - tmpKeySignature.left
        keySignaturesOnStaves.push(
          stavePiece(numberOfStaveLines, tmpKeySignatureWidth)(styles, leftOffset, calculatedTopOffsetForCurrentStave)
        )
      } else {
        const drawnKeySignature = keySignature(numberOfStaveLines, clefName, keySignatureName)(styles, leftOffset, calculatedTopOffsetForCurrentStave)
        keySignaturesOnStaves.push(
          drawnKeySignature
        )
        if (measureIndexInGeneralOfRefId !== undefined) {
          addPropertiesToElement(
            drawnKeySignature,
            {
              'ref-ids': `key-signature-${measureIndexInGeneralOfRefId + 1}`
            }
          )
        }
        if (keySignatureNameForEachLineId !== undefined) {
          addPropertiesToElement(
            drawnKeySignature,
            {
              'ref-ids': `key-signature-for-each-line-${keySignatureNameForEachLineId}`
            }
          )
        }
        if (
          (measureIndexInGeneralOfRefId !== undefined) &&
          (staveIndexOfRefId !== undefined) &&
          (voiceIndexOfRefId !== undefined) &&
          (singleUnitIndexOfRefId !== undefined)
        ) {
          addPropertiesToElement(
            drawnKeySignature,
            {
              'ref-ids': `key-signature-before-${measureIndexInGeneralOfRefId + 1}-${staveIndexOfRefId + 1}-${voiceIndexOfRefId + 1}-${singleUnitIndexOfRefId + 1}`
            }
          )
        }
      }
    }
    return group(
      'keySignaturesOnStaves',
      keySignaturesOnStaves
    )
  }
}
