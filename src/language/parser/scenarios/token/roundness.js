'use strict'

import regexps from '#repertoire/language/parser/scenarios/static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  const match = regexps.withRoundness.match(tokenValues)
  const roundness = match[0] * 1
  return roundness
}
