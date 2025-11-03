'use strict'

import withNumbersInsteadOfWords from './withNumbersInsteadOfWords.js'
import regexps from './../static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  const tokenValuesWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
  const match = regexps.horizontalCorrection.match(tokenValuesWithNumbersInsteadOfWords)
  const horizontalCorrectionValue = match[0]
  const directionOfHorizontalCorrection = match[1]
  const directionSignOfHorizontalCorrection = directionOfHorizontalCorrection === 'left' ? -1 : 1
  return directionSignOfHorizontalCorrection * horizontalCorrectionValue
}
