'use strict'

const regexps = require('./static-objects/regexps')
const foundNextTokenValueOnTheLine = require('./token/foundNextTokenValueOnTheLine')
const isDirection = require('./token/isDirection')
const direction = require('./token/direction')
const isRoundness = require('./token/isRoundness')
const roundness = require('./token/roundness')
const isAboveBelowOverUnder = require('./token/isAboveBelowOverUnder')
const directionByAboveBelowOverUnder = require('./token/directionByAboveBelowOverUnder')
const isVerticalCorrection = require('./token/isVerticalCorrection')
const verticalCorrection = require('./token/verticalCorrection')
const chordParamsByLastMentionedUnitPositions = require('./page-schema/chordParamsByLastMentionedUnitPositions')
const removeSlurMarksThatFinishFromChordsParamsByKeyAndSlurMarksFromCurrentChordParamsThatDontFinishByKey = require('./page-schema/removeSlurMarksThatFinishFromChordsParamsByKeyAndSlurMarksFromCurrentChordParamsThatDontFinishByKey')
const addDirectionToSlurMarkByKey = require('./page-schema/addDirectionToSlurMarkByKey')
const addRoundnessToSlurMarkByKey = require('./page-schema/addRoundnessToSlurMarkByKey')
const addSShapeToSlurMarkByKey = require('./page-schema/addSShapeToSlurMarkByKey')
const addLeftYCorrectionToSlurMarkByKey = require('./page-schema/addLeftYCorrectionToSlurMarkByKey')
const addRightYCorrectionToSlurMarkByKey = require('./page-schema/addRightYCorrectionToSlurMarkByKey')
const addRightPointPlacementToSlurMarkByKey = require('./page-schema/addRightPointPlacementToSlurMarkByKey')
const undefineAllMentionedPositions = require('./page-schema/undefineAllMentionedPositions')
const undefineOnlyLastMentionedUnitPosition = require('./page-schema/undefineOnlyLastMentionedUnitPosition')
const fillAllPlaceholdersInHighlightsHtmlBufferWithMentionedPositionsWhereItsNeeded = require('./highlights-html-buffer/fillAllPlaceholdersInHighlightsHtmlBufferWithMentionedPositionsWhereItsNeeded')
const addUnitPositionScenarios = require('./addUnitPositionScenarios')
const addLineMeasureStaveVoicePositionScenarios = require('./addLineMeasureStaveVoicePositionScenarios')

const addSlurFeaturesIfTheyAreSpecifiedBeforeItsUnitPositions = (parserState, slurMarkKey) => {
  if (parserState.lastSlurDirection) {
    addDirectionToSlurMarkByKey(parserState, slurMarkKey, parserState.lastSlurDirection)
    parserState.lastSlurDirection = undefined
  }
  if (parserState.lastSlurRoundness) {
    addRoundnessToSlurMarkByKey(parserState, slurMarkKey, parserState.lastSlurRoundness)
    parserState.lastSlurRoundness = undefined
  }
  if (parserState.lastSlurLeftYCorrection) {
    addLeftYCorrectionToSlurMarkByKey(parserState, slurMarkKey, parserState.lastSlurLeftYCorrection)
    parserState.lastSlurLeftYCorrection = undefined
  }
  if (parserState.lastSlurRightYCorrection) {
    addRightYCorrectionToSlurMarkByKey(parserState, slurMarkKey, parserState.lastSlurRightYCorrection)
    parserState.lastSlurRightYCorrection = undefined
  }
  if (parserState.lastSlurRightPointPlacement) {
    addRightPointPlacementToSlurMarkByKey(parserState, slurMarkKey, parserState.lastSlurRightPointPlacement)
    parserState.lastSlurRightPointPlacement = undefined
  }
  if (parserState.lastSlurWithSShape) {
    addSShapeToSlurMarkByKey(parserState, slurMarkKey)
    parserState.lastSlurWithSShape = undefined
  }
}

module.exports = (scenarios) => {
  scenarios['slur'] = {
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    startsOnNewLine: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.slur.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      undefineAllMentionedPositions(parserState)
      parserState.lastSlurDirection = undefined
      parserState.lastSShapeSlurPartDirection = undefined
      parserState.lastSlurRoundness = undefined
      parserState.lastSlurLeftYCorrection = undefined
      parserState.lastSlurRightYCorrection = undefined
      parserState.lastSlurRightPointPlacement = undefined
      parserState.lastSlurWithSShape = undefined
      parserState.numberOfSlurs += 1
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.slurHighlight, (match) => {
            return `<span class="eh" ref-id="slur-${parserState.numberOfSlurs}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="eh" ref-id="slur-${parserState.numberOfSlurs}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.slurHighlight, (match) => {
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
  scenarios['slur starts before unit'] = {
    requiredCommandProgression: 'slur',
    prohibitedCommandProgressions: [ 'slur finishes at unit', 'slur finishes after unit', 'slur starts at unit' ],
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
          chordParamsValue.slurMarks = chordParamsValue.slurMarks || []
          const slurMarkKey = `slur-${parserState.numberOfSlurs}`
          chordParamsValue.slurMarks.push({
            key: slurMarkKey,
            before: true
          })
          chordParamsValue.slurMarks.push({
            key: slurMarkKey,
            finish: true
          })
          parserState.slurMarkChords[slurMarkKey] = parserState.slurMarkChords[slurMarkKey] || []
          parserState.slurMarkChords[slurMarkKey].push(chordParamsValue)
          addSlurFeaturesIfTheyAreSpecifiedBeforeItsUnitPositions(parserState, slurMarkKey)
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
  addUnitPositionScenarios(scenarios, 'slur starts before unit', 2, { measure: true, stave: true })
  scenarios['slur starts before above|below unit'] = {
    requiredCommandProgression: 'slur starts before unit',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isAboveBelowOverUnder(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState.lastSlurDirection = directionByAboveBelowOverUnder(tokenValues)
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      // no highlights needed
      parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
    }
  }
  scenarios['slur finishes after unit'] = {
    requiredCommandProgression: 'slur',
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
          chordParamsValue.slurMarks = chordParamsValue.slurMarks || []
          const slurMarkKey = `slur-${parserState.numberOfSlurs}`
          removeSlurMarksThatFinishFromChordsParamsByKeyAndSlurMarksFromCurrentChordParamsThatDontFinishByKey(parserState, slurMarkKey, chordParamsValue)
          parserState.slurMarkChords[slurMarkKey] = parserState.slurMarkChords[slurMarkKey] || []
          if (parserState.slurMarkChords[slurMarkKey].length === 0) {
            chordParamsValue.slurMarks.push({
              key: slurMarkKey
            })
            parserState.slurMarkChords[slurMarkKey].push(chordParamsValue)
          }
          const slurMark = {
            key: slurMarkKey,
            finish: true,
            after: true
          }
          if (parserState.lastSShapeSlurPartDirection) {
            slurMark.direction = parserState.lastSShapeSlurPartDirection
            parserState.lastSShapeSlurPartDirection = undefined
          }
          chordParamsValue.slurMarks.push(slurMark)
          parserState.slurMarkChords[slurMarkKey].push(chordParamsValue)
          addSlurFeaturesIfTheyAreSpecifiedBeforeItsUnitPositions(parserState, slurMarkKey)
        }
      }
      if (parserState.applyHighlighting) {
        fillAllPlaceholdersInHighlightsHtmlBufferWithMentionedPositionsWhereItsNeeded(parserState)
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
        undefineOnlyLastMentionedUnitPosition(parserState)
      }
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  addUnitPositionScenarios(scenarios, 'slur finishes after unit', 2, { measure: true, stave: true })
  scenarios['slur finishes after above|below unit'] = {
    requiredCommandProgression: 'slur finishes after unit',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isAboveBelowOverUnder(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const slurMarkKey = `slur-${parserState.numberOfSlurs}`
      const slurDirection = directionByAboveBelowOverUnder(tokenValues)
      addDirectionToSlurMarkByKey(parserState, slurMarkKey, slurDirection)
      parserState.lastSShapeSlurPartDirection = slurDirection
      parserState.lastSlurDirection = slurDirection
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
  scenarios['slur starts at unit'] = {
    requiredCommandProgression: 'slur',
    prohibitedCommandProgressions: [ 'slur finishes at unit', 'slur finishes after unit', 'slur starts after unit' ],
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
        const chordParamsValue = chordParamsByLastMentionedUnitPositions(parserState)
        if (!chordParamsValue) {
          parserState.errors.push(`unit after command '${argumentsFromMainAction.joinedTokenValuesWithRealDelimiters}' is not found on the line ${argumentsFromMainAction.lineNumber}`)
        } else {
          chordParamsValue.slurMarks = chordParamsValue.slurMarks || []
          const slurMarkKey = `slur-${parserState.numberOfSlurs}`
          const slurMark = {
            key: slurMarkKey
          }
          chordParamsValue.slurMarks.push(slurMark)
          parserState.slurMarkChords[slurMarkKey] = parserState.slurMarkChords[slurMarkKey] || []
          parserState.slurMarkChords[slurMarkKey].push(chordParamsValue)
          addSlurFeaturesIfTheyAreSpecifiedBeforeItsUnitPositions(parserState, slurMarkKey)
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
  addUnitPositionScenarios(scenarios, 'slur starts at unit', 2, { measure: true, stave: true })
  scenarios['slur starts above|below unit'] = {
    requiredCommandProgression: 'slur starts at unit',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isAboveBelowOverUnder(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState.lastSlurDirection = directionByAboveBelowOverUnder(tokenValues)
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
  scenarios['slur finishes at unit'] = {
    requiredCommandProgression: 'slur',
    prohibitedCommandProgressions: [ 'slur finishes at unit' ],
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
        if (!chordParamsValue) {
          parserState.errors.push(`unit after command '${argumentsFromMainAction.joinedTokenValuesWithRealDelimiters}' is not found on the line ${argumentsFromMainAction.lineNumber}`)
        } else {
          chordParamsValue.slurMarks = chordParamsValue.slurMarks || []
          const slurMarkKey = `slur-${parserState.numberOfSlurs}`
          removeSlurMarksThatFinishFromChordsParamsByKeyAndSlurMarksFromCurrentChordParamsThatDontFinishByKey(parserState, slurMarkKey, chordParamsValue)
          parserState.slurMarkChords[slurMarkKey] = parserState.slurMarkChords[slurMarkKey] || []
          if (parserState.slurMarkChords[slurMarkKey].length > 0) {
            const slurMark = {
              key: slurMarkKey,
              finish: true
            }
            if (parserState.lastSShapeSlurPartDirection) {
              slurMark.direction = parserState.lastSShapeSlurPartDirection
              parserState.lastSShapeSlurPartDirection = undefined
            }
            chordParamsValue.slurMarks.push(slurMark)
            parserState.slurMarkChords[slurMarkKey].push(chordParamsValue)
            addSlurFeaturesIfTheyAreSpecifiedBeforeItsUnitPositions(parserState, slurMarkKey)
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
  addUnitPositionScenarios(scenarios, 'slur finishes at unit', 2, { measure: true, stave: true })
  scenarios['slur finishes above|below unit'] = {
    requiredCommandProgression: 'slur finishes at unit',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isAboveBelowOverUnder(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState.lastSShapeSlurPartDirection = directionByAboveBelowOverUnder(tokenValues)
      parserState.lastSlurDirection = parserState.lastSShapeSlurPartDirection
      if (parserState.applyHighlighting) {
        // no highlights needed
        parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimiters
      )
    }
  }
  scenarios['slur direction'] = {
    requiredCommandProgression: 'slur',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isDirection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const slurMarkKey = `slur-${parserState.numberOfSlurs}`
      const slurDirection = direction(tokenValues)
      addDirectionToSlurMarkByKey(parserState, slurMarkKey, slurDirection)
      parserState.lastSlurDirection = slurDirection
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="${slurMarkKey}">${joinedTokenValuesWithRealDelimiters}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimiters
      )
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['slur above or below'] = {
    requiredCommandProgression: 'slur',
    prohibitedCommandProgressions: [
      'slur starts before unit',
      'slur finishes after unit',
      'slur starts at unit',
      'slur finishes at unit',
      'slur goes through unit'
    ],
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isAboveBelowOverUnder(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const slurMarkKey = `slur-${parserState.numberOfSlurs}`
      const slurDirection = directionByAboveBelowOverUnder(tokenValues)
      addDirectionToSlurMarkByKey(parserState, slurMarkKey, slurDirection)
      parserState.lastSlurDirection = slurDirection
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="${slurMarkKey}">${joinedTokenValuesWithRealDelimiters}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimiters
      )
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['slur roundness'] = {
    requiredCommandProgression: 'slur',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isRoundness(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const slurMarkKey = `slur-${parserState.numberOfSlurs}`
      const roundnessValue = roundness(tokenValues)
      addRoundnessToSlurMarkByKey(parserState, slurMarkKey, roundnessValue)
      parserState.lastSlurRoundness = roundnessValue
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedNumber = joinedTokenValuesWithRealDelimiters.replace(
          regexps.roundnessHighlight, (match) => {
            return `<span class="th" ref-id="${slurMarkKey}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="${slurMarkKey}">${joinedTokenValuesWithRealDelimitersWithHighlightedNumber}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedNumber = joinedTokenValuesWithRealDelimiters.replace(
        regexps.roundnessHighlight, (match) => {
          return `<span class="th">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedNumber
      )
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['slur goes through unit'] = {
    requiredCommandProgression: 'slur',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.changesStaveOrGoesThrough.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="th">${joinedTokenValuesWithRealDelimiters}`
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
          chordParamsValue.slurMarks = chordParamsValue.slurMarks || []
          const slurMarkKey = `slur-${parserState.numberOfSlurs}`
          parserState.slurMarkChords[slurMarkKey] = parserState.slurMarkChords[slurMarkKey] || []
          const slurMark = {
            key: slurMarkKey
          }
          if (parserState.lastSShapeSlurPartDirection) {
            slurMark.direction = parserState.lastSShapeSlurPartDirection
            parserState.lastSShapeSlurPartDirection = undefined
          }
          chordParamsValue.slurMarks.push(slurMark)
          parserState.slurMarkChords[slurMarkKey].push(chordParamsValue)
          addSlurFeaturesIfTheyAreSpecifiedBeforeItsUnitPositions(parserState, slurMarkKey)
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
  scenarios['slur goes through above|below unit'] = {
    requiredCommandProgression: 'slur goes through unit',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    onTheSameLineAsPrevScenario: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isAboveBelowOverUnder(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState.lastSShapeSlurPartDirection = directionByAboveBelowOverUnder(tokenValues)
      if (parserState.applyHighlighting) {
        // no highlights needed
        parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      // no highlights needed
      parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  addUnitPositionScenarios(scenarios, 'slur goes through unit', 2, { measure: true, stave: true })
  scenarios['slur left point'] = {
    requiredCommandProgression: 'slur',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.leftPoint.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const slurMarkKey = `slur-${parserState.numberOfSlurs}`
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="${slurMarkKey}">${joinedTokenValuesWithRealDelimiters}`
        )
      }
    },
    itIsNewCommandProgressionFromLevel: 1,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimiters
      )
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  scenarios['slur left point vertical correction'] = {
    requiredCommandProgression: 'slur left point',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    onTheSameLineAsPrevScenario: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isVerticalCorrection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const slurMarkKey = `slur-${parserState.numberOfSlurs}`
      const verticalCorrectionValue = verticalCorrection(tokenValues)
      addLeftYCorrectionToSlurMarkByKey(parserState, slurMarkKey, verticalCorrectionValue)
      parserState.lastSlurLeftYCorrection = verticalCorrectionValue
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedNumber = joinedTokenValuesWithRealDelimiters.replace(
          regexps.verticalCorrectionHighlight, (match) => {
            return `<span class="th" ref-id="${slurMarkKey}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="${slurMarkKey}">${joinedTokenValuesWithRealDelimitersWithHighlightedNumber}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedNumber = joinedTokenValuesWithRealDelimiters.replace(
        regexps.verticalCorrectionHighlight, (match) => {
          return `<span class="th">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedNumber
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['slur right point'] = {
    requiredCommandProgression: 'slur',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.rightPoint.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const slurMarkKey = `slur-${parserState.numberOfSlurs}`
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="${slurMarkKey}">${joinedTokenValuesWithRealDelimiters}`
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
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  scenarios['slur right point vertical correction'] = {
    requiredCommandProgression: 'slur right point',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    onTheSameLineAsPrevScenario: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isVerticalCorrection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const slurMarkKey = `slur-${parserState.numberOfSlurs}`
      const verticalCorrectionValue = verticalCorrection(tokenValues)
      addRightYCorrectionToSlurMarkByKey(parserState, slurMarkKey, verticalCorrectionValue)
      parserState.lastSlurRightYCorrection = verticalCorrectionValue
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedNumber = joinedTokenValuesWithRealDelimiters.replace(
          regexps.verticalCorrectionHighlight, (match) => {
            return `<span class="th" ref-id="${slurMarkKey}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="${slurMarkKey}">${joinedTokenValuesWithRealDelimitersWithHighlightedNumber}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedNumber = joinedTokenValuesWithRealDelimiters.replace(
        regexps.verticalCorrectionHighlight, (match) => {
          return `<span class="th">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedNumber
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['slur right point attached to middle of stem'] = {
    requiredCommandProgression: 'slur right point',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    onTheSameLineAsPrevScenario: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.attachedToMiddleOfStem.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const slurMarkKey = `slur-${parserState.numberOfSlurs}`
      const placementValue = 'middleStem'
      addRightPointPlacementToSlurMarkByKey(parserState, slurMarkKey, placementValue)
      parserState.lastSlurRightPointPlacement = placementValue
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="${slurMarkKey}">${joinedTokenValuesWithRealDelimiters}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimiters
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['slur right point attached to note body'] = {
    requiredCommandProgression: 'slur right point',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    onTheSameLineAsPrevScenario: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.attachedToNoteBody.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const slurMarkKey = `slur-${parserState.numberOfSlurs}`
      const placementValue = 'noteBody'
      addRightPointPlacementToSlurMarkByKey(parserState, slurMarkKey, placementValue)
      parserState.lastSlurRightPointPlacement = placementValue
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="${slurMarkKey}">${joinedTokenValuesWithRealDelimiters}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimiters
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['slur with s shape'] = {
    requiredCommandProgression: 'slur',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withSShape.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const slurMarkKey = `slur-${parserState.numberOfSlurs}`
      addSShapeToSlurMarkByKey(parserState, slurMarkKey)
      parserState.lastSlurWithSShape = true
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="${slurMarkKey}">${joinedTokenValuesWithRealDelimiters}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimiters
      )
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  addLineMeasureStaveVoicePositionScenarios(
    scenarios,
    'slur',
    [
      'slur starts before unit',
      'slur finishes after unit',
      'slur starts at unit',
      'slur finishes at unit',
      'slur goes through unit',
      'slur left point',
      'slur right point'
    ],
    1,
    true,
    { line: true, measure: true, stave: true, voice: true }
  )
}
