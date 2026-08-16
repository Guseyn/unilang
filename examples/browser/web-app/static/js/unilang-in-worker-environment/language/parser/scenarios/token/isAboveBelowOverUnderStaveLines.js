'use strict'

import regexps from '/js/unilang-in-worker-environment/language/parser/scenarios/static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.aboveBelowOverUnderStaveLines.test(tokenValues)
}
