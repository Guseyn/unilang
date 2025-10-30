'use strict'

const pitchAdjustmentForNoteTimeFrame = require('./pitchAdjustmentForNoteTimeFrame')

const PITCHES_BY_NOTE_NAMES = {
  'c': 0,
  'd': 2,
  'e': 4,
  'f': 5,
  'g': 7,
  'a': 9,
  'b': 11
}

module.exports = (note, pitchAdjustmentsAuraForAllStavesSplittedInTimeFrames, orderedTimeFramesFromPitchAdjustmentsAuraForAllStavesSplittedInTimeFrames, pitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames, orderedTimeFramesFromPitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames, graceMaxCountForCurrentTime, graceCountersForEachVoiceInEachStaveSplittedInTimeFrames, staveVoiceKey) => {
  if (note.isRest) {
    return 0
  }
  return PITCHES_BY_NOTE_NAMES[note.noteName] + pitchAdjustmentForNoteTimeFrame(note, pitchAdjustmentsAuraForAllStavesSplittedInTimeFrames, orderedTimeFramesFromPitchAdjustmentsAuraForAllStavesSplittedInTimeFrames, pitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames, orderedTimeFramesFromPitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames, graceMaxCountForCurrentTime, graceCountersForEachVoiceInEachStaveSplittedInTimeFrames, staveVoiceKey)
}
