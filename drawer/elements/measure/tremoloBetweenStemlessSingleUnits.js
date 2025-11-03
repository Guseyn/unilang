'use strict'

import path from './../basic/path.js'

export default function (drawnVoicesOnPageLine, styles) {
  const { yDistanceBetweenSingleTremoloStrokes, tremoloStrokeOptions, beamWidth, noteSquareStemStrokeOptions, negativeXOffsetOfTremoloBeams, negativeXOffsetOfTremoloBeamsForUnitWithNotesOnAdditionalStaveLines } = styles
  const drawnTremolos = []
  const stemWidth = noteSquareStemStrokeOptions.width
  const beamLineHeightNormal = Math.sqrt(Math.pow(beamWidth, 2) - Math.pow(stemWidth, 2))
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
                  const nextSingleUnitInVoice = drawnSingleUnitsInVoices[staveIndex][voiceIndex][singleUnitIndex + 1]
                  if (nextSingleUnitInVoice && currentSingleUnit.hasConnectedTremolo && currentSingleUnit.tremoloWithNext && currentSingleUnit.stemless && currentSingleUnit.unitDuration === nextSingleUnitInVoice.unitDuration) {
                    const allTremoloStrokeHeight = (currentSingleUnit.numberOfTremoloStrokes - 1) * yDistanceBetweenSingleTremoloStrokes + currentSingleUnit.numberOfTremoloStrokes * beamLineHeightNormal
                    const leftUnitBodyHeight = currentSingleUnit.bodyBottom - currentSingleUnit.bodyTop
                    const rightUnitBodyHeight = nextSingleUnitInVoice.bodyBottom - nextSingleUnitInVoice.bodyTop
                    const yStartOfTremoloLeftEdge = currentSingleUnit.bodyTop + (leftUnitBodyHeight - allTremoloStrokeHeight) / 2
                    const yStartOfTremoloRightEdge = nextSingleUnitInVoice.bodyTop + (rightUnitBodyHeight - allTremoloStrokeHeight) / 2
                    const xLeftEdge = currentSingleUnit.bodyRight + (currentSingleUnit.anyNotesOnAdditionalStaveLines ? negativeXOffsetOfTremoloBeamsForUnitWithNotesOnAdditionalStaveLines : negativeXOffsetOfTremoloBeams)
                    const xRightEdge = nextSingleUnitInVoice.bodyLeft - (nextSingleUnitInVoice.anyNotesOnAdditionalStaveLines ? negativeXOffsetOfTremoloBeamsForUnitWithNotesOnAdditionalStaveLines : negativeXOffsetOfTremoloBeams)
                    const tremoloPoints = []
                    for (let index = 0; index < currentSingleUnit.numberOfTremoloStrokes; index++) {
                      tremoloPoints.push(
                        'M',
                        xLeftEdge, yStartOfTremoloLeftEdge + index * (yDistanceBetweenSingleTremoloStrokes + beamLineHeightNormal),
                        'L',
                        xRightEdge, yStartOfTremoloRightEdge + index * (yDistanceBetweenSingleTremoloStrokes + beamLineHeightNormal),
                        'L',
                        xRightEdge, yStartOfTremoloRightEdge + index * (yDistanceBetweenSingleTremoloStrokes + beamLineHeightNormal) + beamLineHeightNormal,
                        'L',
                        xLeftEdge, yStartOfTremoloLeftEdge + index * (yDistanceBetweenSingleTremoloStrokes + beamLineHeightNormal) + beamLineHeightNormal,
                        'Z'
                      )
                    }
                    drawnTremolos.push(
                      path(
                        tremoloPoints,
                        tremoloStrokeOptions
                      )
                    )
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return drawnTremolos
}
