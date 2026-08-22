'use strict'

import tempoMark from '/js/e-unilang/unilang-worker/drawer/elements/measure/tempoMark.js'
import addPropertiesToElement from '/js/e-unilang/unilang-worker/drawer/elements/basic/addPropertiesToElement.js'

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
