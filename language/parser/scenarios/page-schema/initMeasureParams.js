'use strict'

// const lastMeasureParams = require('./lastMeasureParams')

module.exports = (pageSchema, parserState) => {
  pageSchema.measuresParams = pageSchema.measuresParams || []
  if (parserState.numberOfPageLines === 0) {
    parserState.numberOfPageLines += 1
  }
  if (!parserState.newlineAlreadyIntroducedNewMeasure) {
    pageSchema.measuresParams.push({
      closingBarLineName: 'barLine',
      pageLineNumber: parserState.numberOfPageLines
    })
  }
  parserState.newlineAlreadyIntroducedNewMeasure = false
  /* const updatedLastMeasureParamsValue = lastMeasureParams(pageSchema)
  if (parserState.lastCrossStaveConnectionsParamsForEachLine) {
    updatedLastMeasureParamsValue.connectionsParams = JSON.parse(JSON.stringify(parserState.lastCrossStaveConnectionsParamsForEachLine))
  }
  if (parserState.lastInstrumentTitlesParamsForEachLine) {
    updatedLastMeasureParamsValue.instrumentTitlesParams = JSON.parse(JSON.stringify(parserState.lastInstrumentTitlesParamsForEachLine))
  }
  if (parserState.lastKeySignatureName) {
    updatedLastMeasureParamsValue.keySignatureName = parserState.lastKeySignatureName
    updatedLastMeasureParamsValue.keySignatureNameForEachLineId = parserState.lastKeySignatureNameForEachLineId
  }
  if (parserState.lastTimeSignatureParams) {
    updatedLastMeasureParamsValue.timeSignatureParams = parserState.lastTimeSignatureParams
  } */
}
