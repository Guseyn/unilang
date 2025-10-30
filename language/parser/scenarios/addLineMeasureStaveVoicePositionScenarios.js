'use strict'

const regexps = require('./static-objects/regexps')
const withNumbersInsteadOfWords = require('./token/withNumbersInsteadOfWords')

module.exports = (
  scenarios,
  requiredCommandProgression,
  prohibitedCommandProgressions = [],
  commandProgressionLevel = 2,
  forConnection = false,
  allowedCoordinates = { line: true, measure: true, stave: true, voice: true }
) => {
  if (allowedCoordinates.line) {
    scenarios[`line position (${requiredCommandProgression})`] = {
      requiredCommandProgression,
      prohibitedCommandProgressions,
      considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
      onTheSameLineAsPrevScenario: true,
      condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
        if (forConnection && (parserState.lastMentionedUnitPosition !== undefined)) {
          return false
        }
        const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
        return regexps.unitLinePosition.test(tokensWithNumbersInsteadOfWords)
      },
      action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
        const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
        const unitLinePosition = regexps.unitLinePosition.match(tokensWithNumbersInsteadOfWords)[0] * 1 - 1
        if (forConnection) {
          parserState.lastMentionedConnectionPageLinePosition = unitLinePosition
        }
        parserState.lastMentionedPageLinePosition = unitLinePosition
        if (parserState.applyHighlighting) {
          const tokensWithNumbersInsteadOfWordsWithTrimmedEnd = joinedTokenValuesWithRealDelimiters.trimEnd()
          const tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition = tokensWithNumbersInsteadOfWordsWithTrimmedEnd.replace(
            regexps.positionPreposition, (match, p1, p2, p3, p4) => {
              return `${p1 || ''}<span class="clph" ref-id="">${p4}</span>`
            }
          )
          parserState.highlightsHtmlBuffer.push(
            `<span class="clpph" ref-id="">${tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition}</span>${joinedTokenValuesWithRealDelimiters.slice(tokensWithNumbersInsteadOfWordsWithTrimmedEnd.length)}`
          )
          if (forConnection) {
            parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholdersForConnection.push(
              parserState.highlightsHtmlBuffer.length - 1
            )
          } else {
            parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders.push(
              parserState.highlightsHtmlBuffer.length - 1
            )
          }
        }
      },
      actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
        const tokensWithNumbersInsteadOfWordsWithTrimmedEnd = joinedTokenValuesWithRealDelimiters.trimEnd()
        const tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition = tokensWithNumbersInsteadOfWordsWithTrimmedEnd.replace(
          regexps.positionPreposition, (match, p1, p2, p3, p4) => {
            return `${p1 || ''}<span class="clph">${p4}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `${tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition}${joinedTokenValuesWithRealDelimiters.slice(tokensWithNumbersInsteadOfWordsWithTrimmedEnd.length)}`
        )
      },
      itIsNewCommandProgressionFromLevel: commandProgressionLevel
    }
    scenarios[`position of line (${requiredCommandProgression})`] = {
      requiredCommandProgression,
      prohibitedCommandProgressions,
      considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
      onTheSameLineAsPrevScenario: true,
      condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
        if (forConnection && (parserState.lastMentionedUnitPosition !== undefined)) {
          return false
        }
        const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
        return regexps.linePositionOfUnit.test(tokensWithNumbersInsteadOfWords)
      },
      action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
        const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
        const unitLinePosition = regexps.linePositionOfUnit.match(tokensWithNumbersInsteadOfWords)[0] * 1 - 1
        if (forConnection) {
          parserState.lastMentionedConnectionPageLinePosition = unitLinePosition
        }
        parserState.lastMentionedPageLinePosition = unitLinePosition
        if (parserState.applyHighlighting) {
          const tokensWithNumbersInsteadOfWordsWithTrimmedEnd = joinedTokenValuesWithRealDelimiters.trimEnd()
          const tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition = tokensWithNumbersInsteadOfWordsWithTrimmedEnd.replace(
            regexps.positionPreposition, (match, p1, p2, p3, p4) => {
              return `${p1 || ''}<span class="clph" ref-id="">${p4}</span>`
            }
          )
          parserState.highlightsHtmlBuffer.push(
            `<span class="clpph" ref-id="">${tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition}</span>${joinedTokenValuesWithRealDelimiters.slice(tokensWithNumbersInsteadOfWordsWithTrimmedEnd.length)}`
          )
          if (forConnection) {
            parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholdersForConnection.push(
              parserState.highlightsHtmlBuffer.length - 1
            )
          } else {
            parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders.push(
              parserState.highlightsHtmlBuffer.length - 1
            )
          }
        }
      },
      actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
        const tokensWithNumbersInsteadOfWordsWithTrimmedEnd = joinedTokenValuesWithRealDelimiters.trimEnd()
        const tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition = tokensWithNumbersInsteadOfWordsWithTrimmedEnd.replace(
          regexps.positionPreposition, (match, p1, p2, p3, p4) => {
            return `${p1 || ''}<span class="clph">${p4}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `${tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition}${joinedTokenValuesWithRealDelimiters.slice(tokensWithNumbersInsteadOfWordsWithTrimmedEnd.length)}`
        )
      },
      itIsNewCommandProgressionFromLevel: commandProgressionLevel
    }
  }
  if (allowedCoordinates.measure) {
    scenarios[`measure position (${requiredCommandProgression})`] = {
      requiredCommandProgression,
      prohibitedCommandProgressions,
      considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
      onTheSameLineAsPrevScenario: true,
      condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
        if (forConnection && (parserState.lastMentionedUnitPosition !== undefined)) {
          return false
        }
        const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
        return regexps.unitMeasurePosition.test(tokensWithNumbersInsteadOfWords)
      },
      action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
        const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
        const unitMeasurePosition = regexps.unitMeasurePosition.match(tokensWithNumbersInsteadOfWords)[0] * 1 - 1
        if (forConnection) {
          parserState.lastMentionedConnectionMeasurePosition = unitMeasurePosition
        }
        parserState.lastMentionedMeasurePosition = unitMeasurePosition
        if (parserState.applyHighlighting) {
          const tokensWithNumbersInsteadOfWordsWithTrimmedEnd = joinedTokenValuesWithRealDelimiters.trimEnd()
          const tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition = tokensWithNumbersInsteadOfWordsWithTrimmedEnd.replace(
            regexps.positionPreposition, (match, p1, p2, p3, p4) => {
              return `${p1 || ''}<span class="cmph" ref-id="">${p4}</span>`
            }
          )
          parserState.highlightsHtmlBuffer.push(
            `<span class="cmpph" ref-id="">${tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition}</span>${joinedTokenValuesWithRealDelimiters.slice(tokensWithNumbersInsteadOfWordsWithTrimmedEnd.length)}`
          )
          if (forConnection) {
            parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholdersForConnection.push(
              parserState.highlightsHtmlBuffer.length - 1
            )
          } else {
            parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders.push(
              parserState.highlightsHtmlBuffer.length - 1
            )
          }
        }
      },
      actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
        const tokensWithNumbersInsteadOfWordsWithTrimmedEnd = joinedTokenValuesWithRealDelimiters.trimEnd()
        const tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition = tokensWithNumbersInsteadOfWordsWithTrimmedEnd.replace(
          regexps.positionPreposition, (match, p1, p2, p3, p4) => {
            return `${p1 || ''}<span class="cmph">${p4}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `${tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition}${joinedTokenValuesWithRealDelimiters.slice(tokensWithNumbersInsteadOfWordsWithTrimmedEnd.length)}`
        )
      },
      itIsNewCommandProgressionFromLevel: commandProgressionLevel
    }
    scenarios[`position of measure (${requiredCommandProgression})`] = {
      requiredCommandProgression,
      prohibitedCommandProgressions,
      considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
      onTheSameLineAsPrevScenario: true,
      condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
        if (forConnection && (parserState.lastMentionedUnitPosition !== undefined)) {
          return false
        }
        const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
        return regexps.measurePositionOfUnit.test(tokensWithNumbersInsteadOfWords)
      },
      action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
        const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
        const unitMeasurePosition = regexps.measurePositionOfUnit.match(tokensWithNumbersInsteadOfWords)[0] * 1 - 1
        if (forConnection) {
          parserState.lastMentionedConnectionMeasurePosition = unitMeasurePosition
        }
        parserState.lastMentionedMeasurePosition = unitMeasurePosition
        if (parserState.applyHighlighting) {
          const tokensWithNumbersInsteadOfWordsWithTrimmedEnd = joinedTokenValuesWithRealDelimiters.trimEnd()
          const tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition = tokensWithNumbersInsteadOfWordsWithTrimmedEnd.replace(
            regexps.positionPreposition, (match, p1, p2, p3, p4) => {
              return `${p1 || ''}<span class="cmph" ref-id="">${p4}</span>`
            }
          )
          parserState.highlightsHtmlBuffer.push(
            `<span class="cmpph" ref-id="">${tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition}</span>${joinedTokenValuesWithRealDelimiters.slice(tokensWithNumbersInsteadOfWordsWithTrimmedEnd.length)}`
          )
          if (forConnection) {
            parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholdersForConnection.push(
              parserState.highlightsHtmlBuffer.length - 1
            )
          } else {
            parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders.push(
              parserState.highlightsHtmlBuffer.length - 1
            )
          }
        }
      },
      actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
        const tokensWithNumbersInsteadOfWordsWithTrimmedEnd = joinedTokenValuesWithRealDelimiters.trimEnd()
        const tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition = tokensWithNumbersInsteadOfWordsWithTrimmedEnd.replace(
          regexps.positionPreposition, (match, p1, p2, p3, p4) => {
            return `${p1 || ''}<span class="cmph">${p4}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `${tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition}${joinedTokenValuesWithRealDelimiters.slice(tokensWithNumbersInsteadOfWordsWithTrimmedEnd.length)}`
        )
      },
      itIsNewCommandProgressionFromLevel: commandProgressionLevel
    }
  }
  if (allowedCoordinates.stave) {
    scenarios[`stave position (${requiredCommandProgression})`] = {
      requiredCommandProgression,
      prohibitedCommandProgressions,
      considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
      onTheSameLineAsPrevScenario: true,
      condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
        if (forConnection && (parserState.lastMentionedUnitPosition !== undefined)) {
          return false
        }
        const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
        return regexps.unitStavePosition.test(tokensWithNumbersInsteadOfWords)
      },
      action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
        const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
        const unitStavePosition = regexps.unitStavePosition.match(tokensWithNumbersInsteadOfWords)[0] * 1 - 1
        if (forConnection) {
          parserState.lastMentionedConnectionStavePosition = unitStavePosition
        }
        parserState.lastMentionedStavePosition = unitStavePosition
        if (parserState.applyHighlighting) {
          const tokensWithNumbersInsteadOfWordsWithTrimmedEnd = joinedTokenValuesWithRealDelimiters.trimEnd()
          const tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition = tokensWithNumbersInsteadOfWordsWithTrimmedEnd.replace(
            regexps.positionPreposition, (match, p1, p2, p3, p4) => {
              return `${p1 || ''}<span class="csph" ref-id="">${p4}</span>`
            }
          )
          parserState.highlightsHtmlBuffer.push(
            `<span class="cspph" ref-id="">${tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition}</span>${joinedTokenValuesWithRealDelimiters.slice(tokensWithNumbersInsteadOfWordsWithTrimmedEnd.length)}`
          )
          if (forConnection) {
            parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholdersForConnection.push(
              parserState.highlightsHtmlBuffer.length - 1
            )
          } else {
            parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders.push(
              parserState.highlightsHtmlBuffer.length - 1
            )
          }
        }
      },
      actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
        const tokensWithNumbersInsteadOfWordsWithTrimmedEnd = joinedTokenValuesWithRealDelimiters.trimEnd()
        const tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition = tokensWithNumbersInsteadOfWordsWithTrimmedEnd.replace(
          regexps.positionPreposition, (match, p1, p2, p3, p4) => {
            return `${p1 || ''}<span class="csph">${p4}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `${tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition}${joinedTokenValuesWithRealDelimiters.slice(tokensWithNumbersInsteadOfWordsWithTrimmedEnd.length)}`
        )
      },
      itIsNewCommandProgressionFromLevel: commandProgressionLevel
    }
    scenarios[`position of stave (${requiredCommandProgression})`] = {
      requiredCommandProgression,
      prohibitedCommandProgressions,
      considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
      onTheSameLineAsPrevScenario: true,
      condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
        if (forConnection && (parserState.lastMentionedUnitPosition !== undefined)) {
          return false
        }
        const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
        return regexps.stavePositionOfUnit.test(tokensWithNumbersInsteadOfWords)
      },
      action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
        const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
        const unitStavePosition = regexps.stavePositionOfUnit.match(tokensWithNumbersInsteadOfWords)[0] * 1 - 1
        if (forConnection) {
          parserState.lastMentionedConnectionStavePosition = unitStavePosition
        }
        parserState.lastMentionedStavePosition = unitStavePosition
        if (parserState.applyHighlighting) {
          const tokensWithNumbersInsteadOfWordsWithTrimmedEnd = joinedTokenValuesWithRealDelimiters.trimEnd()
          const tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition = tokensWithNumbersInsteadOfWordsWithTrimmedEnd.replace(
            regexps.positionPreposition, (match, p1, p2, p3, p4) => {
              return `${p1 || ''}<span class="csph" ref-id="">${p4}</span>`
            }
          )
          parserState.highlightsHtmlBuffer.push(
            `<span class="cspph" ref-id="">${tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition}</span>${joinedTokenValuesWithRealDelimiters.slice(tokensWithNumbersInsteadOfWordsWithTrimmedEnd.length)}`
          )
          if (forConnection) {
            parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholdersForConnection.push(
              parserState.highlightsHtmlBuffer.length - 1
            )
          } else {
            parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders.push(
              parserState.highlightsHtmlBuffer.length - 1
            )
          }
        }
      },
      actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
        const tokensWithNumbersInsteadOfWordsWithTrimmedEnd = joinedTokenValuesWithRealDelimiters.trimEnd()
        const tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition = tokensWithNumbersInsteadOfWordsWithTrimmedEnd.replace(
          regexps.positionPreposition, (match, p1, p2, p3, p4) => {
            return `${p1 || ''}<span class="csph">${p4}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `${tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition}${joinedTokenValuesWithRealDelimiters.slice(tokensWithNumbersInsteadOfWordsWithTrimmedEnd.length)}`
        )
      },
      itIsNewCommandProgressionFromLevel: commandProgressionLevel
    }
  }
  if (allowedCoordinates.voice) {
    scenarios[`voice position (${requiredCommandProgression})`] = {
      requiredCommandProgression,
      prohibitedCommandProgressions,
      considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
      onTheSameLineAsPrevScenario: true,
      condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
        if (forConnection && (parserState.lastMentionedUnitPosition !== undefined)) {
          return false
        }
        const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
        return regexps.unitVoicePosition.test(tokensWithNumbersInsteadOfWords)
      },
      action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
        const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
        const unitVoicePosition = regexps.unitVoicePosition.match(tokensWithNumbersInsteadOfWords)[0] * 1 - 1
        if (forConnection) {
          parserState.lastMentionedConnectionVoicePosition = unitVoicePosition
        }
        parserState.lastMentionedVoicePosition = unitVoicePosition
        if (parserState.applyHighlighting) {
          const tokensWithNumbersInsteadOfWordsWithTrimmedEnd = joinedTokenValuesWithRealDelimiters.trimEnd()
          const tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition = tokensWithNumbersInsteadOfWordsWithTrimmedEnd.replace(
            regexps.positionPreposition, (match, p1, p2, p3, p4) => {
              return `${p1 || ''}<span class="cvph" ref-id="">${p4}</span>`
            }
          )
          parserState.highlightsHtmlBuffer.push(
            `<span class="cvpph" ref-id="">${tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition}</span>${joinedTokenValuesWithRealDelimiters.slice(tokensWithNumbersInsteadOfWordsWithTrimmedEnd.length)}`
          )
          if (forConnection) {
            parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholdersForConnection.push(
              parserState.highlightsHtmlBuffer.length - 1
            )
          } else {
            parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders.push(
              parserState.highlightsHtmlBuffer.length - 1
            )
          }
        }
      },
      actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
        const tokensWithNumbersInsteadOfWordsWithTrimmedEnd = joinedTokenValuesWithRealDelimiters.trimEnd()
        const tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition = tokensWithNumbersInsteadOfWordsWithTrimmedEnd.replace(
          regexps.positionPreposition, (match, p1, p2, p3, p4) => {
            return `${p1 || ''}<span class="cvph">${p4}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `${tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition}${joinedTokenValuesWithRealDelimiters.slice(tokensWithNumbersInsteadOfWordsWithTrimmedEnd.length)}`
        )
      },
      itIsNewCommandProgressionFromLevel: commandProgressionLevel
    }
    scenarios[`position of voice (${requiredCommandProgression})`] = {
      requiredCommandProgression,
      prohibitedCommandProgressions,
      considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
      onTheSameLineAsPrevScenario: true,
      condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
        if (forConnection && (parserState.lastMentionedUnitPosition !== undefined)) {
          return false
        }
        const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
        return regexps.voicePositionOfUnit.test(tokensWithNumbersInsteadOfWords)
      },
      action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
        const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
        const unitVoicePosition = regexps.voicePositionOfUnit.match(tokensWithNumbersInsteadOfWords)[0] * 1 - 1
        if (forConnection) {
          parserState.lastMentionedConnectionVoicePosition = unitVoicePosition
        }
        parserState.lastMentionedVoicePosition = unitVoicePosition
        if (parserState.applyHighlighting) {
          const tokensWithNumbersInsteadOfWordsWithTrimmedEnd = joinedTokenValuesWithRealDelimiters.trimEnd()
          const tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition = tokensWithNumbersInsteadOfWordsWithTrimmedEnd.replace(
            regexps.positionPreposition, (match, p1, p2, p3, p4) => {
              return `${p1 || ''}<span class="cvph" ref-id="">${p4}</span>`
            }
          )
          parserState.highlightsHtmlBuffer.push(
            `<span class="cvpph" ref-id="">${tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition}</span>${joinedTokenValuesWithRealDelimiters.slice(tokensWithNumbersInsteadOfWordsWithTrimmedEnd.length)}`
          )
          if (forConnection) {
            parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholdersForConnection.push(
              parserState.highlightsHtmlBuffer.length - 1
            )
          } else {
            parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders.push(
              parserState.highlightsHtmlBuffer.length - 1
            )
          }
        }
      },
      actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
        const tokensWithNumbersInsteadOfWordsWithTrimmedEnd = joinedTokenValuesWithRealDelimiters.trimEnd()
        const tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition = tokensWithNumbersInsteadOfWordsWithTrimmedEnd.replace(
          regexps.positionPreposition, (match, p1, p2, p3, p4) => {
            return `${p1 || ''}<span class="cvph">${p4}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `${tokensWithNumbersInsteadOfWordsWithTrimmedEndWithHighlightedPosition}${joinedTokenValuesWithRealDelimiters.slice(tokensWithNumbersInsteadOfWordsWithTrimmedEnd.length)}`
        )
      },
      itIsNewCommandProgressionFromLevel: commandProgressionLevel
    }
  }
}
