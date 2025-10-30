'use strict'

const pedalShape = require('./../pedal/pedalShape')
const minTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex = require('./minTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex')

module.exports = (drawnVoicesOnPageLine, drawnMeasuresOnPageLine, styles) => {
  const drawnPedals = []
  const pedalsStack = {}
  const { pedalBracketRightOffsetFinishesBeforeEndOfMeasure, pedalBracketVerticalLineFinishesBeforeOrAfterUnitXOffset } = styles
  if (drawnVoicesOnPageLine) {
    for (let measureIndex = 0; measureIndex < drawnVoicesOnPageLine.length; measureIndex++) {
      if (drawnVoicesOnPageLine[measureIndex]) {
        const { drawnSingleUnitsInAllCrossStaveUnits, drawnSingleUnitsInVoices, topOffsetsForEachStave, numberOfStaveLines, isOnLastMeasureOfPageLine, withoutVoices } = drawnVoicesOnPageLine[measureIndex]
        if (!withoutVoices) {
          for (let crossStaveUnitIndex = 0; crossStaveUnitIndex < drawnSingleUnitsInAllCrossStaveUnits.length; crossStaveUnitIndex++) {
            const currentCrossStaveUnit = drawnSingleUnitsInAllCrossStaveUnits[crossStaveUnitIndex]
            const isLastCrossStaveUnitOnPageLine = (crossStaveUnitIndex === drawnSingleUnitsInAllCrossStaveUnits.length - 1) && isOnLastMeasureOfPageLine
            for (let crossVoiceUnitIndex = 0; crossVoiceUnitIndex < currentCrossStaveUnit.length; crossVoiceUnitIndex++) {
              const currentCrossVoiceUnitInCurrentCrossStaveUnit = currentCrossStaveUnit[crossVoiceUnitIndex]
              let currentCrossVoiceUnitIsLastInCurrentCrossStaveUnit = crossVoiceUnitIndex === currentCrossStaveUnit.length - 1
              if (!currentCrossVoiceUnitIsLastInCurrentCrossStaveUnit) {
                for (let crossVoiceUnitIndexAfter = crossVoiceUnitIndex + 1; crossVoiceUnitIndexAfter < currentCrossStaveUnit.length; crossVoiceUnitIndexAfter++) {
                  if (crossVoiceUnitIndexAfter === currentCrossStaveUnit.length - 1) {
                    if (!currentCrossStaveUnit[crossVoiceUnitIndexAfter]) {
                      currentCrossVoiceUnitIsLastInCurrentCrossStaveUnit = true
                      break
                    }
                    if (currentCrossStaveUnit[crossVoiceUnitIndexAfter].length === 0) {
                      currentCrossVoiceUnitIsLastInCurrentCrossStaveUnit = true
                      break
                    }
                    break
                  }
                  if (!currentCrossStaveUnit[crossVoiceUnitIndexAfter]) {
                    continue
                  }
                  if (currentCrossStaveUnit[crossVoiceUnitIndexAfter].length === 0) {
                    continue
                  }
                  break
                }
              }
              for (let singleUnitIndex = 0; singleUnitIndex < currentCrossVoiceUnitInCurrentCrossStaveUnit.length; singleUnitIndex++) {
                const currentSingleUnit = currentCrossVoiceUnitInCurrentCrossStaveUnit[singleUnitIndex]
                const pedalMark = currentSingleUnit.pedalMark
                for (let key in pedalsStack) {
                  const markedPedal = pedalsStack[key]
                  markedPedal.underStaveIndex = markedPedal.underStaveIndex || 0
                  if (currentSingleUnit.staveIndex === markedPedal.underStaveIndex) {
                    markedPedal.chords.push(currentSingleUnit)
                  }
                  if (pedalMark) {
                    if (pedalMark.textValue) {
                      if (pedalMark.variablePeak) {
                        markedPedal.hasTextValuesOnVariablePeaks = true
                        markedPedal.chordsWithTextValueOnPeak.push(
                          {
                            textValue: pedalMark.textValue,
                            chord: currentSingleUnit,
                            afterUnit: pedalMark.afterUnit,
                            beforeUnit: pedalMark.beforeUnit
                          }
                        )
                        markedPedal.chordsWithStandAloneTextsAndVariablePeaksAndReleasePedals.push(
                          {
                            type: 'variablePeak',
                            textValue: pedalMark.textValue,
                            chord: currentSingleUnit,
                            afterUnit: pedalMark.afterUnit,
                            beforeUnit: pedalMark.beforeUnit
                          }
                        )
                      } else {
                        markedPedal.chordsWithStandAloneTextsAndVariablePeaksAndReleasePedals.push(
                          {
                            type: 'standAloneText',
                            textValue: pedalMark.textValue,
                            chord: currentSingleUnit,
                            afterUnit: pedalMark.afterUnit,
                            beforeUnit: pedalMark.beforeUnit
                          }
                        )
                      }
                    } else if (pedalMark.release) {
                      markedPedal.chordsWithStandAloneTextsAndVariablePeaksAndReleasePedals.push(
                        {
                          type: 'releasePedal',
                          chord: currentSingleUnit,
                          afterUnit: pedalMark.afterUnit,
                          beforeUnit: pedalMark.beforeUnit,
                          atEndOfMeasure: pedalMark.atEndOfMeasure,
                          measure: drawnMeasuresOnPageLine[currentSingleUnit.measureIndexOnPageLine]
                        }
                      )
                    } else if (pedalMark.variablePeak) {
                      markedPedal.chordsWithStandAloneTextsAndVariablePeaksAndReleasePedals.push(
                        {
                          type: 'variablePeak',
                          chord: currentSingleUnit,
                          afterUnit: pedalMark.afterUnit,
                          beforeUnit: pedalMark.beforeUnit
                        }
                      )
                    }
                  }
                  if (markedPedal.measureIndexes.indexOf(measureIndex) === -1) {
                    markedPedal.measureIndexes.push(measureIndex)
                    const calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex = minTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex(drawnSingleUnitsInVoices, topOffsetsForEachStave, numberOfStaveLines, markedPedal.underStaveIndex, styles)
                    markedPedal.y = Math.max(markedPedal.y, calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex.max)
                  }
                }
                if (pedalMark) {
                  if (pedalMark.key && !pedalsStack[pedalMark.key] && pedalMark.start) {
                    pedalMark.underStaveIndex = (pedalMark.underStaveIndex === undefined) ? currentSingleUnit.staveIndex : pedalMark.underStaveIndex
                    const calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex = minTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex(drawnSingleUnitsInVoices, topOffsetsForEachStave, numberOfStaveLines, pedalMark.underStaveIndex, styles)
                    pedalsStack[pedalMark.key] = {
                      key: pedalMark.key,
                      yCorrection: pedalMark.yCorrection,
                      withBrackets: pedalMark.withBrackets,
                      underStaveIndex: pedalMark.underStaveIndex,
                      y: calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex.max,
                      leftSingleUnit: currentSingleUnit,
                      leftPoint: currentSingleUnit.left,
                      chords: [ currentSingleUnit ],
                      measureIndexes: [ currentSingleUnit.measureIndexOnPageLine ],
                      chordsWithStandAloneTextsAndVariablePeaksAndReleasePedals: [],
                      chordsWithTextValueOnPeak: [],
                      hasTextValuesOnVariablePeaks: false,
                      withBracketClosure: pedalMark.withBracketClosure
                    }
                    if (!pedalMark.textValue && !pedalMark.variablePeak && !pedalMark.release) {
                      pedalsStack[pedalMark.key].chordsWithStandAloneTextsAndVariablePeaksAndReleasePedals.push(
                        {
                          type: 'emptyPoint',
                          chord: currentSingleUnit,
                          afterUnit: pedalMark.afterUnit,
                          beforeUnit: pedalMark.beforeUnit
                        }
                      )
                    }
                    if (pedalMark.textValue) {
                      if (pedalMark.variablePeak) {
                        pedalsStack[pedalMark.key].hasTextValuesOnVariablePeaks = true
                        pedalsStack[pedalMark.key].chordsWithStandAloneTextsAndVariablePeaksAndReleasePedals.push(
                          {
                            type: 'variablePeak',
                            textValue: pedalMark.textValue,
                            chord: currentSingleUnit,
                            afterUnit: pedalMark.afterUnit,
                            beforeUnit: pedalMark.beforeUnit
                          }
                        )
                      } else {
                        pedalsStack[pedalMark.key].chordsWithStandAloneTextsAndVariablePeaksAndReleasePedals.push(
                          {
                            type: 'standAloneText',
                            textValue: pedalMark.textValue,
                            chord: currentSingleUnit,
                            afterUnit: pedalMark.afterUnit,
                            beforeUnit: pedalMark.beforeUnit
                          }
                        )
                      }
                    } else if (pedalMark.release) {
                      pedalsStack[pedalMark.key].chordsWithStandAloneTextsAndVariablePeaksAndReleasePedals.push(
                        {
                          type: 'releasePedal',
                          chord: currentSingleUnit,
                          afterUnit: pedalMark.afterUnit,
                          beforeUnit: pedalMark.beforeUnit,
                          atEndOfMeasure: pedalMark.atEndOfMeasure,
                          measure: drawnMeasuresOnPageLine[currentSingleUnit.measureIndexOnPageLine]
                        }
                      )
                    } else if (pedalMark.variablePeak) {
                      pedalsStack[pedalMark.key].chordsWithStandAloneTextsAndVariablePeaksAndReleasePedals.push(
                        {
                          type: 'variablePeak',
                          chord: currentSingleUnit,
                          afterUnit: pedalMark.afterUnit,
                          beforeUnit: pedalMark.beforeUnit
                        }
                      )
                    }
                  }
                  if (pedalMark.key && pedalMark.finish && pedalsStack[pedalMark.key]) {
                    if (pedalMark.withBracketClosure) {
                      pedalsStack[pedalMark.key].withBracketClosure = pedalMark.withBracketClosure
                    }
                    if (pedalMark.tillEndOfMeasure) {
                      pedalsStack[pedalMark.key].rightPoint = drawnMeasuresOnPageLine[currentSingleUnit.measureIndexOnPageLine]
                        ? drawnMeasuresOnPageLine[currentSingleUnit.measureIndexOnPageLine].right - pedalBracketRightOffsetFinishesBeforeEndOfMeasure
                        : currentSingleUnit.right
                    } else if (pedalMark.afterUnit) {
                      pedalsStack[pedalMark.key].rightPoint = currentSingleUnit.right + pedalBracketVerticalLineFinishesBeforeOrAfterUnitXOffset
                    } else if (pedalMark.beforeUnit) {
                      pedalsStack[pedalMark.key].rightPoint = currentSingleUnit.left - pedalBracketVerticalLineFinishesBeforeOrAfterUnitXOffset
                    } else {
                      pedalsStack[pedalMark.key].rightPoint = currentSingleUnit.right
                    }
                    if (pedalMark.start && pedalMark.finish) {
                      pedalsStack[pedalMark.key].withBrackets = false
                    }
                    pedalsStack[pedalMark.key].finish = true
                    const drawnPedalShape = pedalShape(pedalsStack[pedalMark.key], styles)
                    drawnPedals.push(drawnPedalShape)
                    delete pedalsStack[pedalMark.key]
                  }
                }
                if (isLastCrossStaveUnitOnPageLine && currentCrossVoiceUnitIsLastInCurrentCrossStaveUnit && (singleUnitIndex === (currentCrossVoiceUnitInCurrentCrossStaveUnit.length - 1))) {
                  for (let key in pedalsStack) {
                    pedalsStack[key].rightPoint = drawnMeasuresOnPageLine[currentSingleUnit.measureIndexOnPageLine]
                      ? drawnMeasuresOnPageLine[currentSingleUnit.measureIndexOnPageLine].right - pedalBracketRightOffsetFinishesBeforeEndOfMeasure
                      : currentSingleUnit.right
                    const drawnPedalShape = pedalShape(pedalsStack[key], styles)
                    drawnPedals.push(drawnPedalShape)
                    delete pedalsStack[key]
                  }
                }
              }
            }
          }
        }
      }
    }
    drawnPedals.forEach(drawnPedal => {
      drawnPedal.chords.forEach(singleUnit => {
        if (!drawnPedal.isEmpty) {
          singleUnit.top = Math.min(singleUnit.top, drawnPedal.top)
          singleUnit.bottom = Math.max(singleUnit.bottom, drawnPedal.bottom)
          drawnMeasuresOnPageLine[singleUnit.measureIndexOnPageLine].top = Math.min(drawnMeasuresOnPageLine[singleUnit.measureIndexOnPageLine].top, singleUnit.top)
          drawnMeasuresOnPageLine[singleUnit.measureIndexOnPageLine].bottom = Math.max(drawnMeasuresOnPageLine[singleUnit.measureIndexOnPageLine].bottom, singleUnit.bottom)
        }
      })
    })
  }
  return drawnPedals
}
