'use strict'

import moveElement from './../basic/moveElement.js'
import updateSingleUnitPartsCoordinates from './updateSingleUnitPartsCoordinates.js'

export default function (drawnSingleUnit, xDistanceToMove = 0, yDistanceToMove = 0) {
  moveElement(drawnSingleUnit, xDistanceToMove, yDistanceToMove)
  updateSingleUnitPartsCoordinates(drawnSingleUnit, xDistanceToMove, yDistanceToMove)
}
