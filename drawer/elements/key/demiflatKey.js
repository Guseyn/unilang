'use strict'

const stavePiece = require('./../stave/stavePiece')
const demiflatKeyShape = require('./demiflatKeyShape')
const group = require('./../basic/group')

module.exports = (numberOfStaveLines, positionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { stavePaddingForAccidentals } = styles
    const demiflatKeyShapeWithCoordinates = demiflatKeyShape(positionNumber)(styles, leftOffset + stavePaddingForAccidentals, topOffset)
    const demiflatKeyShapeWithCoordinatesWidth = demiflatKeyShapeWithCoordinates.right - demiflatKeyShapeWithCoordinates.left
    const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, stavePaddingForAccidentals + demiflatKeyShapeWithCoordinatesWidth + stavePaddingForAccidentals)(styles, leftOffset, topOffset)
    return group(
      'demiflatKey',
      [
        stavePieceWithCoordinates,
        demiflatKeyShapeWithCoordinates
      ]
    )
  }
}
