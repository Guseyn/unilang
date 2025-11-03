'use strict'

import path from './../basic/path.js'
import group from './../basic/group.js'

export default function (restPositionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, halfRest, fontColor } = styles
    return group(
      'rest',
      [
        path(
          halfRest.points,
          null,
          fontColor,
          leftOffset,
          topOffset + Math.floor(restPositionNumber) * intervalBetweenStaveLines + halfRest.yCorrection
        )
      ]
    )
  }
}
