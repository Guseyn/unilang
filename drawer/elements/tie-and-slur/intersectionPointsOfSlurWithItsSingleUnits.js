'use strict'

const intersectionPointOfSlurWithItsSingleUnit = require('./intersectionPointOfSlurWithItsSingleUnit')

module.exports = (singleUnits, slurSplinePoints, slurDirection, styles) => {
  return singleUnits.map(
    singleUnit => intersectionPointOfSlurWithItsSingleUnit(
      singleUnit,
      slurSplinePoints,
      slurDirection,
      styles
    )
  )
}
