'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')

module.exports = (restPositionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, wholeRest, fontColor } = styles
    return group(
      'rest',
      [
        path(
          wholeRest.points,
          null,
          fontColor,
          leftOffset,
          topOffset + Math.floor(restPositionNumber) * intervalBetweenStaveLines + wholeRest.yCorrection
        )
      ]
    )
  }
}
