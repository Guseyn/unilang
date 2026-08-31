'use strict'

import stavePiece from '/js/msq/msq-worker/drawer/elements/stave/stavePiece.js'
import clefShape from '/js/msq/msq-worker/drawer/elements/clef/clefShape.js'
import moveElement from '/js/msq/msq-worker/drawer/elements/basic/moveElement.js'
import group from '/js/msq/msq-worker/drawer/elements/basic/group.js'

export default function () {
  return (styles, leftOffset, topOffset) => {
    const { stavePieceWidthForClef, topOffsetMarginForMezzoSopranoClef } = styles
    const numberOfStaveLines = 5
    const altoShapeWithCoordinates = clefShape('alto')(styles, 0, topOffset + topOffsetMarginForMezzoSopranoClef)
    const xCorrection = (leftOffset + leftOffset + stavePieceWidthForClef) / 2 - (altoShapeWithCoordinates.right + altoShapeWithCoordinates.left) / 2
    moveElement(altoShapeWithCoordinates, xCorrection)
    const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, stavePieceWidthForClef)(styles, leftOffset, topOffset)
    return group(
      'mezzoSopranoClef',
      [
        stavePieceWithCoordinates,
        altoShapeWithCoordinates
      ]
    )
  }
}
