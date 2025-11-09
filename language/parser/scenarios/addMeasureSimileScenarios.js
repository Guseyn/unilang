'use strict'

import initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll from '#unilang/language/parser/scenarios/page-schema/initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll.js'
import lastMeasureParams from '#unilang/language/parser/scenarios/page-schema/lastMeasureParams.js'
import withNumbersInsteadOfWords from '#unilang/language/parser/scenarios/token/withNumbersInsteadOfWords.js'
import regexps from '#unilang/language/parser/scenarios/static-objects/regexps.js'

export default function (scenarios) {
  scenarios['simile of previous measure'] = {
    startsOnNewLine: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.simileOfPreviousMeasure.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll(parserState.pageSchema, 'similePreviousMeasureCount', parserState)
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      lastMeasureParamsValue.similePreviousMeasureCount = '1'
      const numberOfMeasures = parserState.pageSchema.measuresParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.simileHighlight, (match) => {
            return `<span class="eh" ref-id="simile-${numberOfMeasures}">${match}</span>`
          }
        ).replace(
          regexps.previousMeasureHighlight, (match) => {
            return `<span class="cmph" ref-id="simile-prev-measure-${numberOfMeasures}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="simile-${numberOfMeasures}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.simileHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      ).replace(
        regexps.previousMeasureHighlight, (match) => {
          return `<span class="cmph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 1,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  scenarios['simile of two previous measures'] = {
    startsOnNewLine: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.simileOfTwoPreviousMeasures.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll(parserState.pageSchema, 'simileTwoPreviousMeasuresCount', parserState)
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      lastMeasureParamsValue.simileTwoPreviousMeasuresCount = '1'
      const numberOfMeasures = parserState.pageSchema.measuresParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.simileHighlight, (match) => {
            return `<span class="eh" ref-id="simile-${numberOfMeasures}">${match}</span>`
          }
        ).replace(
          regexps.twoPreviousMeasuresHighlight, (match) => {
            return `<span class="cmph" ref-id="simile-two-prev-measures-${numberOfMeasures}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="simile-${numberOfMeasures}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.simileHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      ).replace(
        regexps.twoPreviousMeasuresHighlight, (match) => {
          return `<span class="cmph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 1,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  scenarios['simile count for previous measure'] = {
    requiredCommandProgression: 'simile of previous measure',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.simileCount.test(
        withNumbersInsteadOfWords(tokenValues)
      )
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const simileCount = regexps.simileCount.match(
        withNumbersInsteadOfWords(tokenValues)
      )[0]
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      lastMeasureParamsValue.similePreviousMeasureCount = simileCount
      const numberOfMeasures = parserState.pageSchema.measuresParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedNumber = joinedTokenValuesWithRealDelimiters.replace(
          regexps.numberHighlight, (match) => {
            return `<span class="cnh" ref-id="simile-count-${numberOfMeasures}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="simile-count-${numberOfMeasures}">${joinedTokenValuesWithRealDelimitersWithHighlightedNumber}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedNumber = joinedTokenValuesWithRealDelimiters.replace(
        regexps.numberHighlight, (match) => {
          return `<span class="cnh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedNumber
      )
    }
  }
  scenarios['simile count for two previous measures'] = {
    requiredCommandProgression: 'simile of two previous measures',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.simileCount.test(
        withNumbersInsteadOfWords(tokenValues)
      )
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const simileCount = regexps.simileCount.match(
        withNumbersInsteadOfWords(tokenValues)
      )[0]
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      lastMeasureParamsValue.simileTwoPreviousMeasuresCount = simileCount
      const numberOfMeasures = parserState.pageSchema.measuresParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedNumber = joinedTokenValuesWithRealDelimiters.replace(
          regexps.numberHighlight, (match) => {
            return `<span class="cnh" ref-id="simile-count-${numberOfMeasures}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="simile-count-${numberOfMeasures}">${joinedTokenValuesWithRealDelimitersWithHighlightedNumber}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedNumber = joinedTokenValuesWithRealDelimiters.replace(
        regexps.numberHighlight, (match) => {
          return `<span class="cnh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedNumber
      )
    }
  }
}
