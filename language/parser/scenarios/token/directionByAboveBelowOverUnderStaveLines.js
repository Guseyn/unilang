'use strict'

const regexps = require('./../static-objects/regexps')

module.exports = (tokenValues, joinedTokenValues) => {
  const match = regexps.aboveBelowOverUnderStaveLines.match(tokenValues)
  const matchedDirection = match[0]
  const direction = ((matchedDirection === 'above') || (matchedDirection === 'over'))
    ? 'up'
    : 'down'
  return direction
}
