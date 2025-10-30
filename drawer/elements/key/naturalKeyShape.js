'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')

module.exports = (positionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, naturalKey, fontColor } = styles
    return group(
      'naturalKeyShape',
      [
        path(
          naturalKey.points,
          null,
          fontColor,
          leftOffset,
          topOffset + naturalKey.yCorrection + positionNumber * intervalBetweenStaveLines
        )
      ]
    )
  }
}
