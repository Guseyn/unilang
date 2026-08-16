'use strict'

import withNumbersInsteadOfWords from '#unilang/language/parser/scenarios/token/withNumbersInsteadOfWords.js'
import regexps from '#unilang/language/parser/scenarios/static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  const tokenValuesWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
  return regexps.staveIndex.test(tokenValuesWithNumbersInsteadOfWords) ||
    regexps.indexOfStave.test(tokenValuesWithNumbersInsteadOfWords)
}
