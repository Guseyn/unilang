'use strict'

const stavePiece = require('./../stave/stavePiece')
const naturalKeyShape = require('./naturalKeyShape')
const group = require('./../basic/group')

module.exports = (numberOfStaveLines, positionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { stavePaddingForAccidentals } = styles
    const naturalKeyShapeWithCoordinates = naturalKeyShape(positionNumber)(styles, leftOffset + stavePaddingForAccidentals, topOffset)
    const naturalKeyShapeWithCoordinatesWidth = naturalKeyShapeWithCoordinates.right - naturalKeyShapeWithCoordinates.left
    const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, stavePaddingForAccidentals + naturalKeyShapeWithCoordinatesWidth + stavePaddingForAccidentals)(styles, leftOffset, topOffset)
    return group(
      'naturalKey',
      [
        stavePieceWithCoordinates,
        naturalKeyShapeWithCoordinates
      ]
    )
  }
}
