'use strict'

const path = require('./../basic/path')

module.exports = (octaveSignNumber, octaveSignPostfix, direction) => {
  return (styles, leftOffset, topOffset) => {
    const { fontColor, octaveSignLetters } = styles
    return path(
      octaveSignLetters[`${octaveSignNumber}${octaveSignPostfix}-${direction}`].points,
      null,
      fontColor,
      leftOffset,
      topOffset
    )
  }
}
