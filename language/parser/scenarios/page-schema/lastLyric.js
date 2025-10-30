'use strict'

module.exports = lastChordParams => {
  return lastChordParams.relatedLyrics[lastChordParams.relatedLyrics.length - 1]
}
