'use strict'

import withNumbersInsteadOfWords from '#repertoire/language/parser/scenarios/token/withNumbersInsteadOfWords.js'
import regexps from '#repertoire/language/parser/scenarios/static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.horizontalCorrection.test(
    withNumbersInsteadOfWords(tokenValues)
  )
}
