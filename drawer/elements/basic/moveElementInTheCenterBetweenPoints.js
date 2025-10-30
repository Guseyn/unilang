'use strict'

const moveElement = require('./moveElement')

module.exports = (element, leftPoint, rightPoint) => {
  const elementCenter = (element.right + element.left) / 2
  const centerPointBetweenLeftAndRightPoints = (leftPoint + rightPoint) / 2
  moveElement(
    element,
    centerPointBetweenLeftAndRightPoints - elementCenter
  )
}
