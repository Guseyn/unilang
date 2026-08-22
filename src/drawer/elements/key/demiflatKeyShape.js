'use strict'

import path from '#repertoire/drawer/elements/basic/path.js'
import group from '#repertoire/drawer/elements/basic/group.js'

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
