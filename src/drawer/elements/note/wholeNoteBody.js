'use strict'

import path from '#repertoire/drawer/elements/basic/path.js'
import group from '#repertoire/drawer/elements/basic/group.js'

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
