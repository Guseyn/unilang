'use strict'

import withNumbersInsteadOfWords from '/js/unilang-in-worker-environment/language/parser/scenarios/token/withNumbersInsteadOfWords.js'
import regexps from '/js/unilang-in-worker-environment/language/parser/scenarios/static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.horizontalCorrection.test(
    withNumbersInsteadOfWords(tokenValues)
  )
}
