'use strict'

import slurMarkWithSpecifiedKey from './slurMarkWithSpecifiedKey.js'

export default function (parserState, slurMarkKey, yCorrection) {
  const foundSlurMarkWithSpecifiedKey = slurMarkWithSpecifiedKey(parserState, slurMarkKey)
  if (foundSlurMarkWithSpecifiedKey) {
    foundSlurMarkWithSpecifiedKey.rightYCorrection = yCorrection
  }
}
