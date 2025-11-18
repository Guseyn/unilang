'use strict'

const updateCoordinatesOfElementWithItsChildElementsRecursively = (element, dx = 0, dy = 0) => {
  if (element) {
    element.top = element.top + dy
    element.right = element.right + dx
    element.bottom = element.bottom + dy
    element.left = element.left + dx
    if (element.elements) {
      element.elements.forEach(childElement => {
        updateCoordinatesOfElementWithItsChildElementsRecursively(childElement, dx, dy)
      })
    }
  }
}

export default function (element, dx = 0, dy = 0) {
  if (!element || element.isEmpty) {
    return
  }
  if (isNaN(dx) || isNaN(dy)) {
    throw new Error(`moving on ${dx}, ${dy} is not possible`)
  }
  if (dx !== 0 || dy !== 0) {
    element.transformations.push(
      {
        type: 'translate',
        x: dx,
        y: dy
      }
    )
    updateCoordinatesOfElementWithItsChildElementsRecursively(element, dx, dy)
  }
}
