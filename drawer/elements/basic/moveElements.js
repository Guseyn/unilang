'use strict'

const moveElement = require('./moveElement')

module.exports = (elements, dx = 0, dy = 0) => {
  if (dx !== 0 || dy !== 0) {
    if (elements) {
      elements.forEach(element => {
        if (element) {
          moveElement(element, dx, dy)
        }
      })
    }
  }
}
