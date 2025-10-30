'use strict'

const updateSingleUnitPartsCoordinatesInVoices = require('./updateSingleUnitPartsCoordinatesInVoices')
const moveElement = require('./../basic/moveElement')

module.exports = (voices, drawnSingleUnitsInVoices, xDistanceToMove) => {
  moveElement(voices, xDistanceToMove)
  updateSingleUnitPartsCoordinatesInVoices(drawnSingleUnitsInVoices, xDistanceToMove)
}
