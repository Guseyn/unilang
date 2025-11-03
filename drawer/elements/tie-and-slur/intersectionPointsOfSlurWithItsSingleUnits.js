'use strict'

import intersectionPointOfSlurWithItsSingleUnit from './intersectionPointOfSlurWithItsSingleUnit.js'

export default function (singleUnits, slurSplinePoints, slurDirection, styles) {
  return singleUnits.map(
    singleUnit => intersectionPointOfSlurWithItsSingleUnit(
      singleUnit,
      slurSplinePoints,
      slurDirection,
      styles
    )
  )
}
