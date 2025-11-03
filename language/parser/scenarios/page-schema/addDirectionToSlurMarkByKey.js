'use strict'

import slurMarkWithSpecifiedKey from './slurMarkWithSpecifiedKey.js'

export default function (parserState, slurMarkKey, direction) {
  const foundSlurMarkWithSpecifiedKey = slurMarkWithSpecifiedKey(parserState, slurMarkKey)
  if (foundSlurMarkWithSpecifiedKey) {
    foundSlurMarkWithSpecifiedKey.direction = direction
  }
}
