'use strict'

module.exports = lastChordParams => {
  return lastChordParams.keysParams[lastChordParams.keysParams.length - 1]
}
