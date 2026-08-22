'use strict'

import stavePiece from '/js/e-repertoire/repertoire-worker/drawer/elements/stave/stavePiece.js'
import doubleSharpKeyShape from '/js/e-repertoire/repertoire-worker/drawer/elements/key/doubleSharpKeyShape.js'
import group from '/js/e-repertoire/repertoire-worker/drawer/elements/basic/group.js'

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
