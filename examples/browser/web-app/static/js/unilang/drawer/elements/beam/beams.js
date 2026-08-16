'use strict'

import calculatedNumberOfBeamLinesByDuration from '#unilang/drawer/elements/beam/calculatedNumberOfBeamLinesByDuration.js'
import drawnBeamColumn from '#unilang/drawer/elements/beam/drawnBeamColumn.js'
import drawnBeamColumnForStemInBeamedSingleUnitsChainWithDifferenStemDirections from '#unilang/drawer/elements/beam/drawnBeamColumnForStemInBeamedSingleUnitsChainWithDifferenStemDirections.js'
import drawnBeamLinesPiece from '#unilang/drawer/elements/beam/drawnBeamLinesPiece.js'

export default function (styles, drawnStems, minNumberOfBeamLines, beamLineHeightNormal, allBeamsHeightNormalWhereAllStemsWithSameDirection, beamLineCoefficients, anyStemDirectionChangesInBeamedSingleUnits) {
  const beamColumns = []
  const beamLinesPieces = []
  const firstStemDirection = drawnStems[0].direction
  const numberOfDrawnBeamsForEachStemInLeftSide = []
  for (let index = 0; index < drawnStems.length; index++) {
    const isFirstBeam = (index === 0)
    const isLastBeam = (index === drawnStems.length - 2)
    const stem = drawnStems[index]
    const nextStem = drawnStems[index + 1]
    const nextToNextStem = drawnStems[index + 2]
    if (nextStem) {
      const numberOfBeamLinesForStemInRightSide = calculatedNumberOfBeamLinesByDuration(stem.unitDuration) + (stem.hasConnectedTremolo ? stem.numberOfTremoloStrokesInUnit : 0)
      const numberOfBeamLinesForNextStemInLeftSide = calculatedNumberOfBeamLinesByDuration(nextStem.unitDuration) + (nextStem.hasConnectedTremolo ? nextStem.numberOfTremoloStrokesInUnit : 0)
      const numberOfBeamLinesForNextToNextStemInLeftSide = nextToNextStem ? (calculatedNumberOfBeamLinesByDuration(nextToNextStem.unitDuration) + nextToNextStem.numberOfTremoloStrokesInUnit) : undefined
      let numberOfBeamLinesForStemInRightSideToDraw = numberOfBeamLinesForStemInRightSide
      let numberOfBeamLinesForNextStemInLeftSideToDraw = numberOfBeamLinesForNextStemInLeftSide
      if (numberOfBeamLinesForNextToNextStemInLeftSide >= numberOfBeamLinesForNextStemInLeftSide) {
        numberOfBeamLinesForNextStemInLeftSideToDraw = Math.min(numberOfBeamLinesForStemInRightSide, numberOfBeamLinesForNextStemInLeftSide)
      }
      if (numberOfDrawnBeamsForEachStemInLeftSide[index - 1]) {
        if (numberOfDrawnBeamsForEachStemInLeftSide[index - 1] >= numberOfBeamLinesForStemInRightSide) {
          numberOfBeamLinesForStemInRightSideToDraw = Math.min(numberOfBeamLinesForStemInRightSide, numberOfBeamLinesForNextStemInLeftSide)
        }
      }
      numberOfDrawnBeamsForEachStemInLeftSide.push(numberOfBeamLinesForNextStemInLeftSideToDraw)
      beamLinesPieces.push(
        drawnBeamLinesPiece(styles, stem, nextStem, beamLineHeightNormal, allBeamsHeightNormalWhereAllStemsWithSameDirection, isFirstBeam, isLastBeam, numberOfBeamLinesForStemInRightSideToDraw, numberOfBeamLinesForNextStemInLeftSideToDraw, beamLineCoefficients, anyStemDirectionChangesInBeamedSingleUnits, firstStemDirection)
      )
    }
  }
  for (let index = 0; index < drawnStems.length; index++) {
    const stem = drawnStems[index]
    if (!anyStemDirectionChangesInBeamedSingleUnits) {
      beamColumns.push(
        drawnBeamColumn(styles, stem, beamLineHeightNormal, allBeamsHeightNormalWhereAllStemsWithSameDirection)
      )
    } else {
      beamColumns.push(
        drawnBeamColumnForStemInBeamedSingleUnitsChainWithDifferenStemDirections(styles, stem)
      )
    }
  }
  return {
    beamColumns,
    beamLinesPieces
  }
}
