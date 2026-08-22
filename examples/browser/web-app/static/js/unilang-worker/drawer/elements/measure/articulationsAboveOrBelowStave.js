'use strict'

import articulations from '/js/unilang-worker/drawer/elements/measure/articulations.js'

export default function (drawnVoicesOnPageLine, dontDrawDynamics, drawOnlyDynamics, styles) {
  return articulations(drawnVoicesOnPageLine, false, true, dontDrawDynamics, drawOnlyDynamics, styles)
}
