'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')

module.exports = (positionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, flatKey, fontColor } = styles
    return group(
      'flatKeyShape',
      [
        path(
          flatKey.points,
          null,
          fontColor,
          leftOffset,
          topOffset + flatKey.yCorrection + positionNumber * intervalBetweenStaveLines
        )
      ]
    )
  }
}
