'use strict'

import stavePiece from './../stave/stavePiece.js'
import doubleSharpKeyShape from './doubleSharpKeyShape.js'
import group from './../basic/group.js'

export default function (numberOfStaveLines, positionNumber) {
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
