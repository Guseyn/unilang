'use strict'

export default function (keySignatureName, pitchAdjustmentsAuraForAllStavesSplittedInTimeFrames, unitIsGrace, graceCountersForEachVoiceInEachStaveSplittedInTimeFrames, time, pitchAdjustmentsByKeySignatures, staveVoiceKey) {
  if (keySignatureName) {
    pitchAdjustmentsAuraForAllStavesSplittedInTimeFrames[time] = pitchAdjustmentsAuraForAllStavesSplittedInTimeFrames[time] || []
    pitchAdjustmentsAuraForAllStavesSplittedInTimeFrames[time].push({
      pitchAdjustments: pitchAdjustmentsByKeySignatures[keySignatureName],
      graceCount: unitIsGrace ? graceCountersForEachVoiceInEachStaveSplittedInTimeFrames[time][staveVoiceKey] : undefined,
      byKeySignatureBefore: true
    })
  }
}
