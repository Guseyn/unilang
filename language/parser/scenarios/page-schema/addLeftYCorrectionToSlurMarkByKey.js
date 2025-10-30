'use strict'

const slurMarkWithSpecifiedKey = require('./slurMarkWithSpecifiedKey')

module.exports = (parserState, slurMarkKey, yCorrection) => {
  const foundSlurMarkWithSpecifiedKey = slurMarkWithSpecifiedKey(parserState, slurMarkKey)
  if (foundSlurMarkWithSpecifiedKey) {
    foundSlurMarkWithSpecifiedKey.leftYCorrection = yCorrection
  }
}
