'use strict'

import sortedNotesForSingleUnitConsideringStaves from './../unit/sortedNotesForSingleUnitConsideringStaves.js'
import path from './../basic/path.js'
import wave from './../basic/wave.js'
import group from './../basic/group.js'
import scaleElementAroundPoint from './../basic/scaleElementAroundPoint.js'
import elementWithAdditionalInformation from './../basic/elementWithAdditionalInformation.js'
import addPropertiesToElement from './../basic/addPropertiesToElement.js'

export default function (selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit, drawnOnlyNoteLettersBeforeApreggiatedWavesForCrossStaveUnits, styles, leftOffset, topOffsetsForEachStave, numberOfStaveLines, containsDrawnCrossStaveElementsBesideCrossStaveUnits) {
  const { fontColor, intervalBetweenStaveLines, arpeggioWavePeriod, arpeggioWaveWithArrowPeriod, spaceAfterBreathMark, spaceAfterOnlyLettersForArpeggiatedWaves, graceElementsScaleFactor } = styles
  const drawnWaves = []
  let currentWaveParams
  const positionalPaddingForWave = 0.5
  const isGrace = selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit.some(singleUnit => singleUnit.isGrace)
  let spaceBeforeApreggiatedWaves = spaceAfterBreathMark * (isGrace ? graceElementsScaleFactor : 1)
  if (drawnOnlyNoteLettersBeforeApreggiatedWavesForCrossStaveUnits[drawnOnlyNoteLettersBeforeApreggiatedWavesForCrossStaveUnits.length - 1].numberOfKeys !== 0) {
    spaceBeforeApreggiatedWaves = spaceAfterOnlyLettersForArpeggiatedWaves * (isGrace ? graceElementsScaleFactor : 1)
  } else {
    spaceBeforeApreggiatedWaves = 0
  }
  const startXPositionOfWaves = drawnOnlyNoteLettersBeforeApreggiatedWavesForCrossStaveUnits[drawnOnlyNoteLettersBeforeApreggiatedWavesForCrossStaveUnits.length - 1].right + spaceBeforeApreggiatedWaves
  const connectedArpeggiatedSingleUnitsParams = []
  const drawnWavePeriodStandAlone = path(
    arpeggioWavePeriod.points,
    null,
    fontColor,
    0,
    0
  )
  const drawnWaveWithArrowPeriodStandAlone = path(
    arpeggioWaveWithArrowPeriod.points,
    null,
    fontColor,
    0,
    0
  )
  if (isGrace) {
    scaleElementAroundPoint(
      drawnWavePeriodStandAlone,
      graceElementsScaleFactor,
      graceElementsScaleFactor,
      {
        x: drawnWavePeriodStandAlone.left,
        y: (drawnWavePeriodStandAlone.top + drawnWavePeriodStandAlone.bottom) / 2
      }
    )
    scaleElementAroundPoint(
      drawnWaveWithArrowPeriodStandAlone,
      graceElementsScaleFactor,
      graceElementsScaleFactor,
      {
        x: drawnWaveWithArrowPeriodStandAlone.left,
        y: (drawnWaveWithArrowPeriodStandAlone.top + drawnWavePeriodStandAlone.bottom) / 2
      }
    )
  }
  const waveAmplitude = drawnWavePeriodStandAlone.bottom - drawnWavePeriodStandAlone.top
  const waveWithArrowAmplitude = drawnWaveWithArrowPeriodStandAlone.bottom - drawnWaveWithArrowPeriodStandAlone.top
  for (let singleUnitParamIndex = 0; singleUnitParamIndex < selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit.length; singleUnitParamIndex++) {
    const currentSingleUnitParams = selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit[singleUnitParamIndex]
    const currentStaveIndex = currentSingleUnitParams.staveIndex
    if (currentSingleUnitParams.arpeggiated) {
      connectedArpeggiatedSingleUnitsParams.push(currentSingleUnitParams)
      const sortedNotes = sortedNotesForSingleUnitConsideringStaves(currentSingleUnitParams.notes)
      if (!currentWaveParams) {
        let staveIndexForFirstNote = currentStaveIndex
        if (sortedNotes[0].stave === 'next') {
          staveIndexForFirstNote += 1
        } else if (sortedNotes[0].stave === 'prev') {
          staveIndexForFirstNote -= 1
        }
        currentWaveParams = {
          minY: (topOffsetsForEachStave[staveIndexForFirstNote] || topOffsetsForEachStave[currentStaveIndex]) + (sortedNotes[0].positionNumber - positionalPaddingForWave) * intervalBetweenStaveLines
        }
      }
      if (currentSingleUnitParams.arpeggiated.arrow) {
        currentWaveParams.arrow = currentSingleUnitParams.arpeggiated.arrow
      }
      if (!currentSingleUnitParams.arpeggiated.isConnectedWithNextChord || (selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit[singleUnitParamIndex + 1] && !selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit[singleUnitParamIndex + 1].arpeggiated) || (singleUnitParamIndex === selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit.length - 1)) {
        let staveIndexForLastNote = currentStaveIndex
        if (sortedNotes[sortedNotes.length - 1].stave === 'next') {
          staveIndexForLastNote += 1
        } else if (sortedNotes[sortedNotes.length - 1].stave === 'prev') {
          staveIndexForLastNote -= 1
        }
        currentWaveParams.maxY = (topOffsetsForEachStave[staveIndexForLastNote] || topOffsetsForEachStave[currentStaveIndex]) + (sortedNotes[sortedNotes.length - 1].positionNumber + positionalPaddingForWave) * intervalBetweenStaveLines
        const amplitudeOffset = (currentWaveParams.arrow ? waveWithArrowAmplitude / 2 : waveAmplitude / 2)
        const drawnWave = wave(
          { x: startXPositionOfWaves, y: currentWaveParams.arrow === 'up' ? currentWaveParams.maxY : currentWaveParams.minY },
          { x: startXPositionOfWaves, y: currentWaveParams.arrow === 'up' ? currentWaveParams.minY : currentWaveParams.maxY },
          arpeggioWavePeriod,
          fontColor,
          graceElementsScaleFactor,
          isGrace,
          1,
          currentWaveParams.arrow ? arpeggioWaveWithArrowPeriod : null
        )
        drawnWave.left = drawnWave.left - amplitudeOffset
        drawnWave.right = drawnWave.right + amplitudeOffset
        connectedArpeggiatedSingleUnitsParams.forEach(singleUnitParams => {
          addPropertiesToElement(
            drawnWave,
            {
              'ref-ids': `arpeggiated-wave-${singleUnitParams.measureIndexInGeneral + 1}-${singleUnitParams.staveIndex + 1}-${singleUnitParams.voiceIndex + 1}-${singleUnitParams.singleUnitIndex + 1}`
            }
          )
        })
        drawnWaves.push(drawnWave)
        connectedArpeggiatedSingleUnitsParams.length = 0
        currentWaveParams = undefined
      }
    }
  }
  if (drawnWaves.length === 0) {
    return {
      isEmpty: true,
      name: 'g',
      properties: {
        'data-name': 'apreggiatedWavesForCrossStaveUnit'
      },
      transformations: [],
      top: topOffsetsForEachStave[0],
      right: startXPositionOfWaves,
      bottom: topOffsetsForEachStave[topOffsetsForEachStave.length - 1],
      left: startXPositionOfWaves,
      numberOfWaves: 0
    }
  }
  containsDrawnCrossStaveElementsBesideCrossStaveUnits.value = true
  const groupedApregiatedWavesForCrossStaveUnit = group(
    'apreggiatedWavesForCrossStaveUnit',
    [...drawnWaves ]
  )
  return elementWithAdditionalInformation(
    groupedApregiatedWavesForCrossStaveUnit,
    {
      numberOfWaves: drawnWaves.length
    }
  )
}
