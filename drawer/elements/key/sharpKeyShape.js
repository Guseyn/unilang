'use strict'

import path from './../basic/path.js'
import group from './../basic/group.js'

export default function (positionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, sharpKey, fontColor } = styles
    const drawnKeyShape = group(
      'sharpKeyShape',
      [
        path(
          sharpKey.points,
          null,
          fontColor,
          leftOffset,
          topOffset + sharpKey.yCorrection + positionNumber * intervalBetweenStaveLines
        )
      ]
    )
    return drawnKeyShape
  }
}
