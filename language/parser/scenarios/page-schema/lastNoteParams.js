'use strict'

module.exports = lastChordParams => {
  return lastChordParams.notes[lastChordParams.notes.length - 1]
}
