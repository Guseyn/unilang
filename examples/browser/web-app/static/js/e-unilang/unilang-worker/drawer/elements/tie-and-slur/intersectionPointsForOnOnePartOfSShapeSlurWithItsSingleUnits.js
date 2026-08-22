'use strict'

import intersectionPointForOnePartOfSShapeSlurWithItsSingleUnit from '/js/e-unilang/unilang-worker/drawer/elements/tie-and-slur/intersectionPointForOnePartOfSShapeSlurWithItsSingleUnit.js'

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
