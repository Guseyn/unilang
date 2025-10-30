'use strict'

module.exports = lastChordParams => {
  return lastChordParams.articulationParams[lastChordParams.articulationParams.length - 1]
}
