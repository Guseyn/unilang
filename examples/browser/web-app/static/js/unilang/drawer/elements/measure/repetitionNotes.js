'use strict'

import repetitionNoteText from '#unilang/drawer/elements/measure/repetitionNoteText.js'
import addPropertiesToElement from '#unilang/drawer/elements/basic/addPropertiesToElement.js'

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
