'use strict'

import stavePiece from '#repertoire/drawer/elements/stave/stavePiece.js'
import clefShape from '#repertoire/drawer/elements/clef/clefShape.js'
import moveElementInTheCenterBetweenPoints from '#repertoire/drawer/elements/basic/moveElementInTheCenterBetweenPoints.js'
import group from '#repertoire/drawer/elements/basic/group.js'

export default function (trebleStyleKey) {
  return (styles, leftOffset, topOffset) => {
    const { stavePieceWidthForClef } = styles
    const numberOfStaveLines = 5
    const trebleShapeWithCoordinates = clefShape(trebleStyleKey)(styles, 0, topOffset)
    moveElementInTheCenterBetweenPoints(trebleShapeWithCoordinates, leftOffset, leftOffset + stavePieceWidthForClef)
    const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, stavePieceWidthForClef)(styles, leftOffset, topOffset)
    return group(
      'trebleClef',
      [
        stavePieceWithCoordinates,
        trebleShapeWithCoordinates
      ]
    )
  }
}
