'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')

module.exports = (restPositionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, quarterRest, fontColor } = styles
    return group(
      'rest',
      [
        path(
          quarterRest.points,
          null,
          fontColor,
          leftOffset,
          topOffset + restPositionNumber * intervalBetweenStaveLines + quarterRest.yCorrection
        )
      ]
    )
  }
}
