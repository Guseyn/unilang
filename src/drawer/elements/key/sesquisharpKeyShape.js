'use strict'

import path from '#repertoire/drawer/elements/basic/path.js'
import group from '#repertoire/drawer/elements/basic/group.js'

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
