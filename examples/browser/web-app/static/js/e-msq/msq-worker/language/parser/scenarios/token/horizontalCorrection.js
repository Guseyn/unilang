'use strict'

import withNumbersInsteadOfWords from '/js/e-msq/msq-worker/language/parser/scenarios/token/withNumbersInsteadOfWords.js'
import regexps from '/js/e-msq/msq-worker/language/parser/scenarios/static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  const tokenValuesWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
  const match = regexps.horizontalCorrection.match(tokenValuesWithNumbersInsteadOfWords)
  const horizontalCorrectionValue = match[0]
  const directionOfHorizontalCorrection = match[1]
  const directionSignOfHorizontalCorrection = directionOfHorizontalCorrection === 'left' ? -1 : 1
  return directionSignOfHorizontalCorrection * horizontalCorrectionValue
}
