'use strict'

import tokenValuesFromTokens from './tokenValuesFromTokens.js'

export default function (tokens) {
  return tokenValuesFromTokens(tokens).join(' ')
}
