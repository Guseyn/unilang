'use strict'

import durationsValuesInTempoExpressedInQuarters from '#unilang/midi/durationsValuesInTempoExpressedInQuarters.js'
import tempoNamesMappedWitTempoAuraUpdaters from '#unilang/midi/tempoNamesMappedWitTempoAuraUpdaters.js'

const REGEXPS_WITH_GROUPED_LIST_OF_TEMPO_NAMES = new RegExp(`(${Object.keys(tempoNamesMappedWitTempoAuraUpdaters).join('|')})`)
const REGXEPS_WITH_TEMPO_NUMBER = /= {0,}(\d+)/

export default function (tempoMark, tempoAura, unitDurationInQuarters, thisIsFirstUnitInMeasure, label) {
  if (tempoMark) {
    let tempoName = 'default'
    let tempoDuration
    let tempoNumber
    for (let index = 0; index < tempoMark.textValueParts.length; index++) {
      const tempoNameMatch = tempoMark.textValueParts[index].toLowerCase().match(REGEXPS_WITH_GROUPED_LIST_OF_TEMPO_NAMES)
      if (tempoNameMatch) {
        tempoName = tempoNameMatch[1]
      }
      if (durationsValuesInTempoExpressedInQuarters[tempoMark.textValueParts[index]]) {
        tempoDuration = tempoMark.textValueParts[index]
      }
      const tempoNumberMatch = tempoMark.textValueParts[index].toLowerCase().match(REGXEPS_WITH_TEMPO_NUMBER)
      if (tempoNumberMatch) {
        tempoNumber = tempoNumberMatch[1] * 1
      }
    }
    tempoNamesMappedWitTempoAuraUpdaters[tempoName](tempoDuration, tempoNumber, tempoAura, unitDurationInQuarters, thisIsFirstUnitInMeasure)
  }
}
