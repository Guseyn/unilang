'use strict'

const staveIndexOfNoteConsideringItsStave = require('./staveIndexOfNoteConsideringItsStave')

module.exports = (singleUnit) => {
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
