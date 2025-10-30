'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')

module.exports = (notePositionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, wholeNoteBody, fontColor } = styles
    return group(
      'noteBody',
      [
        path(
          wholeNoteBody.points,
          null,
          fontColor,
          leftOffset,
          topOffset + wholeNoteBody.yCorrection + notePositionNumber * intervalBetweenStaveLines
        )
      ]
    )
  }
}
