'use strict'

import path from '/js/unilang-in-worker-environment/drawer/elements/basic/path.js'
import group from '/js/unilang-in-worker-environment/drawer/elements/basic/group.js'

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
