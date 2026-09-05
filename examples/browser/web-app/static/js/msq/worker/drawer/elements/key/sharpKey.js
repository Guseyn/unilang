'use strict'

import stavePiece from '/js/msq/worker/drawer/elements/stave/stavePiece.js'
import sharpKeyShape from '/js/msq/worker/drawer/elements/key/sharpKeyShape.js'
import group from '/js/msq/worker/drawer/elements/basic/group.js'

export default function (numberOfStaveLines, positionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { stavePaddingForAccidentals } = styles
    const sharpKeyShapeWithCoordinates = sharpKeyShape(positionNumber)(styles, leftOffset + stavePaddingForAccidentals, topOffset)
    const sharpKeyShapeWithCoordinatesWidth = sharpKeyShapeWithCoordinates.right - sharpKeyShapeWithCoordinates.left
    const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, stavePaddingForAccidentals + sharpKeyShapeWithCoordinatesWidth + stavePaddingForAccidentals)(styles, leftOffset, topOffset)
    return group(
      'sharpKey',
      [
        stavePieceWithCoordinates,
        sharpKeyShapeWithCoordinates
      ]
    )
  }
}
