'use strict'

import regexps from './../static-objects/regexps.js'
import withNumbersInsteadOfWords from './withNumbersInsteadOfWords.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.numberOfTimes.match(
    withNumbersInsteadOfWords(tokenValues)
  )[0] * 1
}
