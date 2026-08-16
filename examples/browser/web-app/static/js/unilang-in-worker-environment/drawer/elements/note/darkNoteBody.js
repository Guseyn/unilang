'use strict'

import path from '/js/unilang-in-worker-environment/drawer/elements/basic/path.js'
import group from '/js/unilang-in-worker-environment/drawer/elements/basic/group.js'

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
