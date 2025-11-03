'use strict'

import stavePiece from './../stave/stavePiece.js'
import naturalKeyShape from './naturalKeyShape.js'
import group from './../basic/group.js'

export default function (numberOfStaveLines, positionNumber) {
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
