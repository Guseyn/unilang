'use strict'

import tokenValuesFromTokens from '/js/unilang-in-worker-environment/language/parser/scenarios/token/tokenValuesFromTokens.js'

export default function (tokens) {
  return tokenValuesFromTokens(tokens).join(' ')
}
