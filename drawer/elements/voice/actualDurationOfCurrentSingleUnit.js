'use strict'

const actualDurationConsideringDotsAndTremolos = require('./actualDurationConsideringDotsAndTremolos')
const actualDurationConsideringDotsAndTupletsAndTremolos = require('./actualDurationConsideringDotsAndTupletsAndTremolos')

module.exports = (selectedSingleUnitParams, affectingTupletValuesByStaveAndVoiceIndexes, similesInformationByStaveAndVoiceIndexes, generatedSimileKey, staveIndex, voiceIndex) => {
  if (selectedSingleUnitParams.isGrace) {
    if (selectedSingleUnitParams.simileCountDown === 1) {
      delete similesInformationByStaveAndVoiceIndexes[generatedSimileKey]
    }
    return 0
  }
  if (selectedSingleUnitParams.isSimile) {
    const duration = similesInformationByStaveAndVoiceIndexes[generatedSimileKey].duration
    if (selectedSingleUnitParams.simileCountDown === 1) {
      delete similesInformationByStaveAndVoiceIndexes[generatedSimileKey]
    }
    return duration
  }
  if (affectingTupletValuesByStaveAndVoiceIndexes && affectingTupletValuesByStaveAndVoiceIndexes[staveIndex] && affectingTupletValuesByStaveAndVoiceIndexes[staveIndex][voiceIndex]) {
    const durationConsideringDotsAndTupletsAndTremolos = actualDurationConsideringDotsAndTupletsAndTremolos(
      selectedSingleUnitParams.unitDuration,
      selectedSingleUnitParams.numberOfDots || 0,
      affectingTupletValuesByStaveAndVoiceIndexes[staveIndex][voiceIndex],
      selectedSingleUnitParams.tremoloParams
        ? selectedSingleUnitParams.tremoloParams.tremoloDurationFactor
        : 1
    )
    if (isNaN(durationConsideringDotsAndTupletsAndTremolos)) {
      throw new Error(`durationConsideringDotsAndTupletsAndTremolos is ${durationConsideringDotsAndTupletsAndTremolos}`)
    }
    const tupletMarksInCurrentSingleUnit = selectedSingleUnitParams.tupletMarks
    if (tupletMarksInCurrentSingleUnit) {
      for (let tupletMarkIndex = 0; tupletMarkIndex < tupletMarksInCurrentSingleUnit.length; tupletMarkIndex++) {
        if (tupletMarksInCurrentSingleUnit[tupletMarkIndex].finish || selectedSingleUnitParams.isLastSingleUnitInVoiceOnPageLine) {
          if (affectingTupletValuesByStaveAndVoiceIndexes[staveIndex][voiceIndex]) {
            affectingTupletValuesByStaveAndVoiceIndexes[staveIndex][voiceIndex].pop()
            if (affectingTupletValuesByStaveAndVoiceIndexes[staveIndex][voiceIndex].length === 0) {
              delete affectingTupletValuesByStaveAndVoiceIndexes[staveIndex][voiceIndex]
            }
          }
        }
      }
    }
    return durationConsideringDotsAndTupletsAndTremolos
  }
  const durationConsideringDotsAndTremolos = actualDurationConsideringDotsAndTremolos(
    selectedSingleUnitParams.unitDuration,
    selectedSingleUnitParams.numberOfDots || 0,
    selectedSingleUnitParams.tremoloParams
      ? selectedSingleUnitParams.tremoloParams.tremoloDurationFactor
      : 1
  )
  return durationConsideringDotsAndTremolos
}
