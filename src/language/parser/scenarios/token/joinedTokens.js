'use strict'

import tokenValuesFromTokens from '#repertoire/language/parser/scenarios/token/tokenValuesFromTokens.js'

export default function (tokens) {
  return tokenValuesFromTokens(tokens).join(' ')
}
