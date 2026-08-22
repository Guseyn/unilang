'use strict'

import moveElement from '/js/unilang-worker/drawer/elements/basic/moveElement.js'
import updateSingleUnitPartsCoordinates from '/js/unilang-worker/drawer/elements/unit/updateSingleUnitPartsCoordinates.js'

export default function (drawnSingleUnit, xDistanceToMove = 0, yDistanceToMove = 0) {
  moveElement(drawnSingleUnit, xDistanceToMove, yDistanceToMove)
  updateSingleUnitPartsCoordinates(drawnSingleUnit, xDistanceToMove, yDistanceToMove)
}
