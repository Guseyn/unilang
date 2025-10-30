'use strict'

module.exports = (note, globalCurrentGraceTimeOffset, graceTimeOffestForEachVoiceOnEachStaveSplittedInTimeFrames, graceTimeOffestForEachGraceUnitInVoiceOnEachStaveSplittedInTimeFrames, staveVoiceKey) => {
  let adjustment = globalCurrentGraceTimeOffset
  if (note.isGrace) {
    return adjustment - graceTimeOffestForEachVoiceOnEachStaveSplittedInTimeFrames[note.time][staveVoiceKey] + graceTimeOffestForEachGraceUnitInVoiceOnEachStaveSplittedInTimeFrames[note.time][`${staveVoiceKey}-${note.graceCount}`]
  }
  return adjustment
}
