'use strict'

const sortedNotesForSingleUnitConsideringStaves = require('./../unit/sortedNotesForSingleUnitConsideringStaves')
const singleUnit = require('./../unit/singleUnit')
const actualDurationOfCurrentSingleUnit = require('./actualDurationOfCurrentSingleUnit')
const numberOfSimileStrokesByNumberOfUnitsAndBeats = require('./../simile/numberOfSimileStrokesByNumberOfUnitsAndBeats')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

const beamKey = (staveIndex, voiceIndex, isGrace) => {
  return `${staveIndex}-${voiceIndex}-${isGrace}`
}

const simileKey = (staveIndex, voiceIndex) => {
  return `${staveIndex}-${voiceIndex}`
}

const singleUnitParams = (params) => {
  const {
    pageLineNumber,
    numberOfStaveLines,
    measureIndexOnPageLine,
    measureIndexInGeneral,
    staveIndex,
    voiceIndex,
    singleUnitIndex,
    containsNotesOnCurrentStave,
    containsNotesOnPrevStave,
    containsNotesOnNextStave,
    containsKeysOnCurrentStave,
    containsKeysOnPrevStave,
    containsKeysOnNextStave,
    notes,
    unitDuration,
    actualDuration,
    stemDirection,
    numberOfDots,
    keysParams,
    parentheses,
    arpeggiated,
    beamedWithNext,
    beamedWithNextWithJustOneBeam,
    beamedWithPrevious,
    isRest,
    isOnlyUnitOnStaveWithoutMidMeasureElementsOrLyricsOrChordLettersOrSimilesOnThatStave,
    isFullMeasure,
    isFullMeasureAndShouldBeCentralizedBecauseOfThat,
    isSimile,
    isGrace,
    isGraceUnitAndNextUnitIsNotGrace,
    hasGraceCrushLine,
    simileRefId,
    simileYCorrection,
    numberOfSimileStrokes,
    tiedWithNext,
    tiedBefore,
    tiedAfter,
    tiedBeforeMeasure,
    tiedAfterMeasure,
    slurMarks,
    glissandoMarks,
    tupletMarks,
    pedalMark,
    dynamicChangeMark,
    articulationParams,
    tremoloParams,
    octaveSignMark,
    isOnLastMeasureOfPageLine,
    isLastSingleUnitInVoiceOnPageLine,
    thereAreNotesInTheSameCrossStaveUnitThatTheirPositionNumberIsMoreThanMaxNotePositionNumberInCurrentSingleUnitOnTheSameStave,
    thereAreNotesInTheSameCrossStaveUnitThatTheirPositionNumberIsLessThanMinNotePositionNumberInCurrentSingleUnitOnTheSameStave
  } = params
  return {
    pageLineNumber,
    numberOfStaveLines,
    measureIndexOnPageLine,
    measureIndexInGeneral,
    staveIndex,
    voiceIndex,
    singleUnitIndex,
    containsNotesOnCurrentStave: containsNotesOnCurrentStave || false,
    containsNotesOnPrevStave: containsNotesOnPrevStave || false,
    containsNotesOnNextStave: containsNotesOnNextStave || false,
    containsKeysOnCurrentStave: containsKeysOnCurrentStave || false,
    containsKeysOnPrevStave: containsKeysOnPrevStave || false,
    containsKeysOnNextStave: containsKeysOnNextStave || false,
    notes: notes || [],
    unitDuration: unitDuration || 1,
    actualDuration: actualDuration,
    stemDirection: stemDirection || 'up',
    numberOfDots: numberOfDots || 0,
    keysParams: keysParams || [],
    parentheses: parentheses || [],
    arpeggiated: arpeggiated || false,
    beamedWithNext: beamedWithNext && unitDuration < 1 / 4 && !isGraceUnitAndNextUnitIsNotGrace,
    beamedWithNextWithJustOneBeam: beamedWithNextWithJustOneBeam || false,
    beamedWithPrevious: beamedWithPrevious || false,
    isRest: isRest || false,
    isOnlyUnitOnStaveWithoutMidMeasureElementsOrLyricsOrChordLettersOrSimilesOnThatStave: isOnlyUnitOnStaveWithoutMidMeasureElementsOrLyricsOrChordLettersOrSimilesOnThatStave || false,
    isFullMeasure: isFullMeasure || false,
    isFullMeasureAndShouldBeCentralizedBecauseOfThat: isFullMeasureAndShouldBeCentralizedBecauseOfThat || false,
    isSimile: isSimile || false,
    isGrace: isGrace || false,
    isGraceUnitAndNextUnitIsNotGrace: isGraceUnitAndNextUnitIsNotGrace || false,
    hasGraceCrushLine: hasGraceCrushLine || false,
    numberOfSimileStrokes: isSimile ? (numberOfSimileStrokes || 1) : 0,
    simileRefId: simileRefId || null,
    simileYCorrection: simileYCorrection || 0,
    tiedWithNext: tiedWithNext || false,
    tiedBefore: tiedBefore || false,
    tiedAfter: tiedAfter || false,
    tiedBeforeMeasure: tiedBeforeMeasure || false,
    tiedAfterMeasure: tiedAfterMeasure || false,
    slurMarks: slurMarks || null,
    glissandoMarks: glissandoMarks || null,
    tupletMarks: tupletMarks || null,
    octaveSignMark: octaveSignMark || null,
    pedalMark: pedalMark || null,
    dynamicChangeMark: dynamicChangeMark || null,
    tremoloParams: tremoloParams || null,
    articulationParams: articulationParams || [],
    isLastSingleUnitInVoiceOnPageLine: isLastSingleUnitInVoiceOnPageLine || false,
    isOnLastMeasureOfPageLine: isOnLastMeasureOfPageLine || false,
    thereAreNotesInTheSameCrossStaveUnitThatTheirPositionNumberIsMoreThanMaxNotePositionNumberInCurrentSingleUnitOnTheSameStave,
    thereAreNotesInTheSameCrossStaveUnitThatTheirPositionNumberIsLessThanMinNotePositionNumberInCurrentSingleUnitOnTheSameStave
  }
}

module.exports = (selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit, numberOfStaves, numberOfStaveLines, pageLineNumber, measureIndexInGeneral, measureIndexOnPageLine, crossStaveUnitCount, drawnKeysForCrossStaveUnits, drawnSingleUnitsInVoices, beamingStatusesForEachVoiceOnPageLine, countersForEachVoice, durationsAccumulatorsForEachVoice, similesInformationByStaveAndVoiceIndexes, affectingTupletValuesByStaveAndVoiceIndexes, isOnLastMeasureOfPageLine, styles, topOffsetsForEachStave) => {
  const drawnSingleUnitsForCurrentCrossStaveUnitByStaves = []
  const drawnSingleUnitsForCurrentCrossStaveUnit = []
  for (let staveIndex = 0; staveIndex < numberOfStaves; staveIndex++) {
    drawnSingleUnitsForCurrentCrossStaveUnitByStaves[staveIndex] = []
  }
  const maxNotePositionsForEachStave = {}
  const minNotePositionsForEachStave = {}
  for (let singleUnitParamIndex = 0; singleUnitParamIndex < selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit.length; singleUnitParamIndex++) {
    const selectedSingleUnitParams = selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit[singleUnitParamIndex]
    let staveIndex = selectedSingleUnitParams.staveIndex
    for (let noteIndex = 0; noteIndex < selectedSingleUnitParams.notes.length; noteIndex++) {
      const currentNote = selectedSingleUnitParams.notes[noteIndex]
      if (currentNote.stave === 'prev') {
        staveIndex -= 1
      } else if (currentNote.stave === 'next') {
        staveIndex += 1
      }
      if (maxNotePositionsForEachStave[staveIndex] === undefined || maxNotePositionsForEachStave[staveIndex] < currentNote.positionNumber) {
        maxNotePositionsForEachStave[staveIndex] = currentNote.positionNumber
      }
      if (minNotePositionsForEachStave[staveIndex] === undefined || minNotePositionsForEachStave[staveIndex] > currentNote.positionNumber) {
        minNotePositionsForEachStave[staveIndex] = currentNote.positionNumber
      }
    }
  }
  for (let singleUnitParamIndex = 0; singleUnitParamIndex < selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit.length; singleUnitParamIndex++) {
    const selectedSingleUnitParams = selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit[singleUnitParamIndex]
    const staveIndex = selectedSingleUnitParams.staveIndex
    const voiceIndex = selectedSingleUnitParams.voiceIndex
    const sortedNotes = sortedNotesForSingleUnitConsideringStaves(selectedSingleUnitParams.notes)
    const firstNote = sortedNotes[0]
    const lastNote = sortedNotes[sortedNotes.length - 1]
    let staveIndexOfFirstNote = staveIndex
    let staveIndexOfLastNote = staveIndex
    if (firstNote.stave === 'prev') {
      staveIndexOfFirstNote -= 1
    } else if (firstNote.stave === 'next') {
      staveIndexOfFirstNote += 1
    }
    if (lastNote.stave === 'prev') {
      staveIndexOfLastNote -= 1
    } else if (lastNote.stave === 'next') {
      staveIndexOfLastNote += 1
    }
    const thereAreNotesInTheSameCrossStaveUnitThatTheirPositionNumberIsMoreThanMaxNotePositionNumberInCurrentSingleUnitOnTheSameStave = (maxNotePositionsForEachStave[staveIndexOfLastNote] > lastNote.positionNumber)
    const thereAreNotesInTheSameCrossStaveUnitThatTheirPositionNumberIsLessThanMinNotePositionNumberInCurrentSingleUnitOnTheSameStave = (minNotePositionsForEachStave[staveIndexOfFirstNote] < firstNote.positionNumber)
    const calculatedTopOffsetForCurrentStave = topOffsetsForEachStave[staveIndex]
    if (affectingTupletValuesByStaveAndVoiceIndexes && selectedSingleUnitParams.tupletMarks) {
      const tupletMarksInCurrentSingleUnit = selectedSingleUnitParams.tupletMarks
      for (let tupletMarkIndex = 0; tupletMarkIndex < tupletMarksInCurrentSingleUnit.length; tupletMarkIndex++) {
        if (!tupletMarksInCurrentSingleUnit[tupletMarkIndex].finish) {
          if (!affectingTupletValuesByStaveAndVoiceIndexes[staveIndex]) {
            affectingTupletValuesByStaveAndVoiceIndexes[staveIndex] = {}
          }
          if (!affectingTupletValuesByStaveAndVoiceIndexes[staveIndex][voiceIndex]) {
            affectingTupletValuesByStaveAndVoiceIndexes[staveIndex][voiceIndex] = []
          }
          const tupletValue = tupletMarksInCurrentSingleUnit[tupletMarkIndex].value
          if (/^(\d+)(:(\d+))?$/.test(tupletValue)) {
            affectingTupletValuesByStaveAndVoiceIndexes[staveIndex][voiceIndex].push(
              tupletValue
            )
          }
        }
      }
    }
    const generatedBeamKey = beamKey(staveIndex, voiceIndex, selectedSingleUnitParams.isGrace)
    const generatedSimileKey = simileKey(staveIndex, voiceIndex)

    const numberOfSimileStrokes = similesInformationByStaveAndVoiceIndexes[generatedSimileKey]
      ? similesInformationByStaveAndVoiceIndexes[generatedSimileKey].numberOfSimileStrokes
      : 0
    const simileRefId = similesInformationByStaveAndVoiceIndexes[generatedSimileKey]
      ? similesInformationByStaveAndVoiceIndexes[generatedSimileKey].refId
      : null
    const calculatedActualDurationOfCurrentSingleUnit = actualDurationOfCurrentSingleUnit(
      selectedSingleUnitParams,
      affectingTupletValuesByStaveAndVoiceIndexes,
      similesInformationByStaveAndVoiceIndexes,
      generatedSimileKey,
      staveIndex, voiceIndex
    )
    durationsAccumulatorsForEachVoice[staveIndex][voiceIndex] += calculatedActualDurationOfCurrentSingleUnit

    if (selectedSingleUnitParams.simileMark) {
      if (!similesInformationByStaveAndVoiceIndexes[generatedSimileKey]) {
        similesInformationByStaveAndVoiceIndexes[generatedSimileKey] = {
          numberOfSimileStrokes: 0,
          duration: 0,
          numberOfUnits: 0,
          numberOfBeats: selectedSingleUnitParams.simileMark.numberOfBeats,
          refId: selectedSingleUnitParams.simileMark.refId
        }
      }
    }
    if (similesInformationByStaveAndVoiceIndexes[generatedSimileKey] && !selectedSingleUnitParams.isSimile) {
      similesInformationByStaveAndVoiceIndexes[generatedSimileKey].duration += calculatedActualDurationOfCurrentSingleUnit
      similesInformationByStaveAndVoiceIndexes[generatedSimileKey].numberOfUnits += 1
      similesInformationByStaveAndVoiceIndexes[generatedSimileKey].numberOfSimileStrokes = numberOfSimileStrokesByNumberOfUnitsAndBeats(
        similesInformationByStaveAndVoiceIndexes[generatedSimileKey].numberOfUnits,
        similesInformationByStaveAndVoiceIndexes[generatedSimileKey].numberOfBeats
      )
    }
    const drawnSingleUnit = singleUnit(
      singleUnitParams({
        pageLineNumber,
        numberOfStaveLines: numberOfStaveLines,
        measureIndexOnPageLine,
        measureIndexInGeneral,
        staveIndex,
        voiceIndex,
        crossStaveUnitIndex: crossStaveUnitCount,
        singleUnitIndex: selectedSingleUnitParams.singleUnitIndex,
        containsNotesOnCurrentStave: selectedSingleUnitParams.containsNotesOnCurrentStave,
        containsNotesOnPrevStave: selectedSingleUnitParams.containsNotesOnPrevStave,
        containsNotesOnNextStave: selectedSingleUnitParams.containsNotesOnNextStave,
        containsKeysOnCurrentStave: selectedSingleUnitParams.containsKeysOnCurrentStave,
        containsKeysOnPrevStave: selectedSingleUnitParams.containsKeysOnPrevStave,
        containsKeysOnNextStave: selectedSingleUnitParams.containsKeysOnNextStave,
        notes: selectedSingleUnitParams.notes,
        unitDuration: selectedSingleUnitParams.unitDuration,
        actualDuration: calculatedActualDurationOfCurrentSingleUnit,
        stemDirection: selectedSingleUnitParams.stemDirection,
        numberOfDots: selectedSingleUnitParams.numberOfDots,
        keysParams: selectedSingleUnitParams.keysParams,
        parentheses: selectedSingleUnitParams.parentheses,
        arpeggiated: selectedSingleUnitParams.arpeggiated,
        beamedWithNext: selectedSingleUnitParams.beamedWithNext,
        beamedWithNextWithJustOneBeam: selectedSingleUnitParams.beamedWithNextWithJustOneBeam,
        beamedWithPrevious: beamingStatusesForEachVoiceOnPageLine[generatedBeamKey],
        isRest: selectedSingleUnitParams.isRest,
        isOnlyUnitOnStaveWithoutMidMeasureElementsOrLyricsOrChordLettersOrSimilesOnThatStave: selectedSingleUnitParams.isOnlyUnitOnStaveWithoutMidMeasureElementsOrLyricsOrChordLettersOrSimilesOnThatStave,
        isFullMeasure: selectedSingleUnitParams.isFullMeasure,
        isFullMeasureAndShouldBeCentralizedBecauseOfThat: selectedSingleUnitParams.isFullMeasureAndShouldBeCentralizedBecauseOfThat,
        isSimile: selectedSingleUnitParams.isSimile,
        isGrace: selectedSingleUnitParams.isGrace,
        isGraceUnitAndNextUnitIsNotGrace: selectedSingleUnitParams.isGraceUnitAndNextUnitIsNotGrace,
        hasGraceCrushLine: selectedSingleUnitParams.hasGraceCrushLine,
        simileRefId,
        simileYCorrection: selectedSingleUnitParams.simileYCorrection,
        numberOfSimileStrokes,
        tiedWithNext: selectedSingleUnitParams.tiedWithNext,
        tiedBefore: selectedSingleUnitParams.tiedBefore,
        tiedAfter: selectedSingleUnitParams.tiedAfter,
        tiedBeforeMeasure: selectedSingleUnitParams.tiedBeforeMeasure,
        tiedAfterMeasure: selectedSingleUnitParams.tiedAfterMeasure,
        slurMarks: selectedSingleUnitParams.slurMarks,
        glissandoMarks: selectedSingleUnitParams.glissandoMarks,
        tupletMarks: selectedSingleUnitParams.tupletMarks,
        octaveSignMark: selectedSingleUnitParams.octaveSignMark,
        pedalMark: selectedSingleUnitParams.pedalMark,
        dynamicChangeMark: selectedSingleUnitParams.dynamicChangeMark,
        articulationParams: selectedSingleUnitParams.articulationParams,
        tremoloParams: selectedSingleUnitParams.tremoloParams,
        isOnLastMeasureOfPageLine: isOnLastMeasureOfPageLine,
        isLastSingleUnitInVoiceOnPageLine: selectedSingleUnitParams.isLastSingleUnitInVoiceOnPageLine,
        thereAreNotesInTheSameCrossStaveUnitThatTheirPositionNumberIsMoreThanMaxNotePositionNumberInCurrentSingleUnitOnTheSameStave,
        thereAreNotesInTheSameCrossStaveUnitThatTheirPositionNumberIsLessThanMinNotePositionNumberInCurrentSingleUnitOnTheSameStave
      })
    )(
      styles,
      drawnKeysForCrossStaveUnits[drawnKeysForCrossStaveUnits.length - 1].right,
      calculatedTopOffsetForCurrentStave
    )
    addPropertiesToElement(
      drawnSingleUnit,
      {
        'ref-ids': `all-units,all-units-on-line-${pageLineNumber + 1},unit-${measureIndexInGeneral + 1}-${staveIndex + 1}-${voiceIndex + 1}-${countersForEachVoice[staveIndex][voiceIndex] + 1},voice-${voiceIndex + 1},voice-${staveIndex + 1}-${voiceIndex + 1},voice-${measureIndexInGeneral + 1}-${staveIndex + 1}-${voiceIndex + 1},voice-${pageLineNumber + 1}-${measureIndexOnPageLine + 1}-${staveIndex + 1}-${voiceIndex + 1},voice-in-measure-on-all-staves-${pageLineNumber + 1}-${measureIndexOnPageLine + 1}-${voiceIndex + 1},voice-in-all-measures-and-on-all-staves-on-line-${pageLineNumber + 1}-${voiceIndex + 1}`
      }
    )
    beamingStatusesForEachVoiceOnPageLine[generatedBeamKey] = drawnSingleUnit.beamedWithNext
    if (!drawnSingleUnitsInVoices[staveIndex]) {
      drawnSingleUnitsInVoices[staveIndex] = []
    }
    if (!drawnSingleUnitsInVoices[staveIndex][voiceIndex]) {
      drawnSingleUnitsInVoices[staveIndex][voiceIndex] = []
    }
    drawnSingleUnitsInVoices[staveIndex][voiceIndex].push(drawnSingleUnit)
    drawnSingleUnitsForCurrentCrossStaveUnitByStaves[staveIndex].push(drawnSingleUnit)
    drawnSingleUnitsForCurrentCrossStaveUnit.push(drawnSingleUnit)
    countersForEachVoice[staveIndex][voiceIndex] += 1
  }
  drawnSingleUnitsForCurrentCrossStaveUnit.forEach((singleUnit, singleUnitIndex) => {
    if (singleUnit.arpeggiated && drawnSingleUnitsForCurrentCrossStaveUnit[singleUnitIndex - 1] && drawnSingleUnitsForCurrentCrossStaveUnit[singleUnitIndex - 1].arpeggiated && drawnSingleUnitsForCurrentCrossStaveUnit[singleUnitIndex - 1].arpeggiated.isConnectedWithNextChord) {
      addPropertiesToElement(
        singleUnit,
        {
          'ref-ids': `unit-arpeggiated-below-${drawnSingleUnitsForCurrentCrossStaveUnit[singleUnitIndex - 1].measureIndexInGeneral + 1}-${drawnSingleUnitsForCurrentCrossStaveUnit[singleUnitIndex - 1].staveIndex + 1}-${drawnSingleUnitsForCurrentCrossStaveUnit[singleUnitIndex - 1].voiceIndex + 1}-${drawnSingleUnitsForCurrentCrossStaveUnit[singleUnitIndex - 1].singleUnitIndex + 1}`
        }
      )
    }
  })
  return drawnSingleUnitsForCurrentCrossStaveUnitByStaves
}
