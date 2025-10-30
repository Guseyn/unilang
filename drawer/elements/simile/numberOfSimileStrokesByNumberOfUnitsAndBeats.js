'use strict'

module.exports = (numberOfUnits, numberOfBeats) => {
  if (numberOfUnits === 1) {
    return 1
  }
  if (numberOfBeats === 1) {
    return 2
  }
  if (numberOfBeats > 1) {
    return 'mixed'
  }
  return 0
}
