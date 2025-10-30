'use strict'

module.exports = (tupletValuesAuraForEachVoiceInEachStave, unitParams, staveVoiceKey) => {
  if (unitParams.tupletMarks) {
    for (let tupletMarkIndex = 0; tupletMarkIndex < unitParams.tupletMarks.length; tupletMarkIndex++) {
      if (unitParams.tupletMarks[tupletMarkIndex].finish || unitParams.isLastSingleUnitInVoiceOnPageLine) {
        if (tupletValuesAuraForEachVoiceInEachStave[staveVoiceKey]) {
          tupletValuesAuraForEachVoiceInEachStave[staveVoiceKey].pop()
          if (tupletValuesAuraForEachVoiceInEachStave[staveVoiceKey].length === 0) {
            delete tupletValuesAuraForEachVoiceInEachStave[staveVoiceKey]
          }
        }
      }
    }
  }
}
