'use strict'

import coda from './coda.js'
import addPropertiesToElement from './../basic/addPropertiesToElement.js'

export default function (drawnMeasuresOnPageLine, styles) {
  const drawnCodas = []
  drawnMeasuresOnPageLine.forEach(measure => {
    if (measure.coda) {
      const drawnCoda = coda(measure, styles)
      addPropertiesToElement(
        drawnCoda,
        {
          'ref-ids': `coda-${measure.measureIndexInGeneral + 1}`
        }
      )
      drawnCodas.push(drawnCoda)
    }
  })
  return drawnCodas
}
