'use strict'

import updateSingleUnitPartsCoordinatesInVoices from '/js/msq/msq-worker/drawer/elements/voice/updateSingleUnitPartsCoordinatesInVoices.js'
import moveElement from '/js/msq/msq-worker/drawer/elements/basic/moveElement.js'

export default function (voices, drawnSingleUnitsInVoices, xDistanceToMove) {
  moveElement(voices, xDistanceToMove)
  updateSingleUnitPartsCoordinatesInVoices(drawnSingleUnitsInVoices, xDistanceToMove)
}
