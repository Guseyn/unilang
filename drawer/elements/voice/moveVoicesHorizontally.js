'use strict'

import updateSingleUnitPartsCoordinatesInVoices from './updateSingleUnitPartsCoordinatesInVoices.js'
import moveElement from './../basic/moveElement.js'

export default function (voices, drawnSingleUnitsInVoices, xDistanceToMove) {
  moveElement(voices, xDistanceToMove)
  updateSingleUnitPartsCoordinatesInVoices(drawnSingleUnitsInVoices, xDistanceToMove)
}
