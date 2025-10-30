'use strict'

const moveElement = require('./moveElement')

module.exports = (element, yPoint, interval) => {
  moveElement(
    element,
    0,
    -(element.bottom - yPoint) - interval
  )
}
