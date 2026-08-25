'use strict'

import regexps from '/js/e-msq/msq-worker/language/parser/scenarios/static-objects/regexps.js'
import withNumbersInsteadOfWords from '/js/e-msq/msq-worker/language/parser/scenarios/token/withNumbersInsteadOfWords.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.numberOfTimes.test(
    withNumbersInsteadOfWords(tokenValues)
  )
}
