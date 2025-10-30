'use strict'

module.exports = lastChordParams => {
  return lastChordParams.glissandoMarks[lastChordParams.glissandoMarks.length - 1]
}
