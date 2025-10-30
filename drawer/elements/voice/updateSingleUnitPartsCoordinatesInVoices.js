'use strict'

const updateSingleUnitPartsCoordinates = require('./../unit/updateSingleUnitPartsCoordinates')

module.exports = (drawnSingleUnitsInVoices, xDistanceToMove = 0, yDistanceToMove = 0) => {
  for (let staveIndex = 0; staveIndex < drawnSingleUnitsInVoices.length; staveIndex++) {
    if (drawnSingleUnitsInVoices[staveIndex]) {
      for (let voiceIndex = 0; voiceIndex < drawnSingleUnitsInVoices[staveIndex].length; voiceIndex++) {
        if (drawnSingleUnitsInVoices[staveIndex][voiceIndex]) {
          for (let singleUnitIndex = 0; singleUnitIndex < drawnSingleUnitsInVoices[staveIndex][voiceIndex].length; singleUnitIndex++) {
            const currentSingleUnit = drawnSingleUnitsInVoices[staveIndex][voiceIndex][singleUnitIndex]
            updateSingleUnitPartsCoordinates(currentSingleUnit, xDistanceToMove, yDistanceToMove)
          }
        }
      }
    }
  }
}
