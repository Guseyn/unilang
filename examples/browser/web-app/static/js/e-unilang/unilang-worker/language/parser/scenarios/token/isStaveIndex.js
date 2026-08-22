'use strict'

import withNumbersInsteadOfWords from '/js/e-unilang/unilang-worker/language/parser/scenarios/token/withNumbersInsteadOfWords.js'
import regexps from '/js/e-unilang/unilang-worker/language/parser/scenarios/static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  const tokenValuesWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
  return regexps.staveIndex.test(tokenValuesWithNumbersInsteadOfWords) ||
    regexps.indexOfStave.test(tokenValuesWithNumbersInsteadOfWords)
}
