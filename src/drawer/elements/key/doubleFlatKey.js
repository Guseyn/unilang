'use strict'

import stavePiece from '#repertoire/drawer/elements/stave/stavePiece.js'
import flatKeyShape from '#repertoire/drawer/elements/key/flatKeyShape.js'
import group from '#repertoire/drawer/elements/basic/group.js'

export default function (numberOfStaveLines, positionNumber) {
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
