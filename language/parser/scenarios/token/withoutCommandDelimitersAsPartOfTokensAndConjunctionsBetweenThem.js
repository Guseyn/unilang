'use strict'

import regexps from './../static-objects/regexps.js'

export default function (tokens) { return regexps.globalCommandDelimiter.replaceAllWithEmptyString(tokens) }
