'use strict'

import regexps from '#unilang/language/parser/scenarios/static-objects/regexps.js'

export default function (tokens) { return regexps.globalCommandDelimiter.replaceAllWithEmptyString(tokens) }
