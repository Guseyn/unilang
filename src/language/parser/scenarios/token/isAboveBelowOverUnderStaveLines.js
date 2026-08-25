'use strict'

import regexps from '#msq/language/parser/scenarios/static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.aboveBelowOverUnderStaveLines.test(tokenValues)
}
