'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')

module.exports = (restPositionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, halfRest, fontColor } = styles
    return group(
      'rest',
      [
        path(
          halfRest.points,
          null,
          fontColor,
          leftOffset,
          topOffset + Math.floor(restPositionNumber) * intervalBetweenStaveLines + halfRest.yCorrection
        )
      ]
    )
  }
}
