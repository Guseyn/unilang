'use strict'

export default function (note) {
  const tremoloParams = note.tremoloParams
  let numberOfStrokes = 0
  if (tremoloParams) {
    numberOfStrokes = tremoloParams.customNumberOfTremoloStrokes || 3
  }
  if (tremoloParams && note.visualDuration === 1 / 16 && numberOfStrokes > 1) {
    numberOfStrokes = 1
  }
  if (tremoloParams && note.visualDuration === 1 / 8 && numberOfStrokes > 2) {
    numberOfStrokes = 2
  }
  if (tremoloParams && note.visualDuration <= 1 / 32) {
    numberOfStrokes = 0
  }
  let tremoloFactor = 1 / 32
  if (tremoloParams && note.visualDuration > 1 / 8 && numberOfStrokes === 1) {
    tremoloFactor = 1 / 8
  }
  if (tremoloParams && note.visualDuration >= 1 / 8 && numberOfStrokes === 2) {
    tremoloFactor = 1 / 16
  }
  if (tremoloParams && numberOfStrokes > 0) {
    note.numberOfTremoloNotes = Math.floor(note.actualDuration / tremoloFactor)
    note.durationOfEachTremoloNoteInSeconds = note.durationInSeconds / note.numberOfTremoloNotes
  }
}
