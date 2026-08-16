'use strict'

import slurMarkWithSpecifiedKey from '#unilang/language/parser/scenarios/page-schema/slurMarkWithSpecifiedKey.js'

export default function (parserState, slurMarkKey, direction) {
  const foundSlurMarkWithSpecifiedKey = slurMarkWithSpecifiedKey(parserState, slurMarkKey)
  if (foundSlurMarkWithSpecifiedKey) {
    foundSlurMarkWithSpecifiedKey.direction = direction
  }
}
