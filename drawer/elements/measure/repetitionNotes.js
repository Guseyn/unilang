'use strict'

import repetitionNoteText from './repetitionNoteText.js'
import addPropertiesToElement from './../basic/addPropertiesToElement.js'

export default function (drawnMeasuresOnPageLine, styles) {
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
