'use strict'

import regexps from '/js/e-repertoire/repertoire-worker/language/parser/scenarios/static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.aboveBelowOverUnder.test(tokenValues)
}
