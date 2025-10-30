'use strict'

const slurMarkWithSpecifiedKey = require('./slurMarkWithSpecifiedKey')

module.exports = (parserState, slurMarkKey, roundness) => {
  const foundSlurMarkWithSpecifiedKey = slurMarkWithSpecifiedKey(parserState, slurMarkKey)
  if (foundSlurMarkWithSpecifiedKey) {
    foundSlurMarkWithSpecifiedKey.roundCoefficientFactor = roundness
  }
}
