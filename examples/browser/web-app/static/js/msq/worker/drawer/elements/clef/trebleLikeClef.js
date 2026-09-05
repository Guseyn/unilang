'use strict'

import stavePiece from '/js/msq/worker/drawer/elements/stave/stavePiece.js'
import clefShape from '/js/msq/worker/drawer/elements/clef/clefShape.js'
import moveElementInTheCenterBetweenPoints from '/js/msq/worker/drawer/elements/basic/moveElementInTheCenterBetweenPoints.js'
import group from '/js/msq/worker/drawer/elements/basic/group.js'

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
