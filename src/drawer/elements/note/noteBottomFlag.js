'use strict'

import path from '#repertoire/drawer/elements/basic/path.js'
import group from '#repertoire/drawer/elements/basic/group.js'

export default function (numberOfFlags) {
  return (styles, leftOffset, topOffset) => {
    const { oneBottomFlag, twoBottomFlags, threeBottomFlags, fourBottomFlags, fiveBottomFlags, sixBottomFlags, fontColor } = styles
    const bottomFlags = [ oneBottomFlag, twoBottomFlags, threeBottomFlags, fourBottomFlags, fiveBottomFlags, sixBottomFlags ]
    const drawnNoteFlag = group(
      'noteFlag',
      [
        path(
          bottomFlags[numberOfFlags - 1].points,
          null,
          fontColor,
          leftOffset,
          topOffset + bottomFlags[numberOfFlags - 1].yCorrection
        )
      ]
    )
    drawnNoteFlag.stemEndY = topOffset
    return drawnNoteFlag
  }
}
