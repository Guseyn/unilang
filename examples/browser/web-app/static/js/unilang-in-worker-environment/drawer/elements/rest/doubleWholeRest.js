'use strict'

import path from '/js/unilang-in-worker-environment/drawer/elements/basic/path.js'
import group from '/js/unilang-in-worker-environment/drawer/elements/basic/group.js'

export default function (restPositionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, doubleWholeRest, fontColor } = styles
    return group(
      'rest',
      [
        path(
          doubleWholeRest.points,
          null,
          fontColor,
          leftOffset,
          topOffset + Math.floor(restPositionNumber) * intervalBetweenStaveLines + doubleWholeRest.yCorrection
        )
      ]
    )
  }
}
