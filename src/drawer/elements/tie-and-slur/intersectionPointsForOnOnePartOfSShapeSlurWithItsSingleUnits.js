'use strict'

import intersectionPointForOnePartOfSShapeSlurWithItsSingleUnit from '#msq/drawer/elements/tie-and-slur/intersectionPointForOnePartOfSShapeSlurWithItsSingleUnit.js'

export default function (singleUnits, slurSplinePoints, slurDirection, styles) {
  return singleUnits.map(
    singleUnit => intersectionPointForOnePartOfSShapeSlurWithItsSingleUnit(
      singleUnit,
      slurSplinePoints,
      slurDirection,
      styles
    )
  )
}
