'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')

module.exports = (positionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, sesquisharpKey, fontColor } = styles
    const drawnKeyShape = group(
      'sesquisharpKeyShape',
      [
        path(
          sesquisharpKey.points,
          null,
          fontColor,
          leftOffset,
          topOffset + sesquisharpKey.yCorrection + positionNumber * intervalBetweenStaveLines
        )
      ]
    )
    return drawnKeyShape
  }
}
