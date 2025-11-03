'use strict'

import regexps from './../static-objects/regexps.js'
import withNumbersInsteadOfWords from './withNumbersInsteadOfWords.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.withNumberOfStrokes.test(
    withNumbersInsteadOfWords(tokenValues)
  )
}
