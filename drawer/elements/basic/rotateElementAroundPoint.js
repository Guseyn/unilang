'use strict'

module.exports = (element, point, angle, newCoordinates = null) => {
  if (element) {
    element.transformations.push(
      {
        type: 'rotate',
        cx: point.x,
        cy: point.y,
        angle: angle
      }
    )
    if (newCoordinates) {
      element.top = newCoordinates.top
      element.right = newCoordinates.right
      element.bottom = newCoordinates.bottom
      element.left = newCoordinates.left
    }
  }
  return element
}
