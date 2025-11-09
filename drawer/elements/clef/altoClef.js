'use strict'

import stavePiece from '#unilang/drawer/elements/stave/stavePiece.js'
import clefShape from '#unilang/drawer/elements/clef/clefShape.js'
import moveElement from '#unilang/drawer/elements/basic/moveElement.js'
import group from '#unilang/drawer/elements/basic/group.js'

export default function () {
  return (styles, leftOffset, topOffset) => {
    const { stavePieceWidthForClef } = styles
    const numberOfStaveLines = 5
    const altoShapeWithCoordinates = clefShape('alto')(styles, 0, topOffset)
    const xCorrection = (leftOffset + leftOffset + stavePieceWidthForClef) / 2 - (altoShapeWithCoordinates.right + altoShapeWithCoordinates.left) / 2
    moveElement(altoShapeWithCoordinates, xCorrection)
    const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, stavePieceWidthForClef)(styles, leftOffset, topOffset)
    return group(
      'altoClef',
      [
        stavePieceWithCoordinates,
        altoShapeWithCoordinates
      ]
    )
  }
}
