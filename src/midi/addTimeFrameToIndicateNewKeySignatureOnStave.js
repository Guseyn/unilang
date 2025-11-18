'use strict'

export default function (keySignatureName, pitchAdjustmentsAuraForAllStavesSplittedInTimeFrames, time, pitchAdjustmentsByKeySignatures) {
  if (keySignatureName) {
    pitchAdjustmentsAuraForAllStavesSplittedInTimeFrames[time] = pitchAdjustmentsAuraForAllStavesSplittedInTimeFrames[time] || []
    pitchAdjustmentsAuraForAllStavesSplittedInTimeFrames[time].push({
      pitchAdjustments: pitchAdjustmentsByKeySignatures[keySignatureName]
    })
  }
}
