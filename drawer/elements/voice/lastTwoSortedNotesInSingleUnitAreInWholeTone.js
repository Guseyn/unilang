'use strict'

const staveIndexOfNoteConsideringItsStave = require('./staveIndexOfNoteConsideringItsStave')

module.exports = (singleUnit) => {
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
