'use strict'

import volta from '#unilang/drawer/elements/measure/volta.js'
import addPropertiesToElement from '#unilang/drawer/elements/basic/addPropertiesToElement.js'

export default function (drawnMeasuresOnPageLine, voicesBodiesOnPageLine, styles) {
  const { yOffsetOfVolta } = styles
  let currentVoltaStructure
  const drawnVoltas = []
  for (let measureIndexOnPageLine = 0; measureIndexOnPageLine < drawnMeasuresOnPageLine.length; measureIndexOnPageLine++) {
    const isLastMeasureOnPageLine = measureIndexOnPageLine === drawnMeasuresOnPageLine.length - 1
    const currentMeasure = drawnMeasuresOnPageLine[measureIndexOnPageLine]
    const currentVoicesBody = voicesBodiesOnPageLine[measureIndexOnPageLine]
    if (currentMeasure.voltaMark) {
      if (!currentVoltaStructure && (currentMeasure.voltaMark.startsHere || currentMeasure.voltaMark.startsBefore)) {
        currentVoltaStructure = {
          left: (!currentVoicesBody || currentVoicesBody.isEmpty) ? currentMeasure.left : currentVoicesBody.left,
          top: currentMeasure.top - yOffsetOfVolta,
          value: currentMeasure.voltaMark.value,
          key: currentMeasure.voltaMark.key,
          withLeftColumn: currentMeasure.voltaMark.startsHere,
          yCorrection: currentMeasure.voltaMark.yCorrection,
          measures: [ ]
        }
      }
    }
    if (currentVoltaStructure) {
      currentVoltaStructure.top = Math.min(currentVoltaStructure.top, currentMeasure.top - yOffsetOfVolta)
      currentVoltaStructure.measures.push(currentMeasure)
      if (currentMeasure.voltaMark) {
        if (currentMeasure.voltaMark.finishesHere || currentMeasure.voltaMark.finishesAfter || isLastMeasureOnPageLine) {
          currentVoltaStructure.right = (!currentVoicesBody || currentVoicesBody.isEmpty) ? currentMeasure.right : currentVoicesBody.right
          currentVoltaStructure.withRightColumn = currentMeasure.voltaMark.finishesHere
          const drawnVolta = volta(currentVoltaStructure, styles)
          addPropertiesToElement(
            drawnVolta,
            {
              'ref-ids': currentVoltaStructure.key
            }
          )
          drawnVoltas.push(drawnVolta)
          currentVoltaStructure.measures.forEach(measure => {
            measure.top = Math.min(measure.top, drawnVolta.top)
            measure.bottom = Math.max(measure.bottom, drawnVolta.bottom)
          })
          currentVoltaStructure = undefined
        }
      }
    }
  }
  return drawnVoltas
}
