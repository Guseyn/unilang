'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')

module.exports = (numberOfFlags) => {
  return (styles, leftOffset, topOffset) => {
    const { oneTopFlag, twoTopFlags, threeTopFlags, fourTopFlags, fiveTopFlags, sixTopFlags, fontColor } = styles
    const topFlags = [ oneTopFlag, twoTopFlags, threeTopFlags, fourTopFlags, fiveTopFlags, sixTopFlags ]
    const drawnNoteFlag = group(
      'noteFlag',
      [
        path(
          topFlags[numberOfFlags - 1].points,
          null,
          fontColor,
          leftOffset,
          topOffset + topFlags[numberOfFlags - 1].yCorrection
        )
      ]
    )
    drawnNoteFlag.stemEndY = topOffset
    return drawnNoteFlag
  }
}
