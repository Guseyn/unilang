'use strict'

export default function (voicesBody, drawnSingleUnitsInVoices) {
  if (voicesBody && !voicesBody.isEmpty) {
    for (let staveIndex = 0; staveIndex < drawnSingleUnitsInVoices.length; staveIndex++) {
      if (drawnSingleUnitsInVoices[staveIndex]) {
        for (let voiceIndex = 0; voiceIndex < drawnSingleUnitsInVoices[staveIndex].length; voiceIndex++) {
          if (drawnSingleUnitsInVoices[staveIndex][voiceIndex]) {
            for (let singleUnitIndex = 0; singleUnitIndex < drawnSingleUnitsInVoices[staveIndex][voiceIndex].length; singleUnitIndex++) {
              const currentSingleUnit = drawnSingleUnitsInVoices[staveIndex][voiceIndex][singleUnitIndex]
              if (currentSingleUnit.top < voicesBody.top) {
                voicesBody.top = currentSingleUnit.top
              }
              if (currentSingleUnit.bottom > voicesBody.bottom) {
                voicesBody.bottom = currentSingleUnit.bottom
              }
            }
          }
        }
      }
    }
  }
}
