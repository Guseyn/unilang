'use strict'

module.exports = (numberOfStaveLines, sortedNotesPositionNumbers) => {
  return sortedNotesPositionNumbers.some(notePosition => notePosition <= -1 || notePosition >= numberOfStaveLines)
}
