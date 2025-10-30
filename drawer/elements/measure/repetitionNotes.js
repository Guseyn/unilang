'use strict'

const repetitionNoteText = require('./repetitionNoteText')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

module.exports = (drawnMeasuresOnPageLine, styles) => {
  const drawnRepetitionNotes = []
  drawnMeasuresOnPageLine.forEach((measure) => {
    if (measure.repetitionNote && measure.repetitionNote.value) {
      const drawnRepetitionNote = repetitionNoteText(measure, styles)
      addPropertiesToElement(
        drawnRepetitionNote,
        {
          'ref-ids': `repetition-note-${measure.measureIndexInGeneral + 1}`
        }
      )
      drawnRepetitionNotes.push(drawnRepetitionNote)
    }
  })
  return drawnRepetitionNotes
}
