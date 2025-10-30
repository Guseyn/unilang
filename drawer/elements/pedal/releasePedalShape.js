'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')

module.exports = () => {
  return (styles, leftOffset, topOffset) => {
    const { releasePedal, fontColor } = styles
    const drawnReleasePedal = path(
      releasePedal.points,
      null,
      fontColor,
      leftOffset,
      topOffset
    )
    return group(
      'releasePedal',
      [
        drawnReleasePedal
      ]
    )
  }
}
