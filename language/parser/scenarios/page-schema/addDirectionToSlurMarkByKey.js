'use strict'

const slurMarkWithSpecifiedKey = require('./slurMarkWithSpecifiedKey')

module.exports = (parserState, slurMarkKey, direction) => {
  const foundSlurMarkWithSpecifiedKey = slurMarkWithSpecifiedKey(parserState, slurMarkKey)
  if (foundSlurMarkWithSpecifiedKey) {
    foundSlurMarkWithSpecifiedKey.direction = direction
  }
}
