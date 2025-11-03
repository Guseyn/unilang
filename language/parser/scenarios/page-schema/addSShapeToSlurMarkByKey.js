'use strict'

import slurMarkWithSpecifiedKey from './slurMarkWithSpecifiedKey.js'

export default function (parserState, slurMarkKey) {
  const foundSlurMarkWithSpecifiedKey = slurMarkWithSpecifiedKey(parserState, slurMarkKey)
  if (foundSlurMarkWithSpecifiedKey) {
    foundSlurMarkWithSpecifiedKey.sShape = true
  }
}
