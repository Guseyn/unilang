'use strict'

import tempoMark from '#unilang/drawer/elements/measure/tempoMark.js'
import addPropertiesToElement from '#unilang/drawer/elements/basic/addPropertiesToElement.js'

export default function (drawnMeasuresOnPageLine, voicesBodiesOnPageLine, styles) {
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
