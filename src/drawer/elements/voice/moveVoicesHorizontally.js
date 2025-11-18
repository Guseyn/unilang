'use strict'

import updateSingleUnitPartsCoordinatesInVoices from '#unilang/drawer/elements/voice/updateSingleUnitPartsCoordinatesInVoices.js'
import moveElement from '#unilang/drawer/elements/basic/moveElement.js'

export default function (voices, drawnSingleUnitsInVoices, xDistanceToMove) {
  moveElement(voices, xDistanceToMove)
  updateSingleUnitPartsCoordinatesInVoices(drawnSingleUnitsInVoices, xDistanceToMove)
}
