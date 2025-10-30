'use strict'

module.exports = (pitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames, timeProgressionForAllMeasures, measureParams, measureIndex) => {
  for (let staveIndex = 0; staveIndex < measureParams.stavesParams.length; staveIndex++) {
    const measureStaveIndex = `${measureIndex}-${staveIndex}`
    pitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames[timeProgressionForAllMeasures][measureStaveIndex] = pitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames[timeProgressionForAllMeasures][measureStaveIndex] || []
    pitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames[timeProgressionForAllMeasures][measureStaveIndex].push({
      measureIndex,
      staveIndex,
      pitchAdjustments: []
    })
  }
}
