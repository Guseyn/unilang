'use strict'

import withNumbersInsteadOfWords from './withNumbersInsteadOfWords.js'
import regexps from './../static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
  return regexps.noteIndex.test(tokensWithNumbersInsteadOfWords) ||
    regexps.indexOfNote.test(tokensWithNumbersInsteadOfWords)
}
