'use strict'

import stavesPiece from '#unilang/drawer/elements/stave/stavesPiece.js'
import polyline from '#unilang/drawer/elements/basic/polyline.js'
import group from '#unilang/drawer/elements/basic/group.js'
import elementWithAdditionalInformation from '#unilang/drawer/elements/basic/elementWithAdditionalInformation.js'

export default function (numberOfStaves, maxNumberOfStavesInThisAndNextMeasures, numberOfStaveLines, noSpaceNeeded = false) {
  return (styles, leftOffset, topOffsetOfFirstStaveLine) => {
    const { fontColor, intervalBetweenBarLineAndBoldLine, boldBarLineWidth, barLineWidth } = styles
    const stavePieceWidth = barLineWidth + intervalBetweenBarLineAndBoldLine + boldBarLineWidth
    const staveLinesPiecesWithCoordinates = stavesPiece(maxNumberOfStavesInThisAndNextMeasures, numberOfStaveLines, stavePieceWidth, numberOfStaves)(styles, leftOffset, topOffsetOfFirstStaveLine)
    const firstLineWithCoordinates = polyline(
      [
        staveLinesPiecesWithCoordinates.right - boldBarLineWidth - intervalBetweenBarLineAndBoldLine, staveLinesPiecesWithCoordinates.top,
        staveLinesPiecesWithCoordinates.right - boldBarLineWidth - intervalBetweenBarLineAndBoldLine - barLineWidth, staveLinesPiecesWithCoordinates.top,
        staveLinesPiecesWithCoordinates.right - boldBarLineWidth - intervalBetweenBarLineAndBoldLine - barLineWidth, staveLinesPiecesWithCoordinates.bottom,
        staveLinesPiecesWithCoordinates.right - boldBarLineWidth - intervalBetweenBarLineAndBoldLine, staveLinesPiecesWithCoordinates.bottom
      ],
      null,
      fontColor, 0, 0
    )
    const secondLineWithCoordinates = polyline(
      [
        staveLinesPiecesWithCoordinates.right, staveLinesPiecesWithCoordinates.top,
        staveLinesPiecesWithCoordinates.right - boldBarLineWidth, staveLinesPiecesWithCoordinates.top,
        staveLinesPiecesWithCoordinates.right - boldBarLineWidth, staveLinesPiecesWithCoordinates.bottom,
        staveLinesPiecesWithCoordinates.right, staveLinesPiecesWithCoordinates.bottom
      ],
      null, fontColor, 0, 0
    )
    return elementWithAdditionalInformation(
      group(
        'boldDoubleBarLine',
        [
          staveLinesPiecesWithCoordinates,
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
