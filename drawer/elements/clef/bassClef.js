'use strict'

import stavePiece from './../stave/stavePiece.js'
import clefShape from './clefShape.js'
import moveElement from './../basic/moveElement.js'
import group from './../basic/group.js'

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
