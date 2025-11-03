'use strict'

import lastStaveParams from './lastStaveParams.js'

export default function (lastMeasureParams, componentName, parserState) {
  if (!lastMeasureParams.stavesParams) {
    lastMeasureParams.stavesParams = []
  }
  if (lastMeasureParams.stavesParams.length === 0) {
    lastMeasureParams.stavesParams.push({})
  }
  if (componentName) {
    if (
      lastStaveParams(lastMeasureParams)[componentName] &&
      !Array.isArray(lastStaveParams(lastMeasureParams)[componentName])
    ) {
      lastMeasureParams.stavesParams.push({})
    }
  }
}
