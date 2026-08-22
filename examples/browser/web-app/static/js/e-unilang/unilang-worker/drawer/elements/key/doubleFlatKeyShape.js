'use strict'

import path from '/js/e-unilang/unilang-worker/drawer/elements/basic/path.js'
import group from '/js/e-unilang/unilang-worker/drawer/elements/basic/group.js'

export default function (positionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, doubleFlatKey, fontColor } = styles
    return group(
      'doubleFlatKeyShape',
      [
        path(
          doubleFlatKey.points,
          null,
          fontColor,
          leftOffset,
          topOffset + doubleFlatKey.yCorrection + positionNumber * intervalBetweenStaveLines
        )
      ]
    )
  }
}
