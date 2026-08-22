'use strict'

import stavePiece from '#repertoire/drawer/elements/stave/stavePiece.js'
import naturalKeyShape from '#repertoire/drawer/elements/key/naturalKeyShape.js'
import group from '#repertoire/drawer/elements/basic/group.js'

export default function (numberOfStaveLines, positionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { stavePaddingForAccidentals } = styles
    const naturalKeyShapeWithCoordinates = naturalKeyShape(positionNumber)(styles, leftOffset + stavePaddingForAccidentals, topOffset)
    const naturalKeyShapeWithCoordinatesWidth = naturalKeyShapeWithCoordinates.right - naturalKeyShapeWithCoordinates.left
    const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, stavePaddingForAccidentals + naturalKeyShapeWithCoordinatesWidth + stavePaddingForAccidentals)(styles, leftOffset, topOffset)
    return group(
      'naturalKey',
      [
        stavePieceWithCoordinates,
        naturalKeyShapeWithCoordinates
      ]
    )
  }
}
