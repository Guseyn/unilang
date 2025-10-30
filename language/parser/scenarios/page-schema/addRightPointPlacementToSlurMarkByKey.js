'use strict'

const slurMarkWithSpecifiedKey = require('./slurMarkWithSpecifiedKey')

module.exports = (parserState, slurMarkKey, placement) => {
  const foundSlurMarkWithSpecifiedKey = slurMarkWithSpecifiedKey(parserState, slurMarkKey)
  if (foundSlurMarkWithSpecifiedKey) {
    foundSlurMarkWithSpecifiedKey.rightPlacement = placement
  }
}
