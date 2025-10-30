'use strict'

const regexps = require('./static-objects/regexps')
const initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll = require('./page-schema/initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll')
const initNewStaveParamsIfThereIsAlreadySuchStavePropertyOrNoStavesAtAll = require('./page-schema/initNewStaveParamsIfThereIsAlreadySuchStavePropertyOrNoStavesAtAll')
const lastMeasureParams = require('./page-schema/lastMeasureParams')
const lastStaveParams = require('./page-schema/lastStaveParams')

module.exports = (scenarios) => {
  scenarios['voice'] = {
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return currentToken.firstOnTheLine &&
        regexps.voice.test(
          [ currentToken.value ]
        )
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll(parserState.pageSchema, 'stavesParams', parserState)
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      initNewStaveParamsIfThereIsAlreadySuchStavePropertyOrNoStavesAtAll(lastMeasureParamsValue, 'voicesParams', parserState)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      lastStaveParamsValue.voicesParams = lastStaveParamsValue.voicesParams || []
      lastStaveParamsValue.voicesParams.push([])
      const numberOfMeasures = parserState.pageSchema.measuresParams.length
      const numberOfStaves = lastMeasureParamsValue.stavesParams.length
      const numberOfVoices = lastStaveParamsValue.voicesParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.voiceHighlight, (match) => {
            return `<span class="cvph" ref-id="voice-${numberOfMeasures}-${numberOfStaves}-${numberOfVoices}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="voice-${numberOfMeasures}-${numberOfStaves}-${numberOfVoices}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.voiceHighlight, (match) => {
          return `<span class="cvph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 0
  }
}
