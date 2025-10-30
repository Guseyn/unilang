'use strict'

module.exports = (keySignatureName, pitchAdjustmentsAuraForAllStavesSplittedInTimeFrames, time, pitchAdjustmentsByKeySignatures) => {
  if (keySignatureName) {
    pitchAdjustmentsAuraForAllStavesSplittedInTimeFrames[time] = pitchAdjustmentsAuraForAllStavesSplittedInTimeFrames[time] || []
    pitchAdjustmentsAuraForAllStavesSplittedInTimeFrames[time].push({
      pitchAdjustments: pitchAdjustmentsByKeySignatures[keySignatureName]
    })
  }
}
