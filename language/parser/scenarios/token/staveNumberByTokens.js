'use strict'

const withNumbersInsteadOfWords = require('./withNumbersInsteadOfWords')
const regexps = require('./../static-objects/regexps')

module.exports = (joinedTokens, startsFromZero) => {
  const strigifiedTokens = withNumbersInsteadOfWords(joinedTokens)
  const staveIndexMatches = regexps.numbers.match(strigifiedTokens)
  if (staveIndexMatches && staveIndexMatches[0]) {
    const staveIndex = staveIndexMatches[0] * 1 - (startsFromZero ? 1 : 0)
    return staveIndex
  }
  return 0
}
