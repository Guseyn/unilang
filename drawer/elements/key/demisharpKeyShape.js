'use strict'

import path from './../basic/path.js'
import group from './../basic/group.js'

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
