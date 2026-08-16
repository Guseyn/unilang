'use strict'

import articulations from '#unilang/drawer/elements/measure/articulations.js'

export default function (drawnVoicesOnPageLine, dontDrawDynamics, drawOnlyDynamics, styles) {
  return articulations(drawnVoicesOnPageLine, true, false, dontDrawDynamics, drawOnlyDynamics, styles)
}
