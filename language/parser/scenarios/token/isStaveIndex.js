'use strict'

const withNumbersInsteadOfWords = require('./withNumbersInsteadOfWords')
const regexps = require('./../static-objects/regexps')

module.exports = (tokenValues, joinedTokenValues) => {
  const tokenValuesWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
  return regexps.staveIndex.test(tokenValuesWithNumbersInsteadOfWords) ||
    regexps.indexOfStave.test(tokenValuesWithNumbersInsteadOfWords)
}
