'use strict'

import withNumbersInsteadOfWords from './withNumbersInsteadOfWords.js'
import regexps from './../static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  const tokenValuesWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
  const match = regexps.verticalCorrection.match(tokenValuesWithNumbersInsteadOfWords)
  const verticalCorrectionValue = match[0]
  const directionOfVerticalCorrection = match[1]
  const directionSignOfVerticalCorrection = directionOfVerticalCorrection === 'up' ? -1 : 1
  return directionSignOfVerticalCorrection * verticalCorrectionValue
}
