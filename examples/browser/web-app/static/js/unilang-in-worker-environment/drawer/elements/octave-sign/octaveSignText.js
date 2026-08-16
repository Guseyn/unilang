'use strict'

import path from '/js/unilang-in-worker-environment/drawer/elements/basic/path.js'

export default function (octaveSignNumber, octaveSignPostfix, direction) {
  return (styles, leftOffset, topOffset) => {
    const { fontColor, octaveSignLetters } = styles
    return path(
      octaveSignLetters[`${octaveSignNumber}${octaveSignPostfix}-${direction}`].points,
      null,
      fontColor,
      leftOffset,
      topOffset
    )
  }
}
