'use strict'

module.exports = (drawnSingleUnits) => {
  for (let index = 0; index < drawnSingleUnits.length; index++) {
    if (index > 0) {
      if (drawnSingleUnits[index].stemDirection !== drawnSingleUnits[index - 1].stemDirection) {
        return true
      }
    }
  }
  return false
}
