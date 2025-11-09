'use strict'

import path from '#unilang/drawer/elements/basic/path.js'
import group from '#unilang/drawer/elements/basic/group.js'

export default function (positionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, sesquisharpKey, fontColor } = styles
    const drawnKeyShape = group(
      'sesquisharpKeyShape',
      [
        path(
          sesquisharpKey.points,
          null,
          fontColor,
          leftOffset,
          topOffset + sesquisharpKey.yCorrection + positionNumber * intervalBetweenStaveLines
        )
      ]
    )
    return drawnKeyShape
  }
}
