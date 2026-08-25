'use strict'

import updateSingleUnitPartsCoordinatesInVoices from '#msq/drawer/elements/voice/updateSingleUnitPartsCoordinatesInVoices.js'
import moveElement from '#msq/drawer/elements/basic/moveElement.js'

export default function (voicesBody, drawnSingleUnitsInVoices, xDistanceToMove, exapandVoicesBodyToTheRight = true) {
  moveElement(voicesBody, xDistanceToMove)
  if (exapandVoicesBodyToTheRight) {
    voicesBody.right += xDistanceToMove
  }
  updateSingleUnitPartsCoordinatesInVoices(drawnSingleUnitsInVoices, xDistanceToMove)
}
