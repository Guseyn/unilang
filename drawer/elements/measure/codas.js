'use strict'

const coda = require('./coda')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

module.exports = (drawnMeasuresOnPageLine, styles) => {
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
