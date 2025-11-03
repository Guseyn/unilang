'use strict'

import noteTopFlag from './../note/noteTopFlag.js'
import noteBottomFlag from './../note/noteBottomFlag.js'
import calculatedNumberOfFlagsBySingleUnitDuration from './calculatedNumberOfFlagsBySingleUnitDuration.js'

export default function (styles, unitDuration, stemWithCoordinates, stemDirection, isGrace) {
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
