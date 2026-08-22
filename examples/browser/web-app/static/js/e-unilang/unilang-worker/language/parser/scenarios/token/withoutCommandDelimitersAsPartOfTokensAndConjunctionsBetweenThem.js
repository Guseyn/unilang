'use strict'

import regexps from '/js/e-unilang/unilang-worker/language/parser/scenarios/static-objects/regexps.js'

export default function (tokens) {
  return regexps.globalCommandDelimiter.replaceAllWithEmptyString(tokens)
}
