'use strict'

import regexps from '#unilang/language/parser/scenarios/static-objects/regexps.js'
import initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll from '#unilang/language/parser/scenarios/page-schema/initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll.js'
import lastMeasureParams from '#unilang/language/parser/scenarios/page-schema/lastMeasureParams.js'
import lastStaveParams from '#unilang/language/parser/scenarios/page-schema/lastStaveParams.js'
import clefs from '#unilang/language/parser/scenarios/static-objects/clefs.js'
import foundNextTokenValueOnTheLine from '#unilang/language/parser/scenarios/token/foundNextTokenValueOnTheLine.js'

export default function (scenarios) {
  scenarios['stave'] = {
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return currentToken.firstOnTheLine &&
        regexps.stave.test(
          [ currentToken.value ]
        ) &&
        !regexps.lines.test(
          [
            foundNextTokenValueOnTheLine(
              unitext,
              currentToken.firstCharIndexOfNextToken
            )
          ]
        )
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll(parserState.pageSchema, 'stavesParams', parserState)
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      lastMeasureParamsValue.stavesParams = lastMeasureParamsValue.stavesParams || []
      lastMeasureParamsValue.stavesParams.push({})
      const numberOfMeasures = parserState.pageSchema.measuresParams.length
      const numberOfStaves = lastMeasureParamsValue.stavesParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.staveHighlight, (match) => {
            return `<span class="csph" ref-id="stave-lines-${numberOfMeasures}-${numberOfStaves}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="stave-lines-${numberOfMeasures}-${numberOfStaves}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.staveHighlight, (match) => {
          return `<span class="csph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 0,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
    }
  }
  scenarios['stave with clef'] = {
    requiredCommandProgression: 'stave',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withClef.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll(parserState.pageSchema, 'stavesParams', parserState)
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const clefName = regexps.withClef.match(tokenValues)[0]
      lastStaveParamsValue.clef = clefs[clefName]
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
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
    itIsNewCommandProgressionFromLevel: 1
  }
}
