'use strict'

import regexps from '/js/msq/msq-worker/language/parser/scenarios/static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.aboveBelowOverUnder.test(tokenValues)
}
