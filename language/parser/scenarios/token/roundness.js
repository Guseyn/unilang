'use strict'

const regexps = require('./../static-objects/regexps')

module.exports = (tokenValues, joinedTokenValues) => {
  const match = regexps.withRoundness.match(tokenValues)
  const roundness = match[0] * 1
  return roundness
}
