'use strict'

const withNumbersInsteadOfWords = require('./withNumbersInsteadOfWords')
const regexps = require('./../static-objects/regexps')

module.exports = (tokenValues, joinedTokenValues) => {
  const tokenValuesWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
  const match = regexps.verticalCorrection.match(tokenValuesWithNumbersInsteadOfWords)
  const verticalCorrectionValue = match[0]
  const directionOfVerticalCorrection = match[1]
  const directionSignOfVerticalCorrection = directionOfVerticalCorrection === 'up' ? -1 : 1
  return directionSignOfVerticalCorrection * verticalCorrectionValue
}
