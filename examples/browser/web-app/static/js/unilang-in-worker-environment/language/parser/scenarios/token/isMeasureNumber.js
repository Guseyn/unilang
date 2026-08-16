'use strict'

import regexps from '/js/unilang-in-worker-environment/language/parser/scenarios/static-objects/regexps.js'
import withNumbersInsteadOfWords from '/js/unilang-in-worker-environment/language/parser/scenarios/token/withNumbersInsteadOfWords.js'

export default function (tokenValues, joinedTokenValues) {
  const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
  return regexps.measureNumber.test(tokensWithNumbersInsteadOfWords) ||
    regexps.numberOfMeasure.test(tokensWithNumbersInsteadOfWords)
}
