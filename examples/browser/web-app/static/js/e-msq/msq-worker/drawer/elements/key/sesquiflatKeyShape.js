'use strict'

import path from '/js/e-msq/msq-worker/drawer/elements/basic/path.js'
import group from '/js/e-msq/msq-worker/drawer/elements/basic/group.js'

export default function (positionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, sesquiflatKey, fontColor } = styles
    return group(
      'sesquiflatKeyShape',
      [
        path(
          sesquiflatKey.points,
          null,
          fontColor,
          leftOffset,
          topOffset + sesquiflatKey.yCorrection + positionNumber * intervalBetweenStaveLines
        )
      ]
    )
  }
}
