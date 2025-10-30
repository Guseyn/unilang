'use strict'

const moveElement = require('./moveElement')

module.exports = (element, xPoint, interval) => {
  moveElement(
    element,
    -(element.right - xPoint) - interval
  )
}
