'use strict'

import stavePiece from './../stave/stavePiece.js'
import sesquiflatKeyShape from './sesquiflatKeyShape.js'
import group from './../basic/group.js'

export default function (numberOfStaveLines, positionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { stavePaddingForAccidentals } = styles
    const sesquiflatKeyShapeWithCoordinates = sesquiflatKeyShape(positionNumber)(styles, leftOffset + stavePaddingForAccidentals, topOffset)
    const sesquiflatKeyShapeWithCoordinatesWidth = sesquiflatKeyShapeWithCoordinates.right - sesquiflatKeyShapeWithCoordinates.left
    const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, stavePaddingForAccidentals + sesquiflatKeyShapeWithCoordinatesWidth + stavePaddingForAccidentals)(styles, leftOffset, topOffset)
    return group(
      'sesquiflatKey',
      [
        stavePieceWithCoordinates,
        sesquiflatKeyShapeWithCoordinates
      ]
    )
  }
}
