'use strict'

const stavesPiece = require('./../stave/stavesPiece')
const polyline = require('./../basic/polyline')
const group = require('./../basic/group')
const elementWithAdditionalInformation = require('./../basic/elementWithAdditionalInformation')

module.exports = (numberOfStaves, maxNumberOfStavesInThisAndNextMeasures, numberOfStaveLines, noSpaceNeeded = false) => {
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
