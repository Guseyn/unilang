'use strict'

const withNumbersInsteadOfWords = require('./withNumbersInsteadOfWords')
const regexps = require('./../static-objects/regexps')

module.exports = (tokenValues, joinedTokenValues) => {
  return regexps.horizontalCorrection.test(
    withNumbersInsteadOfWords(tokenValues)
  )
}
