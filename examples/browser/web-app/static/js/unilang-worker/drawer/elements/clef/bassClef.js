'use strict'

import stavePiece from '/js/unilang-worker/drawer/elements/stave/stavePiece.js'
import clefShape from '/js/unilang-worker/drawer/elements/clef/clefShape.js'
import moveElement from '/js/unilang-worker/drawer/elements/basic/moveElement.js'
import group from '/js/unilang-worker/drawer/elements/basic/group.js'

export default function () {
  return (styles, leftOffset, topOffset) => {
    const { stavePieceWidthForClef } = styles
    const numberOfStaveLines = 5
    const bassShapeWithCoordinates = clefShape('bass')(styles, 0, topOffset)
    const xCorrection = (leftOffset + leftOffset + stavePieceWidthForClef) / 2 - (bassShapeWithCoordinates.right + bassShapeWithCoordinates.left) / 2
    moveElement(bassShapeWithCoordinates, xCorrection)
    const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, stavePieceWidthForClef)(styles, leftOffset, topOffset)
    return group(
      'bassCleff',
      [
        stavePieceWithCoordinates,
        bassShapeWithCoordinates
      ]
    )
  }
}
