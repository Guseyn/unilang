'use strict'

const regexps = require('./../static-objects/regexps')
const withNumbersInsteadOfWords = require('./withNumbersInsteadOfWords')

module.exports = (tokenValues, joinedTokenValues) => {
  const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
  return regexps.measureNumber.test(tokensWithNumbersInsteadOfWords) ||
    regexps.numberOfMeasure.test(tokensWithNumbersInsteadOfWords)
}
