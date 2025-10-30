'use strict'

const stavePiece = require('./../stave/stavePiece')
const sesquisharpKeyShape = require('./sesquisharpKeyShape')
const group = require('./../basic/group')

module.exports = (numberOfStaveLines, positionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { stavePaddingForAccidentals } = styles
    const sesquisharpKeyShapeWithCoordinates = sesquisharpKeyShape(positionNumber)(styles, leftOffset + stavePaddingForAccidentals, topOffset)
    const sesquisharpKeyShapeWithCoordinatesWidth = sesquisharpKeyShapeWithCoordinates.right - sesquisharpKeyShapeWithCoordinates.left
    const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, stavePaddingForAccidentals + sesquisharpKeyShapeWithCoordinatesWidth + stavePaddingForAccidentals)(styles, leftOffset, topOffset)
    return group(
      'sharpKey',
      [
        stavePieceWithCoordinates,
        sesquisharpKeyShapeWithCoordinates
      ]
    )
  }
}
