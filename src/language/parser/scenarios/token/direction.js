'use strict'

import regexps from '#repertoire/language/parser/scenarios/static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  const match = regexps.direction.match(tokenValues)
  const direction = match[0]
  return direction
}
