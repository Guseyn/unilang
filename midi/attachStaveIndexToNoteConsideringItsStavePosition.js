'use strict'

module.exports = (note, measureParams) => {
  note.staveIndexConsideringStavePosition = note.staveIndex
  if (note.stave === 'prev' && measureParams && measureParams.stavesParams && measureParams.stavesParams[note.staveIndex - 1]) {
    note.staveIndexConsideringStavePosition -= 1
  } else if (note.stave === 'next' && measureParams && measureParams.stavesParams && measureParams.stavesParams[note.staveIndex + 1]) {
    note.staveIndexConsideringStavePosition += 1
  }
}
