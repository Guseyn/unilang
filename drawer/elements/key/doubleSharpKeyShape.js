'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')

module.exports = (positionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, doubleSharpKey, fontColor } = styles
    const doubleSharpKeyWithCoordinates = path(
      doubleSharpKey.points,
      null,
      fontColor,
      leftOffset,
      topOffset + doubleSharpKey.yCorrection + positionNumber * intervalBetweenStaveLines
    )
    return group(
      'doubleSharpKeyShape',
      [
        doubleSharpKeyWithCoordinates
      ]
    )
  }
}
