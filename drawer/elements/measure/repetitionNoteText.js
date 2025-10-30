'use strict'

const text = require('./../basic/text')
const moveElement = require('./../basic/moveElement')

module.exports = (measure, styles) => {
  const repetitionNote = measure.repetitionNote
  measure.repetitionNote.measurePosition = measure.repetitionNote.measurePosition || 'start'
  const startXPoint = (measure.repetitionNote.measurePosition === 'start')
    ? (measure.stavesLeft || measure.left)
    : (measure.stavesRight || measure.right)
  const drawnRepetitionNoteText = text(
    repetitionNote.value,
    styles.repetitionNoteFontOptions
  )(styles, startXPoint, measure.top)
  const drawnRepetitionNoteTextWidth = drawnRepetitionNoteText.right - drawnRepetitionNoteText.left
  const drawnRepetitionNoteTextHeight = drawnRepetitionNoteText.bottom - drawnRepetitionNoteText.top
  moveElement(
    drawnRepetitionNoteText,
    (measure.repetitionNote.measurePosition === 'start')
      ? styles.repetitionNoteXOffset
      : -drawnRepetitionNoteTextWidth - styles.repetitionNoteXOffset,
    -(drawnRepetitionNoteTextHeight / 2 + styles.repetitionNoteBottomOffset) + (repetitionNote.yCorrection || 0) * styles.intervalBetweenStaveLines
  )
  measure.top = Math.min(measure.top, drawnRepetitionNoteText.top)
  measure.bottom = Math.max(measure.bottom, drawnRepetitionNoteText.bottom)
  return drawnRepetitionNoteText
}
