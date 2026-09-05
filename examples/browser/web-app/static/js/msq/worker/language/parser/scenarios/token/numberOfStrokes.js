'use strict'

import regexps from '/js/msq/worker/language/parser/scenarios/static-objects/regexps.js'
import withNumbersInsteadOfWords from '/js/msq/worker/language/parser/scenarios/token/withNumbersInsteadOfWords.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.withNumberOfStrokes.match(
    withNumbersInsteadOfWords(tokenValues)
  )[0] * 1
}
