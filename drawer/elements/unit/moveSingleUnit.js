'use strict'

const moveElement = require('./../basic/moveElement')
const updateSingleUnitPartsCoordinates = require('./updateSingleUnitPartsCoordinates')

module.exports = (drawnSingleUnit, xDistanceToMove = 0, yDistanceToMove = 0) => {
  moveElement(drawnSingleUnit, xDistanceToMove, yDistanceToMove)
  updateSingleUnitPartsCoordinates(drawnSingleUnit, xDistanceToMove, yDistanceToMove)
}
