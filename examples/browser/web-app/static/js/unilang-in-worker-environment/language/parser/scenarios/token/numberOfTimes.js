'use strict'

import regexps from '/js/unilang-in-worker-environment/language/parser/scenarios/static-objects/regexps.js'
import withNumbersInsteadOfWords from '/js/unilang-in-worker-environment/language/parser/scenarios/token/withNumbersInsteadOfWords.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.numberOfTimes.match(
    withNumbersInsteadOfWords(tokenValues)
  )[0] * 1
}
