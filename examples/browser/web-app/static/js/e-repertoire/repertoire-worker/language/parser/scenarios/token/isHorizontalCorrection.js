'use strict'

import withNumbersInsteadOfWords from '/js/e-repertoire/repertoire-worker/language/parser/scenarios/token/withNumbersInsteadOfWords.js'
import regexps from '/js/e-repertoire/repertoire-worker/language/parser/scenarios/static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.horizontalCorrection.test(
    withNumbersInsteadOfWords(tokenValues)
  )
}
