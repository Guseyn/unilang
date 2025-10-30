'use strict'

const flatKey = require('./flatKey')
const sharpKey = require('./sharpKey')
const naturalKey = require('./naturalKey')
const keySignaturesStructures = require('./keySignaturesStructures')
const stavePiece = require('./../stave/stavePiece')
const group = require('./../basic/group')

module.exports = (numberOfStaveLines, clefName, keySignatureName) => {
  if (clefName === 'octaveEightUp' || clefName === 'octaveEightDown' || clefName === 'octaveFifteenUp' || clefName === 'octaveFifteenDown') {
    clefName = 'treble'
  }
  return (styles, leftOffset, topOffset) => {
    const { leftOffsetMarginForNonEmptyKeySignature, spaceWidthAfterKeySignature } = styles
    const metaForKeys = keySignaturesStructures[clefName] ? keySignaturesStructures[clefName][keySignatureName] : null
    const keysWithCoordinates = []
    let nextLeftOffset
    if (metaForKeys != null) {
      nextLeftOffset = leftOffset + (metaForKeys.length === 0 ? 0 : leftOffsetMarginForNonEmptyKeySignature)
      metaForKeys.forEach(metaForKey => {
        let keyWithCoordinates
        if (metaForKey.key === 'sharp') {
          keyWithCoordinates = sharpKey(numberOfStaveLines, metaForKey.positionNumber)(styles, nextLeftOffset, topOffset)
        } else if (metaForKey.key === 'flat') {
          keyWithCoordinates = flatKey(numberOfStaveLines, metaForKey.positionNumber)(styles, nextLeftOffset, topOffset)
        } else if (metaForKey.key === 'natural') {
          keyWithCoordinates = naturalKey(numberOfStaveLines, metaForKey.positionNumber)(styles, nextLeftOffset, topOffset)
        }
        keysWithCoordinates.push(keyWithCoordinates)
        nextLeftOffset = keyWithCoordinates.right
      })
    }
    if (keysWithCoordinates.length === 0) {
      return group(
        'keySignature',
        [
          stavePiece(numberOfStaveLines, 0)(styles, leftOffset, topOffset)
        ]
      )
    }
    return group(
      'keySignature',
      [
        stavePiece(numberOfStaveLines, leftOffsetMarginForNonEmptyKeySignature)(styles, leftOffset, topOffset),
        ...keysWithCoordinates,
        stavePiece(numberOfStaveLines, spaceWidthAfterKeySignature)(styles, nextLeftOffset, topOffset)
      ]
    )
  }
}
