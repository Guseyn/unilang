'use strict'

import articulations from './articulations.js'

export default function (drawnVoicesOnPageLine, dontDrawDynamics, drawOnlyDynamics, styles) {
  return articulations(drawnVoicesOnPageLine, false, true, dontDrawDynamics, drawOnlyDynamics, styles)
}
