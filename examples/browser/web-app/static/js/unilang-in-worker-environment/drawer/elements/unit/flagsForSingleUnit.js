'use strict'

import noteTopFlag from '/js/unilang-in-worker-environment/drawer/elements/note/noteTopFlag.js'
import noteBottomFlag from '/js/unilang-in-worker-environment/drawer/elements/note/noteBottomFlag.js'
import calculatedNumberOfFlagsBySingleUnitDuration from '/js/unilang-in-worker-environment/drawer/elements/unit/calculatedNumberOfFlagsBySingleUnitDuration.js'

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
