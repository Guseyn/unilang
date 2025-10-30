'use strict'

module.exports = (drawnSingleUnit, direction = 'up') => {
  const drawnSingleUnitContainsWholeTonesCloseToArticulation = drawnSingleUnit.anyWholeTones && !drawnSingleUnit.isRest && (((direction === 'up' && drawnSingleUnit.stemDirection === 'down') || (direction === 'up' && drawnSingleUnit.stemless)) ? (drawnSingleUnit.sortedNotesPositionNumbers[1] - drawnSingleUnit.sortedNotesPositionNumbers[0] === 0.5) : (((direction === 'down' && drawnSingleUnit.stemDirection === 'up') || (direction === 'down' && drawnSingleUnit.stemless)) ? (drawnSingleUnit.sortedNotesPositionNumbers[drawnSingleUnit.sortedNotesPositionNumbers.length - 1] - drawnSingleUnit.sortedNotesPositionNumbers[drawnSingleUnit.sortedNotesPositionNumbers.length - 2] === 0.5) : false))
  const shouldBeAboveOrUnderStemLine = (drawnSingleUnit.stemDirection === direction && !drawnSingleUnit.isRest && drawnSingleUnit.unitDuration !== 1 && drawnSingleUnit.unitDuration !== 2) || drawnSingleUnitContainsWholeTonesCloseToArticulation
  return shouldBeAboveOrUnderStemLine
}
