'use strict'

import stavesPiece from '#unilang/drawer/elements/stave/stavesPiece.js'
import polyline from '#unilang/drawer/elements/basic/polyline.js'
import group from '#unilang/drawer/elements/basic/group.js'
import elementWithAdditionalInformation from '#unilang/drawer/elements/basic/elementWithAdditionalInformation.js'

export default function (numberOfStaves, maxNumberOfStavesInThisAndNextMeasures, numberOfStaveLines, noSpaceNeeded = false) {
  return (styles, leftOffset, topOffsetOfFirstStaveLine) => {
    const { fontColor, intervalBetweenBarLines, barLineWidth } = styles
    const stavePieceWidth = barLineWidth + intervalBetweenBarLines + barLineWidth
    const stavesPieceWithCoordinates = stavesPiece(maxNumberOfStavesInThisAndNextMeasures, numberOfStaveLines, stavePieceWidth, numberOfStaves)(styles, leftOffset, topOffsetOfFirstStaveLine)
    const firstLineWithCoordinates = polyline(
      [
        stavesPieceWithCoordinates.right - intervalBetweenBarLines - barLineWidth, stavesPieceWithCoordinates.top,
        stavesPieceWithCoordinates.right - intervalBetweenBarLines - barLineWidth - barLineWidth, stavesPieceWithCoordinates.top,
        stavesPieceWithCoordinates.right - intervalBetweenBarLines - barLineWidth - barLineWidth, stavesPieceWithCoordinates.bottom,
        stavesPieceWithCoordinates.right - intervalBetweenBarLines - barLineWidth, stavesPieceWithCoordinates.bottom
      ],
      null, fontColor, 0, 0
    )
    const secondLineWithCoordinates = polyline(
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
        'doubleBarLine',
        [
          stavesPieceWithCoordinates,
          firstLineWithCoordinates,
          secondLineWithCoordinates
        ]
      ),
      {
        xCenter: (firstLineWithCoordinates.left + secondLineWithCoordinates.right) / 2
      }
    )
  }
}
