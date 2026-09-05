'use strict'

import path from '/js/msq/worker/drawer/elements/basic/path.js'
import group from '/js/msq/worker/drawer/elements/basic/group.js'

export default function (positionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, demiflatKey, fontColor } = styles
    return group(
      'demiflatKeyShape',
      [
        path(
          demiflatKey.points,
          null,
          fontColor,
          leftOffset,
          topOffset + demiflatKey.yCorrection + positionNumber * intervalBetweenStaveLines
        )
      ]
    )
  }
}
