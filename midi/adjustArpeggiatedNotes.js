'use strict'

const MIDI_CC_FACTOR = 127

export default function (unilangNote, midiNote, trackForNote, midiNoteShouldBeAdjustedAsStartArpeggiatedNote, midiNoteShouldBeAdjustedAsLastArpeggiatedNote) {
  if (unilangNote.isFirstArpeggiatedNote && midiNoteShouldBeAdjustedAsStartArpeggiatedNote) {
    trackForNote.addCC({
      number: 65,
      value: 127 / MIDI_CC_FACTOR,
      time: midiNote.time
    })
  }
  if (unilangNote.isLastArpeggiatedNote && midiNoteShouldBeAdjustedAsLastArpeggiatedNote) {
    trackForNote.addCC({
      number: 65,
      value: 0 / MIDI_CC_FACTOR,
      time: midiNote.time + midiNote.duration
    })
  }
}
