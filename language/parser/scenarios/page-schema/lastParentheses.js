'use strict'

module.exports = lastChordParams => {
  return lastChordParams.parentheses[lastChordParams.parentheses.length - 1]
}
