'use strict'

import withNumbersInsteadOfWords from '#msq/language/parser/scenarios/token/withNumbersInsteadOfWords.js'
import regexps from '#msq/language/parser/scenarios/static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.horizontalCorrection.test(
    withNumbersInsteadOfWords(tokenValues)
  )
}
