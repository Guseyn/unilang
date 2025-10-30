'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')

module.exports = (notePositionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, wholeNoteBody, doubleVerticalLinesForDoubleWholeNoteBodyShape, doubleVerticalLinesForDoubleWholeNoteBodyStrokeOptions, fontColor } = styles
    const topOffsetForNoteBody = topOffset + notePositionNumber * intervalBetweenStaveLines
    const spaceBetweenLinesAndCircleInTheMiddle = doubleVerticalLinesForDoubleWholeNoteBodyStrokeOptions.width / 2
    const leftLines = path(
      doubleVerticalLinesForDoubleWholeNoteBodyShape,
      doubleVerticalLinesForDoubleWholeNoteBodyStrokeOptions,
      true,
      leftOffset,
      topOffsetForNoteBody
    )
    const circleInTheMiddle = path(
      wholeNoteBody.points,
      null,
      fontColor,
      doubleVerticalLinesForDoubleWholeNoteBodyStrokeOptions.width / 2 + leftLines.right + spaceBetweenLinesAndCircleInTheMiddle,
      topOffsetForNoteBody + wholeNoteBody.yCorrection
    )
    const rightLines = path(
      doubleVerticalLinesForDoubleWholeNoteBodyShape,
      doubleVerticalLinesForDoubleWholeNoteBodyStrokeOptions,
      true,
      circleInTheMiddle.left - leftLines.right + circleInTheMiddle.right,
      topOffsetForNoteBody
    )
    return group(
      'noteBody',
      [
        leftLines,
        circleInTheMiddle,
        rightLines
      ]
    )
  }
}
