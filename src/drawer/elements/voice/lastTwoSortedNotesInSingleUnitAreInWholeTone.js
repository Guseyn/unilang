'use strict'

import staveIndexOfNoteConsideringItsStave from '#unilang/drawer/elements/voice/staveIndexOfNoteConsideringItsStave.js'

export default function (singleUnit) {
  const wholeToneDelta = 0.5
  const lastSortedNote = singleUnit.sortedNotes[singleUnit.sortedNotes.length - 1]
  const noteBeforeLastSortedNote = singleUnit.sortedNotes[singleUnit.sortedNotes.length - 2]
  if (!noteBeforeLastSortedNote) {
    return false
  }
  const staveIndexOfLastSortedNoteConsideringItsStave = staveIndexOfNoteConsideringItsStave(lastSortedNote)
  const staveIndexOfNoteBeforeLastSortedNoteConsideringItsStave = staveIndexOfNoteConsideringItsStave(noteBeforeLastSortedNote)
  return (lastSortedNote.positionNumber - noteBeforeLastSortedNote.positionNumber === wholeToneDelta) &&
    (staveIndexOfLastSortedNoteConsideringItsStave === staveIndexOfNoteBeforeLastSortedNoteConsideringItsStave)
}
