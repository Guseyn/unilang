'use strict'

import stavePiece from '/js/unilang-in-worker-environment/drawer/elements/stave/stavePiece.js'
import demisharpKeyShape from '/js/unilang-in-worker-environment/drawer/elements/key/demisharpKeyShape.js'
import group from '/js/unilang-in-worker-environment/drawer/elements/basic/group.js'

export default function (numberOfStaveLines, positionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { stavePaddingForAccidentals } = styles
    const demisharpKeyShapeWithCoordinates = demisharpKeyShape(positionNumber)(styles, leftOffset + stavePaddingForAccidentals, topOffset)
    const demisharpKeyShapeWithCoordinatesWidth = demisharpKeyShapeWithCoordinates.right - demisharpKeyShapeWithCoordinates.left
    const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, stavePaddingForAccidentals + demisharpKeyShapeWithCoordinatesWidth + stavePaddingForAccidentals)(styles, leftOffset, topOffset)
    return group(
      'sharpKey',
      [
        stavePieceWithCoordinates,
        demisharpKeyShapeWithCoordinates
      ]
    )
  }
}
