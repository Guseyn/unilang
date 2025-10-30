'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')

module.exports = (restPositionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, doubleWholeRest, fontColor } = styles
    return group(
      'rest',
      [
        path(
          doubleWholeRest.points,
          null,
          fontColor,
          leftOffset,
          topOffset + Math.floor(restPositionNumber) * intervalBetweenStaveLines + doubleWholeRest.yCorrection
        )
      ]
    )
  }
}
