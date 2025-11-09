'use strict'

import regexps from '#unilang/language/parser/scenarios/static-objects/regexps.js'
import initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll from '#unilang/language/parser/scenarios/page-schema/initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll.js'
import initNewStaveParamsIfThereIsAlreadySuchStavePropertyOrNoStavesAtAll from '#unilang/language/parser/scenarios/page-schema/initNewStaveParamsIfThereIsAlreadySuchStavePropertyOrNoStavesAtAll.js'
import lastMeasureParams from '#unilang/language/parser/scenarios/page-schema/lastMeasureParams.js'
import lastStaveParams from '#unilang/language/parser/scenarios/page-schema/lastStaveParams.js'
import clefs from '#unilang/language/parser/scenarios/static-objects/clefs.js'

export default function (scenarios) {
  scenarios['clef'] = {
    startsOnNewLine: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.clef.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll(parserState.pageSchema, 'stavesParams', parserState)
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      initNewStaveParamsIfThereIsAlreadySuchStavePropertyOrNoStavesAtAll(lastMeasureParamsValue, 'clef', parserState)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const clefName = regexps.clef.match(tokenValues)[0]
      lastStaveParamsValue.clef = clefs[clefName]
      parserState.lastClef[currentNumberOfStaves - 1] = lastStaveParamsValue.clef
      const numberOfMeasures = parserState.pageSchema.measuresParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.clefHighlight, (match) => {
            return `<span class="eh" ref-id="clef-${numberOfMeasures}-${currentNumberOfStaves}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="clef-${numberOfMeasures}-${currentNumberOfStaves}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.clefHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 0
  }
}
