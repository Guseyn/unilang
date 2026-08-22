'use strict'

const MIDI_CC_FACTOR = 127

export default function (repertoireNote, midiNote, trackForNote, slurMarksMappedWithTracks, midiNoteShouldBeAdjustedWithStartSlur, midiNoteShouldBeAdjustedWithFinishSlur) {
  if (repertoireNote.noteIndex !== 0) {
    return
  }
  if (!repertoireNote.slurMarks) {
    return
  }
  for (let slurMarkIndex = 0; slurMarkIndex < repertoireNote.slurMarks.length; slurMarkIndex++) {
    const slurMark = repertoireNote.slurMarks[slurMarkIndex]
    if (!slurMarksMappedWithTracks[slurMark.key] && midiNoteShouldBeAdjustedWithStartSlur) {
      trackForNote.addCC({
        number: 65,
        value: 127 / MIDI_CC_FACTOR,
        time: midiNote.time
      })
      slurMarksMappedWithTracks[slurMark.key] = trackForNote
      continue
    }
    if (slurMarksMappedWithTracks[slurMark.key] && slurMark.finish && midiNoteShouldBeAdjustedWithFinishSlur) {
      slurMarksMappedWithTracks[slurMark.key].addCC({
        number: 65,
        value: 0 / MIDI_CC_FACTOR,
        time: midiNote.time
      })
      slurMarksMappedWithTracks[slurMark.key] = undefined
      continue
    }
    if (slurMarksMappedWithTracks[slurMark.key] && !slurMark.finish) {
      slurMarksMappedWithTracks[slurMark.key].addCC({
        number: 65,
        value: 0 / MIDI_CC_FACTOR,
        time: midiNote.time
      })
      trackForNote.addCC({
        number: 65,
        value: 127 / MIDI_CC_FACTOR,
        time: midiNote.time
      })
      slurMarksMappedWithTracks[slurMark.key] = trackForNote
      continue
    }
  }
}
