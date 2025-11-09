'use strict'

import path from '#unilang/drawer/elements/basic/path.js'
import group from '#unilang/drawer/elements/basic/group.js'

export default function (restPositionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, doubleWholeRest, fontColor } = styles
    return group(
      'rest',
      [
        path(
          doubleWholeRest.points,
          null,
          fontColor,
          leftOffset,
          topOffset + Math.floor(restPositionNumber) * intervalBetweenStaveLines + doubleWholeRest.yCorrection
        )
      ]
    )
  }
}
