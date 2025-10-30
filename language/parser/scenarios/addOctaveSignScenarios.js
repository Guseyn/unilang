'use strict'

const regexps = require('./static-objects/regexps')
const isVerticalCorrection = require('./token/isVerticalCorrection')
const verticalCorrection = require('./token/verticalCorrection')
const foundNextTokenValueOnTheLine = require('./token/foundNextTokenValueOnTheLine')
const foundNextTokenValuesOnTheLine = require('./token/foundNextTokenValuesOnTheLine')
const chordParamsByLastMentionedUnitPositions = require('./page-schema/chordParamsByLastMentionedUnitPositions')
const undefineAllMentionedPositions = require('./page-schema/undefineAllMentionedPositions')
const undefineOnlyLastMentionedUnitPosition = require('./page-schema/undefineOnlyLastMentionedUnitPosition')
const fillAllPlaceholdersInHighlightsHtmlBufferWithMentionedPositionsWhereItsNeeded = require('./highlights-html-buffer/fillAllPlaceholdersInHighlightsHtmlBufferWithMentionedPositionsWhereItsNeeded')
const addUnitPositionScenarios = require('./addUnitPositionScenarios')
const addLineMeasureStaveVoicePositionScenarios = require('./addLineMeasureStaveVoicePositionScenarios')

module.exports = (scenarios) => {
  scenarios['octave sign'] = {
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    startsOnNewLine: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const nextTwoTokens = foundNextTokenValuesOnTheLine(
        unitext, currentToken.firstCharIndexOfNextToken, 2
      )
      return regexps.octaveOrTwoOctavesHigherOrLower.test(tokenValues) &&
        nextTwoTokens.indexOf('clef') === -1
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      undefineAllMentionedPositions(parserState)
      const match = regexps.octaveOrTwoOctavesHigherOrLower.match(tokenValues)
      const isTwoOctaves = match[0]
      const octaveSignMainValue = isTwoOctaves ? '15' : '8'
      const octaveSignUpperValue = isTwoOctaves ? 'ma' : 'va'
      const octaveSignDirection = (match[1] === 'up' || match[1] === 'higher') ? 'up' : 'down'
      parserState.numberOfOctaveSignMarks += 1
      parserState[`lastStartOctaveSignMark-${parserState.numberOfOctaveSignMarks}`] = {
        key: `octave-sign-${parserState.numberOfOctaveSignMarks}`,
        octaveNumber: octaveSignMainValue,
        octavePostfix: octaveSignUpperValue,
        yCorrection: 0,
        direction: octaveSignDirection
      }
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.isOctaveOrTwoOctavesHigherOrLowerHighlight, (match) => {
            return `<span class="eh" ref-id="octave-sign-${parserState.numberOfOctaveSignMarks}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="octave-sign-${parserState.numberOfOctaveSignMarks}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.isOctaveOrTwoOctavesHigherOrLowerHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 0,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      if (parserState.applyHighlighting) {
        fillAllPlaceholdersInHighlightsHtmlBufferWithMentionedPositionsWhereItsNeeded(parserState, true)
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
      undefineOnlyLastMentionedUnitPosition(parserState)
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  scenarios['octave sign from unit'] = {
    requiredCommandProgression: 'octave sign',
    prohibitedCommandProgressions: [ 'octave sign from unit', 'octave sign to unit' ],
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return (
        (
          regexps.starts.test(tokenValues) &&
          !regexps.from.test(
            [
              foundNextTokenValueOnTheLine(
                unitext, currentToken.firstCharIndexOfNextToken
              )
            ]
          )
        ) ||
        regexps.from.test(tokenValues) ||
        regexps.startsFrom.test(tokenValues)
      )
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="">${joinedTokenValuesWithRealDelimiters}`
        )
        parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders.push(
          parserState.highlightsHtmlBuffer.length - 1
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimiters
      )
    },
    itIsNewCommandProgressionFromLevel: 1,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      if (parserState.lastMentionedUnitPosition === undefined) {
        parserState.errors.push(`unit position after command '${argumentsFromMainAction.joinedTokenValuesWithRealDelimiters}' is not specified on the line number ${argumentsFromMainAction.lineNumber}`)
      } else {
        const chordParamsValue = chordParamsByLastMentionedUnitPositions(parserState)
        if (!chordParamsValue) {
          parserState.errors.push(`unit after command '${argumentsFromMainAction.joinedTokenValuesWithRealDelimiters}' is not found on the line ${argumentsFromMainAction.lineNumber}`)
        } else {
          chordParamsValue.octaveSignMark = parserState[`lastStartOctaveSignMark-${parserState.numberOfOctaveSignMarks}`]
        }
      }
      if (parserState.applyHighlighting) {
        fillAllPlaceholdersInHighlightsHtmlBufferWithMentionedPositionsWhereItsNeeded(parserState)
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
      undefineOnlyLastMentionedUnitPosition(parserState)
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  addUnitPositionScenarios(scenarios, 'octave sign from unit', 2, { measure: true })
  scenarios['octave sign to unit'] = {
    requiredCommandProgression: 'octave sign',
    prohibitedCommandProgressions: [ 'octave sign to unit' ],
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.finishes.test(tokenValues) ||
        regexps.to.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="">${joinedTokenValuesWithRealDelimiters}`
        )
        parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders.push(
          parserState.highlightsHtmlBuffer.length - 1
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimiters
      )
    },
    itIsNewCommandProgressionFromLevel: 1,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      if (parserState.lastMentionedUnitPosition === undefined) {
        parserState.errors.push(`unit position after command '${argumentsFromMainAction.joinedTokenValuesWithRealDelimiters}' is not specified on the line number ${argumentsFromMainAction.lineNumber}`)
      } else {
        const chordParamsValue = chordParamsByLastMentionedUnitPositions(parserState)
        if (!chordParamsValue) {
          parserState.errors.push(`unit after command '${argumentsFromMainAction.joinedTokenValuesWithRealDelimiters}' is not found on the line ${argumentsFromMainAction.lineNumber}`)
        } else {
          chordParamsValue.octaveSignMark = {
            key: `octave-sign-${parserState.numberOfOctaveSignMarks}`,
            finish: true
          }
        }
      }
      if (parserState.applyHighlighting) {
        fillAllPlaceholdersInHighlightsHtmlBufferWithMentionedPositionsWhereItsNeeded(parserState)
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
      undefineOnlyLastMentionedUnitPosition(parserState)
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  addUnitPositionScenarios(scenarios, 'octave sign to unit', 2, { measure: true })
  scenarios['octave sign vertical correction'] = {
    requiredCommandProgression: 'octave sign',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isVerticalCorrection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState[`lastStartOctaveSignMark-${parserState.numberOfOctaveSignMarks}`].yCorrection = verticalCorrection(tokenValues)
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.verticalCorrectionHighlight, (match) => {
            return `<span class="th" ref-id="octave-sign-${parserState.numberOfOctaveSignMarks}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="tuplet-${parserState.numberOfOctaveSignMarks}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.verticalCorrectionHighlight, (match) => {
          return `<span class="th">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  addLineMeasureStaveVoicePositionScenarios(
    scenarios,
    'octave sign',
    [
      'octave sign from unit',
      'octave sign to unit'
    ],
    1,
    true,
    { line: true, measure: true, stave: true, voice: true }
  )
}
