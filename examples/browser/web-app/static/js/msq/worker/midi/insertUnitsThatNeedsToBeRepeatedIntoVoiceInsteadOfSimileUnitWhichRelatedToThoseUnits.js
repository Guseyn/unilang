'use strict'

export default function (similesAuraForEachVoiceInEachStave, voiceParams, staveVoiceKey, unitParams, unitIndex) {
  for (let simileAuraUnitIndex = 0; simileAuraUnitIndex < similesAuraForEachVoiceInEachStave[staveVoiceKey].units.length; simileAuraUnitIndex++) {
    const copyOfUnitToRepeat = JSON.parse(JSON.stringify(similesAuraForEachVoiceInEachStave[staveVoiceKey].units[simileAuraUnitIndex]))
    copyOfUnitToRepeat.isRepetition = true
    voiceParams.splice(unitIndex + simileAuraUnitIndex + 1, 0, copyOfUnitToRepeat)
  }
  voiceParams.splice(unitIndex, 1)
  if (unitParams.simileCountDown === 1) {
    delete similesAuraForEachVoiceInEachStave[staveVoiceKey]
  }
}
