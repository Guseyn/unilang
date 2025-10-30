'use strict'

const minTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex = (drawnSingleUnitsInVoices, topOffsetsForEachStave, numberOfStaveLines, staveIndex, styles) => {
  const { intervalBetweenStaveLines } = styles
  const numberOfStaves = topOffsetsForEachStave.length
  if (staveIndex < 0) {
    staveIndex = 0
  }
  if (staveIndex > numberOfStaves - 1) {
    staveIndex = numberOfStaves - 1
  }
  let minTopOfCrossVoiceUnitsOnStave = topOffsetsForEachStave[staveIndex]
  let maxBottomOfCrossVoiceUnitsOnStave = topOffsetsForEachStave[staveIndex] + (numberOfStaveLines - 1) * intervalBetweenStaveLines
  if (drawnSingleUnitsInVoices[staveIndex]) {
    for (let voiceIndex = 0; voiceIndex < drawnSingleUnitsInVoices[staveIndex].length; voiceIndex++) {
      if (drawnSingleUnitsInVoices[staveIndex][voiceIndex]) {
        for (let singleUnitIndex = 0; singleUnitIndex < drawnSingleUnitsInVoices[staveIndex][voiceIndex].length; singleUnitIndex++) {
          const currentSingleUnit = drawnSingleUnitsInVoices[staveIndex][voiceIndex][singleUnitIndex]
          if (minTopOfCrossVoiceUnitsOnStave > currentSingleUnit.top) {
            minTopOfCrossVoiceUnitsOnStave = currentSingleUnit.top
          }
          if (maxBottomOfCrossVoiceUnitsOnStave < currentSingleUnit.bottom) {
            maxBottomOfCrossVoiceUnitsOnStave = currentSingleUnit.bottom
          }
        }
      }
    }
  }
  return {
    min: minTopOfCrossVoiceUnitsOnStave,
    max: maxBottomOfCrossVoiceUnitsOnStave
  }
}

module.exports = minTopAndMaxBottomOfCrossVoiceUnitsOnStaveWithSpecifiedIndex
