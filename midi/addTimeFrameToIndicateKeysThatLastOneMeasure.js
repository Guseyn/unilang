'use strict'

module.exports = (keysParams, pitchesByNoteNames, pitchAdjustmentsByKeyType, pitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames, unitIsGrace, graceCountersForEachVoiceInEachStaveSplittedInTimeFrames, time, measureIndex, staveIndex, staveVoiceKey) => {
  if (keysParams) {
    const keysParamsOnCurrentStave = keysParams.filter(keyParams => !keyParams.stave || keyParams.stave === 'current')
    const keysParamsOnPreviousStave = keysParams.filter(keyParams => keyParams.stave === 'prev')
    const keysParamsOnNextStave = keysParams.filter(keyParams => keyParams.stave === 'next')
    const pitchAdjustmentsThatLastOnlyThisMeasureOnCurrentStave = keysParamsOnCurrentStave.map(keyParams => {
      return {
        pitch: pitchesByNoteNames[keyParams.noteName],
        octaveNumber: keyParams.octaveNumber,
        midiPitchAdjustment: pitchAdjustmentsByKeyType[keyParams.keyType]
      }
    })
    const pitchAdjustmentsThatLastOnlyThisMeasureOnPreviousStave = keysParamsOnPreviousStave.map(keyParams => {
      return {
        pitch: pitchesByNoteNames[keyParams.noteName],
        octaveNumber: keyParams.octaveNumber,
        midiPitchAdjustment: pitchAdjustmentsByKeyType[keyParams.keyType]
      }
    })
    const pitchAdjustmentsThatLastOnlyThisMeasureOnNextStave = keysParamsOnNextStave.map(keyParams => {
      return {
        pitch: pitchesByNoteNames[keyParams.noteName],
        octaveNumber: keyParams.octaveNumber,
        midiPitchAdjustment: pitchAdjustmentsByKeyType[keyParams.keyType]
      }
    })
    pitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames[time] = pitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames[time] || {}
    if (pitchAdjustmentsThatLastOnlyThisMeasureOnCurrentStave.length > 0) {
      const measureStaveIndex = `${measureIndex}-${staveIndex}`
      pitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames[time][measureStaveIndex] = pitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames[time][measureStaveIndex] || []
      pitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames[time][measureStaveIndex].push({
        pitchAdjustments: pitchAdjustmentsThatLastOnlyThisMeasureOnCurrentStave,
        graceCount: unitIsGrace ? graceCountersForEachVoiceInEachStaveSplittedInTimeFrames[time][staveVoiceKey] : undefined
      })
    }
    if (pitchAdjustmentsThatLastOnlyThisMeasureOnPreviousStave.length > 0) {
      const measureStaveIndex = `${measureIndex}-${staveIndex - 1}`
      pitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames[time][measureStaveIndex] = pitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames[time][measureStaveIndex] || []
      pitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames[time][measureStaveIndex].push({
        pitchAdjustments: pitchAdjustmentsThatLastOnlyThisMeasureOnPreviousStave,
        graceCount: unitIsGrace ? graceCountersForEachVoiceInEachStaveSplittedInTimeFrames[time][staveVoiceKey] : undefined
      })
    }
    if (pitchAdjustmentsThatLastOnlyThisMeasureOnNextStave.length > 0) {
      const measureStaveIndex = `${measureIndex}-${staveIndex + 1}`
      pitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames[time][measureStaveIndex] = pitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames[time][`${measureIndex}-${staveIndex + 1}`] || []
      pitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames[time][measureStaveIndex].push({
        pitchAdjustments: pitchAdjustmentsThatLastOnlyThisMeasureOnNextStave,
        graceCount: unitIsGrace ? graceCountersForEachVoiceInEachStaveSplittedInTimeFrames[time][staveVoiceKey] : undefined
      })
    }
  }
}
