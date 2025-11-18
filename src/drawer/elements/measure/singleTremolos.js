'use strict'

import singleTremolo from '#unilang/drawer/elements/tremolo/singleTremolo.js'
import addPropertiesToElement from '#unilang/drawer/elements/basic/addPropertiesToElement.js'

export default function (drawnVoicesOnPageLine, styles) {
  const drawnSingleTremolos = []
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
                    const drawnSingleTremolo = singleTremolo(currentSingleUnit, styles)
                    if (drawnSingleTremolo) {
                      addPropertiesToElement(
                        drawnSingleTremolo,
                        {
                          'ref-ids': `tremolo-${currentSingleUnit.measureIndexInGeneral + 1}-${currentSingleUnit.staveIndex + 1}-${currentSingleUnit.voiceIndex + 1}-${currentSingleUnit.singleUnitIndex + 1}`
                        }
                      )
                      currentSingleUnit.top = Math.min(currentSingleUnit.top, drawnSingleTremolo.top)
                      currentSingleUnit.bottom = Math.max(currentSingleUnit.bottom, drawnSingleTremolo.bottom)
                      drawnSingleTremolos.push(drawnSingleTremolo)
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
  return drawnSingleTremolos
}
