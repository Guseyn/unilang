'use strict'

import path from './../basic/path.js'
import group from './../basic/group.js'

export default function (restPositionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, quarterRest, fontColor } = styles
    return group(
      'rest',
      [
        path(
          quarterRest.points,
          null,
          fontColor,
          leftOffset,
          topOffset + restPositionNumber * intervalBetweenStaveLines + quarterRest.yCorrection
        )
      ]
    )
  }
}
