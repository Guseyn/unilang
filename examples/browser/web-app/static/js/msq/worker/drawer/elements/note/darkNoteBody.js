'use strict'

import path from '/js/msq/worker/drawer/elements/basic/path.js'
import group from '/js/msq/worker/drawer/elements/basic/group.js'

export default function (notePositionNumber) {
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
