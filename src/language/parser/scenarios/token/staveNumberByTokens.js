'use strict'

import withNumbersInsteadOfWords from '#unilang/language/parser/scenarios/token/withNumbersInsteadOfWords.js'
import regexps from '#unilang/language/parser/scenarios/static-objects/regexps.js'

export default function (joinedTokens, startsFromZero) {
  const strigifiedTokens = withNumbersInsteadOfWords(joinedTokens)
  const staveIndexMatches = regexps.numbers.match(strigifiedTokens)
  if (staveIndexMatches && staveIndexMatches[0]) {
    const staveIndex = staveIndexMatches[0] * 1 - (startsFromZero ? 1 : 0)
    return staveIndex
  }
  return 0
}
