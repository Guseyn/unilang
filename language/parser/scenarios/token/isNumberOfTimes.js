'use strict'

const regexps = require('./../static-objects/regexps')
const withNumbersInsteadOfWords = require('./withNumbersInsteadOfWords')

module.exports = (tokenValues, joinedTokenValues) => {
  return regexps.numberOfTimes.test(
    withNumbersInsteadOfWords(tokenValues)
  )
}
