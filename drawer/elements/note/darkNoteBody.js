'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')

module.exports = (notePositionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, darkNoteBody, fontColor } = styles
    return group(
      'noteBody',
      [
        path(
          darkNoteBody.points,
          null,
          fontColor,
          leftOffset,
          topOffset + darkNoteBody.yCorrection + notePositionNumber * intervalBetweenStaveLines
        )
      ]
    )
  }
}
