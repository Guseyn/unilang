'use strict'

const regexps = require('./../static-objects/regexps')

module.exports = (tokenValues, joinedTokenValues) => {
  const match = regexps.direction.match(tokenValues)
  const direction = match[0]
  return direction
}
