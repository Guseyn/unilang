'use strict'

export default function (parserState, slurMarkKey, lastChordParamsInSlur) {
  if (parserState.slurMarkChords[slurMarkKey]) {
    parserState.slurMarkChords[slurMarkKey].forEach((chordParams, chordParamsIndex) => {
      const slurMarkThatFinishesIndex = chordParams.slurMarks.findIndex(slurMark => {
        return (slurMark.key === slurMarkKey) && slurMark.finish
      })
      if (slurMarkThatFinishesIndex !== -1) {
        chordParams.slurMarks.splice(slurMarkThatFinishesIndex, 1)
      }
    })
  }
  lastChordParamsInSlur.slurMarks.forEach((slurMark, slurMarkIndex) => {
    if (
      (slurMark.key === slurMarkKey) &&
      !slurMark.finish
    ) {
      lastChordParamsInSlur.slurMarks.splice(slurMarkIndex, 1)
    }
  })
}
