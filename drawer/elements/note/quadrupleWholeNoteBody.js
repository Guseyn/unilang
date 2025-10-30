'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')

module.exports = (notePositionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, wholeNoteBody, verticalLineForQuadrupleWholeNoteShape, verticalLineForQuadrupleWholeNoteStrokeOptions, fontColor } = styles
    const topOffsetForNoteBody = topOffset + notePositionNumber * intervalBetweenStaveLines
    const spaceBetweenLinesAndCircleInTheMiddle = verticalLineForQuadrupleWholeNoteStrokeOptions.width / 2
    const leftVerticalLine = path(
      verticalLineForQuadrupleWholeNoteShape,
      verticalLineForQuadrupleWholeNoteStrokeOptions,
      true,
      leftOffset,
      topOffsetForNoteBody
    )
    const circleInTheMiddle = path(
      wholeNoteBody.points,
      null,
      fontColor,
      verticalLineForQuadrupleWholeNoteStrokeOptions.width / 2 + leftVerticalLine.right + spaceBetweenLinesAndCircleInTheMiddle,
      topOffsetForNoteBody + wholeNoteBody.yCorrection
    )
    const rightVerticalLine = path(
      verticalLineForQuadrupleWholeNoteShape,
      verticalLineForQuadrupleWholeNoteStrokeOptions,
      true,
      circleInTheMiddle.left - leftVerticalLine.right + circleInTheMiddle.right,
      topOffsetForNoteBody
    )
    return group(
      'noteBody',
      [
        leftVerticalLine,
        circleInTheMiddle,
        rightVerticalLine
      ]
    )
  }
}
