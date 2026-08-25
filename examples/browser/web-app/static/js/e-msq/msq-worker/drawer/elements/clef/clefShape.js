'use strict'

import path from '/js/e-msq/msq-worker/drawer/elements/basic/path.js'
import group from '/js/e-msq/msq-worker/drawer/elements/basic/group.js'

export default function (clefName) {
  return (styles, leftOffset, topOffset) => {
    const { fontColor } = styles
    const drawnClefShape = path(
      styles[clefName].points,
      null,
      fontColor,
      leftOffset,
      topOffset + styles[clefName].yCorrection
    )
    return group(
      'clefShape',
      [ drawnClefShape ]
    )
  }
}
