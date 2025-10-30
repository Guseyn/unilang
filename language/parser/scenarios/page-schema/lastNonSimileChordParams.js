'use strict'

module.exports = lastVoiceParams => {
  for (let chordIndex = lastVoiceParams.length - 1; chordIndex >= 0; chordIndex--) {
    if (!lastVoiceParams[chordIndex].isSimile) {
      return lastVoiceParams[chordIndex]
    }
  }
  return null
}
