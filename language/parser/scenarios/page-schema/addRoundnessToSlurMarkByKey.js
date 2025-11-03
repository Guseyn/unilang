'use strict'

import slurMarkWithSpecifiedKey from './slurMarkWithSpecifiedKey.js'

export default function (parserState, slurMarkKey, roundness) {
  const foundSlurMarkWithSpecifiedKey = slurMarkWithSpecifiedKey(parserState, slurMarkKey)
  if (foundSlurMarkWithSpecifiedKey) {
    foundSlurMarkWithSpecifiedKey.roundCoefficientFactor = roundness
  }
}
