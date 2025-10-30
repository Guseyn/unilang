'use strict'

const slurMarkWithSpecifiedKey = require('./slurMarkWithSpecifiedKey')

module.exports = (parserState, slurMarkKey) => {
  const foundSlurMarkWithSpecifiedKey = slurMarkWithSpecifiedKey(parserState, slurMarkKey)
  if (foundSlurMarkWithSpecifiedKey) {
    foundSlurMarkWithSpecifiedKey.sShape = true
  }
}
