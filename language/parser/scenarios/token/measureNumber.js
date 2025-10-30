'use strict'

const regexps = require('./../static-objects/regexps')
const withNumbersInsteadOfWords = require('./withNumbersInsteadOfWords')

module.exports = (tokenValues, joinedTokenValues) => {
  const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
  let match
  if (regexps.measureNumber.test(tokensWithNumbersInsteadOfWords)) {
    match = regexps.measureNumber.match(tokensWithNumbersInsteadOfWords)
  } else {
    match = regexps.numberOfMeasure.match(tokensWithNumbersInsteadOfWords)
  }
  const measureNumber = match[0] * 1
  return measureNumber
}
