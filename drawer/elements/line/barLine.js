'use strict'

const stavesPiece = require('./../stave/stavesPiece')
const polyline = require('./../basic/polyline')
const group = require('./../basic/group')
const elementWithAdditionalInformation = require('./../basic/elementWithAdditionalInformation')

module.exports = (numberOfStaves, maxNumberOfStavesInThisAndNextMeasures, numberOfStaveLines, noSpaceNeeded = false) => {
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
