'use strict'

module.exports = (clef, clefAurasForEachStaveSplittedInTimeFrames, time, staveIndex) => {
  if (clef) {
    clefAurasForEachStaveSplittedInTimeFrames[time] = clefAurasForEachStaveSplittedInTimeFrames[time] || {}
    clefAurasForEachStaveSplittedInTimeFrames[time][staveIndex] = clefAurasForEachStaveSplittedInTimeFrames[time][staveIndex] || []
    clefAurasForEachStaveSplittedInTimeFrames[time][staveIndex].push({
      clef,
      isMidMeasureClef: false
    })
  }
}
