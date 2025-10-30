'use strict'

const stavesPiece = require('./../stave/stavesPiece')
const polyline = require('./../basic/polyline')
const group = require('./../basic/group')
const elementWithAdditionalInformation = require('./../basic/elementWithAdditionalInformation')

module.exports = (numberOfStaves, maxNumberOfStavesInThisAndNextMeasures, numberOfStaveLines, noSpaceNeeded = false) => {
  return (styles, leftOffset, topOffsetOfFirstStaveLine) => {
    const { fontColor, stavePieceWidthForDottedBarLine, intervalBetweenDotsInDottedBarLine, dotLengthInDottedBarLine, dottedBarLineWidth } = styles
    const stavePieceWidth = (noSpaceNeeded ? 0 : stavePieceWidthForDottedBarLine) + dottedBarLineWidth
    const stavesPieceWithCoordinates = stavesPiece(maxNumberOfStavesInThisAndNextMeasures, numberOfStaveLines, stavePieceWidth, numberOfStaves)(styles, leftOffset, topOffsetOfFirstStaveLine)
    let topOffsetDistance = topOffsetOfFirstStaveLine
    let isFirstDot = true
    const dotLinesWithCoordinates = []
    while (topOffsetDistance + intervalBetweenDotsInDottedBarLine + dotLengthInDottedBarLine <= stavesPieceWithCoordinates.bottom) {
      dotLinesWithCoordinates.push(
        polyline(
          [
            stavesPieceWithCoordinates.right, (isFirstDot ? topOffsetDistance : topOffsetDistance + intervalBetweenDotsInDottedBarLine),
            stavesPieceWithCoordinates.right - dottedBarLineWidth, (isFirstDot ? topOffsetDistance : topOffsetDistance + intervalBetweenDotsInDottedBarLine),
            stavesPieceWithCoordinates.right - dottedBarLineWidth, (isFirstDot ? topOffsetDistance + dotLengthInDottedBarLine : topOffsetDistance + intervalBetweenDotsInDottedBarLine + dotLengthInDottedBarLine),
            stavesPieceWithCoordinates.right, (isFirstDot ? topOffsetDistance + dotLengthInDottedBarLine : topOffsetDistance + intervalBetweenDotsInDottedBarLine + dotLengthInDottedBarLine)
          ],
          null, fontColor, 0, 0
        )
      )
      topOffsetDistance = isFirstDot ? topOffsetDistance + dotLengthInDottedBarLine : topOffsetDistance + intervalBetweenDotsInDottedBarLine + dotLengthInDottedBarLine
      isFirstDot = false
    }
    if (topOffsetDistance + intervalBetweenDotsInDottedBarLine < stavesPieceWithCoordinates.bottom) {
      dotLinesWithCoordinates.push(
        polyline(
          [
            stavesPieceWithCoordinates.right, topOffsetDistance + intervalBetweenDotsInDottedBarLine,
            stavesPieceWithCoordinates.right - dottedBarLineWidth, topOffsetDistance + intervalBetweenDotsInDottedBarLine,
            stavesPieceWithCoordinates.right - dottedBarLineWidth, stavesPieceWithCoordinates.bottom,
            stavesPieceWithCoordinates.right, stavesPieceWithCoordinates.bottom
          ],
          null, fontColor, 0, 0
        )
      )
    }
    return elementWithAdditionalInformation(
      group(
        'dottedBarLine',
        [
          stavesPieceWithCoordinates,
          ...dotLinesWithCoordinates
        ]
      ),
      {
        xCenter: (dotLinesWithCoordinates[0].left + dotLinesWithCoordinates[0].right) / 2
      }
    )
  }
}
