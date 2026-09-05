'use strict'

import path from '/js/msq/worker/drawer/elements/basic/path.js'
import group from '/js/msq/worker/drawer/elements/basic/group.js'

export default function () {
  return (styles, leftOffset, topOffset) => {
    const { releasePedal, fontColor } = styles
    const drawnReleasePedal = path(
      releasePedal.points,
      null,
      fontColor,
      leftOffset,
      topOffset
    )
    return group(
      'releasePedal',
      [
        drawnReleasePedal
      ]
    )
  }
}
