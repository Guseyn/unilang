'use strict'

import path from './../basic/path.js'
import group from './../basic/group.js'

export default function (notePositionNumber, duration) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, ghostWholeNoteBody, ghostHalfNoteBody, ghostDarkNoteBody, doubleVerticalLinesForDoubleWholeNoteBodyShape, doubleVerticalLinesForDoubleWholeNoteBodyStrokeOptions, verticalLineForQuadrupleWholeNoteShape, verticalLineForQuadrupleWholeNoteStrokeOptions, fontColor } = styles
    const topOffsetForNoteBody = topOffset + notePositionNumber * intervalBetweenStaveLines
    const elementsForNoteBody = []
    if (duration === 4) {
      const spaceBetweenLinesAndCrossInTheMiddle = verticalLineForQuadrupleWholeNoteStrokeOptions.width / 2
      const leftLine = path(
        verticalLineForQuadrupleWholeNoteShape,
        verticalLineForQuadrupleWholeNoteStrokeOptions,
        fontColor,
        leftOffset,
        topOffsetForNoteBody
      )
      const crossInTheMiddle = path(
        ghostWholeNoteBody.points,
        null,
        true,
        doubleVerticalLinesForDoubleWholeNoteBodyStrokeOptions.width / 2 + leftLine.right + spaceBetweenLinesAndCrossInTheMiddle,
        topOffsetForNoteBody + ghostWholeNoteBody.yCorrection
      )
      const rightLine = path(
        verticalLineForQuadrupleWholeNoteShape,
        verticalLineForQuadrupleWholeNoteStrokeOptions,
        false,
        crossInTheMiddle.left - leftLine.right + crossInTheMiddle.right,
        topOffsetForNoteBody
      )
      elementsForNoteBody.push(
        leftLine,
        crossInTheMiddle,
        rightLine
      )
    } else if (duration === 2) {
      const spaceBetweenLinesAndCrossInTheMiddle = doubleVerticalLinesForDoubleWholeNoteBodyStrokeOptions.width / 2
      const leftLines = path(
        doubleVerticalLinesForDoubleWholeNoteBodyShape,
        doubleVerticalLinesForDoubleWholeNoteBodyStrokeOptions,
        false,
        leftOffset,
        topOffsetForNoteBody
      )
      const crossInTheMiddle = path(
        ghostWholeNoteBody.points,
        null,
        fontColor,
        doubleVerticalLinesForDoubleWholeNoteBodyStrokeOptions.width / 2 + leftLines.right + spaceBetweenLinesAndCrossInTheMiddle,
        topOffsetForNoteBody + ghostWholeNoteBody.yCorrection
      )
      const rightLines = path(
        doubleVerticalLinesForDoubleWholeNoteBodyShape,
        doubleVerticalLinesForDoubleWholeNoteBodyStrokeOptions,
        false,
        crossInTheMiddle.left - leftLines.right + crossInTheMiddle.right,
        topOffsetForNoteBody
      )
      elementsForNoteBody.push(
        leftLines,
        crossInTheMiddle,
        rightLines
      )
    } else if (duration === 1) {
      elementsForNoteBody.push(
        path(
          ghostWholeNoteBody.points,
          null,
          fontColor,
          leftOffset,
          topOffsetForNoteBody + ghostWholeNoteBody.yCorrection
        )
      )
    } else if (duration === 1 / 2) {
      elementsForNoteBody.push(
        path(
          ghostHalfNoteBody.points,
          null,
          fontColor,
          leftOffset,
          topOffsetForNoteBody + ghostHalfNoteBody.yCorrection
        )
      )
    } else {
      elementsForNoteBody.push(
        path(
          ghostDarkNoteBody.points,
          null,
          fontColor,
          leftOffset,
          topOffsetForNoteBody + ghostDarkNoteBody.yCorrection
        )
      )
    }
    return group(
      'noteBody',
      elementsForNoteBody
    )
  }
}
