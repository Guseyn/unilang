'use strict'

const regexps = require('./../static-objects/regexps')

module.exports = tokens => regexps.globalCommandDelimiter.replaceAllWithEmptyString(tokens)
