'use strict'

const stavePiece = require('./../stave/stavePiece')
const flatKeyShape = require('./flatKeyShape')
const group = require('./../basic/group')

module.exports = (numberOfStaveLines, positionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { stavePaddingForAccidentals } = styles
    const flatKeyShapeWithCoordinates = flatKeyShape(positionNumber)(styles, leftOffset + stavePaddingForAccidentals, topOffset)
    const flatKeyShapeWithCoordinatesWidth = flatKeyShapeWithCoordinates.right - flatKeyShapeWithCoordinates.left
    const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, stavePaddingForAccidentals + flatKeyShapeWithCoordinatesWidth + stavePaddingForAccidentals)(styles, leftOffset, topOffset)
    return group(
      'doubleFlatKey',
      [
        stavePieceWithCoordinates,
        flatKeyShapeWithCoordinates
      ]
    )
  }
}
