'use strict'

module.exports = (sortedNotes) => {
  const deltaInPositionForWholeTone = 0.5
  return sortedNotes.some((note, index) => {
    if (sortedNotes[index + 1]) {
      return sortedNotes[index + 1].positionNumber - note.positionNumber === deltaInPositionForWholeTone &&
        sortedNotes[index + 1].stave === sortedNotes[index].stave
    }
    return false
  })
}
