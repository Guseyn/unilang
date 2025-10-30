'use strict'

const stavesPiece = require('./../stave/stavesPiece')
const polyline = require('./../basic/polyline')
const group = require('./../basic/group')
const elementWithAdditionalInformation = require('./../basic/elementWithAdditionalInformation')

module.exports = (numberOfStaves, numberOfStaveLines) => {
  return (styles, leftOffset, topOffsetOfFirstStaveLine) => {
    const { fontColor, intervalBetweenBarLineAndBoldLine, barLineWidth, boldBarLineWidth } = styles
    const stavePieceWidth = barLineWidth + intervalBetweenBarLineAndBoldLine + boldBarLineWidth
    const staveLinesPiecesWithCoordinates = stavesPiece(numberOfStaves, numberOfStaveLines, stavePieceWidth, numberOfStaves)(styles, leftOffset, topOffsetOfFirstStaveLine)
    const firstLineWithCoordinates = polyline(
      [
        staveLinesPiecesWithCoordinates.left, staveLinesPiecesWithCoordinates.top,
        staveLinesPiecesWithCoordinates.left + boldBarLineWidth, staveLinesPiecesWithCoordinates.top,
        staveLinesPiecesWithCoordinates.left + boldBarLineWidth, staveLinesPiecesWithCoordinates.bottom,
        staveLinesPiecesWithCoordinates.left, staveLinesPiecesWithCoordinates.bottom
      ],
      null, fontColor, 0, 0
    )
    const secondLineWithCoordinates = polyline(
      [
        staveLinesPiecesWithCoordinates.left + boldBarLineWidth + intervalBetweenBarLineAndBoldLine, staveLinesPiecesWithCoordinates.top,
        staveLinesPiecesWithCoordinates.left + boldBarLineWidth + intervalBetweenBarLineAndBoldLine + barLineWidth, staveLinesPiecesWithCoordinates.top,
        staveLinesPiecesWithCoordinates.left + boldBarLineWidth + intervalBetweenBarLineAndBoldLine + barLineWidth, staveLinesPiecesWithCoordinates.bottom,
        staveLinesPiecesWithCoordinates.left + boldBarLineWidth + intervalBetweenBarLineAndBoldLine, staveLinesPiecesWithCoordinates.bottom
      ],
      null, fontColor, 0, 0
    )
    return elementWithAdditionalInformation(
      group(
        'startBoldDoubleBarLine',
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
