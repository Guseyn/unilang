'use strict'

const line = require('./../basic/line')

module.exports = (styles, stem, beamLineHeightNormal, allBeamsHeightNormalWhereAllStemsWithSameDirection) => {
  const { noteStemStrokeOptions, noteBeamColumnStrokeOptions, graceElementsScaleFactor } = styles
  const tunedNoteStemStrokeOptions = Object.assign({}, noteStemStrokeOptions)
  const tunedNoteBeamColumnStrokeOptions = Object.assign({}, noteBeamColumnStrokeOptions)
  if (stem.isGrace) {
    tunedNoteBeamColumnStrokeOptions.width *= graceElementsScaleFactor
    tunedNoteStemStrokeOptions.width *= graceElementsScaleFactor
  }
  const stemWidth = noteStemStrokeOptions.width
  const stemStart = stem.direction === 'up' ? stem.top : stem.bottom
  const stemEnd = stem.isRest
    ? stemStart
    : stem.direction === 'up'
      ? stemStart - allBeamsHeightNormalWhereAllStemsWithSameDirection + beamLineHeightNormal - stemWidth
      : stemStart + allBeamsHeightNormalWhereAllStemsWithSameDirection - beamLineHeightNormal + stemWidth
  return line(
    stem.left, stemStart,
    stem.left, stemEnd,
    tunedNoteBeamColumnStrokeOptions,
    0,
    0,
    'beamColumn'
  )
}
