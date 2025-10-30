'use strict'

const pitchAdjustmentForNoteTimeFrame = require('./pitchAdjustmentForNoteTimeFrame')

const MIDI_PITCHES_MAPPED_WITH_TRILL_BOTTOM_ALTERNATE_PITCH_ADJUSTMENTS = {
  'C': -1,
  'C#': -2,
  'D': -2,
  'D#': -3,
  'E': -2,
  'F': -1,
  'F#': -2,
  'G': -2,
  'G#': -3,
  'A': -2,
  'A#': -3,
  'B': -2
}

const MIDI_PITCHES_MAPPED_WITH_TRILL_BOTTOM_ALTERNATE_PITCH = {
  'C': 'B',
  'C#': 'B',
  'D': 'C',
  'D#': 'C',
  'E': 'D',
  'F': 'E',
  'F#': 'E',
  'G': 'F',
  'G#': 'F',
  'A': 'G',
  'A#': 'G',
  'B': 'A'
}

const NORMALIZED_PITCHES = require('./normalizedPitches')
const PITCH_ADJUSTEMENTS_BY_SIMPLE_KEY_NAME = require('./pitchAdjustmentsBySimpleKeyName')

module.exports = (note, trillOfNote, pitchAdjustmentsAuraForAllStavesSplittedInTimeFrames, orderedTimeFramesFromPitchAdjustmentsAuraForAllStavesSplittedInTimeFrames, pitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames, orderedTimeFramesFromPitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames, graceMaxCountForCurrentTime, graceCountersForEachVoiceInEachStaveSplittedInTimeFrames, staveVoiceKey) => {
  const trillBottomAlternateNote = Object.assign({}, note)  
  trillBottomAlternateNote.noteName = MIDI_PITCHES_MAPPED_WITH_TRILL_BOTTOM_ALTERNATE_PITCH[note.midiPitch].toLowerCase()
  
  const pitchAdjustmentForTrillBottomAlternateNote = MIDI_PITCHES_MAPPED_WITH_TRILL_BOTTOM_ALTERNATE_PITCH_ADJUSTMENTS[note.midiPitch]
  const pitchAdjustmentByTrillKeyBelow = (PITCH_ADJUSTEMENTS_BY_SIMPLE_KEY_NAME[trillOfNote.keyBelow] || 0)
  const pitchAdjustmentForTrillBottomAlternateNoteTimeFrame = pitchAdjustmentForNoteTimeFrame(trillBottomAlternateNote, pitchAdjustmentsAuraForAllStavesSplittedInTimeFrames, orderedTimeFramesFromPitchAdjustmentsAuraForAllStavesSplittedInTimeFrames, pitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames, orderedTimeFramesFromPitchAdjustmentsAuraForEachStaveThatLastOneMeasureSplittedInTimeFrames, graceMaxCountForCurrentTime, graceCountersForEachVoiceInEachStaveSplittedInTimeFrames, staveVoiceKey)
  const allPitchAdjustmentsForTrillBottomAlternateNote = pitchAdjustmentForTrillBottomAlternateNote + pitchAdjustmentByTrillKeyBelow + pitchAdjustmentForTrillBottomAlternateNoteTimeFrame

  const pitchFactorForTrillBottomAlternateNote = (
    NORMALIZED_PITCHES.indexOf(note.midiPitch) +
    allPitchAdjustmentsForTrillBottomAlternateNote
  ) % NORMALIZED_PITCHES.length
  const absolutePitchFactorForTrillBottomAlternateNote = (pitchFactorForTrillBottomAlternateNote >= 0) ? pitchFactorForTrillBottomAlternateNote : (NORMALIZED_PITCHES.length - Math.abs(pitchFactorForTrillBottomAlternateNote))


  trillBottomAlternateNote.midiPitch = NORMALIZED_PITCHES[
    absolutePitchFactorForTrillBottomAlternateNote
  ]

  if (
    (note.midiPitch === 'B') &&
    (allPitchAdjustmentsForTrillBottomAlternateNote > 0)
  ) {
    trillBottomAlternateNote.midiOctave = note.midiOctave + 1
  }
  if (
    (note.midiPitch === 'C') &&
    (allPitchAdjustmentsForTrillBottomAlternateNote < 0)
  ) {
    trillBottomAlternateNote.midiOctave = note.midiOctave - 1
  }
  return trillBottomAlternateNote
}
