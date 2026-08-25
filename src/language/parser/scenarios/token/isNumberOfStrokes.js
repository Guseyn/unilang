'use strict'

import regexps from '#msq/language/parser/scenarios/static-objects/regexps.js'
import withNumbersInsteadOfWords from '#msq/language/parser/scenarios/token/withNumbersInsteadOfWords.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.withNumberOfStrokes.test(
    withNumbersInsteadOfWords(tokenValues)
  )
}
