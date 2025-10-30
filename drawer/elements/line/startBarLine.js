'use strict'

const stavesPiece = require('./../stave/stavesPiece')
const polyline = require('./../basic/polyline')
const group = require('./../basic/group')
const elementWithAdditionalInformation = require('./../basic/elementWithAdditionalInformation')

module.exports = (numberOfStaves, numberOfStaveLines) => {
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
