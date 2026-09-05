'use strict'

import articulations from '/js/msq/worker/drawer/elements/measure/articulations.js'

export default function (drawnVoicesOnPageLine, dontDrawDynamics, drawOnlyDynamics, styles) {
  return articulations(drawnVoicesOnPageLine, true, false, dontDrawDynamics, drawOnlyDynamics, styles)
}
