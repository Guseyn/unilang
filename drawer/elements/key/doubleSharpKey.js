'use strict'

import stavePiece from '#unilang/drawer/elements/stave/stavePiece.js'
import doubleSharpKeyShape from '#unilang/drawer/elements/key/doubleSharpKeyShape.js'
import group from '#unilang/drawer/elements/basic/group.js'

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
