'use strict'

const regexps = require('./static-objects/regexps')
const withNumbersInsteadOfWords = require('./token/withNumbersInsteadOfWords')
const addLineMeasureStaveVoicePositionScenarios = require('./addLineMeasureStaveVoicePositionScenarios')

module.exports = (scenarios, requiredCommandProgression, commandProgressionLevel = 2, allowedCoordinates) => {
  scenarios[`unit position (${requiredCommandProgression})`] = {
    requiredCommandProgression,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    onTheSameLineAsPrevScenario: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
      return regexps.unitPosition.test(tokensWithNumbersInsteadOfWords)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
      const unitPosition = regexps.unitPosition.match(tokensWithNumbersInsteadOfWords)[0] * 1 - 1
      parserState.lastMentionedUnitPosition = unitPosition
      if (parserState.applyHighlighting) {
        const tokensWithNumbersInsteadOfWordsWithTrimmedEnd = joinedTokenValuesWithRealDelimiters.trimEnd()
        const tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition = tokensWithNumbersInsteadOfWordsWithTrimmedEnd.replace(
          regexps.positionPreposition, (match, p1, p2, p3, p4) => {
            return `${p1 || ''}<span class="cuph" ref-id="">${p4}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="cupph" ref-id="">${tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition}</span>${joinedTokenValuesWithRealDelimiters.slice(tokensWithNumbersInsteadOfWordsWithTrimmedEnd.length)}`
        )
        parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders.push(
          parserState.highlightsHtmlBuffer.length - 1
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const tokensWithNumbersInsteadOfWordsWithTrimmedEnd = joinedTokenValuesWithRealDelimiters.trimEnd()
      const tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition = tokensWithNumbersInsteadOfWordsWithTrimmedEnd.replace(
        regexps.positionPreposition, (match, p1, p2, p3, p4) => {
          return `${p1 || ''}<span class="cuph">${p4}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        `${tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition}${joinedTokenValuesWithRealDelimiters.slice(tokensWithNumbersInsteadOfWordsWithTrimmedEnd.length)}`
      )
    },
    itIsNewCommandProgressionFromLevel: commandProgressionLevel
  }
  scenarios[`position of unit (${requiredCommandProgression})`] = {
    requiredCommandProgression,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    onTheSameLineAsPrevScenario: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
      return regexps.positionOfUnit.test(tokensWithNumbersInsteadOfWords)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
      const unitPosition = regexps.positionOfUnit.match(tokensWithNumbersInsteadOfWords)[0] * 1 - 1
      parserState.lastMentionedUnitPosition = unitPosition
      if (parserState.applyHighlighting) {
        const tokensWithNumbersInsteadOfWordsWithTrimmedEnd = joinedTokenValuesWithRealDelimiters.trimEnd()
        const tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition = tokensWithNumbersInsteadOfWordsWithTrimmedEnd.replace(
          regexps.positionPreposition, (match, p1, p2, p3, p4) => {
            return `${p1 || ''}<span class="cuph" ref-id="">${p4}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="cupph" ref-id="">${tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition}</span>${joinedTokenValuesWithRealDelimiters.slice(tokensWithNumbersInsteadOfWordsWithTrimmedEnd.length)}`
        )
        parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders.push(
          parserState.highlightsHtmlBuffer.length - 1
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const tokensWithNumbersInsteadOfWordsWithTrimmedEnd = joinedTokenValuesWithRealDelimiters.trimEnd()
      const tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition = tokensWithNumbersInsteadOfWordsWithTrimmedEnd.replace(
        regexps.positionPreposition, (match, p1, p2, p3, p4) => {
          return `${p1 || ''}<span class="cuph">${p4}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        `${tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition}${joinedTokenValuesWithRealDelimiters.slice(tokensWithNumbersInsteadOfWordsWithTrimmedEnd.length)}`
      )
    },
    itIsNewCommandProgressionFromLevel: commandProgressionLevel
  }
  addLineMeasureStaveVoicePositionScenarios(scenarios, requiredCommandProgression, [], commandProgressionLevel, false, allowedCoordinates)
}
