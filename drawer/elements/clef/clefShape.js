'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')

module.exports = (clefName) => {
  return (styles, leftOffset, topOffset) => {
    const { fontColor } = styles
    const drawnClefShape = path(
      styles[clefName].points,
      null,
      fontColor,
      leftOffset,
      topOffset + styles[clefName].yCorrection
    )
    return group(
      'clefShape',
      [ drawnClefShape ]
    )
  }
}
