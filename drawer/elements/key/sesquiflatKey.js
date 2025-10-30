'use strict'

const stavePiece = require('./../stave/stavePiece')
const sesquiflatKeyShape = require('./sesquiflatKeyShape')
const group = require('./../basic/group')

module.exports = (numberOfStaveLines, positionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { stavePaddingForAccidentals } = styles
    const sesquiflatKeyShapeWithCoordinates = sesquiflatKeyShape(positionNumber)(styles, leftOffset + stavePaddingForAccidentals, topOffset)
    const sesquiflatKeyShapeWithCoordinatesWidth = sesquiflatKeyShapeWithCoordinates.right - sesquiflatKeyShapeWithCoordinates.left
    const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, stavePaddingForAccidentals + sesquiflatKeyShapeWithCoordinatesWidth + stavePaddingForAccidentals)(styles, leftOffset, topOffset)
    return group(
      'sesquiflatKey',
      [
        stavePieceWithCoordinates,
        sesquiflatKeyShapeWithCoordinates
      ]
    )
  }
}
