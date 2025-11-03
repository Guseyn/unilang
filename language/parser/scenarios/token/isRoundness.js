'use strict'

import regexps from './../static-objects/regexps.js'

export default function (tokenValues, joinedTokenValues) {
  return regexps.withRoundness.test(tokenValues)
}
