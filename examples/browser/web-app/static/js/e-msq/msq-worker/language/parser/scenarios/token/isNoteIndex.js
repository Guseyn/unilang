'use strict'

import withNumbersInsteadOfWords from '/js/e-msq/msq-worker/language/parser/scenarios/token/withNumbersInsteadOfWords.js'
import regexps from '/js/e-msq/msq-worker/language/parser/scenarios/static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
  return regexps.noteIndex.test(tokensWithNumbersInsteadOfWords) ||
    regexps.indexOfNote.test(tokensWithNumbersInsteadOfWords)
}
