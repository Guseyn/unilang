'use strict'

import moveElement from '/js/e-repertoire/repertoire-worker/drawer/elements/basic/moveElement.js'
import updateSingleUnitPartsCoordinates from '/js/e-repertoire/repertoire-worker/drawer/elements/unit/updateSingleUnitPartsCoordinates.js'

export default function (drawnSingleUnit, xDistanceToMove = 0, yDistanceToMove = 0) {
  moveElement(drawnSingleUnit, xDistanceToMove, yDistanceToMove)
  updateSingleUnitPartsCoordinates(drawnSingleUnit, xDistanceToMove, yDistanceToMove)
}
