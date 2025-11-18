'use strict'

import stavesPiece from '#unilang/drawer/elements/stave/stavesPiece.js'
import polyline from '#unilang/drawer/elements/basic/polyline.js'
import group from '#unilang/drawer/elements/basic/group.js'
import elementWithAdditionalInformation from '#unilang/drawer/elements/basic/elementWithAdditionalInformation.js'

export default function (numberOfStaves, numberOfStaveLines) {
  return (styles, leftOffset, topOffsetOfFirstStaveLine) => {
    const { fontColor, barLineWidth } = styles
    const stavePieceWidth = barLineWidth
    const stavesPieceWithCoordinates = stavesPiece(numberOfStaves, numberOfStaveLines, stavePieceWidth, numberOfStaves)(styles, leftOffset, topOffsetOfFirstStaveLine)
    const lineWithCoordinates = polyline(
      [
        stavesPieceWithCoordinates.left, stavesPieceWithCoordinates.top,
        stavesPieceWithCoordinates.left + barLineWidth, stavesPieceWithCoordinates.top,
        stavesPieceWithCoordinates.left + barLineWidth, stavesPieceWithCoordinates.bottom,
        stavesPieceWithCoordinates.left, stavesPieceWithCoordinates.bottom
      ],
      null, fontColor, 0, 0
    )
    return elementWithAdditionalInformation(
      group(
        'startBarLine',
        [
          stavesPieceWithCoordinates,
          lineWithCoordinates
        ]
      ),
      {
        xCenter: (lineWithCoordinates.left + lineWithCoordinates.right) / 2
      }
    )
  }
}
