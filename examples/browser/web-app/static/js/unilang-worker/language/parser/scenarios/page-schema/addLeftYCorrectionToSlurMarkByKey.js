'use strict'

import slurMarkWithSpecifiedKey from '/js/unilang-worker/language/parser/scenarios/page-schema/slurMarkWithSpecifiedKey.js'

export default function (parserState, slurMarkKey, yCorrection) {
  const foundSlurMarkWithSpecifiedKey = slurMarkWithSpecifiedKey(parserState, slurMarkKey)
  if (foundSlurMarkWithSpecifiedKey) {
    foundSlurMarkWithSpecifiedKey.leftYCorrection = yCorrection
  }
}
