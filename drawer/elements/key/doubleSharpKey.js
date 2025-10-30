'use strict'

const stavePiece = require('./../stave/stavePiece')
const doubleSharpKeyShape = require('./doubleSharpKeyShape')
const group = require('./../basic/group')

module.exports = (numberOfStaveLines, positionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { stavePaddingForAccidentals } = styles
    const doubleSharpKeyShapeWithCoordinates = doubleSharpKeyShape(positionNumber)(styles, leftOffset + stavePaddingForAccidentals, topOffset)
    const doubleSharpKeyShapeWithCoordinatesWidth = doubleSharpKeyShapeWithCoordinates.right - doubleSharpKeyShapeWithCoordinates.left
    const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, stavePaddingForAccidentals + doubleSharpKeyShapeWithCoordinatesWidth + stavePaddingForAccidentals)(styles, leftOffset, topOffset)
    return group(
      'doubleSharpKey',
      [
        stavePieceWithCoordinates,
        doubleSharpKeyShapeWithCoordinates
      ]
    )
  }
}
