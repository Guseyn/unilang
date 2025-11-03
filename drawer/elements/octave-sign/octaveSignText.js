'use strict'

import path from './../basic/path.js'

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
