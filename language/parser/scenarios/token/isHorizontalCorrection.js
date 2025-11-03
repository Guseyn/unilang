'use strict'

import withNumbersInsteadOfWords from './withNumbersInsteadOfWords.js'
import regexps from './../static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.horizontalCorrection.test(
    withNumbersInsteadOfWords(tokenValues)
  )
}
