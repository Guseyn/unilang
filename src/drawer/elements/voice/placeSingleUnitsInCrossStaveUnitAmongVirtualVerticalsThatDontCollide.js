'use strict'

import singleUnitFitsInVertical from '#unilang/drawer/elements/voice/singleUnitFitsInVertical.js'

export default function (stavesParams, drawnSingleUnitsForCurrentCrossStaveUnit, verticalsInCrossStaveUnit, containsCollidedVoices, styles) {
  for (let staveIndex = 0; staveIndex < stavesParams.length; staveIndex++) {
    if (drawnSingleUnitsForCurrentCrossStaveUnit[staveIndex].length > 0) {
      const drawnSingleUnitsForCurrentCrossStaveUnitOnCurrentStaveSortedByNumberOfDots = drawnSingleUnitsForCurrentCrossStaveUnit[staveIndex].sort((firstSingleUnit, secondSingleUnit) => {
        if (firstSingleUnit.numberOfDots > secondSingleUnit.numberOfDots) {
          return -1
        }
        if (firstSingleUnit.numberOfDots < secondSingleUnit.numberOfDots) {
          return +1
        }
        return 0
      })
      for (let singleUnitIndex = 0; singleUnitIndex < drawnSingleUnitsForCurrentCrossStaveUnitOnCurrentStaveSortedByNumberOfDots.length; singleUnitIndex++) {
        const currentSingleUnit = drawnSingleUnitsForCurrentCrossStaveUnitOnCurrentStaveSortedByNumberOfDots[singleUnitIndex]
        let verticalIndexWhereSingleUnitFitsIn = 0
        if (verticalsInCrossStaveUnit.length === 0) {
          verticalsInCrossStaveUnit.push({
            singleUnits: [ currentSingleUnit ]
          })
          if (currentSingleUnit.numberOfDots > 0) {
            verticalsInCrossStaveUnit[verticalsInCrossStaveUnit.length - 1].containsSingleUnitsWithDots = true
          }
        } else {
          let singleUnitCanFitInOneOfExistingVerticals = false
          for (let verticalIndex = 0; verticalIndex < verticalsInCrossStaveUnit.length; verticalIndex++) {
            const currentVertical = verticalsInCrossStaveUnit[verticalIndex]
            const singleUnitsBefore = currentVertical.singleUnits
            const staveIndex = currentSingleUnit.staveIndex
            singleUnitCanFitInOneOfExistingVerticals = singleUnitFitsInVertical(staveIndex, currentSingleUnit, singleUnitsBefore, styles)
            if (singleUnitCanFitInOneOfExistingVerticals) {
              verticalIndexWhereSingleUnitFitsIn = verticalIndex
              break
            }
          }
          if (singleUnitCanFitInOneOfExistingVerticals) {
            verticalsInCrossStaveUnit[verticalIndexWhereSingleUnitFitsIn].singleUnits.push(currentSingleUnit)
            if (currentSingleUnit.numberOfDots > 0) {
              verticalsInCrossStaveUnit[verticalIndexWhereSingleUnitFitsIn].containsSingleUnitsWithDots = true
            }
          } else {
            verticalIndexWhereSingleUnitFitsIn += 1
            verticalsInCrossStaveUnit.push({
              singleUnits: [ currentSingleUnit ]
            })
            containsCollidedVoices.value = true
            if (currentSingleUnit.numberOfDots > 0) {
              verticalsInCrossStaveUnit[verticalsInCrossStaveUnit.length - 1].containsSingleUnitsWithDots = true
            }
          }
        }
        currentSingleUnit.verticalIndex = verticalIndexWhereSingleUnitFitsIn
      }
    }
  }
}
