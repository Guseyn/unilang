'use strict'

const measureFermata = require('./measureFermata')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

module.exports = (drawnMeasuresOnPageLine, styles) => {
  const drawnMeasureFermatas = []
  drawnMeasuresOnPageLine.forEach((measure) => {
    if (measure.measureContainsFermataOverBarline && measure.drawnFinishBarline) {
      const drawnMeasureFermata = measureFermata(measure.drawnFinishBarline, measure.isLastMeasureOnPageLine, styles)
      addPropertiesToElement(
        drawnMeasureFermata,
        {
          'ref-ids': `measure-fermata-${measure.measureIndexInGeneral + 1}`
        }
      )
      drawnMeasureFermatas.push(drawnMeasureFermata)
    }
  })
  return drawnMeasureFermatas
}
