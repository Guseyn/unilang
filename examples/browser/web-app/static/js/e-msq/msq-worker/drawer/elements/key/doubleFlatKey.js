'use strict'

import stavePiece from '/js/e-msq/msq-worker/drawer/elements/stave/stavePiece.js'
import flatKeyShape from '/js/e-msq/msq-worker/drawer/elements/key/flatKeyShape.js'
import group from '/js/e-msq/msq-worker/drawer/elements/basic/group.js'

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
