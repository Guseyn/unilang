'use strict'

const updateSingleUnitPartsCoordinatesInVoices = require('./updateSingleUnitPartsCoordinatesInVoices')
const moveElement = require('./../basic/moveElement')

module.exports = (voicesBody, drawnSingleUnitsInVoices, xDistanceToMove, exapandVoicesBodyToTheRight = true) => {
  moveElement(voicesBody, xDistanceToMove)
  if (exapandVoicesBodyToTheRight) {
    voicesBody.right += xDistanceToMove
  }
  updateSingleUnitPartsCoordinatesInVoices(drawnSingleUnitsInVoices, xDistanceToMove)
}
