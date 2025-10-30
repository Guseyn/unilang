'use strict'

const regexps = require('./../static-objects/regexps')

module.exports = (tokenValues, joinedTokenValues) => {
  return regexps.direction.test(tokenValues)
}
