'use strict'

const articulations = require('./articulations')

module.exports = (drawnVoicesOnPageLine, dontDrawDynamics, drawOnlyDynamics, styles) => {
  return articulations(drawnVoicesOnPageLine, true, false, dontDrawDynamics, drawOnlyDynamics, styles)
}
