'use strict'

import regexps from '/js/e-repertoire/repertoire-worker/language/parser/scenarios/static-objects/regexps.js'
import withNumbersInsteadOfWords from '/js/e-repertoire/repertoire-worker/language/parser/scenarios/token/withNumbersInsteadOfWords.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.withNumberOfStrokes.test(
    withNumbersInsteadOfWords(tokenValues)
  )
}
