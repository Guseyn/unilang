'use strict'

import stavesPiece from '/js/msq/worker/drawer/elements/stave/stavesPiece.js'
import polyline from '/js/msq/worker/drawer/elements/basic/polyline.js'
import group from '/js/msq/worker/drawer/elements/basic/group.js'
import elementWithAdditionalInformation from '/js/msq/worker/drawer/elements/basic/elementWithAdditionalInformation.js'

export default function (numberOfStaves, maxNumberOfStavesInThisAndNextMeasures, numberOfStaveLines, noSpaceNeeded = false) {
  return (styles, leftOffset, topOffsetOfFirstStaveLine) => {
    const { fontColor, barLineWidth } = styles
    const stavePieceWidth = barLineWidth
    const stavesPieceWithCoordinates = stavesPiece(maxNumberOfStavesInThisAndNextMeasures, numberOfStaveLines, stavePieceWidth, numberOfStaves)(styles, leftOffset, topOffsetOfFirstStaveLine)
    const lineWithCoordinates = polyline(
      [
        stavesPieceWithCoordinates.right, stavesPieceWithCoordinates.top,
        stavesPieceWithCoordinates.right - barLineWidth, stavesPieceWithCoordinates.top,
        stavesPieceWithCoordinates.right - barLineWidth, stavesPieceWithCoordinates.bottom,
        stavesPieceWithCoordinates.right, stavesPieceWithCoordinates.bottom
      ],
      null, fontColor, 0, 0
    )
    return elementWithAdditionalInformation(
      group(
        'barLine',
        [
          stavesPieceWithCoordinates,
          lineWithCoordinates
        ]
      ),
      {
        xCenter: (lineWithCoordinates.right + lineWithCoordinates.left) / 2
      }
    )
  }
}
