'use strict'

import path from '#repertoire/drawer/elements/basic/path.js'
import group from '#repertoire/drawer/elements/basic/group.js'

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
