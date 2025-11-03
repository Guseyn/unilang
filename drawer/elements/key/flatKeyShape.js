'use strict'

import path from './../basic/path.js'
import group from './../basic/group.js'

export default function (positionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, flatKey, fontColor } = styles
    return group(
      'flatKeyShape',
      [
        path(
          flatKey.points,
          null,
          fontColor,
          leftOffset,
          topOffset + flatKey.yCorrection + positionNumber * intervalBetweenStaveLines
        )
      ]
    )
  }
}
