'use strict'

const text = require('./../basic/text')
const stavesPiece = require('./../stave/stavesPiece')
const moveElement = require('./../basic/moveElement')
const group = require('./../basic/group')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

module.exports = (measureIndex, directionOfMeasureNumber, numberOfStaves, numberOfStaveLines) => {
  return (styles, leftOffset, topOffsetOfFirstStaveLine) => {
    const { fontOptionsForMeasureNumberText, measureNumberTextPadding, measureNumberTextVerticalOffset, intervalBetweenStaveLines } = styles
    const topOffsetOfFirstStaveTop = topOffsetOfFirstStaveLine
    const topOffsetOfFirstStaveBottom = topOffsetOfFirstStaveLine + (numberOfStaveLines - 1) * (intervalBetweenStaveLines)
    const measureIndexTextValue = (measureIndex + 1) + ''
    const drawnMeasureNumberText = text(measureIndexTextValue, fontOptionsForMeasureNumberText)(styles, leftOffset + measureNumberTextPadding, directionOfMeasureNumber === 'up' ? topOffsetOfFirstStaveTop : topOffsetOfFirstStaveBottom)
    const directionOfMeasureNumberSign = directionOfMeasureNumber === 'up' ? -1 : +1
    const yDistanceToMoveMeasureNumberText = directionOfMeasureNumber === 'up'
      ? (topOffsetOfFirstStaveTop - drawnMeasureNumberText.top + measureNumberTextVerticalOffset)
      : (topOffsetOfFirstStaveBottom - drawnMeasureNumberText.top + measureNumberTextVerticalOffset)
    moveElement(drawnMeasureNumberText, 0, directionOfMeasureNumberSign * yDistanceToMoveMeasureNumberText)
    const stavePieceWidth = drawnMeasureNumberText.right - leftOffset + measureNumberTextPadding
    const stavesPieceWithCoordinates = stavesPiece(numberOfStaves, numberOfStaveLines, stavePieceWidth, numberOfStaves)(styles, leftOffset, topOffsetOfFirstStaveLine)
    addPropertiesToElement(
      drawnMeasureNumberText,
      {
        'ref-ids': 'measure-numbers'
      }
    )
    const drawnMeasureNumber = group(
      'measureNumber',
      [
        stavesPieceWithCoordinates,
        drawnMeasureNumberText
      ]
    )
    return drawnMeasureNumber
  }
}
