'use strict'

import path from '/js/unilang-in-worker-environment/drawer/elements/basic/path.js'
import group from '/js/unilang-in-worker-environment/drawer/elements/basic/group.js'

export default function (positionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, naturalKey, fontColor } = styles
    return group(
      'naturalKeyShape',
      [
        path(
          naturalKey.points,
          null,
          fontColor,
          leftOffset,
          topOffset + naturalKey.yCorrection + positionNumber * intervalBetweenStaveLines
        )
      ]
    )
  }
}
