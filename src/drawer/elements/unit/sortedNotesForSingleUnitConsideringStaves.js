'use strict'

import correctedStaveIndexOfNoteOrKey from '#unilang/drawer/elements/unit/correctedStaveIndexOfNoteOrKey.js'

const compareTwoNotes = (note1, note2) => {
  const staveIndex1 = correctedStaveIndexOfNoteOrKey(note1)
  const staveIndex2 = correctedStaveIndexOfNoteOrKey(note2)
  if (staveIndex1 < staveIndex2) {
    return -1
  }
  if (staveIndex1 > staveIndex2) {
    return +1
  }
  return note1.positionNumber - note2.positionNumber
}

export default function (notes) {
  return notes.slice(0).sort((note1, note2) => compareTwoNotes(note1, note2))
}
