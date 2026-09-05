'use strict'

import withNumbersInsteadOfWords from '/js/msq/worker/language/parser/scenarios/token/withNumbersInsteadOfWords.js'
import regexps from '/js/msq/worker/language/parser/scenarios/static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.verticalCorrection.test(
    withNumbersInsteadOfWords(tokenValues)
  )
}
