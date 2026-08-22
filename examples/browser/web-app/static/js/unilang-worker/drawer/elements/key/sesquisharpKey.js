'use strict'

import stavePiece from '/js/unilang-worker/drawer/elements/stave/stavePiece.js'
import sesquisharpKeyShape from '/js/unilang-worker/drawer/elements/key/sesquisharpKeyShape.js'
import group from '/js/unilang-worker/drawer/elements/basic/group.js'

export default function (numberOfStaveLines, positionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { stavePaddingForAccidentals } = styles
    const sesquisharpKeyShapeWithCoordinates = sesquisharpKeyShape(positionNumber)(styles, leftOffset + stavePaddingForAccidentals, topOffset)
    const sesquisharpKeyShapeWithCoordinatesWidth = sesquisharpKeyShapeWithCoordinates.right - sesquisharpKeyShapeWithCoordinates.left
    const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, stavePaddingForAccidentals + sesquisharpKeyShapeWithCoordinatesWidth + stavePaddingForAccidentals)(styles, leftOffset, topOffset)
    return group(
      'sharpKey',
      [
        stavePieceWithCoordinates,
        sesquisharpKeyShapeWithCoordinates
      ]
    )
  }
}
