'use strict'

import intersectionPointOfSlurWithItsSingleUnit from '#unilang/drawer/elements/tie-and-slur/intersectionPointOfSlurWithItsSingleUnit.js'

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
