'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')

module.exports = (notePositionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, halfNoteBody, fontColor } = styles
    return group(
      'noteBody',
      [
        path(
          halfNoteBody.points,
          null,
          fontColor,
          leftOffset,
          topOffset + halfNoteBody.yCorrection + notePositionNumber * intervalBetweenStaveLines
        )
      ]
    )
  }
}
