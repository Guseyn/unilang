'use strict'

import stavePiece from '#repertoire/drawer/elements/stave/stavePiece.js'
import clefShape from '#repertoire/drawer/elements/clef/clefShape.js'
import moveElement from '#repertoire/drawer/elements/basic/moveElement.js'
import group from '#repertoire/drawer/elements/basic/group.js'

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
