'use strict'

import octaveSignShape from './../octave-sign/octaveSignShape.js'
import minTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex from './minTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex.js'

const keyForOctaveSign = (staveIndex, voiceIndex) => {
  return `${staveIndex}-${voiceIndex}`
}

export default function (drawnVoicesOnPageLine, styles) {
  const drawnOctaveSigns = []
  const octaveSignsStack = {}
  if (drawnVoicesOnPageLine) {
    for (let measureIndex = 0; measureIndex < drawnVoicesOnPageLine.length; measureIndex++) {
      if (drawnVoicesOnPageLine[measureIndex]) {
        const { drawnSingleUnitsInVoices, topOffsetsForEachStave, numberOfStaveLines, withoutVoices } = drawnVoicesOnPageLine[measureIndex]
        if (!withoutVoices) {
          for (let staveIndex = 0; staveIndex < drawnSingleUnitsInVoices.length; staveIndex++) {
            if (drawnSingleUnitsInVoices[staveIndex]) {
              let calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex
              for (let voiceIndex = 0; voiceIndex < drawnSingleUnitsInVoices[staveIndex].length; voiceIndex++) {
                if (drawnSingleUnitsInVoices[staveIndex][voiceIndex]) {
                  for (let singleUnitIndex = 0; singleUnitIndex < drawnSingleUnitsInVoices[staveIndex][voiceIndex].length; singleUnitIndex++) {
                    const currentSingleUnit = drawnSingleUnitsInVoices[staveIndex][voiceIndex][singleUnitIndex]
                    const generatedKeyForOctaveSign = keyForOctaveSign(staveIndex, voiceIndex)
                    if (octaveSignsStack[generatedKeyForOctaveSign]) {
                      octaveSignsStack[generatedKeyForOctaveSign].chords.push(currentSingleUnit)
                      if (!calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex) {
                        calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex = minTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex(drawnSingleUnitsInVoices, topOffsetsForEachStave, numberOfStaveLines, staveIndex, styles)
                        octaveSignsStack[generatedKeyForOctaveSign].y = octaveSignsStack[generatedKeyForOctaveSign].direction === 'up'
                          ? Math.min(octaveSignsStack[generatedKeyForOctaveSign].y, calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex.min)
                          : Math.max(octaveSignsStack[generatedKeyForOctaveSign].y, calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex.max)
                      }
                    }
                    if (currentSingleUnit.octaveSignMark) {
                      if (octaveSignsStack[generatedKeyForOctaveSign]) {
                        octaveSignsStack[generatedKeyForOctaveSign].rightSingleUnit = currentSingleUnit
                        const drawnOctaveSignShape = octaveSignShape(octaveSignsStack[generatedKeyForOctaveSign], styles)
                        drawnOctaveSigns.push(drawnOctaveSignShape)
                        delete octaveSignsStack[generatedKeyForOctaveSign]
                      }
                      const octaveSignMark = currentSingleUnit.octaveSignMark
                      if (!octaveSignsStack[generatedKeyForOctaveSign] && octaveSignMark.octaveNumber && octaveSignMark.octavePostfix) {
                        const direction = octaveSignMark.direction || 'up'
                        if (!calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex) {
                          calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex = minTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex(drawnSingleUnitsInVoices, topOffsetsForEachStave, numberOfStaveLines, staveIndex, styles)
                        }
                        octaveSignsStack[generatedKeyForOctaveSign] = {
                          direction,
                          octaveNumber: octaveSignMark.octaveNumber,
                          octavePostfix: octaveSignMark.octavePostfix,
                          yCorrection: octaveSignMark.yCorrection,
                          y: direction === 'up'
                            ? calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex.min
                            : calculatedMinTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex.max,
                          leftSingleUnit: currentSingleUnit,
                          chords: [ currentSingleUnit ],
                          key: octaveSignMark.key
                        }
                      }
                      if (octaveSignMark.finish && octaveSignsStack[generatedKeyForOctaveSign]) {
                        octaveSignsStack[generatedKeyForOctaveSign].rightSingleUnit = currentSingleUnit
                        const drawnOctaveSignShape = octaveSignShape(octaveSignsStack[generatedKeyForOctaveSign], styles)
                        drawnOctaveSigns.push(drawnOctaveSignShape)
                        delete octaveSignsStack[generatedKeyForOctaveSign]
                      }
                    }
                    if (octaveSignsStack[generatedKeyForOctaveSign] && currentSingleUnit.isLastSingleUnitInVoiceOnPageLine) {
                      octaveSignsStack[generatedKeyForOctaveSign].rightSingleUnit = currentSingleUnit
                      const drawnOctaveSignShape = octaveSignShape(octaveSignsStack[generatedKeyForOctaveSign], styles)
                      drawnOctaveSigns.push(drawnOctaveSignShape)
                      delete octaveSignsStack[generatedKeyForOctaveSign]
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
  return drawnOctaveSigns
}
