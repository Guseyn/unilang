'use strict'

import updateSingleUnitPartsCoordinatesInVoices from '#repertoire/drawer/elements/voice/updateSingleUnitPartsCoordinatesInVoices.js'
import moveElement from '#repertoire/drawer/elements/basic/moveElement.js'

export default function (voices, drawnSingleUnitsInVoices, xDistanceToMove) {
  moveElement(voices, xDistanceToMove)
  updateSingleUnitPartsCoordinatesInVoices(drawnSingleUnitsInVoices, xDistanceToMove)
}
