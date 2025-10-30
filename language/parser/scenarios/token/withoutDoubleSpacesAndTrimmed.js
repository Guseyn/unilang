'use strict'

module.exports = str => str.replace(/(\s){2,}/g, ' ').trim()
