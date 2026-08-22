'use strict'

import path from '/js/e-unilang/unilang-worker/drawer/elements/basic/path.js'
import group from '/js/e-unilang/unilang-worker/drawer/elements/basic/group.js'

export default function (restPositionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, halfRest, fontColor } = styles
    return group(
      'rest',
      [
        path(
          halfRest.points,
          null,
          fontColor,
          leftOffset,
          topOffset + Math.floor(restPositionNumber) * intervalBetweenStaveLines + halfRest.yCorrection
        )
      ]
    )
  }
}
