'use strict'

import calculatedCoordinatesOfElements from './calculatedCoordinatesOfElements.js'

export default function (dataName, elements = [], wrapWithBox = false) {
  const { top, right, bottom, left } = calculatedCoordinatesOfElements(elements)
  const nonEmptyElements = elements.filter(element => element && !element.isEmpty)
  if (nonEmptyElements.length === 0) {
    return {
      name: 'g',
      properties: {
        'data-name': dataName
      },
      elements,
      transformations: [],
      isEmpty: true,
      top,
      right,
      bottom,
      left
    }
  }
  // const box = `<polyline data-name="${name}" points="${left} ${top} ${right} ${top} ${right} ${bottom} ${left} ${bottom} ${left} ${top}" fill="none" stroke-width="1.0" stroke="red"></polyline>`
  return {
    name: 'g',
    properties: {
      'data-name': dataName
    },
    wrapWithBox,
    elements: nonEmptyElements,
    transformations: [],
    isEmpty: false,
    top,
    right,
    bottom,
    left
  }
}
