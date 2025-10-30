'use strict'

const dynamicChange = require('./dynamicChange')
const minTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex = require('./minTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex')

const staveVoiceKey = (staveIndex, voiceIndex) => {
  return `${staveIndex}-${voiceIndex}`
}

module.exports = (drawnVoicesOnPageLine, drawnMeasuresOnPageLine, styles) => {
  const drawnDynamicChanges = []
  const dynamicChangesStack = {}
  if (drawnVoicesOnPageLine) {
    for (let measureIndex = 0; measureIndex < drawnVoicesOnPageLine.length; measureIndex++) {
      if (drawnVoicesOnPageLine[measureIndex]) {
        const { drawnSingleUnitsInVoices, topOffsetsForEachStave, numberOfStaveLines, withoutVoices } = drawnVoicesOnPageLine[measureIndex]
        if (!withoutVoices) {
          for (let staveIndex = 0; staveIndex < drawnSingleUnitsInVoices.length; staveIndex++) {
            if (drawnSingleUnitsInVoices[staveIndex]) {
              for (let voiceIndex = 0; voiceIndex < drawnSingleUnitsInVoices[staveIndex].length; voiceIndex++) {
                if (drawnSingleUnitsInVoices[staveIndex][voiceIndex]) {
                  for (let singleUnitIndex = 0; singleUnitIndex < drawnSingleUnitsInVoices[staveIndex][voiceIndex].length; singleUnitIndex++) {
                    const currentSingleUnit = drawnSingleUnitsInVoices[staveIndex][voiceIndex][singleUnitIndex]
                    const currentMeasure = drawnMeasuresOnPageLine[currentSingleUnit.measureIndexOnPageLine]
                    const generatedKeyForDynamicChange = staveVoiceKey(staveIndex, voiceIndex)
                    if (currentSingleUnit.dynamicChangeMark) {
                      if (!dynamicChangesStack[generatedKeyForDynamicChange] && !currentSingleUnit.isLastSingleUnitInVoiceOnPageLine) {
                        const calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex = minTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex(drawnSingleUnitsInVoices, topOffsetsForEachStave, numberOfStaveLines, staveIndex, styles)
                        dynamicChangesStack[generatedKeyForDynamicChange] = {
                          leftSingleUnit: currentSingleUnit,
                          measureIndexes: [ currentMeasure.measureIndexOnPageLine ],
                          chords: [ currentSingleUnit ],
                          key: currentSingleUnit.dynamicChangeMark.key,
                          type: currentSingleUnit.dynamicChangeMark.type,
                          direction: currentSingleUnit.dynamicChangeMark.direction,
                          valueBefore: currentSingleUnit.dynamicChangeMark.valueBefore,
                          valueAfter: currentSingleUnit.dynamicChangeMark.valueAfter,
                          yCorrection: currentSingleUnit.dynamicChangeMark.yCorrection,
                          startYPosition: currentSingleUnit.dynamicChangeMark.direction === 'up'
                            ? calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex.min
                            : calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex.max
                        }
                        if (!currentSingleUnit.dynamicChangeMark.type) {
                          dynamicChangesStack[generatedKeyForDynamicChange].rightSingleUnit = currentSingleUnit
                          drawnDynamicChanges.push(
                            dynamicChange(dynamicChangesStack[generatedKeyForDynamicChange], styles)
                          )
                          delete dynamicChangesStack[generatedKeyForDynamicChange]
                        }
                      } else if (currentSingleUnit.dynamicChangeMark.finish && dynamicChangesStack[generatedKeyForDynamicChange]) {
                        dynamicChangesStack[generatedKeyForDynamicChange].rightSingleUnit = currentSingleUnit
                        dynamicChangesStack[generatedKeyForDynamicChange].chords.push(currentSingleUnit)
                        if (dynamicChangesStack[generatedKeyForDynamicChange].measureIndexes.indexOf(currentSingleUnit.measureIndexOnPageLine) === -1) {
                          dynamicChangesStack[generatedKeyForDynamicChange].measureIndexes.push(currentMeasure.measureIndexOnPageLine)
                        }
                        const calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex = minTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex(drawnSingleUnitsInVoices, topOffsetsForEachStave, numberOfStaveLines, staveIndex, styles)
                        dynamicChangesStack[generatedKeyForDynamicChange].startYPosition = dynamicChangesStack[generatedKeyForDynamicChange].direction === 'up'
                          ? Math.min(dynamicChangesStack[generatedKeyForDynamicChange].startYPosition, calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex.min)
                          : Math.max(dynamicChangesStack[generatedKeyForDynamicChange].startYPosition, calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex.max)
                        drawnDynamicChanges.push(
                          dynamicChange(dynamicChangesStack[generatedKeyForDynamicChange], styles)
                        )
                        delete dynamicChangesStack[generatedKeyForDynamicChange]
                      }
                    } else {
                      if (dynamicChangesStack[generatedKeyForDynamicChange]) {
                        if (currentSingleUnit.isLastSingleUnitInVoiceOnPageLine) {
                          dynamicChangesStack[generatedKeyForDynamicChange].rightSingleUnit = currentSingleUnit
                          dynamicChangesStack[generatedKeyForDynamicChange].chords.push(currentSingleUnit)
                          if (dynamicChangesStack[generatedKeyForDynamicChange].measureIndexes.indexOf(currentSingleUnit.measureIndexOnPageLine) === -1) {
                            dynamicChangesStack[generatedKeyForDynamicChange].measureIndexes.push(currentMeasure.measureIndexOnPageLine)
                          }
                          const calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex = minTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex(drawnSingleUnitsInVoices, topOffsetsForEachStave, numberOfStaveLines, staveIndex, styles)
                          dynamicChangesStack[generatedKeyForDynamicChange].startYPosition = dynamicChangesStack[generatedKeyForDynamicChange].direction === 'up'
                            ? Math.min(dynamicChangesStack[generatedKeyForDynamicChange].startYPosition, calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex.min)
                            : Math.max(dynamicChangesStack[generatedKeyForDynamicChange].startYPosition, calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex.max)
                          drawnDynamicChanges.push(
                            dynamicChange(dynamicChangesStack[generatedKeyForDynamicChange], styles)
                          )
                          delete dynamicChangesStack[generatedKeyForDynamicChange]
                        } else {
                          dynamicChangesStack[generatedKeyForDynamicChange].chords.push(currentSingleUnit)
                          if (dynamicChangesStack[generatedKeyForDynamicChange].measureIndexes.indexOf(currentSingleUnit.measureIndexOnPageLine) === -1) {
                            const calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex = minTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex(drawnSingleUnitsInVoices, topOffsetsForEachStave, numberOfStaveLines, staveIndex, styles)
                            dynamicChangesStack[generatedKeyForDynamicChange].startYPosition = dynamicChangesStack[generatedKeyForDynamicChange].direction === 'up'
                              ? Math.min(dynamicChangesStack[generatedKeyForDynamicChange].startYPosition, calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex.min)
                              : Math.max(dynamicChangesStack[generatedKeyForDynamicChange].startYPosition, calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex.max)
                            dynamicChangesStack[generatedKeyForDynamicChange].measureIndexes.push(currentMeasure.measureIndexOnPageLine)
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    drawnDynamicChanges.forEach(drawnDynamicChange => {
      drawnDynamicChange.chords.forEach(singleUnit => {
        if (!drawnDynamicChange.isEmpty) {
          singleUnit.top = Math.min(singleUnit.top, drawnDynamicChange.top)
          singleUnit.bottom = Math.max(singleUnit.bottom, drawnDynamicChange.bottom)
          drawnMeasuresOnPageLine[singleUnit.measureIndexOnPageLine].top = Math.min(drawnMeasuresOnPageLine[singleUnit.measureIndexOnPageLine].top, drawnDynamicChange.top)
          drawnMeasuresOnPageLine[singleUnit.measureIndexOnPageLine].bottom = Math.max(drawnMeasuresOnPageLine[singleUnit.measureIndexOnPageLine].bottom, drawnDynamicChange.top)
        }
      })
    })
  }
  return drawnDynamicChanges
}
