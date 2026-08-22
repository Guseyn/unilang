'use strict'

export default function (similesAuraForEachVoiceInEachStave, unitParams, staveVoiceKey) {
  if (unitParams.simileMark) {
    if (!similesAuraForEachVoiceInEachStave[staveVoiceKey]) {
      similesAuraForEachVoiceInEachStave[staveVoiceKey] = {
        units: []
      }
    }
  }
  if (similesAuraForEachVoiceInEachStave[staveVoiceKey] && !unitParams.isSimile && !unitParams.repetition) {
    const unitParamsClone = JSON.parse(JSON.stringify(unitParams))
    unitParamsClone.breathMarkBefore = null
    if (unitParamsClone.simileMark) {
      unitParamsClone.simileMark = null
    }
    unitParamsClone.repetition = true
    similesAuraForEachVoiceInEachStave[staveVoiceKey].units.push(unitParamsClone)
  }
}
