'use strict'

import staveIndexOfNoteConsideringItsStave from '#unilang/drawer/elements/voice/staveIndexOfNoteConsideringItsStave.js'

export default function (singleUnit) {
  const wholeToneDelta = 0.5
  const firstSortedNote = singleUnit.sortedNotes[0]
  const secondSortedNote = singleUnit.sortedNotes[1]
  if (!secondSortedNote) {
    return false
  }
  const staveIndexOfFirstSortedNoteConsideringItsStave = staveIndexOfNoteConsideringItsStave(firstSortedNote)
  const staveIndexOfSecondSortedNoteConsideringItsStave = staveIndexOfNoteConsideringItsStave(secondSortedNote)
  return (secondSortedNote.positionNumber - firstSortedNote.positionNumber === wholeToneDelta) &&
    (staveIndexOfFirstSortedNoteConsideringItsStave === staveIndexOfSecondSortedNoteConsideringItsStave)
}
