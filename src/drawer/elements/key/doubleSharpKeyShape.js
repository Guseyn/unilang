'use strict'

import path from '#msq/drawer/elements/basic/path.js'
import group from '#msq/drawer/elements/basic/group.js'

export default function (positionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, doubleSharpKey, fontColor } = styles
    const doubleSharpKeyWithCoordinates = path(
      doubleSharpKey.points,
      null,
      fontColor,
      leftOffset,
      topOffset + doubleSharpKey.yCorrection + positionNumber * intervalBetweenStaveLines
    )
    return group(
      'doubleSharpKeyShape',
      [
        doubleSharpKeyWithCoordinates
      ]
    )
  }
}
