'use strict'

import regexps from '/js/e-unilang/unilang-worker/language/parser/scenarios/static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  const match = regexps.aboveBelowOverUnder.match(tokenValues)
  const matchedDirection = match[0]
  const direction = ((matchedDirection === 'above') || (matchedDirection === 'over'))
    ? 'up'
    : 'down'
  return direction
}
