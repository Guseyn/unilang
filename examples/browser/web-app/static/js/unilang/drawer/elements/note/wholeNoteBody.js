'use strict'

import path from '#unilang/drawer/elements/basic/path.js'
import group from '#unilang/drawer/elements/basic/group.js'

export default function (notePositionNumber) {
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
