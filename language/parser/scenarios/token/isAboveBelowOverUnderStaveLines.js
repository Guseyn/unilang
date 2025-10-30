'use strict'

const regexps = require('./../static-objects/regexps')

module.exports = (tokenValues, joinedTokenValues) => {
  return regexps.aboveBelowOverUnderStaveLines.test(tokenValues)
}
