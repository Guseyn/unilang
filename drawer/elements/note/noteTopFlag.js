'use strict'

import path from './../basic/path.js'
import group from './../basic/group.js'

export default function (numberOfFlags) {
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
