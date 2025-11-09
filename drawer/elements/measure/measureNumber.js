'use strict'

import text from '#unilang/drawer/elements/basic/text.js'
import stavesPiece from '#unilang/drawer/elements/stave/stavesPiece.js'
import moveElement from '#unilang/drawer/elements/basic/moveElement.js'
import group from '#unilang/drawer/elements/basic/group.js'
import addPropertiesToElement from '#unilang/drawer/elements/basic/addPropertiesToElement.js'

export default function (measureIndex, directionOfMeasureNumber, numberOfStaves, numberOfStaveLines) {
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
