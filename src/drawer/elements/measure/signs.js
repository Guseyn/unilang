'use strict'

import sign from '#unilang/drawer/elements/measure/sign.js'
import addPropertiesToElement from '#unilang/drawer/elements/basic/addPropertiesToElement.js'

export default function (drawnMeasuresOnPageLine, styles) {
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
