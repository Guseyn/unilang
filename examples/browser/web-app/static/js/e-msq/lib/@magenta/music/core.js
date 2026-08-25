/**
 * The magenta `core` entry point.
 *
 * Replaces magenta-js `music/src/core.ts` + `music/src/core/index.ts`
 * (Apache-2.0), https://github.com/magenta/magenta-js, so callers keep
 * upstream's shape:
 *
 *   import * as mm from '#e-msq/lib/@magenta/music/core.js'
 *   const ns = await mm.urlToNoteSequence(url)
 *   const player = new mm.SoundFontPlayer(soundFontURL)
 *
 * Only the player path is vendored. Upstream also re-exports `metronome`,
 * `recorder`, `visualizer`, `data`, `melodies`, `performance`, `chords` and
 * `aux_inputs`, which need `@tensorflow/tfjs`, `tonal` or `staffrender` and are
 * not part of this port.
 */

export * as constants from '#e-msq/lib/@magenta/music/core/constants.js'
export * as logging from '#e-msq/lib/@magenta/music/core/logging.js'
export * as sequences from '#e-msq/lib/@magenta/music/core/sequences.js'

export * from '#e-msq/lib/@magenta/music/core/midi_io.js'
export * from '#e-msq/lib/@magenta/music/core/player.js'
export * from '#e-msq/lib/@magenta/music/core/soundfont.js'
export { getAudioContext, midiToFrequency, transport } from '#e-msq/lib/@magenta/music/core/audio.js'
