'use strict'

const group = require('./../basic/group')
const placeSingleUnitsInCrossStaveUnitAmongVirtualVerticalsThatDontCollide = require('./placeSingleUnitsInCrossStaveUnitAmongVirtualVerticalsThatDontCollide')
const moveSingleUnitsInCrossStaveUnitAccordingToVerticalsTheyBelongSoTheyDontCollideAndAlsoCentralizeAllSingleUnitsByTheirUnitBodiesInEachVerticalIfThereAreNoKeysBefore = require('./moveSingleUnitsInCrossStaveUnitAccordingToVerticalsTheyBelongSoTheyDontCollideAndAlsoCentralizeAllSingleUnitsByTheirUnitBodiesInEachVerticalIfThereAreNoKeysBefore')
const moveElement = require('./../basic/moveElement')
const elementWithAdditionalInformation = require('./../basic/elementWithAdditionalInformation')

module.exports = (drawnSingleUnitsForCurrentCrossStaveUnit, stavesParams, containsCollidedVoices, drawnKeysForCurrentCrossStaveUnit, drawnArpeggiatedWavesForCurrentCrossStaveUnit, isCurrentCrossStaveUnitGrace, topOffsetsForEachStave, numberOfStaveLines, styles) => {
  const drawnCrossVoiceUnitsOnAllStaves = []
  const verticalsInCrossStaveUnit = []
  const areasWithAdditionalStaveLinesForNotesInTheFirstVertical = []
  const { intervalBetweenStaveLines, spaceAfterKeysForSingleUnitsBeforeCrossStaveUnitThatContainsNotesOnAdditionalStaveLines, spaceAfterKeysForSingleUnits, additionalStaveLinesRadiusFromNoteBody, graceElementsScaleFactor } = styles
  const halfOfIntervalBetweenStaveLines = 0.8 * intervalBetweenStaveLines
  const diffBetweenAdditionalStaveLinesRadiusFromNoteBodyForNormalAndGraceUnitsInCaseIfCurrentCrossStaveUnitIsGrace = isCurrentCrossStaveUnitGrace ? (additionalStaveLinesRadiusFromNoteBody - additionalStaveLinesRadiusFromNoteBody * graceElementsScaleFactor) : 0
  placeSingleUnitsInCrossStaveUnitAmongVirtualVerticalsThatDontCollide(stavesParams, drawnSingleUnitsForCurrentCrossStaveUnit, verticalsInCrossStaveUnit, containsCollidedVoices, styles)
  for (let staveIndex = 0; staveIndex < stavesParams.length; staveIndex++) {
    if (drawnSingleUnitsForCurrentCrossStaveUnit[staveIndex].length > 0) {
      for (let singleUnitIndex = 0; singleUnitIndex < drawnSingleUnitsForCurrentCrossStaveUnit[staveIndex].length; singleUnitIndex++) {
        if (drawnSingleUnitsForCurrentCrossStaveUnit[staveIndex][singleUnitIndex].verticalIndex === 0) {
          for (let noteIndex = 0; noteIndex < drawnSingleUnitsForCurrentCrossStaveUnit[staveIndex][singleUnitIndex].notesWithCoordinates.length; noteIndex++) {
            const actualStaveIndex = drawnSingleUnitsForCurrentCrossStaveUnit[staveIndex][singleUnitIndex].notesWithCoordinates[noteIndex].staveIndexConsideringStavePosition
            if (drawnSingleUnitsForCurrentCrossStaveUnit[staveIndex][singleUnitIndex].notesWithCoordinates[noteIndex].isOnTheLeftSideOfUnit) {
              if (drawnSingleUnitsForCurrentCrossStaveUnit[staveIndex][singleUnitIndex].notesWithCoordinates[noteIndex].positionNumber <= -1) {
                areasWithAdditionalStaveLinesForNotesInTheFirstVertical.push({
                  actualStaveIndex: actualStaveIndex,
                  minY: drawnSingleUnitsForCurrentCrossStaveUnit[staveIndex][singleUnitIndex].notesWithCoordinates[noteIndex].top,
                  maxY: topOffsetsForEachStave[actualStaveIndex] - halfOfIntervalBetweenStaveLines
                })
              } else if (drawnSingleUnitsForCurrentCrossStaveUnit[staveIndex][singleUnitIndex].notesWithCoordinates[noteIndex].positionNumber >= numberOfStaveLines) {
                areasWithAdditionalStaveLinesForNotesInTheFirstVertical.push({
                  actualStaveIndex: actualStaveIndex,
                  minY: topOffsetsForEachStave[actualStaveIndex] + (numberOfStaveLines - 1) * intervalBetweenStaveLines + halfOfIntervalBetweenStaveLines,
                  maxY: drawnSingleUnitsForCurrentCrossStaveUnit[staveIndex][singleUnitIndex].notesWithCoordinates[noteIndex].bottom
                })
              }
            }
          }
        }
      }
    }
  }
  const areasWithKeysInTheFirstColumn = drawnKeysForCurrentCrossStaveUnit.areasWithKeysInTheFirstColumn
  let weNeedToMoveSingleUnitsInCrossStaveUnitSoTheyDontCollideWithKeysBeforeBecauseOfAdditionalStaveLines = false
  for (let keyAreaIndex = 0; keyAreaIndex < areasWithKeysInTheFirstColumn.length; keyAreaIndex++) {
    if (weNeedToMoveSingleUnitsInCrossStaveUnitSoTheyDontCollideWithKeysBeforeBecauseOfAdditionalStaveLines) {
      break
    }
    for (let noteAreaIndex = 0; noteAreaIndex < areasWithAdditionalStaveLinesForNotesInTheFirstVertical.length; noteAreaIndex++) {
      if (
        (areasWithAdditionalStaveLinesForNotesInTheFirstVertical[noteAreaIndex].minY < areasWithKeysInTheFirstColumn[keyAreaIndex].maxY) &&
        (areasWithKeysInTheFirstColumn[keyAreaIndex].minY < areasWithAdditionalStaveLinesForNotesInTheFirstVertical[noteAreaIndex].maxY)
      ) {
        weNeedToMoveSingleUnitsInCrossStaveUnitSoTheyDontCollideWithKeysBeforeBecauseOfAdditionalStaveLines = true
        break
      }
    }
  }
  const thereAreKeysBefore = drawnKeysForCurrentCrossStaveUnit.numberOfKeys > 0
  const thereAreArpeggiatedWavesBefore = drawnArpeggiatedWavesForCurrentCrossStaveUnit.numberOfWaves > 0
  const weNeedToMoveSingleUnitsInCrossStaveUnitSoTheyDontCollideWithArrpegiatedWavesAndNotKeysBeforeBecauseOfAdditionalStaveLines = areasWithAdditionalStaveLinesForNotesInTheFirstVertical.length > 0 && thereAreArpeggiatedWavesBefore && !thereAreKeysBefore
  moveSingleUnitsInCrossStaveUnitAccordingToVerticalsTheyBelongSoTheyDontCollideAndAlsoCentralizeAllSingleUnitsByTheirUnitBodiesInEachVerticalIfThereAreNoKeysBefore(verticalsInCrossStaveUnit, weNeedToMoveSingleUnitsInCrossStaveUnitSoTheyDontCollideWithKeysBeforeBecauseOfAdditionalStaveLines, weNeedToMoveSingleUnitsInCrossStaveUnitSoTheyDontCollideWithArrpegiatedWavesAndNotKeysBeforeBecauseOfAdditionalStaveLines, thereAreKeysBefore, thereAreArpeggiatedWavesBefore, isCurrentCrossStaveUnitGrace, styles)
  if (thereAreKeysBefore && weNeedToMoveSingleUnitsInCrossStaveUnitSoTheyDontCollideWithKeysBeforeBecauseOfAdditionalStaveLines) {
    for (let staveIndex = 0; staveIndex < stavesParams.length; staveIndex++) {
      let weNeedToMoveKeysBeforeCrossUnitCloserOnCurrentStave = true
      for (let keyAreaIndex = 0; keyAreaIndex < areasWithKeysInTheFirstColumn.length; keyAreaIndex++) {
        if (!weNeedToMoveKeysBeforeCrossUnitCloserOnCurrentStave) {
          break
        }
        if (areasWithKeysInTheFirstColumn[keyAreaIndex].actualStaveIndex === staveIndex) {
          for (let noteAreaIndex = 0; noteAreaIndex < areasWithAdditionalStaveLinesForNotesInTheFirstVertical.length; noteAreaIndex++) {
            if (areasWithAdditionalStaveLinesForNotesInTheFirstVertical[noteAreaIndex].actualStaveIndex === staveIndex) {
              if (
                (areasWithAdditionalStaveLinesForNotesInTheFirstVertical[noteAreaIndex].minY < areasWithKeysInTheFirstColumn[keyAreaIndex].maxY) &&
                (areasWithKeysInTheFirstColumn[keyAreaIndex].minY < areasWithAdditionalStaveLinesForNotesInTheFirstVertical[noteAreaIndex].maxY)
              ) {
                weNeedToMoveKeysBeforeCrossUnitCloserOnCurrentStave = false
                break
              }
            }
          }
        }
      }
      if (weNeedToMoveKeysBeforeCrossUnitCloserOnCurrentStave) {
        moveElement(
          drawnKeysForCurrentCrossStaveUnit.groupsOfKeysOnAllStaves.find(groupOfKeysOnStave => groupOfKeysOnStave.staveIndex === staveIndex),
          (spaceAfterKeysForSingleUnitsBeforeCrossStaveUnitThatContainsNotesOnAdditionalStaveLines - spaceAfterKeysForSingleUnits) * (isCurrentCrossStaveUnitGrace ? graceElementsScaleFactor : 1) - diffBetweenAdditionalStaveLinesRadiusFromNoteBodyForNormalAndGraceUnitsInCaseIfCurrentCrossStaveUnitIsGrace
        )
      }
    }
  }
  for (let staveIndex = 0; staveIndex < stavesParams.length; staveIndex++) {
    if (drawnSingleUnitsForCurrentCrossStaveUnit[staveIndex].length > 0) {
      const drawnCrossVoiceUnitOnOneStave = elementWithAdditionalInformation(
        group(
          'crossVoiceUnitOnOneStave',
          drawnSingleUnitsForCurrentCrossStaveUnit[staveIndex]
        ),
        {
          areasWithAdditionalStaveLinesForNotesInTheFirstVertical
        }
      )
      drawnCrossVoiceUnitsOnAllStaves.push(
        drawnCrossVoiceUnitOnOneStave
      )
    }
  }
  return drawnCrossVoiceUnitsOnAllStaves
}
