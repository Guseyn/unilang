'use strict'

const theSameScenarioButWithDifferentRequiredCommandProgression = require('./theSameScenarioButWithDifferentRequiredCommandProgression')
const initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll = require('./page-schema/initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll')
const initNewStaveParamsIfThereIsAlreadySuchStavePropertyOrNoStavesAtAll = require('./page-schema/initNewStaveParamsIfThereIsAlreadySuchStavePropertyOrNoStavesAtAll')
const initNewVoiceParamsIfThereIsNoVoicesAtAllAndInitNewChordParamsIfThereIsAlreadySuchChordProperty = require('./page-schema/initNewVoiceParamsIfThereIsNoVoicesAtAllAndInitNewChordParamsIfThereIsAlreadySuchChordProperty')
const lastMeasureParams = require('./page-schema/lastMeasureParams')
const lastStaveParams = require('./page-schema/lastStaveParams')
const lastVoiceParams = require('./page-schema/lastVoiceParams')
const lastNonSimileChordParams = require('./page-schema/lastNonSimileChordParams')
const lastParentheses = require('./page-schema/lastParentheses')
const regexps = require('./static-objects/regexps')
const stavePositions = require('./static-objects/stavePositions')
const isNoteIndex = require('./token/isNoteIndex')
const noteIndexByTokens = require('./token/noteIndexByTokens')
const foundNextTokenValueOnTheLine = require('./token/foundNextTokenValueOnTheLine')
const isDirection = require('./token/isDirection')
const direction = require('./token/direction')
const noteDurations = require('./static-objects/noteDurations')

const defaultChordDuration = 1 / 4

module.exports = (scenarios) => {
  scenarios['chord'] = {
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    startsOnNewLine: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.chordWithDuration.test(tokenValues)
        && !regexps.letters.test(
          [
            foundNextTokenValueOnTheLine(
              unitext, currentToken.firstCharIndexOfNextToken
            )
          ]
        )
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll(parserState.pageSchema, 'stavesParams', parserState)
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      initNewStaveParamsIfThereIsAlreadySuchStavePropertyOrNoStavesAtAll(lastMeasureParamsValue, 'voicesParams', parserState)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      initNewVoiceParamsIfThereIsNoVoicesAtAllAndInitNewChordParamsIfThereIsAlreadySuchChordProperty(lastStaveParamsValue, 'notes')
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const unitDuration = noteDurations[regexps.chordWithDuration.match(tokenValues)[0]]
      lastVoiceParamsValue.push({
        notes: []
      })
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = lastVoiceParamsValue.length
      parserState.numberOfUnitsBeforeFinishingDeclaringNewOne = currentNumberOfUnits
      if (unitDuration) {
        lastChordParamsValue.unitDuration = unitDuration
        if (!parserState.lastChordDuration[currentNumberOfStaves - 1]) {
          parserState.lastChordDuration[currentNumberOfStaves - 1] = {}
        }
        parserState.lastChordDuration[currentNumberOfStaves - 1][currentNumberOfVoices - 1] = unitDuration
      } else if (
        parserState.lastChordDuration[currentNumberOfStaves - 1] &&
        parserState.lastChordDuration[currentNumberOfStaves - 1][currentNumberOfVoices - 1]
      ) {
        lastChordParamsValue.unitDuration = parserState.lastChordDuration[currentNumberOfStaves - 1][currentNumberOfVoices - 1]
      } else {
        lastChordParamsValue.unitDuration = defaultChordDuration
      }
      parserState.chordScopeIsActive = true
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.withChordWithDurationHighlight, (match) => {
            return `<span class="cuph" ref-id="unit-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="unit-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.withChordWithDurationHighlight, (match) => {
          return `<span class="cuph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 0,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      if (scenarioNameThatChangedCommandsProgression !== 'note') {
        parserState.chordScopeIsActive = false
      }

      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      if (!parserState.lastBeamStatus[currentNumberOfStaves - 1]) {
        parserState.lastBeamStatus[currentNumberOfStaves - 1] = {}
      }
      if (!parserState.lastBeamStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1]) {
        parserState.lastBeamStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1] = {
          plain: false,
          grace: false
        }
      }
      if (lastChordParamsValue.unitDuration >= 1 / 4) {
        lastChordParamsValue.beamedWithNext = false
      }
      if (
        lastChordParamsValue.beamedWithNext === false &&
        parserState.lastBeamStatus[currentNumberOfStaves - 1] &&
        parserState.lastBeamStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1] &&
        parserState.lastBeamStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1]['plain'] &&
        !lastChordParamsValue.isGrace
      ) {
        parserState.lastBeamStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1]['plain'] = false
      }
      if (
        lastChordParamsValue.beamedWithNext === false &&
        parserState.lastBeamStatus[currentNumberOfStaves - 1] &&
        parserState.lastBeamStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1] &&
        parserState.lastBeamStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1]['grace'] &&
        lastChordParamsValue.isGrace
      ) {
        parserState.lastBeamStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1]['grace'] = false
      }
      if (
        parserState.lastBeamStatus[currentNumberOfStaves - 1] &&
        parserState.lastBeamStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1] &&
        parserState.lastBeamStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1]['grace'] &&
        !lastChordParamsValue.isGrace
      ) {
        parserState.lastBeamStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1]['grace'] = false
      }
      if (
        parserState.lastBeamStatus[currentNumberOfStaves - 1] &&
        parserState.lastBeamStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1] &&
        parserState.lastBeamStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1]['plain'] &&
        !lastChordParamsValue.isGrace
      ) {
        lastChordParamsValue.beamedWithNext = true
      }
      if (
        parserState.lastBeamStatus[currentNumberOfStaves - 1] &&
        parserState.lastBeamStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1] &&
        parserState.lastBeamStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1]['grace'] &&
        lastChordParamsValue.isGrace
      ) {
        lastChordParamsValue.beamedWithNext = true
      }
      if (
        lastChordParamsValue.beamedWithNext === true &&
        !lastChordParamsValue.isGrace
      ) {
        parserState.lastBeamStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1]['plain'] = true
      }
      if (
        lastChordParamsValue.beamedWithNext === true &&
        lastChordParamsValue.isGrace
      ) {
        parserState.lastBeamStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1]['grace'] = true
      }

      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  scenarios['chord stave position'] = {
    requiredCommandProgression: 'chord',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.stavePosition.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const stavePositionName = regexps.stavePosition.match(tokenValues)[0]
      const stavePosition = stavePositions[stavePositionName]
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      if (!parserState.lastStavePosition[currentNumberOfStaves - 1]) {
        parserState.lastStavePosition[currentNumberOfStaves - 1] = {}
      }
      parserState.lastStavePosition[currentNumberOfStaves - 1][currentNumberOfVoices - 1] = stavePosition
      let stavePositionInRefId = currentNumberOfStaves
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.stavePositionHighlight, (match) => {
            if (stavePositionName === 'next') {
              stavePositionInRefId = currentNumberOfStaves + 1
            } else if (stavePositionName === 'prev') {
              stavePositionInRefId = currentNumberOfStaves - 1
            }
            return `<span class="csph" ref-id="stave-${currentNumberOfMeasures}-${stavePositionInRefId}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="stave-${currentNumberOfMeasures}-${stavePositionInRefId}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.stavePositionHighlight, (match) => {
          return `<span class="csph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['chord with parentheses'] = {
    requiredCommandProgression: 'chord',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withParentheses.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.parentheses = lastChordParamsValue.parentheses || []
      lastChordParamsValue.parentheses.push({
        appliedToWholeUnit: true
      })
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = lastVoiceParamsValue.length
      const currentNumberOfParentheses = lastChordParamsValue.parentheses.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.withParenthesesHighlight, (match) => {
            return `<span class="eh" ref-id="unit-parentheses-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfParentheses}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="unit-parentheses-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfParentheses}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.withParenthesesHighlight, (match) => {
          return `<span class="eh">${match}</span>`
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
  scenarios['chord with parentheses from'] = {
    requiredCommandProgression: 'chord with parentheses',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.from.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="">${joinedTokenValuesWithRealDelimiters}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimiters
      )
    },
    itIsNewCommandProgressionFromLevel: 2,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = lastVoiceParamsValue.length
      if (parserState.applyHighlighting) {
        if (parserState.lastMentionedNoteIndex !== undefined) {
          parserState.highlightsHtmlBuffer[parserState.highlightsHtmlBuffer.length - 2] = parserState.highlightsHtmlBuffer[parserState.highlightsHtmlBuffer.length - 2].replace(
            'ref-id=""', `ref-id="note-with-index-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${parserState.lastMentionedNoteIndex + 1}"`
          )
        }
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  scenarios['chord with parentheses from note index'] = {
    requiredCommandProgression: 'chord with parentheses from',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isNoteIndex(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastChordParenthesesValue = lastParentheses(lastChordParamsValue)
      const noteIndex = noteIndexByTokens(tokenValues, true)
      if (noteIndex !== undefined) {
        lastChordParenthesesValue.appliedToWholeUnit = false
        lastChordParenthesesValue.fromNoteIndex = noteIndex
        parserState.lastMentionedNoteIndex = noteIndex
      }
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = lastVoiceParamsValue.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.noteIndexHighlight, (match) => {
            return `<span class="cuph" ref-id="note-with-index-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${parserState.lastMentionedNoteIndex + 1}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="note-with-index-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${parserState.lastMentionedNoteIndex + 1}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.noteIndexHighlight, (match) => {
          return `<span class="cuph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 3
  }
  scenarios['chord with parentheses to'] = {
    requiredCommandProgression: 'chord with parentheses',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.to.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="">${joinedTokenValuesWithRealDelimiters}`
        )
      }
    },
    itIsNewCommandProgressionFromLevel: 2,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = lastVoiceParamsValue.length
      if (parserState.applyHighlighting) {
        if (parserState.lastMentionedNoteIndex !== undefined) {
          parserState.highlightsHtmlBuffer[parserState.highlightsHtmlBuffer.length - 2] = parserState.highlightsHtmlBuffer[parserState.highlightsHtmlBuffer.length - 2].replace(
            'ref-id=""', `ref-id="note-with-index-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${parserState.lastMentionedNoteIndex + 1}"`
          )
        }
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
  scenarios['chord with parentheses to note index'] = {
    requiredCommandProgression: 'chord with parentheses to',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isNoteIndex(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastChordParenthesesValue = lastParentheses(lastChordParamsValue)
      const noteIndex = noteIndexByTokens(tokenValues, true)
      if (noteIndex !== undefined) {
        lastChordParenthesesValue.appliedToWholeUnit = false
        lastChordParenthesesValue.toNoteIndex = noteIndex
        parserState.lastMentionedNoteIndex = noteIndex
      }
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = lastVoiceParamsValue.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.noteIndexHighlight, (match) => {
            return `<span class="cuph" ref-id="note-with-index-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${parserState.lastMentionedNoteIndex + 1}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="note-with-index-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${parserState.lastMentionedNoteIndex + 1}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.noteIndexHighlight, (match) => {
          return `<span class="cuph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 3
  }
  scenarios['chord is ghost'] = {
    requiredCommandProgression: 'chord',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.isGhost.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      if (!parserState.lastGhostStatus[currentNumberOfStaves - 1]) {
        parserState.lastGhostStatus[currentNumberOfStaves - 1] = {}
      }
      parserState.lastGhostStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1] = true
      if (parserState.applyHighlighting) {
        // no highlights needed
        parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      // no highlights needed
      parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['chord is not ghost'] = {
    requiredCommandProgression: 'chord',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.isNotGhost.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      if (!parserState.lastGhostStatus[currentNumberOfStaves - 1]) {
        parserState.lastGhostStatus[currentNumberOfStaves - 1] = {}
      }
      parserState.lastGhostStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1] = false
      if (parserState.applyHighlighting) {
        // no highlights needed
        parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      // no highlights needed
      parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['chord is arpeggiated'] = {
    requiredCommandProgression: 'chord',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.arpeggiated.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.arpeggiated = { }
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = lastVoiceParamsValue.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.arpeggiatedHighlight, (match) => {
            return `<span class="eh" ref-id="arpeggiated-wave-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="arpeggiated-wave-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.arpeggiatedHighlight, (match) => {
          return `<span class="eh">${match}</span>`
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
  scenarios['chord is arpeggiated with chord below'] = {
    requiredCommandProgression: 'chord is arpeggiated',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withChordBelow.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.arpeggiated.isConnectedWithNextChord = true
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = lastVoiceParamsValue.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.chordHighlight, (match) => {
            return `<span class="cuph" ref-id="unit-arpeggiated-below-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="unit-arpeggiated-below-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.chordHighlight, (match) => {
          return `<span class="cuph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['chord is arpeggiated with arrow'] = {
    requiredCommandProgression: 'chord is arpeggiated',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withArrow.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.arpeggiated.arrow = 'up'
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = lastVoiceParamsValue.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.arrowHighlight, (match) => {
            return `<span class="eh" ref-id="arpeggiated-arrow-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="arpeggiated-arrow-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.arrowHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['chord is arpeggiated with arrow direction'] = {
    requiredCommandProgression: 'chord is arpeggiated with arrow',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isDirection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.arpeggiated.arrow = direction(tokenValues)
      if (parserState.applyHighlighting) {
        // no highlights needed
        parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      // no highlights needed
      parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
    },
    itIsNewCommandProgressionFromLevel: 3
  }
  scenarios['chord with text'] = {
    requiredCommandProgression: 'chord',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withText.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const textValue = regexps.withText.match(tokenValues)[0]
      parserState.lastNoteTextValue = textValue
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedString = joinedTokenValuesWithRealDelimiters.replace(
          regexps.stringHighlight, (match) => {
            return `<span class="sth" ref-id="">${match}</span>`
          }
        )
        const joinedTokenValuesWithRealDelimitersWithHighlightedStringAndElement = joinedTokenValuesWithRealDelimitersWithHighlightedString.replace(
          regexps.withTextHighlight, (match) => {
            return `<span class="eh" ref-id="">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="">${joinedTokenValuesWithRealDelimitersWithHighlightedStringAndElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedString = joinedTokenValuesWithRealDelimiters.replace(
        regexps.stringHighlight, (match) => {
          return `<span class="sth">${match}</span>`
        }
      )
      const joinedTokenValuesWithRealDelimitersWithHighlightedStringAndElement = joinedTokenValuesWithRealDelimitersWithHighlightedString.replace(
        regexps.withTextHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedStringAndElement
      )
    },
    itIsNewCommandProgressionFromLevel: 1,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      if (parserState.lastNoteTextPositionApplicationToNote === undefined) {
        parserState.lastNoteTextPositionApplicationToNote = true
        const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
        const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
        const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
        const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
        lastChordParamsValue.articulationParams = lastChordParamsValue.articulationParams || []
        const newArticulationParams = {
          name: 'noteLetter',
          direction: 'up',
          textValue: parserState.lastNoteTextValue
        }
        lastChordParamsValue.articulationParams.push(newArticulationParams)
        const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
        const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
        const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
        const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
        const currentNumberOfArticulations = lastChordParamsValue.articulationParams.length
        if (parserState.applyHighlighting) {
          parserState.highlightsHtmlBuffer[parserState.highlightsHtmlBuffer.length - 1] = parserState.highlightsHtmlBuffer[parserState.highlightsHtmlBuffer.length - 1].replaceAll(
            'ref-id=""', `ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}"`
          )
        }
        parserState.lastNoteTextPositionApplicationToNote = undefined
      }
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  scenarios['chord with text up or down'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with text up or down'], 'chord with text'
  )
  scenarios['chord with text above or below'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with text above or below'], 'chord with text'
  )
  scenarios['chord with text above or below stave'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with text above or below stave'], 'chord with text'
  )
  scenarios['chord with text up or down vertical correction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with text up or down vertical correction'], 'chord with text up or down'
  )
  scenarios['chord with text above or below vertical correction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with text above or below vertical correction'], 'chord with text above or below'
  )
  scenarios['chord with text above or below stave vertical correction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with text above or below stave vertical correction'], 'chord with text above or below stave'
  )
  scenarios['chord with number of dots'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with number of dots'], 'chord'
  )
  scenarios['dotted chord'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['dotted note'], 'chord'
  )
  scenarios['chord stem direction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note stem direction'], 'chord'
  )
  scenarios['chord beamed'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note beamed'], 'chord'
  )
  scenarios['chord not beamed'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note not beamed'], 'chord'
  )
  scenarios['chord beamed with next'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note beamed with next'], 'chord beamed'
  )
  scenarios['chord not beamed with next'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note not beamed with next'], 'chord not beamed'
  )
  scenarios['chord beamed with only primary line'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note beamed with only primary line'], 'chord beamed'
  )
  scenarios['chord is tied with next'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note is tied with next'], 'chord'
  )
  scenarios['chord is tied before'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note is tied before'], 'chord'
  )
  scenarios['chord is tied before measure number'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note is tied before measure number'], 'chord is tied before'
  )
  scenarios['chord is tied after'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note is tied after'], 'chord'
  )
  scenarios['chord is tied after measure number'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note is tied after measure number'], 'chord is tied after'
  )
  scenarios['chord tied with next direction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note tied with next direction'], 'chord is tied with next'
  )
  scenarios['chord tied with next above or below'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note tied with next above or below'], 'chord is tied with next'
  )
  scenarios['chord tied before direction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note tied before direction'], 'chord is tied before'
  )
  scenarios['chord tied before above or below'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note tied before above or below'], 'chord is tied before'
  )
  scenarios['chord tied after direction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note tied after direction'], 'chord is tied after'
  )
  scenarios['chord tied after above or below'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note tied after above or below'], 'chord is tied after'
  )
  scenarios['chord tied with next roundness'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note tied with next roundness'], 'chord is tied with next'
  )
  scenarios['chord tied before roundness'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note tied before roundness'], 'chord is tied before'
  )
  scenarios['chord tied after roundness'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note tied after roundness'], 'chord is tied after'
  )
  scenarios['chord with glissando'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with glissando'], 'chord'
  )
  scenarios['chord with glissando direction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with glissando direction'], 'chord with glissando'
  )
  scenarios['chord with glissando after'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with glissando after'], 'chord with glissando'
  )
  scenarios['chord with glissando before'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with glissando before'], 'chord with glissando'
  )
  scenarios['chord with glissando after measure number'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with glissando after measure number'], 'chord with glissando after'
  )
  scenarios['chord with glissando before measure number'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with glissando after measure number'], 'chord with glissando before'
  )
  scenarios['chord is grace'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note is grace'], 'chord'
  )
  scenarios['chord with crushed grace'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with crushed grace'], 'chord is grace'
  )
  scenarios['chord is rest'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note is rest'], 'chord'
  )
  scenarios['chord is centralized'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note is centralized'], 'chord'
  )
  scenarios['chord with breath mark before'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with breath mark before'], 'chord'
  )
  scenarios['chord with breath mark before vertical correction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with breath mark before vertical correction'], 'chord with breath mark before'
  )
  scenarios['chord with key signature before'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with key signature before'], 'chord'
  )
  scenarios['chord with clef before'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with clef before'], 'chord'
  )
  scenarios['chord with clef and key signature before'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with clef before'], 'chord'
  )
  scenarios['chord with articulation'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with articulation'], 'chord'
  )
  scenarios['chord with turn'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with turn'], 'chord'
  )
  scenarios['chord with mordent'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with mordent'], 'chord'
  )
  scenarios['chord with trill'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with trill'], 'chord'
  )
  scenarios['chord with articulation direction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with articulation direction'], 'chord with articulation'
  )
  scenarios['chord with turn direction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with turn direction'], 'chord with turn'
  )
  scenarios['chord with mordent direction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with mordent direction'], 'chord with mordent'
  )
  scenarios['chord with trill direction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with trill direction'], 'chord with trill'
  )
  scenarios['chord with articulation above or below'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with articulation above or below'], 'chord with articulation'
  )
  scenarios['chord with turn above or below'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with turn above or below'], 'chord with turn'
  )
  scenarios['chord with mordent above or below'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with mordent above or below'], 'chord with mordent'
  )
  scenarios['chord with trill above or below'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with trill above or below'], 'chord with trill'
  )
  scenarios['chord with articulation above or below stave'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with articulation above or below stave'], 'chord with articulation'
  )
  scenarios['chord with turn above or below stave'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with turn above or below stave'], 'chord with turn'
  )
  scenarios['chord with mordent above or below stave'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with mordent above or below stave'], 'chord with mordent'
  )
  scenarios['chord with trill above or below stave'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with trill above or below stave'], 'chord with trill'
  )
  scenarios['chord with turn key above or below'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with turn key above or below'], 'chord with turn'
  )
  scenarios['chord with mordent key above or below'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with mordent key above or below'], 'chord with mordent'
  )
  scenarios['chord with trill key above or below'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with trill key above or below'], 'chord with trill'
  )
  scenarios['chord with turn after'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with turn after'], 'chord with turn'
  )
  scenarios['chord with turn inverted'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with turn inverted'], 'chord with turn'
  )
  scenarios['chord with trill with wave after'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with trill with wave after'], 'chord with trill'
  )
  scenarios['chord with articulation vertical correction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with articulation vertical correction'], 'chord with articulation'
  )
  scenarios['chord with turn vertical correction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with turn vertical correction'], 'chord with turn'
  )
  scenarios['chord with mordent vertical correction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with mordent vertical correction'], 'chord with mordent'
  )
  scenarios['chord with trill vertical correction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with trill vertical correction'], 'chord with trill'
  )
  scenarios['chord with chord letter'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with chord letter'], 'chord'
  )
  scenarios['chord with chord letter direction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with chord letter direction'], 'chord with chord letter'
  )
  scenarios['chord with chord letter above or below'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with chord letter above or below'], 'chord with chord letter'
  )
  scenarios['chord with chord letter above or below measure'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with chord letter above or below measure'], 'chord with chord letter above or below'
  )
  scenarios['chord with chord letter vertical correction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with chord letter vertical correction'], 'chord with chord letter'
  )
  scenarios['chord with octave sign'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with octave sign'], 'chord'
  )
  scenarios['chord with octave sign vertical correction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with octave sign vertical correction'], 'chord with octave sign'
  )
  scenarios['chord with tremolo'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with tremolo'], 'chord'
  )
  scenarios['chord with tremolo with next'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with tremolo with next'], 'chord with tremolo'
  )
  scenarios['chord with tremolo number of strokes'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with tremolo number of strokes'], 'chord with tremolo'
  )
  scenarios['repeat chord'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['repeat note'], 'chord'
  )
  scenarios['repeat chord via simile'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['repeat note via simile'], 'repeat chord'
  )
  scenarios['repeat chord number of times'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['repeat note number of times'], 'repeat chord'
  )
  scenarios['repeat chord vertical correction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['repeat note vertical correction'], 'repeat chord'
  )
  scenarios['chord with dynamic'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with dynamic'], 'chord'
  )
  scenarios['chord with dynamic direction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with dynamic direction'], 'chord with dynamic'
  )
  scenarios['chord with dynamic above or below'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with dynamic above or below'], 'chord with dynamic'
  )
  scenarios['chord with dynamic above or below stave'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with dynamic above or below stave'], 'chord with dynamic'
  )
  scenarios['chord dynamic vertical correction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note dynamic vertical correction'], 'chord with dynamic'
  )
  scenarios['chord with lyrics'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with lyrics'], 'chord'
  )
  scenarios['chord with lyrics text value'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with lyrics text value'], 'chord with lyrics'
  )
  scenarios['chord with lyrics followed by dash'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with lyrics followed by dash'], 'chord with lyrics'
  )
  scenarios['chord with lyrics where underscore starts'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with lyrics where underscore starts'], 'chord with lyrics'
  )
  scenarios['chord with lyrics where underscore finishes'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with lyrics where underscore finishes'], 'chord with lyrics'
  )
  scenarios['chord with lyrics with vertical correction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with lyrics with vertical correction'], 'chord with lyrics'
  )
  scenarios['chord with pedal'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with pedal'], 'chord'
  )
  scenarios['chord with pedal under'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with pedal under'], 'chord with pedal'
  )
  scenarios['chord with pedal under stave index'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with pedal under stave index'], 'chord with pedal under'
  )
  scenarios['chord with pedal vertical correction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with pedal vertical correction'], 'chord with pedal'
  )
  scenarios['chord with pedal text'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with pedal text'], 'chord with pedal'
  )
  scenarios['chord with pedal opens with bracket'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with pedal opens with bracket'], 'chord with pedal'
  )
  scenarios['chord with pedal before|after'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with pedal before|after'], 'chord with pedal'
  )
  scenarios['chord with variable peak'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with variable peak'], 'chord'
  )
  scenarios['chord with variable peak before|after'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with variable peak before|after'], 'chord with variable peak'
  )
  scenarios['chord with variable peak text'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with variable peak text'], 'chord with variable peak'
  )
  scenarios['chord with release'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with release'], 'chord'
  )
  scenarios['chord with release before|after'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with release before|after'], 'chord with release'
  )
  scenarios['chord with release bracket'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with release bracket'], 'chord with release'
  )
  scenarios['chord with release at the end of measure'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with release at the end of measure'], 'chord with release'
  )
  scenarios['chord with release after measure'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with release after measure'], 'chord with release'
  )
  scenarios['chord with horizontal correction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with horizontal correction'], 'chord'
  )
}
