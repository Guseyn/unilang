'use strict'

const lastStaveParams = require('./lastStaveParams')

module.exports = (lastMeasureParams, componentName, parserState) => {
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
