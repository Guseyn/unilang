'use strict'

import slurMarkWithSpecifiedKey from './slurMarkWithSpecifiedKey.js'

export default function (parserState, slurMarkKey, placement) {
  const foundSlurMarkWithSpecifiedKey = slurMarkWithSpecifiedKey(parserState, slurMarkKey)
  if (foundSlurMarkWithSpecifiedKey) {
    foundSlurMarkWithSpecifiedKey.rightPlacement = placement
  }
}
