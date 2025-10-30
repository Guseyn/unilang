'use strict'

const calculatedCoordinatesOfElements = require('./calculatedCoordinatesOfElements')

module.exports = (...elements) => {
  const { top, right, bottom, left } = calculatedCoordinatesOfElements(elements)
  return {
    name: 'svg',
    properties: {
      'xmlns': 'http://www.w3.org/2000/svg',
      'version': '1.1',
      'xmlns:xlink': 'http://www.w3.org/1999/xlink',
      'width': right,
      'height': bottom,
      'viewBox': `0 0 ${right} ${bottom}`,
      'shape-rendering': 'geometricPrecision'
    },
    elements: elements,
    transformations: [],
    top,
    right,
    bottom,
    left
  }
}
