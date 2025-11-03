'use strict'

import stavePiece from './../stave/stavePiece.js'
import sesquisharpKeyShape from './sesquisharpKeyShape.js'
import group from './../basic/group.js'

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
