'use strict'

import regexps from './../static-objects/regexps.js'
import withNumbersInsteadOfWords from './withNumbersInsteadOfWords.js'

export default function (tokenValues, joinedTokenValues) {
  const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
  return regexps.measureNumber.test(tokensWithNumbersInsteadOfWords) ||
    regexps.numberOfMeasure.test(tokensWithNumbersInsteadOfWords)
}
