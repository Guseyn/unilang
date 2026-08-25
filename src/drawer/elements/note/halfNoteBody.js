'use strict'

import path from '#msq/drawer/elements/basic/path.js'
import group from '#msq/drawer/elements/basic/group.js'

export default function (notePositionNumber) {
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
