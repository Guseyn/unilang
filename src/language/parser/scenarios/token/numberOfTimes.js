'use strict'

import regexps from '#repertoire/language/parser/scenarios/static-objects/regexps.js'
import withNumbersInsteadOfWords from '#repertoire/language/parser/scenarios/token/withNumbersInsteadOfWords.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.numberOfTimes.match(
    withNumbersInsteadOfWords(tokenValues)
  )[0] * 1
}
