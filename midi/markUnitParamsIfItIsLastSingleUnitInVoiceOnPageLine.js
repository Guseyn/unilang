'use strict'

module.exports = (measuresParams, measureParams, voiceParams, unitParams, measureIndex, staveIndex, voiceIndex, unitIndex) => {
  if (!voiceParams[unitIndex + 1]) {
    if ((measureIndex === measuresParams.length - 1) || (measuresParams[measureIndex + 1] && measuresParams[measureIndex + 1].isHidden)) {
      unitParams.isLastSingleUnitInVoiceOnPageLine = true
      unitParams.isLastSingleUnitOnPageInVoice = true
    } else {
      for (let measureIndexAfter = measureIndex + 1; measureIndexAfter < measuresParams.length; measureIndexAfter++) {
        if (
          !measuresParams[measureIndexAfter] ||
          !measuresParams[measureIndexAfter].stavesParams ||
          measuresParams[measureIndexAfter].stavesParams.length === 0 ||
          !measuresParams[measureIndexAfter].stavesParams[staveIndex] ||
          !measuresParams[measureIndexAfter].stavesParams[staveIndex].voicesParams ||
          !measuresParams[measureIndexAfter].stavesParams[staveIndex].voicesParams[voiceIndex] ||
          measuresParams[measureIndexAfter].stavesParams[staveIndex].voicesParams[voiceIndex].length === 0
        ) {
          unitParams.isLastSingleUnitInVoiceOnPageLine = true
        } else {
          unitParams.isLastSingleUnitInVoiceOnPageLine = false
          break
        }
        if (measureParams.isLastMeasureOnPageLine) {
          break
        }
      }
    }
  }
}
