'use strict'

export default function (clef, clefAurasForEachStaveSplittedInTimeFrames, unitIsGrace, graceCountersForEachVoiceInEachStaveSplittedInTimeFrames, time, staveIndex, staveVoiceKey) {
  if (clef) {
    clefAurasForEachStaveSplittedInTimeFrames[time] = clefAurasForEachStaveSplittedInTimeFrames[time] || {}
    clefAurasForEachStaveSplittedInTimeFrames[time][staveIndex] = clefAurasForEachStaveSplittedInTimeFrames[time][staveIndex] || []
    clefAurasForEachStaveSplittedInTimeFrames[time][staveIndex].push({
      clef,
      graceCount: unitIsGrace ? graceCountersForEachVoiceInEachStaveSplittedInTimeFrames[time][staveVoiceKey] : undefined,
      isMidMeasureClef: true
    })
  }
}
