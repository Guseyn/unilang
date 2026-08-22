'use strict'

import tokenValuesFromTokens from '/js/e-unilang/unilang-worker/language/parser/scenarios/token/tokenValuesFromTokens.js'

export default function (tokens) {
  return tokenValuesFromTokens(tokens).join(' ')
}
