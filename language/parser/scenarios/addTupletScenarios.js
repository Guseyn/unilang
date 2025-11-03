'use strict'

import regexps from './static-objects/regexps.js'
import isDirection from './token/isDirection.js'
import direction from './token/direction.js'
import isAboveBelowOverUnder from './token/isAboveBelowOverUnder.js'
import directionByAboveBelowOverUnder from './token/directionByAboveBelowOverUnder.js'
import isAboveBelowOverUnderStaveLines from './token/isAboveBelowOverUnderStaveLines.js'
import directionByAboveBelowOverUnderStaveLines from './token/directionByAboveBelowOverUnderStaveLines.js'
import isVerticalCorrection from './token/isVerticalCorrection.js'
import verticalCorrection from './token/verticalCorrection.js'
import foundNextTokenValueOnTheLine from './token/foundNextTokenValueOnTheLine.js'
import chordParamsByLastMentionedUnitPositions from './page-schema/chordParamsByLastMentionedUnitPositions.js'
import undefineAllMentionedPositions from './page-schema/undefineAllMentionedPositions.js'
import undefineOnlyLastMentionedUnitPosition from './page-schema/undefineOnlyLastMentionedUnitPosition.js'
import fillAllPlaceholdersInHighlightsHtmlBufferWithMentionedPositionsWhereItsNeeded from './highlights-html-buffer/fillAllPlaceholdersInHighlightsHtmlBufferWithMentionedPositionsWhereItsNeeded.js'
import addUnitPositionScenarios from './addUnitPositionScenarios.js'
import addLineMeasureStaveVoicePositionScenarios from './addLineMeasureStaveVoicePositionScenarios.js'

export default function (scenarios) {
  scenarios['tuplet'] = {
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    startsOnNewLine: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.tupletWithValue.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      undefineAllMentionedPositions(parserState)
      parserState.lastChordParamsWithFinishedTupletMarkThatStarted = undefined
      parserState.lastChordParamsWithStartedTupletMark = undefined
      parserState.lastTupletDirection = undefined
      parserState.lastTupletIsAboveOrBelowStaveLines = undefined
      parserState.lastTupletWithBrackets = undefined
      parserState.lastTupletVerticalCorrection = undefined
      parserState.numberOfTuplets += 1
      parserState.lastTupletValue = regexps.tupletWithValue.match(tokenValues)[0]
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithSplittedParts = joinedTokenValuesWithRealDelimiters.split(regexps.tupletHighlight)
        const joinedTokenValuesWithRealDelimitersFirstPart = joinedTokenValuesWithRealDelimitersWithSplittedParts[0]
        const joinedTokenValuesWithRealDelimitersSecondPart = joinedTokenValuesWithRealDelimitersWithSplittedParts[1]
        const joinedTokenValuesWithRealDelimitersFirstPartWithHighlightedElement = `${joinedTokenValuesWithRealDelimitersFirstPart}<span class="eh" ref-id="tuplet-${parserState.numberOfTuplets}">tuplet</span>`
        const joinedTokenValuesWithRealDelimitersSecondPartWithHighlightedElement = joinedTokenValuesWithRealDelimitersSecondPart.replace(
          regexps.tupletValueHighlight, (match) => {
            return `<span class="cnh" ref-id="tuplet-value-${parserState.numberOfTuplets}">${match}</span>`
          }
        )
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = `${joinedTokenValuesWithRealDelimitersFirstPartWithHighlightedElement}${joinedTokenValuesWithRealDelimitersSecondPartWithHighlightedElement}`
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="tuplet-${parserState.numberOfTuplets}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithSplittedParts = joinedTokenValuesWithRealDelimiters.split(regexps.tupletHighlight)
      const joinedTokenValuesWithRealDelimitersFirstPart = joinedTokenValuesWithRealDelimitersWithSplittedParts[0]
      const joinedTokenValuesWithRealDelimitersSecondPart = joinedTokenValuesWithRealDelimitersWithSplittedParts[1]
      const joinedTokenValuesWithRealDelimitersFirstPartWithHighlightedElement = `${joinedTokenValuesWithRealDelimitersFirstPart}<span class="eh">tuplet</span>`
      const joinedTokenValuesWithRealDelimitersSecondPartWithHighlightedElement = joinedTokenValuesWithRealDelimitersSecondPart.replace(
        regexps.tupletValueHighlight, (match) => {
          return `<span class="cnh">${match}</span>`
        }
      )
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = `${joinedTokenValuesWithRealDelimitersFirstPartWithHighlightedElement}${joinedTokenValuesWithRealDelimitersSecondPartWithHighlightedElement}`
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
  scenarios['tuplet starts before unit'] = {
    requiredCommandProgression: 'tuplet',
    prohibitedCommandProgressions: [ 'tuplet starts before unit', 'tuplet starts at unit', 'tuplet finishes after unit', 'tuplet finishes at unit' ],
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.startsBefore.test(tokenValues) ||
        regexps.before.test(tokenValues)
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
          chordParamsValue.tupletMarks = chordParamsValue.tupletMarks || []
          const firstChordParamsInCurrentVoiceOnCurrentStave = parserState.pageSchema.measuresParams[parserState.calculatedUnitMeasureIndexByLastMentionedPositions].stavesParams[parserState.calculatedUnitStaveIndexByLastMentionedPositions].voicesParams[parserState.calculatedUnitVoiceIndexByLastMentionedPositions][0]
          firstChordParamsInCurrentVoiceOnCurrentStave.tupletMarks = firstChordParamsInCurrentVoiceOnCurrentStave.tupletMarks || []
          const tupletMarkKey = `tuplet-${parserState.numberOfTuplets}`
          const startTupletMark = {
            key: tupletMarkKey,
            value: parserState.lastTupletValue,
            before: true
          }
          if (parserState.lastTupletDirection) {
            startTupletMark.direction = parserState.lastTupletDirection
          }
          if (parserState.lastTupletIsAboveOrBelowStaveLines) {
            startTupletMark.direction = parserState.lastTupletDirection
            startTupletMark.aboveBelowOverUnderStaveLines = true
          }
          if (parserState.lastTupletWithBrackets) {
            startTupletMark.withBrackets = true
          }
          if (parserState.lastTupletVerticalCorrection !== undefined) {
            startTupletMark.yCorrection = parserState.lastTupletVerticalCorrection
          }
          firstChordParamsInCurrentVoiceOnCurrentStave.tupletMarks.push(startTupletMark)
          parserState.lastChordParamsWithStartedTupletMark = {
            chordParams: firstChordParamsInCurrentVoiceOnCurrentStave,
            tupletMarkIndex: firstChordParamsInCurrentVoiceOnCurrentStave.tupletMarks.length - 1
          }
          chordParamsValue.tupletMarks.push({
            key: tupletMarkKey,
            finish: true
          })
          parserState.lastChordParamsWithFinishedTupletMarkThatStarted = {
            chordParams: chordParamsValue,
            tupletMarkIndex: chordParamsValue.tupletMarks.length - 1
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
  addUnitPositionScenarios(scenarios, 'tuplet starts before unit', 2, { measure: true })
  scenarios['tuplet finishes after unit'] = {
    requiredCommandProgression: 'tuplet',
    prohibitedCommandProgressions: [ 'tuplet finishes after unit', 'tuplet finishes at unit' ],
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.finishesAfter.test(tokenValues) ||
        regexps.after.test(tokenValues)
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
        parserState.errors.push(`unit position after command '${argumentsFromMainAction.joinedTokenValuesWithRealDelimiters}' is not specified on the line ${argumentsFromMainAction.lineNumber}`)
      } else {
        const chordParamsValue = chordParamsByLastMentionedUnitPositions(parserState)
        if (!chordParamsValue) {
          parserState.errors.push(`unit after command '${argumentsFromMainAction.joinedTokenValuesWithRealDelimiters}' is not found on the line ${argumentsFromMainAction.lineNumber}`)
        } else {
          chordParamsValue.tupletMarks = chordParamsValue.tupletMarks || []
          const tupletMarkKey = `tuplet-${parserState.numberOfTuplets}`
          if (parserState.lastChordParamsWithFinishedTupletMarkThatStarted !== undefined) {
            parserState.lastChordParamsWithFinishedTupletMarkThatStarted.chordParams.tupletMarks.splice(
              parserState.lastChordParamsWithFinishedTupletMarkThatStarted.tupletMarkIndex, 1
            )
            parserState.lastChordParamsWithFinishedTupletMarkThatStarted = undefined
          } else if (parserState.lastChordParamsWithStartedTupletMark === undefined) {
            const startTupletMark = {
              key: tupletMarkKey,
              value: parserState.lastTupletValue
            }
            if (parserState.lastTupletDirection) {
              startTupletMark.direction = parserState.lastTupletDirection
            }
            chordParamsValue.tupletMarks.push(startTupletMark)
            parserState.lastChordParamsWithStartedTupletMark = {
              chordParams: chordParamsValue,
              tupletMarkIndex: chordParamsValue.tupletMarks.length - 1
            }
          }
          const finishTupletMark = {
            value: parserState.lastTupletValue,
            key: tupletMarkKey,
            finish: true,
            after: true
          }
          chordParamsValue.tupletMarks.push(finishTupletMark)
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
  addUnitPositionScenarios(scenarios, 'tuplet finishes after unit', 2, { measure: true })
  scenarios['tuplet starts at unit'] = {
    requiredCommandProgression: 'tuplet',
    prohibitedCommandProgressions: [ 'tuplet starts at unit', 'tuplet starts before unit', 'tuplet finishes after unit', 'tuplet finishes at unit' ],
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
      ) &&
      !regexps.before.test(
        [
          foundNextTokenValueOnTheLine(
            unitext, currentToken.firstCharIndexOfNextToken
          )
        ]
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
        const tupletMarkKey = `tuplet-${parserState.numberOfTuplets}`
        const chordParamsValue = chordParamsByLastMentionedUnitPositions(parserState)
        if (!chordParamsValue) {
          parserState.errors.push(`unit after command '${argumentsFromMainAction.joinedTokenValuesWithRealDelimiters}' is not found on the line ${argumentsFromMainAction.lineNumber}`)
        } else {
          chordParamsValue.tupletMarks = chordParamsValue.tupletMarks || []
          const startTupletMark = {
            key: tupletMarkKey,
            value: parserState.lastTupletValue
          }
          if (parserState.lastTupletDirection) {
            startTupletMark.direction = parserState.lastTupletDirection
          }
          if (parserState.lastTupletIsAboveOrBelowStaveLines) {
            startTupletMark.direction = parserState.lastTupletDirection
            startTupletMark.aboveBelowOverUnderStaveLines = true
          }
          if (parserState.lastTupletWithBrackets) {
            startTupletMark.withBrackets = true
          }
          if (parserState.lastTupletVerticalCorrection !== undefined) {
            startTupletMark.yCorrection = parserState.lastTupletVerticalCorrection
          }
          chordParamsValue.tupletMarks.push(startTupletMark)
          parserState.lastChordParamsWithStartedTupletMark = {
            chordParams: chordParamsValue,
            tupletMarkIndex: chordParamsValue.tupletMarks.length - 1
          }
          chordParamsValue.tupletMarks.push({
            key: tupletMarkKey,
            finish: true,
            after: true
          })
          parserState.lastChordParamsWithFinishedTupletMarkThatStarted = {
            chordParams: chordParamsValue,
            tupletMarkIndex: chordParamsValue.tupletMarks.length - 1
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
  addUnitPositionScenarios(scenarios, 'tuplet starts at unit', 2, { measure: true })
  scenarios['tuplet finishes at unit'] = {
    requiredCommandProgression: 'tuplet',
    prohibitedCommandProgressions: [ 'tuplet finishes at unit', 'tuplet finishes after unit' ],
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return (
        regexps.finishes.test(tokenValues) ||
        regexps.to.test(tokenValues)
      ) &&
      !regexps.after.test(
        [
          foundNextTokenValueOnTheLine(
            unitext, currentToken.firstCharIndexOfNextToken
          )
        ]
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
        const tupletMarkKey = `tuplet-${parserState.numberOfTuplets}`
        if (!chordParamsValue) {
          parserState.errors.push(`unit after command '${argumentsFromMainAction.joinedTokenValuesWithRealDelimiters}' is not found on the line ${argumentsFromMainAction.lineNumber}`)
        } else {
          chordParamsValue.tupletMarks = chordParamsValue.tupletMarks || []
          if (parserState.lastChordParamsWithFinishedTupletMarkThatStarted !== undefined) {
            parserState.lastChordParamsWithFinishedTupletMarkThatStarted.chordParams.tupletMarks.splice(
              parserState.lastChordParamsWithFinishedTupletMarkThatStarted.tupletMarkIndex, 1
            )
            parserState.lastChordParamsWithFinishedTupletMarkThatStarted = undefined
          }
          chordParamsValue.tupletMarks.push({
            key: tupletMarkKey,
            finish: true
          })
          parserState.lastChordParamsWithStartedTupletMark = undefined
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
  addUnitPositionScenarios(scenarios, 'tuplet finishes at unit', 2, { measure: true })
  scenarios['tuplet with direction'] = {
    requiredCommandProgression: 'tuplet',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isDirection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState.lastTupletDirection = direction(tokenValues)
      if (parserState.lastChordParamsWithStartedTupletMark) {
        parserState.lastChordParamsWithStartedTupletMark.chordParams.tupletMarks[parserState.lastChordParamsWithStartedTupletMark.tupletMarkIndex].direction = parserState.lastTupletDirection
      }
      if (parserState.applyHighlighting) {
        // no highlights needed
        parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      // no highlights needed
      parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
    }
  }
  scenarios['tuplet above or below'] = {
    requiredCommandProgression: 'tuplet',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isAboveBelowOverUnder(tokenValues) &&
        !regexps.staveWithAndWithoutDelimeter.test(
          [
            foundNextTokenValueOnTheLine(
              unitext,
              currentToken.firstCharIndexOfNextToken
            )
          ]
        )
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState.lastTupletDirection = directionByAboveBelowOverUnder(tokenValues)
      if (parserState.lastChordParamsWithStartedTupletMark) {
        parserState.lastChordParamsWithStartedTupletMark.chordParams.tupletMarks[parserState.lastChordParamsWithStartedTupletMark.tupletMarkIndex].direction = parserState.lastTupletDirection
      }
      if (parserState.applyHighlighting) {
        // no highlights needed
        parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      // no highlights needed
      parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
    }
  }
  scenarios['tuplet is above or below stave lines'] = {
    requiredCommandProgression: 'tuplet',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isAboveBelowOverUnderStaveLines(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState.lastTupletDirection = directionByAboveBelowOverUnderStaveLines(tokenValues)
      parserState.lastTupletIsAboveOrBelowStaveLines = true
      if (parserState.lastChordParamsWithStartedTupletMark) {
        parserState.lastChordParamsWithStartedTupletMark.chordParams.tupletMarks[parserState.lastChordParamsWithStartedTupletMark.tupletMarkIndex].direction = parserState.lastTupletDirection
        parserState.lastChordParamsWithStartedTupletMark.chordParams.tupletMarks[parserState.lastChordParamsWithStartedTupletMark.tupletMarkIndex].aboveBelowOverUnderStaveLines = true
      }
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.staveHighlight, (match) => {
            return `<span class="csph" ref-id="all-staves-in-measure-${currentNumberOfMeasures}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="all-staves-in-measure-${currentNumberOfMeasures}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
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
    }
  }
  scenarios['tuplet with brackets'] = {
    requiredCommandProgression: 'tuplet',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withBrackets.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState.lastTupletWithBrackets = true
      if (parserState.lastChordParamsWithStartedTupletMark) {
        parserState.lastChordParamsWithStartedTupletMark.chordParams.tupletMarks[parserState.lastChordParamsWithStartedTupletMark.tupletMarkIndex].withBrackets = parserState.lastTupletWithBrackets
      }
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.bracketsHighlight, (match) => {
            return `<span class="th" ref-id="tuplet-brackets-${parserState.numberOfTuplets}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="tuplet-brackets-${parserState.numberOfTuplets}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.bracketsHighlight, (match) => {
          return `<span class="th">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    }
  }
  scenarios['tuplet with vertical correction'] = {
    requiredCommandProgression: 'tuplet',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isVerticalCorrection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState.lastTupletVerticalCorrection = verticalCorrection(tokenValues)
      if (parserState.lastChordParamsWithStartedTupletMark) {
        parserState.lastChordParamsWithStartedTupletMark.chordParams.tupletMarks[parserState.lastChordParamsWithStartedTupletMark.tupletMarkIndex].yCorrection = parserState.lastTupletVerticalCorrection
      }
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.verticalCorrectionHighlight, (match) => {
            return `<span class="th" ref-id="tuplet-${parserState.numberOfTuplets}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="tuplet-${parserState.numberOfTuplets}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
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
    }
  }
  addLineMeasureStaveVoicePositionScenarios(
    scenarios,
    'tuplet',
    [
      'tuplet starts before unit',
      'tuplet finishes after unit',
      'tuplet starts at unit',
      'tuplet finishes at unit'
    ],
    1,
    true,
    { line: true, measure: true, stave: true, voice: true }
  )
}
