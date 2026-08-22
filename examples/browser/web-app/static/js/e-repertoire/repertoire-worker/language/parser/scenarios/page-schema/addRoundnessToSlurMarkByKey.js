'use strict'

import slurMarkWithSpecifiedKey from '/js/e-repertoire/repertoire-worker/language/parser/scenarios/page-schema/slurMarkWithSpecifiedKey.js'

export default function (parserState, slurMarkKey, roundness) {
  const foundSlurMarkWithSpecifiedKey = slurMarkWithSpecifiedKey(parserState, slurMarkKey)
  if (foundSlurMarkWithSpecifiedKey) {
    foundSlurMarkWithSpecifiedKey.roundCoefficientFactor = roundness
  }
}
