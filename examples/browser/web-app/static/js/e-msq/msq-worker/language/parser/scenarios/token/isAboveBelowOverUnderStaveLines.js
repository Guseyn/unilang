'use strict'

import regexps from '/js/e-msq/msq-worker/language/parser/scenarios/static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.aboveBelowOverUnderStaveLines.test(tokenValues)
}
