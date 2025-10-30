'use strict'

module.exports = (note) => {
  let staveIndex = note.staveIndex
  if (note.stave === 'next') {
    staveIndex += 1
  } else if (note.stave === 'prev') {
    staveIndex -= 1
  }
  return staveIndex
}
