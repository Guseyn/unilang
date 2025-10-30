'use strict'

const withNumbersInsteadOfWords = require('./withNumbersInsteadOfWords')
const regexps = require('./../static-objects/regexps')

module.exports = (tokenValues, joinedTokenValues) => {
  const tokenValuesWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
  const match = regexps.horizontalCorrection.match(tokenValuesWithNumbersInsteadOfWords)
  const horizontalCorrectionValue = match[0]
  const directionOfHorizontalCorrection = match[1]
  const directionSignOfHorizontalCorrection = directionOfHorizontalCorrection === 'left' ? -1 : 1
  return directionSignOfHorizontalCorrection * horizontalCorrectionValue
}
