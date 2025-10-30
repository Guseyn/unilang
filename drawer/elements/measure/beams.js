'use strict'

const beamsWithStemsForDrawnSingleUnitsInVoiceOnOneStave = require('./../beam/beamsWithStemsForDrawnSingleUnitsInVoiceOnOneStave')

const keyForBeam = (staveIndex, voiceIndex, isGrace) => {
  return `${staveIndex}-${voiceIndex}-${isGrace}`
}

module.exports = (drawnVoicesOnPageLine, styles) => {
  const drawnBeams = []
  const beamsStack = {}
  if (drawnVoicesOnPageLine) {
    for (let measureIndex = 0; measureIndex < drawnVoicesOnPageLine.length; measureIndex++) {
      if (drawnVoicesOnPageLine[measureIndex]) {
        const { drawnSingleUnitsInVoices, withoutVoices } = drawnVoicesOnPageLine[measureIndex]
        if (!withoutVoices) {
          for (let staveIndex = 0; staveIndex < drawnSingleUnitsInVoices.length; staveIndex++) {
            if (drawnSingleUnitsInVoices[staveIndex]) {
              for (let voiceIndex = 0; voiceIndex < drawnSingleUnitsInVoices[staveIndex].length; voiceIndex++) {
                if (drawnSingleUnitsInVoices[staveIndex][voiceIndex]) {
                  for (let singleUnitIndex = 0; singleUnitIndex < drawnSingleUnitsInVoices[staveIndex][voiceIndex].length; singleUnitIndex++) {
                    const currentSingleUnit = drawnSingleUnitsInVoices[staveIndex][voiceIndex][singleUnitIndex]
                    const beamKey = keyForBeam(staveIndex, voiceIndex, currentSingleUnit.isGrace)
                    if (!beamsStack[beamKey]) {
                      beamsStack[beamKey] = {
                        singleUnits: []
                      }
                    }
                    beamsStack[beamKey].singleUnits.push(
                      currentSingleUnit
                    )
                    if (currentSingleUnit.isLastSingleUnitInVoiceOnPageLine) {
                      const plainKeyForBeam = keyForBeam(staveIndex, voiceIndex, false)
                      const graceKeyForBeam = keyForBeam(staveIndex, voiceIndex, true)
                      if (beamsStack[plainKeyForBeam]) {
                        drawnBeams.push(
                          ...beamsWithStemsForDrawnSingleUnitsInVoiceOnOneStave(
                            beamsStack[plainKeyForBeam].singleUnits, styles
                          )
                        )
                        delete beamsStack[plainKeyForBeam]
                      }
                      if (beamsStack[graceKeyForBeam]) {
                        drawnBeams.push(
                          ...beamsWithStemsForDrawnSingleUnitsInVoiceOnOneStave(
                            beamsStack[graceKeyForBeam].singleUnits, styles
                          )
                        )
                        delete beamsStack[graceKeyForBeam]
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return drawnBeams
}
