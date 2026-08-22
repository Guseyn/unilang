'use strict'

import stavePiece from '#repertoire/drawer/elements/stave/stavePiece.js'
import sesquiflatKeyShape from '#repertoire/drawer/elements/key/sesquiflatKeyShape.js'
import group from '#repertoire/drawer/elements/basic/group.js'

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
