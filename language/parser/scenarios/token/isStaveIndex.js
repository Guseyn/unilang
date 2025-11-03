'use strict'

import withNumbersInsteadOfWords from './withNumbersInsteadOfWords.js'
import regexps from './../static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  const tokenValuesWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
  return regexps.staveIndex.test(tokenValuesWithNumbersInsteadOfWords) ||
    regexps.indexOfStave.test(tokenValuesWithNumbersInsteadOfWords)
}
