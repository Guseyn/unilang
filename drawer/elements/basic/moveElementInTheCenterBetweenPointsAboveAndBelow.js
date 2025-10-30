'use strict'

const moveElement = require('./moveElement')

module.exports = (element, topPoint, bottomPoint) => {
  const elementCenter = (element.bottom + element.top) / 2
  const centerPointBetweenTopAndBottomPoints = (topPoint + bottomPoint) / 2
  moveElement(
    element,
    0,
    centerPointBetweenTopAndBottomPoints - elementCenter
  )
}
