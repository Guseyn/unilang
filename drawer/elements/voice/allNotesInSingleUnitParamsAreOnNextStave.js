'use strict'

module.exports = (singleUnitParams) => {
  return singleUnitParams.notes.every(note => note.stave === 'next')
}
