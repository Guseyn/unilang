'use strict'

import regexps from '/js/msq/worker/language/parser/scenarios/static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.direction.test(tokenValues)
}
