'use strict'

import measureFermata from '/js/e-msq/msq-worker/drawer/elements/measure/measureFermata.js'
import addPropertiesToElement from '/js/e-msq/msq-worker/drawer/elements/basic/addPropertiesToElement.js'

export default function (drawnMeasuresOnPageLine, styles) {
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
