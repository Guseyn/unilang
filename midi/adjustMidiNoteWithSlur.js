'use strict'

const MIDI_CC_FACTOR = 127

module.exports = (unilangNote, midiNote, trackForNote, slurMarksMappedWithTracks, midiNoteShouldBeAdjustedWithStartSlur, midiNoteShouldBeAdjustedWithFinishSlur) => {
  if (unilangNote.noteIndex !== 0) {
    return
  }
  if (!unilangNote.slurMarks) {
    return
  }
  for (let slurMarkIndex = 0; slurMarkIndex < unilangNote.slurMarks.length; slurMarkIndex++) {
    const slurMark = unilangNote.slurMarks[slurMarkIndex]
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
