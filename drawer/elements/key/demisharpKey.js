'use strict'

import stavePiece from './../stave/stavePiece.js'
import demisharpKeyShape from './demisharpKeyShape.js'
import group from './../basic/group.js'

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
