'use strict'

import path from '#msq/drawer/elements/basic/path.js'
import group from '#msq/drawer/elements/basic/group.js'

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
