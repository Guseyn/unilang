'use strict'

import moveElement from '/js/e-unilang/unilang-worker/drawer/elements/basic/moveElement.js'
import updateSingleUnitPartsCoordinates from '/js/e-unilang/unilang-worker/drawer/elements/unit/updateSingleUnitPartsCoordinates.js'

export default function (drawnSingleUnit, xDistanceToMove = 0, yDistanceToMove = 0) {
  moveElement(drawnSingleUnit, xDistanceToMove, yDistanceToMove)
  updateSingleUnitPartsCoordinates(drawnSingleUnit, xDistanceToMove, yDistanceToMove)
}
