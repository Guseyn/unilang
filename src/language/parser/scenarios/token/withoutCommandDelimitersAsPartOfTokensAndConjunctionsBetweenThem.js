'use strict'

import regexps from '#repertoire/language/parser/scenarios/static-objects/regexps.js'

export default function (tokens) {
  return regexps.globalCommandDelimiter.replaceAllWithEmptyString(tokens)
}
