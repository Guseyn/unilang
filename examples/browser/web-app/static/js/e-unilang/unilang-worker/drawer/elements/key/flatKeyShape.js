'use strict'

import path from '/js/e-unilang/unilang-worker/drawer/elements/basic/path.js'
import group from '/js/e-unilang/unilang-worker/drawer/elements/basic/group.js'

export default function (positionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, flatKey, fontColor } = styles
    return group(
      'flatKeyShape',
      [
        path(
          flatKey.points,
          null,
          fontColor,
          leftOffset,
          topOffset + flatKey.yCorrection + positionNumber * intervalBetweenStaveLines
        )
      ]
    )
  }
}
