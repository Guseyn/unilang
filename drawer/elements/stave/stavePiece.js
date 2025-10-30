'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')

module.exports = (numberOfLines, width) => {
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
