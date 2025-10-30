'use strict'

const withNumbersInsteadOfWords = require('./withNumbersInsteadOfWords')
const regexps = require('./../static-objects/regexps')

module.exports = (tokenValues, joinedTokenValues) => {
  const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
  return regexps.noteIndex.test(tokensWithNumbersInsteadOfWords) ||
    regexps.indexOfNote.test(tokensWithNumbersInsteadOfWords)
}
