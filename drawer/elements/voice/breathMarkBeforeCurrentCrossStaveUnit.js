'use strict'

const supportedBreathMarkTypes = ['comma', 'double slash']
import path from './../basic/path.js'
import group from './../basic/group.js'
import addPropertiesToElement from './../basic/addPropertiesToElement.js'

export default function (selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit, drawnMidMeasureClefsForCrossStaveUnits, drawnMidMeasureKeySignaturesForCrossStaveUnits, numberOfStaves, styles, leftOffset, topOffsetsForEachStave, containsDrawnCrossStaveElementsBesideCrossStaveUnits) {
  const { intervalBetweenStaveLines, spaceAfterMidMeasureClefs, spaceAfterMidMeasureKeySignaturesForBreathMark, breathMarkAsComma, breathMarkAsDoubleSlash, fontColor } = styles
  const breathMarkTypes = {
    'comma': breathMarkAsComma,
    'double slash': breathMarkAsDoubleSlash
  }
  let breathMark
  let firstSingleUnitParamsWithBreathMarkBefore
  for (let singleUnitParamIndex = 0; singleUnitParamIndex < selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit.length; singleUnitParamIndex++) {
    const currentSingleUnitParams = selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit[singleUnitParamIndex]
    if (currentSingleUnitParams.breathMarkBefore) {
      breathMark = currentSingleUnitParams.breathMarkBefore
      firstSingleUnitParamsWithBreathMarkBefore = currentSingleUnitParams
      break
    }
  }
  const startXPositionOfBreathMarks = drawnMidMeasureKeySignaturesForCrossStaveUnits[drawnMidMeasureKeySignaturesForCrossStaveUnits.length - 1].right + (
    drawnMidMeasureKeySignaturesForCrossStaveUnits[drawnMidMeasureKeySignaturesForCrossStaveUnits.length - 1].isEmpty
      ? drawnMidMeasureClefsForCrossStaveUnits[drawnMidMeasureClefsForCrossStaveUnits.length - 1].isEmpty
        ? 0
        : spaceAfterMidMeasureClefs
      : spaceAfterMidMeasureKeySignaturesForBreathMark
  )
  if (!breathMark) {
    return {
      isEmpty: true,
      name: 'g',
      properties: {
        'data-name': 'breathMarkBeforeCurrentCrossStaveUnit'
      },
      transformations: [],
      top: topOffsetsForEachStave[0],
      right: startXPositionOfBreathMarks,
      bottom: topOffsetsForEachStave[topOffsetsForEachStave.length - 1],
      left: startXPositionOfBreathMarks
    }
  }
  containsDrawnCrossStaveElementsBesideCrossStaveUnits.value = true
  const breathMarkType = supportedBreathMarkTypes.indexOf(breathMark.type) >= 0 ? breathMark.type : 'comma'
  const breathMarkYCorrection = breathMark.yCorrection || 0
  const breathMarks = []
  for (let staveIndex = 0; staveIndex < numberOfStaves; staveIndex++) {
    const topOffsetForCurrentStave = topOffsetsForEachStave[staveIndex]
    const drawnBreathMark = path(
      breathMarkTypes[breathMarkType].points,
      null,
      fontColor,
      startXPositionOfBreathMarks,
      topOffsetForCurrentStave + (
        breathMarkTypes[breathMarkType].yCorrection
      ) + breathMarkYCorrection * intervalBetweenStaveLines
    )
    addPropertiesToElement(
      drawnBreathMark,
      {
        'ref-ids': `breath-mark-before-${firstSingleUnitParamsWithBreathMarkBefore.measureIndexInGeneral + 1}-${firstSingleUnitParamsWithBreathMarkBefore.staveIndex + 1}-${firstSingleUnitParamsWithBreathMarkBefore.voiceIndex + 1}-${firstSingleUnitParamsWithBreathMarkBefore.singleUnitIndex + 1}`
      }
    )
    breathMarks.push(drawnBreathMark)
  }
  return group(
    'breathMarkBeforeCurrentCrossStaveUnit',
    breathMarks
  )
}
