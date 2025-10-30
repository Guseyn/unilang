'use strict'

const slurJunctionPointForSingleUnit = require('./slurJunctionPointForSingleUnit')
const timeInSlurSplinePointsBySomeXPointThere = require('./timeInSlurSplinePointsBySomeXPointThere')

module.exports = (singleUnit, slurSplinePoints, slurDirection, styles) => {
  const slurStartX = slurSplinePoints[1]
  const slurEndX = slurSplinePoints[22]
  const p0 = { x: slurSplinePoints[1], y: slurSplinePoints[2] }
  const p1 = { x: slurSplinePoints[11], y: slurSplinePoints[12] }
  const p2 = { x: slurSplinePoints[13], y: slurSplinePoints[14] }
  const p3 = { x: slurSplinePoints[15], y: slurSplinePoints[16] }

  const sx = slurJunctionPointForSingleUnit(singleUnit, slurDirection, 'middle', null, styles).x
  let t = timeInSlurSplinePointsBySomeXPointThere(sx, slurStartX, slurEndX)
  return {
    singleUnit,
    x: sx,
    y: Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y
  }
}
