'use strict'

import lastNonSimileChordParams from '#unilang/language/parser/scenarios/page-schema/lastNonSimileChordParams.js'

export default function (lastStaveParams, componentName, parserState) {
  if (!lastStaveParams.voicesParams) {
    lastStaveParams.voicesParams = []
  }
  if (lastStaveParams.voicesParams.length === 0) {
    lastStaveParams.voicesParams.push([])
  }
  if (componentName) {
    const lastChordParamsValue = lastNonSimileChordParams(lastStaveParams)
    if (
      lastChordParamsValue &&
      lastChordParamsValue[componentName] &&
      !Array.isArray(lastChordParamsValue[componentName])
    ) {
      lastStaveParams.voicesParams.push([])
    }
  }
}
