'use strict'

import stavePiece from './../stave/stavePiece.js'
import demiflatKeyShape from './demiflatKeyShape.js'
import group from './../basic/group.js'

export default function (numberOfStaveLines, positionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { stavePaddingForAccidentals } = styles
    const demiflatKeyShapeWithCoordinates = demiflatKeyShape(positionNumber)(styles, leftOffset + stavePaddingForAccidentals, topOffset)
    const demiflatKeyShapeWithCoordinatesWidth = demiflatKeyShapeWithCoordinates.right - demiflatKeyShapeWithCoordinates.left
    const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, stavePaddingForAccidentals + demiflatKeyShapeWithCoordinatesWidth + stavePaddingForAccidentals)(styles, leftOffset, topOffset)
    return group(
      'demiflatKey',
      [
        stavePieceWithCoordinates,
        demiflatKeyShapeWithCoordinates
      ]
    )
  }
}
