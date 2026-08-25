'use strict'

import stavePiece from '#msq/drawer/elements/stave/stavePiece.js'
import flatKeyShape from '#msq/drawer/elements/key/flatKeyShape.js'
import group from '#msq/drawer/elements/basic/group.js'

export default function (numberOfStaveLines, positionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { stavePaddingForAccidentals } = styles
    const flatKeyShapeWithCoordinates = flatKeyShape(positionNumber)(styles, leftOffset + stavePaddingForAccidentals, topOffset)
    const flatKeyShapeWithCoordinatesWidth = flatKeyShapeWithCoordinates.right - flatKeyShapeWithCoordinates.left
    const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, stavePaddingForAccidentals + flatKeyShapeWithCoordinatesWidth + stavePaddingForAccidentals)(styles, leftOffset, topOffset)
    return group(
      'flatKey',
      [
        stavePieceWithCoordinates,
        flatKeyShapeWithCoordinates
      ]
    )
  }
}
