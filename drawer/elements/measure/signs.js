'use strict'

const sign = require('./sign')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

module.exports = (drawnMeasuresOnPageLine, styles) => {
  const drawnSigns = []
  drawnMeasuresOnPageLine.forEach(measure => {
    if (measure.sign) {
      const drawnSign = sign(measure, styles)
      drawnSigns.push(
        drawnSign
      )
      addPropertiesToElement(
        drawnSign,
        {
          'ref-ids': `sign-${measure.measureIndexInGeneral + 1}`
        }
      )
    }
  })
  return drawnSigns
}
