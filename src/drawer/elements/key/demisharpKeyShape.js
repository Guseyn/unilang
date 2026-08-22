'use strict'

import path from '#repertoire/drawer/elements/basic/path.js'
import group from '#repertoire/drawer/elements/basic/group.js'

export default function (positionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, demisharpKey, fontColor } = styles
    const drawnKeyShape = group(
      'sharpKeyShape',
      [
        path(
          demisharpKey.points,
          null,
          fontColor,
          leftOffset,
          topOffset + demisharpKey.yCorrection + positionNumber * intervalBetweenStaveLines
        )
      ]
    )
    return drawnKeyShape
  }
}
