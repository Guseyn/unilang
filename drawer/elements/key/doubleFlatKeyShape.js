'use strict'

import path from './../basic/path.js'
import group from './../basic/group.js'

export default function (positionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, doubleFlatKey, fontColor } = styles
    return group(
      'doubleFlatKeyShape',
      [
        path(
          doubleFlatKey.points,
          null,
          fontColor,
          leftOffset,
          topOffset + doubleFlatKey.yCorrection + positionNumber * intervalBetweenStaveLines
        )
      ]
    )
  }
}
