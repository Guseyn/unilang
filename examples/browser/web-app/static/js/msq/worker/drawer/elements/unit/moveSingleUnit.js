'use strict'

import moveElement from '/js/msq/worker/drawer/elements/basic/moveElement.js'
import updateSingleUnitPartsCoordinates from '/js/msq/worker/drawer/elements/unit/updateSingleUnitPartsCoordinates.js'

export default function (drawnSingleUnit, xDistanceToMove = 0, yDistanceToMove = 0) {
  moveElement(drawnSingleUnit, xDistanceToMove, yDistanceToMove)
  updateSingleUnitPartsCoordinates(drawnSingleUnit, xDistanceToMove, yDistanceToMove)
}
