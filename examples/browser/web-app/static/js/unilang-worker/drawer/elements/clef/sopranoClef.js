'use strict'

import stavePiece from '/js/unilang-worker/drawer/elements/stave/stavePiece.js'
import clefShape from '/js/unilang-worker/drawer/elements/clef/clefShape.js'
import moveElement from '/js/unilang-worker/drawer/elements/basic/moveElement.js'
import group from '/js/unilang-worker/drawer/elements/basic/group.js'

export default function () {
  return (styles, leftOffset, topOffset) => {
    const { stavePieceWidthForClef, topOffsetMarginForSopranoClef } = styles
    const numberOfLines = 5
    const altoShapeWithCoordinates = clefShape('alto')(styles, 0, topOffset + topOffsetMarginForSopranoClef)
    const xCorrection = (leftOffset + leftOffset + stavePieceWidthForClef) / 2 - (altoShapeWithCoordinates.right + altoShapeWithCoordinates.left) / 2
    moveElement(altoShapeWithCoordinates, xCorrection)
    const stavePieceWithCoordinates = stavePiece(numberOfLines, stavePieceWidthForClef)(styles, leftOffset, topOffset)
    return group(
      'sopranoClef',
      [
        stavePieceWithCoordinates,
        altoShapeWithCoordinates
      ]
    )
  }
}
