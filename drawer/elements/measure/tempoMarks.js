'use strict'

const tempoMark = require('./tempoMark')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

module.exports = (drawnMeasuresOnPageLine, voicesBodiesOnPageLine, styles) => {
  const drawnTempoMarks = []
  drawnMeasuresOnPageLine.forEach((measure) => {
    if (measure.tempoMark) {
      const drawnTempoMark = tempoMark(measure, measure.measureIndexInGeneral, voicesBodiesOnPageLine[measure.measureIndexOnPageLine], styles)
      addPropertiesToElement(
        drawnTempoMark,
        {
          'ref-ids': `tempo-mark-${measure.measureIndexInGeneral + 1}`
        }
      )
      drawnTempoMarks.push(drawnTempoMark)
    }
  })
  return drawnTempoMarks
}
