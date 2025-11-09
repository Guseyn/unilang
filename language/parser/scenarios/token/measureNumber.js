'use strict'

import regexps from '#unilang/language/parser/scenarios/static-objects/regexps.js'
import withNumbersInsteadOfWords from '#unilang/language/parser/scenarios/token/withNumbersInsteadOfWords.js'

export default function (tokenValues, joinedTokenValues) {
  const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
  let match
  if (regexps.measureNumber.test(tokensWithNumbersInsteadOfWords)) {
    match = regexps.measureNumber.match(tokensWithNumbersInsteadOfWords)
  } else {
    match = regexps.numberOfMeasure.match(tokensWithNumbersInsteadOfWords)
  }
  const measureNumber = match[0] * 1
  return measureNumber
}
