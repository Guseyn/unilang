'use strict'

import path from '/js/unilang-in-worker-environment/drawer/elements/basic/path.js'
import group from '/js/unilang-in-worker-environment/drawer/elements/basic/group.js'

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
