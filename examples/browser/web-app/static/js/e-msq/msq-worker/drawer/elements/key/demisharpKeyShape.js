'use strict'

import path from '/js/e-msq/msq-worker/drawer/elements/basic/path.js'
import group from '/js/e-msq/msq-worker/drawer/elements/basic/group.js'

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
