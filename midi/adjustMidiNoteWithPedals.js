'use strict'

const allConnectedTracks = require('./allConnectedTracks')

const MIDI_CC_FACTOR = 127

module.exports = (unilangNote, midiNote, tracksForEachInstrumentOnEachStaveInEachVoice, midiNoteShouldBeAdjustedWithPedalSustain, midiNoteShouldBeAdjustedWithPedalRelease) => {
  if (unilangNote.noteIndex !== 0) {
    return
  }
  if (!unilangNote.pedalMark) {
    return
  }
  const allConnectedTracksWithNote = allConnectedTracks(unilangNote, tracksForEachInstrumentOnEachStaveInEachVoice)

  for (let trackIndex = 0; trackIndex < allConnectedTracksWithNote.length; trackIndex++) {
    if (
      unilangNote.pedalMark.start &&
      unilangNote.pedalMark.textValue !== 'U.C.' &&
      unilangNote.pedalMark.textValue !== 'T.C.' &&
      midiNoteShouldBeAdjustedWithPedalSustain &&
      !unilangNote.pedalMark.afterChord
    ) {
      allConnectedTracksWithNote[trackIndex].addCC({
        number: 64,
        value: 127 / MIDI_CC_FACTOR,
        time: midiNote.time
      })
    }
    if (
      unilangNote.pedalMark.start &&
      unilangNote.pedalMark.textValue !== 'U.C.' &&
      unilangNote.pedalMark.textValue !== 'T.C.' &&
      midiNoteShouldBeAdjustedWithPedalSustain &&
      unilangNote.pedalMark.afterChord
    ) {
      allConnectedTracksWithNote[trackIndex].addCC({
        number: 64,
        value: 127 / MIDI_CC_FACTOR,
        time: midiNote.time + midiNote.duration
      })
    }
    if (
      (unilangNote.pedalMark.finish || unilangNote.pedalMark.release) &&
      midiNoteShouldBeAdjustedWithPedalRelease &&
      !unilangNote.pedalMark.start &&
      !unilangNote.pedalMark.afterChord &&
      !unilangNote.pedalMark.tillEndOfMeasure &&
      !unilangNote.pedalMark.atTheEndOfTheMeasure
    ) {
      allConnectedTracksWithNote[trackIndex].addCC({
        number: 64,
        value: 0 / MIDI_CC_FACTOR,
        time: midiNote.time
      })
    }
    if (
      (unilangNote.pedalMark.finish || unilangNote.pedalMark.release) &&
      midiNoteShouldBeAdjustedWithPedalRelease &&
      !unilangNote.pedalMark.start &&
      (
        unilangNote.pedalMark.afterChord ||
        unilangNote.pedalMark.tillEndOfMeasure ||
        unilangNote.pedalMark.atTheEndOfTheMeasure
      )
    ) {
      allConnectedTracksWithNote[trackIndex].addCC({
        number: 64,
        value: 0 / MIDI_CC_FACTOR,
        time: midiNote.time + midiNote.duration
      })
    }
    if (
      (unilangNote.pedalMark.variablePeak) &&
      midiNoteShouldBeAdjustedWithPedalSustain &&
      midiNoteShouldBeAdjustedWithPedalRelease &&
      !unilangNote.pedalMark.beforeChord &&
      !unilangNote.pedalMark.afterChord
    ) {
      allConnectedTracksWithNote[trackIndex].addCC({
        number: 64,
        value: 0 / MIDI_CC_FACTOR,
        time: midiNote.time
      })
      allConnectedTracksWithNote[trackIndex].addCC({
        number: 64,
        value: 127 / MIDI_CC_FACTOR,
        time: midiNote.time + midiNote.duration
      })
    }
    if (
      (unilangNote.pedalMark.variablePeak) &&
      midiNoteShouldBeAdjustedWithPedalSustain &&
      midiNoteShouldBeAdjustedWithPedalRelease &&
      unilangNote.pedalMark.afterChord
    ) {
      allConnectedTracksWithNote[trackIndex].addCC({
        number: 64,
        value: 0 / MIDI_CC_FACTOR,
        time: midiNote.time + midiNote.duration
      })
      allConnectedTracksWithNote[trackIndex].addCC({
        number: 64,
        value: 127 / MIDI_CC_FACTOR,
        time: midiNote.time + midiNote.duration + midiNote.duration / 2
      })
    }
    if (
      (unilangNote.pedalMark.variablePeak) &&
      midiNoteShouldBeAdjustedWithPedalSustain &&
      midiNoteShouldBeAdjustedWithPedalRelease &&
      unilangNote.pedalMark.beforeChord
    ) {
      allConnectedTracksWithNote[trackIndex].addCC({
        number: 64,
        value: 0 / MIDI_CC_FACTOR,
        time: midiNote.time - midiNote.duration / 2
      })
      allConnectedTracksWithNote[trackIndex].addCC({
        number: 64,
        value: 127 / MIDI_CC_FACTOR,
        time: midiNote.time
      })
    }
    if (
      (unilangNote.pedalMark.textValue === 'U.C.') &&
      midiNoteShouldBeAdjustedWithPedalSustain &&
      !unilangNote.pedalMark.beforeChord &&
      !unilangNote.pedalMark.afterChord
    ) {
      allConnectedTracksWithNote[trackIndex].addCC({
        number: 67,
        value: 127 / MIDI_CC_FACTOR,
        time: midiNote.time
      })
    }
    if (
      (unilangNote.pedalMark.textValue === 'U.C.') &&
      midiNoteShouldBeAdjustedWithPedalSustain &&
      unilangNote.pedalMark.afterChord
    ) {
      allConnectedTracksWithNote[trackIndex].addCC({
        number: 67,
        value: 127 / MIDI_CC_FACTOR,
        time: midiNote.time + midiNote.duration
      })
    }
    if (
      (unilangNote.pedalMark.textValue === 'U.C.') &&
      midiNoteShouldBeAdjustedWithPedalSustain &&
      unilangNote.pedalMark.beforeChord
    ) {
      allConnectedTracksWithNote[trackIndex].addCC({
        number: 67,
        value: 127 / MIDI_CC_FACTOR,
        time: midiNote.time - midiNote.duration / 2
      })
    }
    if (
      (unilangNote.pedalMark.textValue === 'T.C.') &&
      midiNoteShouldBeAdjustedWithPedalRelease &&
      !unilangNote.pedalMark.beforeChord &&
      !unilangNote.pedalMark.afterChord
    ) {
      allConnectedTracksWithNote[trackIndex].addCC({
        number: 67,
        value: 0 / MIDI_CC_FACTOR,
        time: midiNote.time
      })
    }
    if (
      (unilangNote.pedalMark.textValue === 'T.C.') &&
      midiNoteShouldBeAdjustedWithPedalRelease &&
      unilangNote.pedalMark.afterChord
    ) {
      allConnectedTracksWithNote[trackIndex].addCC({
        number: 67,
        value: 0 / MIDI_CC_FACTOR,
        time: midiNote.time + midiNote.duration
      })
    }
    if (
      (unilangNote.pedalMark.textValue === 'T.C.') &&
      midiNoteShouldBeAdjustedWithPedalRelease &&
      unilangNote.pedalMark.beforeChord
    ) {
      allConnectedTracksWithNote[trackIndex].addCC({
        number: 67,
        value: 0 / MIDI_CC_FACTOR,
        time: midiNote.time - midiNote.duration / 2
      })
    }
  }
}
