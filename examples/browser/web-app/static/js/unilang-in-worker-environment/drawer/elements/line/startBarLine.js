'use strict'

import stavesPiece from '/js/unilang-in-worker-environment/drawer/elements/stave/stavesPiece.js'
import polyline from '/js/unilang-in-worker-environment/drawer/elements/basic/polyline.js'
import group from '/js/unilang-in-worker-environment/drawer/elements/basic/group.js'
import elementWithAdditionalInformation from '/js/unilang-in-worker-environment/drawer/elements/basic/elementWithAdditionalInformation.js'

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
