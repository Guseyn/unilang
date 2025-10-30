'use strict'

const line = require('./../basic/line')

module.exports = (styles, stem) => {
  const { noteBeamColumnStrokeOptions, graceElementsScaleFactor } = styles
  const tunedNoteBeamColumnStrokeOptions = Object.assign({}, noteBeamColumnStrokeOptions)
  if (stem.isGrace) {
    tunedNoteBeamColumnStrokeOptions.width *= graceElementsScaleFactor
  }
  const stemStart = stem.direction === 'up' ? stem.top : stem.bottom
  const stemEnd = stem.direction === 'up'
    ? stem.topCorrectedByBeamLines
    : stem.bottomCorrectedByBeamLines
  return line(
    stem.left, stemStart,
    stem.left, stemEnd,
    noteBeamColumnStrokeOptions,
    0,
    0,
    'beamColumnWithDifferentDirection'
  )
}
