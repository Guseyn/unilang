'use strict'

import path from './../basic/path.js'
import group from './../basic/group.js'

export default function (numberOfLines, width) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, staveLinesColor, staveLineHeight } = styles
    const pathPoints = []
    for (let i = 0; i < numberOfLines; i++) {
      pathPoints.push(
        'M',
        0, i * intervalBetweenStaveLines - staveLineHeight / 2,
        'L',
        width, i * intervalBetweenStaveLines - staveLineHeight / 2,
        'L',
        width, i * intervalBetweenStaveLines + staveLineHeight / 2,
        'L',
        0, i * intervalBetweenStaveLines + staveLineHeight / 2,
        'L',
        0, i * intervalBetweenStaveLines - staveLineHeight / 2
      )
    }
    if (pathPoints.length > 0) {
      return group(
        'stavePiece',
        [
          path(
            pathPoints,
            null,
            staveLinesColor,
            leftOffset,
            topOffset
          )
        ]
      )
    }
    return group(
      'stavePiece',
      []
    )
  }
}
