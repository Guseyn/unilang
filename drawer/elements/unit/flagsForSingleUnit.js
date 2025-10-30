'use strict'

const noteTopFlag = require('./../note/noteTopFlag')
const noteBottomFlag = require('./../note/noteBottomFlag')
const calculatedNumberOfFlagsBySingleUnitDuration = require('./calculatedNumberOfFlagsBySingleUnitDuration')

module.exports = (styles, unitDuration, stemWithCoordinates, stemDirection, isGrace) => {
  const { stemWidth, graceElementsScaleFactor } = styles
  const numberOfFlagsByNoteLength = calculatedNumberOfFlagsBySingleUnitDuration(unitDuration)
  let drawnWave
  if (stemDirection === 'up') {
    drawnWave = noteTopFlag(numberOfFlagsByNoteLength)(styles, stemWithCoordinates.right - stemWidth / 2 * (isGrace ? graceElementsScaleFactor : 1), stemWithCoordinates.top)
  } else {
    drawnWave = noteBottomFlag(numberOfFlagsByNoteLength)(styles, stemWithCoordinates.right - stemWidth / 2 * (isGrace ? graceElementsScaleFactor : 1), stemWithCoordinates.bottom)
  }
  return drawnWave
}
