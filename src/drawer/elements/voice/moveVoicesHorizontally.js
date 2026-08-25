'use strict'

import updateSingleUnitPartsCoordinatesInVoices from '#msq/drawer/elements/voice/updateSingleUnitPartsCoordinatesInVoices.js'
import moveElement from '#msq/drawer/elements/basic/moveElement.js'

export default function (voices, drawnSingleUnitsInVoices, xDistanceToMove) {
  moveElement(voices, xDistanceToMove)
  updateSingleUnitPartsCoordinatesInVoices(drawnSingleUnitsInVoices, xDistanceToMove)
}
