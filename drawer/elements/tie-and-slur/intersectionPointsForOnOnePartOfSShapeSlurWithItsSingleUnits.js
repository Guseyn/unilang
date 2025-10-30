'use strict'

const intersectionPointForOnePartOfSShapeSlurWithItsSingleUnit = require('./intersectionPointForOnePartOfSShapeSlurWithItsSingleUnit')

module.exports = (singleUnits, slurSplinePoints, slurDirection, styles) => {
  return singleUnits.map(
    singleUnit => intersectionPointForOnePartOfSShapeSlurWithItsSingleUnit(
      singleUnit,
      slurSplinePoints,
      slurDirection,
      styles
    )
  )
}
