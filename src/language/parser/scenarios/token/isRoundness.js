'use strict'

import regexps from '#repertoire/language/parser/scenarios/static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.withRoundness.test(tokenValues)
}
