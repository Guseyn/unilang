'use strict'

import regexps from './static-objects/regexps.js'
import foundNextTokenValueOnTheLine from './token/foundNextTokenValueOnTheLine.js'
import foundNextTokenValuesOnTheLine from './token/foundNextTokenValuesOnTheLine.js'
import withNumbersInsteadOfWords from './token/withNumbersInsteadOfWords.js'
import isVerticalCorrection from './token/isVerticalCorrection.js'
import verticalCorrection from './token/verticalCorrection.js'
import isHorizontalCorrection from './token/isHorizontalCorrection.js'
import horizontalCorrection from './token/horizontalCorrection.js'
import isDirection from './token/isDirection.js'
import isStaveIndex from './token/isStaveIndex.js'
import direction from './token/direction.js'
import staveIndexByTokens from './token/staveIndexByTokens.js'
import isRoundness from './token/isRoundness.js'
import roundness from './token/roundness.js'
import isAboveBelowOverUnderStaveLines from './token/isAboveBelowOverUnderStaveLines.js'
import isAboveBelowOverUnder from './token/isAboveBelowOverUnder.js'
import directionByAboveBelowOverUnderStaveLines from './token/directionByAboveBelowOverUnderStaveLines.js'
import directionByAboveBelowOverUnder from './token/directionByAboveBelowOverUnder.js'
import isMeasureNumber from './token/isMeasureNumber.js'
import measureNumber from './token/measureNumber.js'
import isNumberOfStrokes from './token/isNumberOfStrokes.js'
import numberOfStrokes from './token/numberOfStrokes.js'
import isNumberOfTimes from './token/isNumberOfTimes.js'
import numberOfTimes from './token/numberOfTimes.js'
import restPositionNumberByRestPositionName from './page-schema/restPositionNumberByRestPositionName.js'
import initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll from './page-schema/initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll.js'
import initNewStaveParamsIfThereIsAlreadySuchStavePropertyOrNoStavesAtAll from './page-schema/initNewStaveParamsIfThereIsAlreadySuchStavePropertyOrNoStavesAtAll.js'
import initNewVoiceParamsIfThereIsNoVoicesAtAllAndInitNewChordParamsIfThereIsAlreadySuchChordProperty from './page-schema/initNewVoiceParamsIfThereIsNoVoicesAtAllAndInitNewChordParamsIfThereIsAlreadySuchChordProperty.js'
import lastMeasureParams from './page-schema/lastMeasureParams.js'
import lastStaveParams from './page-schema/lastStaveParams.js'
import lastVoiceParams from './page-schema/lastVoiceParams.js'
import lastNonSimileChordParams from './page-schema/lastNonSimileChordParams.js'
import lastNoteParams from './page-schema/lastNoteParams.js'
import lastKeyParams from './page-schema/lastKeyParams.js'
import lastArticulationParams from './page-schema/lastArticulationParams.js'
import lastGlissandoMark from './page-schema/lastGlissandoMark.js'
import lastLyric from './page-schema/lastLyric.js'
import keySignatureThatUserMeant from './page-schema/keySignatureThatUserMeant.js'
import noteDurations from './static-objects/noteDurations.js'
import stavePositions from './static-objects/stavePositions.js'
import noteKeys from './static-objects/noteKeys.js'
import breathMarks from './static-objects/breathMarks.js'
import clefs from './static-objects/clefs.js'
import articulations from './static-objects/articulations.js'
import ornamentKeys from './static-objects/ornamentKeys.js'
import theSameScenarioButWithDifferentRequiredCommandProgression from './theSameScenarioButWithDifferentRequiredCommandProgression.js'

const defaultChordDuration = 1 / 4

const addSimileUnitsToPageSchema = (parserState, simileMark, currentNumberOfMeasures, currentNumberOfStaves, currentNumberOfVoices, currentNumberOfUnits) => {
  for (let simileIndex = 0; simileIndex < simileMark.count; simileIndex++) {
    parserState.pageSchema.measuresParams[currentNumberOfMeasures - 1].stavesParams[currentNumberOfStaves - 1].voicesParams[currentNumberOfVoices - 1].splice(
      (currentNumberOfUnits - 1) + simileIndex + 1, 0,
      { notes: [{ positionNumber: (simileMark.yCorrection || 0) + 2.0 }], isSimile: true, simileRefId: `simile-mark-${parserState.numberOfSimileMarks}`, simileCountDown: (simileMark.count - simileIndex), simileYCorrection: simileMark.yCorrection }
    )
  }
}

const CLEF = 'clef'
const NOTE = 'note'

export default function (scenarios) {
  scenarios['note'] = {
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const itIsNote = (
        regexps.noteWithDurationAndOctave.test(tokenValues) ||
        (regexps.rest.test(tokenValues) && currentToken.firstOnTheLine) ||
        regexps.topMidBottomRest.test(tokenValues)
      ) && (
        foundNextTokenValueOnTheLine(
          unitext,
          currentToken.firstCharIndexOfNextToken
        ) !== CLEF
      ) && (
        (progressionOfCommandsFromScenarios.indexOf(NOTE) !== -1) ||
        currentToken.isOnNewLine
      )
      return itIsNote
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll(parserState.pageSchema, 'stavesParams', parserState)
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      initNewStaveParamsIfThereIsAlreadySuchStavePropertyOrNoStavesAtAll(lastMeasureParamsValue, 'voicesParams', parserState)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      initNewVoiceParamsIfThereIsNoVoicesAtAllAndInitNewChordParamsIfThereIsAlreadySuchChordProperty(lastStaveParamsValue, 'notes')
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const chordScopeIsNotActive = !parserState.chordScopeIsActive
      if (chordScopeIsNotActive) {
        lastVoiceParamsValue.push({})
        const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
        const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
        if (parserState.lastStavePosition[currentNumberOfStaves - 1] && parserState.lastStavePosition[currentNumberOfStaves - 1][currentNumberOfVoices - 1]) {
          parserState.lastStavePosition[currentNumberOfStaves - 1][currentNumberOfVoices - 1] = undefined
        }
      }
      const itIsNote = regexps.noteWithDurationAndOctave.test(tokenValues)
      const itIsRest = (regexps.rest.test(tokenValues) && currentToken.firstOnTheLine) || regexps.topMidBottomRest.test(tokenValues)
      let noteDuration
      let noteName
      let octaveNumber
      let positionNumber
      if (itIsNote) {
        const match = regexps.noteWithDurationAndOctave.match(tokenValues)
        if (match[0]) {
          noteDuration = noteDurations[match[0]]
        }
        if (match[1]) {
          noteName = match[1]
        }
        if (match[2]) {
          octaveNumber = match[2]
        }
      } else if (itIsRest) {
        const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
        if (lastChordParamsValue.notes && lastChordParamsValue.notes.length > 0) {
          parserState.chordScopeIsActive = false
          lastVoiceParamsValue.push({})
        }
        const match = regexps.topMidBottomRest.match(tokenValues)
        noteDuration = noteDurations[match[0]]
        positionNumber = restPositionNumberByRestPositionName(match[1])
      }
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = lastVoiceParamsValue.length
      parserState.numberOfUnitsBeforeFinishingDeclaringNewOne = currentNumberOfUnits
      const noteParams = {
        noteName,
        octaveNumber,
        positionNumber
      }
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.notes = lastChordParamsValue.notes || []
      lastChordParamsValue.notes.push(noteParams)
      const currentNumberOfNotes = lastChordParamsValue.notes.length
      noteParams.id = currentNumberOfNotes - 1
      const lastNoteParamsValue = lastNoteParams(lastChordParamsValue)
      if (itIsRest) {
        lastChordParamsValue.isRest = true
      }
      if (noteDuration) {
        lastChordParamsValue.unitDuration = noteDuration
        if (!parserState.lastChordDuration[currentNumberOfStaves - 1]) {
          parserState.lastChordDuration[currentNumberOfStaves - 1] = {}
        }
        parserState.lastChordDuration[currentNumberOfStaves - 1][currentNumberOfVoices - 1] = noteDuration
      } else if (
        parserState.lastChordDuration[currentNumberOfStaves - 1] &&
        parserState.lastChordDuration[currentNumberOfStaves - 1][currentNumberOfVoices - 1]
      ) {
        lastChordParamsValue.unitDuration = parserState.lastChordDuration[currentNumberOfStaves - 1][currentNumberOfVoices - 1]
      } else {
        lastChordParamsValue.unitDuration = defaultChordDuration
        if (!parserState.lastChordDuration[currentNumberOfStaves - 1]) {
          parserState.lastChordDuration[currentNumberOfStaves - 1] = {}
        }
        parserState.lastChordDuration[currentNumberOfStaves - 1][currentNumberOfVoices - 1] = noteDuration
      }
      parserState.keysOfLastNote = []
      if (
        parserState.lastStemDirection[currentNumberOfStaves - 1] &&
        parserState.lastStemDirection[currentNumberOfStaves - 1][currentNumberOfVoices - 1]
      ) {
        lastChordParamsValue.stemDirection = parserState.lastStemDirection[currentNumberOfStaves - 1][currentNumberOfVoices - 1]
      } else {
        if (currentNumberOfVoices === 1) {
          lastChordParamsValue.stemDirection = 'up'
        } else {
          lastChordParamsValue.stemDirection = 'down'
        }
      }
      if (
        parserState.lastStavePosition[currentNumberOfStaves - 1] &&
        parserState.lastStavePosition[currentNumberOfStaves - 1][currentNumberOfVoices - 1]
      ) {
        lastNoteParamsValue.stave = parserState.lastStavePosition[currentNumberOfStaves - 1][currentNumberOfVoices - 1]
      }
      if (
        parserState.lastGhostStatus[currentNumberOfStaves - 1] &&
        parserState.lastGhostStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1]
      ) {
        lastNoteParamsValue.isGhost = true
      }
      if (parserState.applyHighlighting) {
        let elementHighlightRegexp
        if (regexps.noteWithDurationAndOctave.test(tokenValues)) {
          elementHighlightRegexp = regexps.noteWithDurationAndOctaveHighlight
        } else if (regexps.topMidBottomRest.test(tokenValues)) {
          elementHighlightRegexp = regexps.topMidBottomRestHighlight
        }
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          elementHighlightRegexp, (match) => {
            return `<span class="cuph" ref-id="">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
        parserState.indexesInHighlightsHtmlBufferWithNotesDeclarationsOfLastChord.push(parserState.highlightsHtmlBuffer.length - 1)
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      let elementHighlightRegexp
      if (regexps.noteWithDurationAndOctave.test(tokenValues)) {
        elementHighlightRegexp = regexps.noteWithDurationAndOctaveHighlight
      } else if (regexps.topMidBottomRest.test(tokenValues)) {
        elementHighlightRegexp = regexps.topMidBottomRestHighlight
      }
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        elementHighlightRegexp, (match) => {
          return `<span class="cuph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 0,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfNotes = lastChordParamsValue.notes.length
      const indexInHighlightsHtmlBufferWithLastNoteDecalration = parserState.indexesInHighlightsHtmlBufferWithNotesDeclarationsOfLastChord[parserState.indexesInHighlightsHtmlBufferWithNotesDeclarationsOfLastChord.length - 1]
      if (lastChordParamsValue.isRest) {
        if (parserState.applyHighlighting) {
          parserState.highlightsHtmlBuffer[indexInHighlightsHtmlBufferWithLastNoteDecalration] = parserState.highlightsHtmlBuffer[indexInHighlightsHtmlBufferWithLastNoteDecalration].replaceAll(
            'ref-id=""', `ref-id="rest-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}"`
          )
        }
      } else {
        if (parserState.applyHighlighting) {
          parserState.highlightsHtmlBuffer[indexInHighlightsHtmlBufferWithLastNoteDecalration] = parserState.highlightsHtmlBuffer[indexInHighlightsHtmlBufferWithLastNoteDecalration].replaceAll(
            'ref-id=""', `ref-id="note-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfNotes}"`
          )
        }
      }

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
        parserState.lastBeamStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1]['grace'] = false
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

      parserState.indexesInHighlightsHtmlBufferWithNotesDeclarationsOfLastChord.length = 0
      parserState.indexesInHighlightsHtmlBufferWithNotesDeclarationsOfLastChord.length = 0
      if (scenarioNameThatChangedCommandsProgression !== NOTE) {
        parserState.chordScopeIsActive = false
      }
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  scenarios['empty line after note'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    type: 'on empty line',
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return true
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState.chordScopeIsActive = false
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      if (parserState.lastStavePosition[currentNumberOfStaves - 1] && parserState.lastStavePosition[currentNumberOfStaves - 1][currentNumberOfVoices - 1]) {
        parserState.lastStavePosition[currentNumberOfStaves - 1][currentNumberOfVoices - 1] = undefined
      }
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
    },
    itIsNewCommandProgressionFromLevel: 0
  }
  scenarios['note stem direction'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.stemDirection.test(tokenValues) ||
        regexps.directionOfStem.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const firstCommandVariation = regexps.stemDirection.match(tokenValues)
      const secondCommandVariation = regexps.directionOfStem.match(tokenValues)
      const stemDirection = (firstCommandVariation || secondCommandVariation)[0]
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.stemDirection = stemDirection
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = lastVoiceParamsValue.length
      if (!parserState.lastStemDirection[currentNumberOfStaves - 1]) {
        parserState.lastStemDirection[currentNumberOfStaves - 1] = {}
      }
      parserState.lastStemDirection[currentNumberOfStaves - 1][currentNumberOfVoices - 1] = stemDirection
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.stemHighlight, (match) => {
            return `<span class="eh" ref-id="stem-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="stem-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.stemHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['note stave position'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.stavePosition.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const stavePositionName = regexps.stavePosition.match(tokenValues)[0]
      const stavePosition = stavePositions[stavePositionName]
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastNoteParamsValue = lastNoteParams(lastChordParamsValue)
      lastNoteParamsValue.stave = stavePosition
      parserState.keysOfLastNote.forEach(keyParams => {
        keyParams.stave = stavePosition
      })
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
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
  scenarios['note with number of dots'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withNumberOfDots.test(
        withNumbersInsteadOfWords(tokenValues)
      )
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const numberOfDots = regexps.withNumberOfDots.match(
        withNumbersInsteadOfWords(tokenValues)
      )[0] * 1
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.numberOfDots = numberOfDots
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.withNumberOfDotsHighlight, (match, p1, p2) => {
            return `${p1}<span class="eh" ref-id="dots-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${p2}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="dots-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.withNumberOfDotsHighlight, (match, p1, p2) => {
          return `${p1}<span class="eh">${p2}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['dotted note'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.dotted.test(tokenValues) || regexps.withDot.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.numberOfDots = 1
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = regexps.dotted.test(tokenValues)
          ? joinedTokenValuesWithRealDelimiters.replace(
            regexps.dottedHighlight, (match) => {
              return `<span class="eh" ref-id="dots-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
            }
          )
          : joinedTokenValuesWithRealDelimiters.replace(
            regexps.withDotHighlight, (match) => {
              return `<span class="eh" ref-id="dots-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
            }
          )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="dots-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = regexps.dotted.test(tokenValues)
        ? joinedTokenValuesWithRealDelimiters.replace(
          regexps.dottedHighlight, (match) => {
            return `<span class="eh">${match}</span>`
          }
        )
        : joinedTokenValuesWithRealDelimiters.replace(
          regexps.withDotHighlight, (match) => {
            return `<span class="eh">${match}</span>`
          }
        )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['note beamed'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.beamed.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      lastChordParamsValue.beamedWithNext = true
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.beamedHighlight, (match) => {
            return `<span class="eh" ref-id="beam-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="beam-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.beamedHighlight, (match) => {
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
  scenarios['note not beamed'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.notBeamed.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.beamedWithNext = false
      parserState.groupScoreIsActive = false
      parserState.graceGroupScoreIsActive = false
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
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
  scenarios['note beamed with next'] = {
    requiredCommandProgression: 'note beamed',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withNext.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.withNextHighlight, (match) => {
            return `<span class="cuph" ref-id="next-to-unit-connected-with-beam-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="next-to-unit-connected-with-beam-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.withNextHighlight, (match) => {
          return `<span class="cuph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note not beamed with next'] = {
    requiredCommandProgression: 'note not beamed',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withNext.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.withNextHighlight, (match) => {
            return `<span class="cuph" ref-id="next-to-unit-not-connected-with-beam-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="next-to-unit-not-connected-with-beam-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.withNextHighlight, (match) => {
          return `<span class="cuph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note beamed with only primary line'] = {
    requiredCommandProgression: 'note beamed',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withOnlyPrimaryLine.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.beamedWithNextWithJustOneBeam = true
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.withOnlyPrimaryLineHighlight, (match) => {
            return `<span class="eh" ref-id="beam-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="beam-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.withOnlyPrimaryLineHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with key'] = {
    requiredCommandProgression: 'note',
    prohibitedCommandProgressions: [ 'note with turn', 'note with mordent', 'note with trill' ],
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withNoteKey.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastNoteParamsValue = lastNoteParams(lastChordParamsValue)
      const { noteName, octaveNumber, positionNumber, stave } = lastNoteParamsValue
      lastChordParamsValue.keysParams = lastChordParamsValue.keysParams || []
      const keyTypeName = regexps.withNoteKey.match(tokenValues)
      const keyType = noteKeys[keyTypeName]
      const newKeyParams = {
        noteName,
        octaveNumber,
        positionNumber,
        stave,
        keyType
      }
      lastChordParamsValue.keysParams.push(newKeyParams)
      parserState.keysOfLastNote.push(newKeyParams)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfNoteKeys = lastChordParamsValue.keysParams.length
      newKeyParams.id = currentNumberOfNoteKeys - 1
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.withNoteKeyHighlight, (match) => {
            return `<span class="eh" ref-id="note-key-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfNoteKeys}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="note-key-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfNoteKeys}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.withNoteKeyHighlight, (match) => {
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
  scenarios['note with key with parentheses'] = {
    requiredCommandProgression: 'note with key',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withParentheses.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastKeyParamsValue = lastKeyParams(lastChordParamsValue)
      lastKeyParamsValue.withParentheses = true
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfNoteKeys = lastChordParamsValue.keysParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.withParenthesesHighlight, (match) => {
            return `<span class="eh" ref-id="note-key-parentheses-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfNoteKeys}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="note-key-parentheses-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfNoteKeys}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
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
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['note with parentheses'] = {
    requiredCommandProgression: 'note',
    prohibitedCommandProgressions: [ 'note with key' ],
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withParentheses.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const numberOfNotes = lastChordParamsValue.notes.length
      lastChordParamsValue.parentheses = lastChordParamsValue.parentheses || []
      lastChordParamsValue.parentheses.push({
        fromNoteIndex: numberOfNotes - 1,
        toNoteIndex: numberOfNotes - 1,
        id: numberOfNotes - 1
      })
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfNotes = lastChordParamsValue.notes.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.withParenthesesHighlight, (match) => {
            return `<span class="eh" ref-id="note-parentheses-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfNotes}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="note-parentheses-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfNotes}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
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
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['note with text'] = {
    requiredCommandProgression: 'note',
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
        const lastNoteParamsValue = lastNoteParams(lastChordParamsValue)
        const { noteName, octaveNumber, positionNumber, stave } = lastNoteParamsValue
        lastChordParamsValue.keysParams = lastChordParamsValue.keysParams || []
        const keyType = 'noteLetter'
        const textValue = parserState.lastNoteTextValue
        const newKeyParams = {
          noteName,
          octaveNumber,
          positionNumber,
          stave,
          keyType,
          textValue
        }
        lastChordParamsValue.keysParams.push(newKeyParams)
        newKeyParams.id = lastChordParamsValue.keysParams.length - 1
        parserState.keysOfLastNote.push(newKeyParams)
        const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
        const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
        const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
        const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
        if (parserState.applyHighlighting) {
          parserState.highlightsHtmlBuffer[parserState.highlightsHtmlBuffer.length - 1] = parserState.highlightsHtmlBuffer[parserState.highlightsHtmlBuffer.length - 1].replaceAll(
            'ref-id=""', `ref-id="note-key-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${newKeyParams.id + 1}"`
          )
        }
      }
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
      parserState.lastNoteTextValue = undefined
      parserState.lastNoteTextPositionApplicationToNote = undefined
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  scenarios['note with text beside'] = {
    requiredCommandProgression: 'note with text',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.beside.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState.lastNoteTextPositionApplicationToNote = 'beside'
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastNoteParamsValue = lastNoteParams(lastChordParamsValue)
      const { noteName, octaveNumber, positionNumber, stave } = lastNoteParamsValue
      lastChordParamsValue.keysParams = lastChordParamsValue.keysParams || []
      const keyType = 'noteLetter'
      const textValue = parserState.lastNoteTextValue
      const newKeyParams = {
        noteName,
        octaveNumber,
        positionNumber,
        stave,
        keyType,
        textValue
      }
      lastChordParamsValue.keysParams.push(newKeyParams)
      newKeyParams.id = lastChordParamsValue.keysParams.length - 1
      parserState.keysOfLastNote.push(newKeyParams)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer[parserState.highlightsHtmlBuffer.length - 1] = parserState.highlightsHtmlBuffer[parserState.highlightsHtmlBuffer.length - 1].replaceAll(
          'ref-id=""', `ref-id="note-key-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${newKeyParams.id + 1}"`
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="note-key-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${newKeyParams.id + 1}">${joinedTokenValuesWithRealDelimiters}</span>`
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
  scenarios['note with text up or down'] = {
    requiredCommandProgression: 'note with text',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isDirection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState.lastNoteTextPositionApplicationToNote = 'up|down'
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.articulationParams = lastChordParamsValue.articulationParams || []
      const newArticulationParams = {
        name: 'noteLetter',
        direction: direction(tokenValues),
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
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${joinedTokenValuesWithRealDelimiters}</span>`
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
  scenarios['note with text above or below'] = {
    requiredCommandProgression: 'note with text',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isAboveBelowOverUnder(tokenValues) &&
        !regexps.staveWithAndWithoutDelimeter.test(
          [
            foundNextTokenValueOnTheLine(
              unitext, currentToken.firstCharIndexOfNextToken
            )
          ]
        )
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState.lastNoteTextPositionApplicationToNote = 'up|down'
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.articulationParams = lastChordParamsValue.articulationParams || []
      const newArticulationParams = {
        name: 'noteLetter',
        direction: directionByAboveBelowOverUnder(tokenValues),
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
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${joinedTokenValuesWithRealDelimiters}</span>`
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
  scenarios['note with text above or below stave'] = {
    requiredCommandProgression: 'note with text',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isAboveBelowOverUnderStaveLines(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState.lastNoteTextPositionApplicationToNote = 'up|down'
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.articulationParams = lastChordParamsValue.articulationParams || []
      const newArticulationParams = {
        name: 'noteLetter',
        direction: directionByAboveBelowOverUnderStaveLines(tokenValues),
        textValue: parserState.lastNoteTextValue,
        aboveBelowOverUnderStaveLines: true
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
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with text up or down vertical correction'] = {
    requiredCommandProgression: 'note with text up or down',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isVerticalCorrection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastArticulationParamsValue = lastArticulationParams(lastChordParamsValue)
      lastArticulationParamsValue.yCorrection = verticalCorrection(tokenValues)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfArticulations = lastChordParamsValue.articulationParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.verticalCorrectionHighlight, (match) => {
            return `<span class="th" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
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
    itIsNewCommandProgressionFromLevel: 3
  }
  scenarios['note with text above or below vertical correction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with text up or down vertical correction'],
    'note with text above or below'
  )
  scenarios['note with text above or below stave vertical correction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with text up or down vertical correction'],
    'note with text above or below stave'
  )
  scenarios['note is tied with next'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.tiedWithNext.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.tiedWithNext = {}
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.tiedHighlight, (match) => {
            return `<span class="eh" ref-id="tie-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        ).replace(
          regexps.withNextHighlight, (match) => {
            return `<span class="cuph" ref-id="next-to-unit-under-tie-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="tie-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.tiedHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      ).replace(
        regexps.withNextHighlight, (match) => {
          return `<span class="cuph">${match}</span>`
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
  scenarios['note is tied before'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.tiedBefore.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.tiedBefore = {}
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.tiedHighlight, (match) => {
            return `<span class="eh" ref-id="tie-before-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="tie-before-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.tiedHighlight, (match) => {
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
  scenarios['note is tied before measure number'] = {
    requiredCommandProgression: 'note is tied before',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isMeasureNumber(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const measureNumberValue = measureNumber(tokenValues)
      lastChordParamsValue.tiedBeforeMeasure = Object.assign({
        index: measureNumberValue
      }, lastChordParamsValue.tiedBefore)
      lastChordParamsValue.tiedBefore = undefined
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.measureIndexHighlight, (match) => {
            return `<span class="cmph" ref-id="measure-${parserState.numberOfPageLines}-${measureNumberValue}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="measure-${parserState.numberOfPageLines}-${measureNumberValue}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.measureIndexHighlight, (match) => {
          return `<span class="cmph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note is tied after'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.tiedAfter.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.tiedAfter = {}
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.tiedHighlight, (match) => {
            return `<span class="eh" ref-id="tie-after-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="tie-after-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.tiedHighlight, (match) => {
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
  scenarios['note is tied after measure number'] = {
    requiredCommandProgression: 'note is tied after',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isMeasureNumber(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const measureNumberValue = measureNumber(tokenValues)
      lastChordParamsValue.tiedAfterMeasure = Object.assign({
        index: measureNumberValue
      }, lastChordParamsValue.tiedAfter)
      lastChordParamsValue.tiedAfter = undefined
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.measureIndexHighlight, (match) => {
            return `<span class="cmph" ref-id="measure-${parserState.numberOfPageLines}-${measureNumberValue}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="measure-${parserState.numberOfPageLines}-${measureNumberValue}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.measureIndexHighlight, (match) => {
          return `<span class="cmph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note tied with next direction'] = {
    requiredCommandProgression: 'note is tied with next',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isDirection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.tiedWithNext.direction = direction(tokenValues)
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
  scenarios['note tied with next above or below'] = {
    requiredCommandProgression: 'note is tied with next',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isAboveBelowOverUnder(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.tiedWithNext.direction = directionByAboveBelowOverUnder(tokenValues)
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
  scenarios['note tied before direction'] = {
    requiredCommandProgression: 'note is tied before',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isDirection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      if (lastChordParamsValue.tiedBefore) {
        lastChordParamsValue.tiedBefore.direction = direction(tokenValues)
      } else if (lastChordParamsValue.tiedBeforeMeasure) {
        lastChordParamsValue.tiedBeforeMeasure.direction = direction(tokenValues)
      }
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
  scenarios['note tied before above or below'] = {
    requiredCommandProgression: 'note is tied before',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isAboveBelowOverUnder(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      if (lastChordParamsValue.tiedBefore) {
        lastChordParamsValue.tiedBefore.direction = directionByAboveBelowOverUnder(tokenValues)
      } else if (lastChordParamsValue.tiedBeforeMeasure) {
        lastChordParamsValue.tiedBeforeMeasure.direction = directionByAboveBelowOverUnder(tokenValues)
      }
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
  scenarios['note tied after direction'] = {
    requiredCommandProgression: 'note is tied after',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isDirection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      if (lastChordParamsValue.tiedAfter) {
        lastChordParamsValue.tiedAfter.direction = direction(tokenValues)
      } else if (lastChordParamsValue.tiedAfterMeasure) {
        lastChordParamsValue.tiedAfterMeasure.direction = direction(tokenValues)
      }
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
  scenarios['note tied after above or below'] = {
    requiredCommandProgression: 'note is tied after',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isAboveBelowOverUnder(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      if (lastChordParamsValue.tiedAfter) {
        lastChordParamsValue.tiedAfter.direction = directionByAboveBelowOverUnder(tokenValues)
      } else if (lastChordParamsValue.tiedAfterMeasure) {
        lastChordParamsValue.tiedAfterMeasure.direction = directionByAboveBelowOverUnder(tokenValues)
      }
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
  scenarios['note tied with next roundness'] = {
    requiredCommandProgression: 'note is tied with next',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isRoundness(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.tiedWithNext.roundCoefficientFactor = roundness(tokenValues)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.roundnessHighlight, (match) => {
            return `<span class="th" ref-id="tie-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="tie-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.roundnessHighlight, (match) => {
          return `<span class="th">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note tied before roundness'] = {
    requiredCommandProgression: 'note is tied before',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isRoundness(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      if (lastChordParamsValue.tiedBefore) {
        lastChordParamsValue.tiedBefore.roundCoefficientFactor = roundness(tokenValues)
      } else if (lastChordParamsValue.tiedBeforeMeasure) {
        lastChordParamsValue.tiedBeforeMeasure.roundCoefficientFactor = roundness(tokenValues)
      }
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.roundnessHighlight, (match) => {
            return `<span class="th" ref-id="tie-before-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="tie-before-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.roundnessHighlight, (match) => {
          return `<span class="th">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note tied after roundness'] = {
    requiredCommandProgression: 'note is tied after',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isRoundness(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      if (lastChordParamsValue.tiedAfter) {
        lastChordParamsValue.tiedAfter.roundCoefficientFactor = roundness(tokenValues)
      } else if (lastChordParamsValue.tiedAfterMeasure) {
        lastChordParamsValue.tiedAfterMeasure.roundCoefficientFactor = roundness(tokenValues)
      }
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.roundnessHighlight, (match) => {
            return `<span class="th" ref-id="tie-after-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="tie-after-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.roundnessHighlight, (match) => {
          return `<span class="th">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with glissando'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withGlissando.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState.numberOfGlissandos += 1
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const key = `glissando-${parserState.numberOfGlissandos}`
      lastChordParamsValue.glissandoMarks = lastChordParamsValue.glissandoMarks || []
      lastChordParamsValue.glissandoMarks.push({ key })
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.glissandoHighlight, (match) => {
            return `<span class="eh" ref-id="glissando-${parserState.numberOfGlissandos}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="glissando-${parserState.numberOfGlissandos}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.glissandoHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 1,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastGlissandoMarkValue = lastGlissandoMark(lastChordParamsValue)
      if (lastGlissandoMarkValue && !lastGlissandoMarkValue.after && (lastGlissandoMarkValue.afterMeasure === undefined) && !lastGlissandoMarkValue.before && (lastGlissandoMarkValue.beforeMeasure === undefined)) {
        lastGlissandoMarkValue.after = true
      }
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  scenarios['note with glissando direction'] = {
    requiredCommandProgression: 'note with glissando',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isDirection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastGlissandoMarkValue = lastGlissandoMark(lastChordParamsValue)
      lastGlissandoMarkValue.direction = direction(tokenValues)
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
  scenarios['note with glissando after'] = {
    requiredCommandProgression: 'note with glissando',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.after.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastGlissandoMarkValue = lastGlissandoMark(lastChordParamsValue)
      lastGlissandoMarkValue.after = true
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
  scenarios['note with glissando before'] = {
    requiredCommandProgression: 'note with glissando',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.before.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastGlissandoMarkValue = lastGlissandoMark(lastChordParamsValue)
      lastGlissandoMarkValue.before = true
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
  scenarios['note with glissando after measure number'] = {
    requiredCommandProgression: 'note with glissando after',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isMeasureNumber(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastGlissandoMarkValue = lastGlissandoMark(lastChordParamsValue)
      const measureNumberValue = measureNumber(tokenValues)
      lastGlissandoMarkValue.afterMeasure = measureNumberValue
      lastGlissandoMarkValue.after = false
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.measureIndexHighlight, (match) => {
            return `<span class="cmph" ref-id="measure-${parserState.numberOfPageLines}-${measureNumberValue}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="glissando-${parserState.numberOfGlissandos}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.measureIndexHighlight, (match) => {
          return `<span class="cmph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with glissando before measure number'] = {
    requiredCommandProgression: 'note with glissando before',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isMeasureNumber(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastGlissandoMarkValue = lastGlissandoMark(lastChordParamsValue)
      const measureNumberValue = measureNumber(tokenValues)
      lastGlissandoMarkValue.beforeMeasure = measureNumberValue
      lastGlissandoMarkValue.after = false
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.measureIndexHighlight, (match) => {
            return `<span class="cmph" ref-id="measure-${parserState.numberOfPageLines}-${measureNumberValue}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="glissando-${parserState.numberOfGlissandos}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.measureIndexHighlight, (match) => {
          return `<span class="cmph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note is rest'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.isRest.test(tokenValues) && !currentToken.firstOnTheLine
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.isRest = true
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.restHighlight, (match) => {
            return `<span class="eh" ref-id="rest-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="rest-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.restHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['note is ghost'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.isGhost.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastNoteParamsValue = lastNoteParams(lastChordParamsValue)
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const chordScopeIsNotActive = !parserState.chordScopeIsActive
      if (chordScopeIsNotActive) {
        if (!parserState.lastGhostStatus[currentNumberOfStaves - 1]) {
          parserState.lastGhostStatus[currentNumberOfStaves - 1] = {}
        }
        parserState.lastGhostStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1] = true
      }
      lastNoteParamsValue.isGhost = true
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
  scenarios['note is not ghost'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.isNotGhost.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastNoteParamsValue = lastNoteParams(lastChordParamsValue)
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const chordScopeIsNotActive = !parserState.chordScopeIsActive
      if (chordScopeIsNotActive) {
        if (!parserState.lastGhostStatus[currentNumberOfStaves - 1]) {
          parserState.lastGhostStatus[currentNumberOfStaves - 1] = {}
        }
        parserState.lastGhostStatus[currentNumberOfStaves - 1][currentNumberOfVoices - 1] = false
      }
      lastNoteParamsValue.isGhost = false
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
  scenarios['note is grace'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.isGrace.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.isGrace = true
      if (regexps.isGrace.match(tokenValues)[0]) {
        lastChordParamsValue.hasGraceCrushLine = true
      }
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
  scenarios['note with crushed grace'] = {
    requiredCommandProgression: 'note is grace',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withCrushLine.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.hasGraceCrushLine = true
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.crushLineHighlight, (match) => {
            return `<span class="eh" ref-id="grace-crush-line-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="grace-crush-line-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.crushLineHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['note is centralized'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.isCentralized.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.isFullMeasure = true
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
  scenarios['note with breath mark before'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withBreathMarkBefore.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const breathMarkTypeName = regexps.withBreathMarkBefore.match(tokenValues)[0]
      const breathMarkType = breathMarks[breathMarkTypeName]
      lastChordParamsValue.breathMarkBefore = {
        type: breathMarkType
      }
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.withBreathMarkBeforeHighlight, (match) => {
            return `<span class="eh" ref-id="breath-mark-before-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="breath-mark-before-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.withBreathMarkBeforeHighlight, (match) => {
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
  scenarios['note with breath mark before vertical correction'] = {
    requiredCommandProgression: 'note with breath mark before',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isVerticalCorrection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.breathMarkBefore.yCorrection = verticalCorrection(tokenValues)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedNumber = joinedTokenValuesWithRealDelimiters.replace(
          regexps.verticalCorrectionHighlight, (match) => {
            return `<span class="th" ref-id="breath-mark-before-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="breath-mark-before-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedNumber}</span>`
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
  scenarios['note with key signature before'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withKeySignatureBefore.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const keySignatureName = regexps.withKeySignatureBefore.match(tokenValues)[0]
      lastChordParamsValue.keySignatureBefore = keySignatureThatUserMeant(keySignatureName)
      if (parserState.lastKeySignatureName) {
        parserState.lastKeySignatureName = lastChordParamsValue.keySignatureBefore
        parserState.lastKeySignatureNameForEachLineId += 1
      }
      if (!lastChordParamsValue.clefBefore) {
        lastChordParamsValue.clefBefore = parserState.lastClef[currentNumberOfStaves - 1] || 'treble'
      }
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.keySignatureHighlight, (match) => {
            return `<span class="eh" ref-id="key-signature-before-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        const joinedTokenValuesWithRealDelimitersWithHighlightedElementAndString = joinedTokenValuesWithRealDelimitersWithHighlightedElement.replace(
          regexps.keySignatureNameHighlight, (match) => {
            return `<span class="sth" ref-id="key-signature-before-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="key-signature-before-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElementAndString}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.keySignatureHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      const joinedTokenValuesWithRealDelimitersWithHighlightedElementAndString = joinedTokenValuesWithRealDelimitersWithHighlightedElement.replace(
        regexps.keySignatureNameHighlight, (match) => {
          return `<span class="sth">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElementAndString
      )
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['note with clef before'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withClefBefore.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const clefName = regexps.withClefBefore.match(tokenValues)[0]
      const clef = clefs[clefName]
      lastChordParamsValue.clefBefore = clef
      parserState.lastClef[currentNumberOfStaves - 1] = clef
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.clefHighlight, (match) => {
            return `<span class="eh" ref-id="clef-before-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="clef-before-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
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
  scenarios['note with clef and key signature before'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withClefAndKeySignatureBefore.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const match = regexps.withClefAndKeySignatureBefore.match(tokenValues)
      const clefName = match[0]
      const clef = clefs[clefName]
      const keySignatureName = match[1]
      const keySignature = keySignatureThatUserMeant(keySignatureName)
      lastChordParamsValue.clefBefore = clef
      lastChordParamsValue.keySignatureBefore = keySignature
      parserState.lastClef[currentNumberOfStaves - 1] = clef
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.keySignatureHighlight, (match) => {
            return `<span class="eh" ref-id="key-signature-before-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        ).replace(
          regexps.clefHighlight, (match) => {
            return `<span class="eh" ref-id="clef-before-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        const joinedTokenValuesWithRealDelimitersWithHighlightedElementAndString = joinedTokenValuesWithRealDelimitersWithHighlightedElement.replace(
          regexps.keySignatureNameHighlight, (match) => {
            return `<span class="sth" ref-id="key-signature-before-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="key-signature-before-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElementAndString}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.keySignatureHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      ).replace(
        regexps.clefHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      const joinedTokenValuesWithRealDelimitersWithHighlightedElementAndString = joinedTokenValuesWithRealDelimitersWithHighlightedElement.replace(
        regexps.keySignatureNameHighlight, (match) => {
          return `<span class="sth">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElementAndString
      )
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['note with articulation'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withArticulation.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const match = regexps.withArticulation.match(tokenValues)
      const articulationName = articulations[match[0]]
      lastChordParamsValue.articulationParams = lastChordParamsValue.articulationParams || []
      const newArticulation = {
        name: articulationName
      }
      lastChordParamsValue.articulationParams.push(newArticulation)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfArticulations = lastChordParamsValue.articulationParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.withArticulationHighlight, (match) => {
            return `<span class="eh" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.withArticulationHighlight, (match) => {
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
  scenarios['note with turn'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withTurn.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const articulationName = 'turn'
      lastChordParamsValue.articulationParams = lastChordParamsValue.articulationParams || []
      const newArticulation = {
        name: articulationName
      }
      lastChordParamsValue.articulationParams.push(newArticulation)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfArticulations = lastChordParamsValue.articulationParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.withTurnHighlight, (match) => {
            return `<span class="eh" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.withTurnHighlight, (match) => {
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
  scenarios['note with mordent'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withMordent.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const articulationName = 'mordent'
      lastChordParamsValue.articulationParams = lastChordParamsValue.articulationParams || []
      const newArticulation = {
        name: articulationName
      }
      lastChordParamsValue.articulationParams.push(newArticulation)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfArticulations = lastChordParamsValue.articulationParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.withMordentHighlight, (match) => {
            return `<span class="eh" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.withMordentHighlight, (match) => {
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
  scenarios['note with trill'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withTrill.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const articulationName = 'trill'
      lastChordParamsValue.articulationParams = lastChordParamsValue.articulationParams || []
      const newArticulation = {
        name: articulationName
      }
      lastChordParamsValue.articulationParams.push(newArticulation)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfArticulations = lastChordParamsValue.articulationParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.withTrillHighlight, (match) => {
            return `<span class="eh" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.withTrillHighlight, (match) => {
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
  scenarios['note with articulation direction'] = {
    requiredCommandProgression: 'note with articulation',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isDirection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastArticulationParamsValue = lastArticulationParams(lastChordParamsValue)
      lastArticulationParamsValue.direction = direction(tokenValues)
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
  scenarios['note with turn direction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with articulation direction'], 'note with turn'
  )
  scenarios['note with mordent direction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with articulation direction'], 'note with mordent'
  )
  scenarios['note with trill direction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with articulation direction'], 'note with trill'
  )
  scenarios['note with articulation above or below'] = {
    requiredCommandProgression: 'note with articulation',
    onTheSameLineAsPrevScenario: true,
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
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastArticulationParamsValue = lastArticulationParams(lastChordParamsValue)
      lastArticulationParamsValue.direction = directionByAboveBelowOverUnder(tokenValues)
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
  scenarios['note with turn above or below'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with articulation above or below'], 'note with turn'
  )
  scenarios['note with mordent above or below'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with articulation above or below'], 'note with mordent'
  )
  scenarios['note with trill above or below'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with articulation above or below'], 'note with trill'
  )
  scenarios['note with articulation above or below stave'] = {
    requiredCommandProgression: 'note with articulation',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isAboveBelowOverUnderStaveLines(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastArticulationParamsValue = lastArticulationParams(lastChordParamsValue)
      lastArticulationParamsValue.direction = directionByAboveBelowOverUnderStaveLines(tokenValues)
      lastArticulationParamsValue.aboveBelowOverUnderStaveLines = true
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
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with turn above or below stave'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with articulation above or below stave'], 'note with turn'
  )
  scenarios['note with mordent above or below stave'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with articulation above or below stave'], 'note with mordent'
  )
  scenarios['note with trill above or below stave'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with articulation above or below stave'], 'note with trill'
  )
  scenarios['note with turn key above or below'] = {
    requiredCommandProgression: 'note with turn',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withOrnamentKeyAboveBelowOverUnder.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastArticulationParamsValue = lastArticulationParams(lastChordParamsValue)
      const match = regexps.withOrnamentKeyAboveBelowOverUnder.match(tokenValues)
      const ornamentKeyName = ornamentKeys[match[0]]
      const ornamentKeyPosition = match[1]
      let ornamentKeyPositionValue
      if (ornamentKeyPosition === 'above' || ornamentKeyPosition === 'over') {
        lastArticulationParamsValue.keyAbove = ornamentKeyName
        ornamentKeyPositionValue = 'above'
      } else if (ornamentKeyPosition === 'below' || ornamentKeyPosition === 'under') {
        lastArticulationParamsValue.keyBelow = ornamentKeyName
        ornamentKeyPositionValue = 'below'
      }
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfArticulations = lastChordParamsValue.articulationParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.ornamentKeyHighlight, (match) => {
            return `<span class="eh" ref-id="articulation-key-${ornamentKeyPositionValue}-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="articulation-key-${ornamentKeyPositionValue}-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.ornamentKeyHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with mordent key above or below'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with turn key above or below'], 'note with mordent'
  )
  scenarios['note with trill key above or below'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with turn key above or below'], 'note with trill'
  )
  scenarios['note with turn after'] = {
    requiredCommandProgression: 'note with turn',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.after.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastArticulationParamsValue = lastArticulationParams(lastChordParamsValue)
      lastArticulationParamsValue.followedAfter = true
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
  scenarios['note with turn inverted'] = {
    requiredCommandProgression: 'note with turn',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.isInverted.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastArticulationParamsValue = lastArticulationParams(lastChordParamsValue)
      lastArticulationParamsValue.inverted = true
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
  scenarios['note with mordent inverted'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with turn inverted'], 'note with mordent'
  )
  scenarios['note with trill with wave after'] = {
    requiredCommandProgression: 'note with trill',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withWaveAfter.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastArticulationParamsValue = lastArticulationParams(lastChordParamsValue)
      lastArticulationParamsValue.withWave = true
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfArticulations = lastChordParamsValue.articulationParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.waveHighlight, (match) => {
            return `<span class="eh" ref-id="articulation-wave-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="articulation-wave-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.waveHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with articulation vertical correction'] = {
    requiredCommandProgression: 'note with articulation',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isVerticalCorrection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastArticulationParamsValue = lastArticulationParams(lastChordParamsValue)
      lastArticulationParamsValue.yCorrection = verticalCorrection(tokenValues)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfArticulations = lastChordParamsValue.articulationParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.verticalCorrectionHighlight, (match) => {
            return `<span class="th" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
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
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with turn vertical correction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with articulation vertical correction'], 'note with turn'
  )
  scenarios['note with mordent vertical correction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with articulation vertical correction'], 'note with mordent'
  )
  scenarios['note with trill vertical correction'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['note with articulation vertical correction'], 'note with trill'
  )
  scenarios['note with chord letter'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withChord.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const chordLetter = regexps.withChord.match(tokenValues)[0]
      lastChordParamsValue.relatedChordLetter = {
        textValue: chordLetter
      }
      if (parserState.lastChordLetterDirection) {
        lastChordParamsValue.relatedChordLetter.direction = parserState.lastChordLetterDirection
      }
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithSplittedParts = joinedTokenValuesWithRealDelimiters.split(regexps.withChordHighlight)
        const joinedTokenValuesWithRealDelimitersFirstPart = joinedTokenValuesWithRealDelimitersWithSplittedParts[0]
        const joinedTokenValuesWithRealDelimitersSecondPart = joinedTokenValuesWithRealDelimitersWithSplittedParts[1]
        const joinedTokenValuesWithRealDelimitersFirstPartWithHighlightedElement = `${joinedTokenValuesWithRealDelimitersFirstPart}<span class="eh" ref-id="chord-letter-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">chord</span>`
        const joinedTokenValuesWithRealDelimitersSecondPartWithHighlightedElement = joinedTokenValuesWithRealDelimitersSecondPart.replace(
          regexps.stringHighlight, (match) => {
            return `<span class="sth" ref-id="chord-letter-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = `${joinedTokenValuesWithRealDelimitersFirstPartWithHighlightedElement}${joinedTokenValuesWithRealDelimitersSecondPartWithHighlightedElement}`
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="chord-letter-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithSplittedParts = joinedTokenValuesWithRealDelimiters.split(regexps.withChordHighlight)
      const joinedTokenValuesWithRealDelimitersFirstPart = joinedTokenValuesWithRealDelimitersWithSplittedParts[0]
      const joinedTokenValuesWithRealDelimitersSecondPart = joinedTokenValuesWithRealDelimitersWithSplittedParts[1]
      const joinedTokenValuesWithRealDelimitersFirstPartWithHighlightedElement = `${joinedTokenValuesWithRealDelimitersFirstPart}<span class="eh">chord</span>`
      const joinedTokenValuesWithRealDelimitersSecondPartWithHighlightedElement = joinedTokenValuesWithRealDelimitersSecondPart.replace(
        regexps.stringHighlight, (match) => {
          return `<span class="sth">${match}</span>`
        }
      )
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = `${joinedTokenValuesWithRealDelimitersFirstPartWithHighlightedElement}${joinedTokenValuesWithRealDelimitersSecondPartWithHighlightedElement}`
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
  scenarios['note with chord letter direction'] = {
    requiredCommandProgression: 'note with chord letter',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isDirection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.relatedChordLetter.direction = direction(tokenValues)
      parserState.lastChordLetterDirection = lastChordParamsValue.relatedChordLetter.direction
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
  scenarios['note with chord letter above or below'] = {
    requiredCommandProgression: 'note with chord letter',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isAboveBelowOverUnder(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      lastChordParamsValue.relatedChordLetter.direction = directionByAboveBelowOverUnder(tokenValues)
      parserState.lastChordLetterDirection = lastChordParamsValue.relatedChordLetter.direction
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="chord-letter-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimiters}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      // no highlights needed
      parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
    },
    itIsNewCommandProgressionFromLevel: 2,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  scenarios['note with chord letter above or below measure'] = {
    requiredCommandProgression: 'note with chord letter above or below',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.measure.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.measureHighlight, (match) => {
            return `<span class="cmph" ref-id="measure-${currentNumberOfMeasures}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="measure-${currentNumberOfMeasures}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.measureHighlight, (match) => {
          return `<span class="cmph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with chord letter vertical correction'] = {
    requiredCommandProgression: 'note with chord letter',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isVerticalCorrection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.relatedChordLetter.yCorrection = verticalCorrection(tokenValues)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.verticalCorrectionHighlight, (match) => {
            return `<span class="th" ref-id="chord-letter-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="chord-letter-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
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
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with octave sign'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const nextTwoTokens = foundNextTokenValuesOnTheLine(
        unitext, currentToken.firstCharIndexOfNextToken, 2
      )
      return regexps.isOctaveOrTwoOctavesHigherOrLower.test(tokenValues) &&
        (nextTwoTokens.indexOf('from') === -1) &&
        (nextTwoTokens.indexOf('starts') === -1) &&
        (nextTwoTokens.indexOf('clef') === -1)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const match = regexps.isOctaveOrTwoOctavesHigherOrLower.match(tokenValues)
      const isTwoOctaves = match[0]
      const octaveSignMainValue = isTwoOctaves ? '15' : '8'
      const octaveSignUpperValue = isTwoOctaves ? 'ma' : 'va'
      const octaveSignDirection = (match[1] === 'up' || match[1] === 'higher') ? 'up' : 'down'
      lastChordParamsValue.articulationParams = lastChordParamsValue.articulationParams || []
      const newArticulation = {
        name: 'octaveSign',
        aboveBelowOverUnderStaveLines: true,
        direction: octaveSignDirection,
        textValue: octaveSignMainValue,
        subTextValue: octaveSignUpperValue
      }
      lastChordParamsValue.articulationParams.push(newArticulation)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfArticulations = lastChordParamsValue.articulationParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.isOctaveOrTwoOctavesHigherOrLowerHighlight, (match) => {
            return `<span class="eh" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
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
  scenarios['note with octave sign vertical correction'] = {
    requiredCommandProgression: 'note with octave sign',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isVerticalCorrection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastArticulationParamsValue = lastArticulationParams(lastChordParamsValue)
      lastArticulationParamsValue.yCorrection = verticalCorrection(tokenValues)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfArticulations = lastChordParamsValue.articulationParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.verticalCorrectionHighlight, (match) => {
            return `<span class="th" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
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
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with tremolo'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withTremolo.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.tremoloParams = {
        type: 'single'
      }
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.withTremoloHighlight, (match) => {
            return `<span class="eh" ref-id="tremolo-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="tremolo-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.withTremoloHighlight, (match) => {
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
  scenarios['note with tremolo with next'] = {
    requiredCommandProgression: 'note with tremolo',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withNext.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.tremoloParams.type = 'withNext'
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.withNextHighlight, (match) => {
            return `<span class="cuph" ref-id="unit-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits + 1}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="unit-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits + 1}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.withNextHighlight, (match) => {
          return `<span class="cuph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with tremolo number of strokes'] = {
    requiredCommandProgression: 'note with tremolo',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isNumberOfStrokes(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.tremoloParams.customNumberOfTremoloStrokes = numberOfStrokes(tokenValues)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.withNumberOfStrokesHighlight, (match) => {
            return `<span class="eh" ref-id="tremolo-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="tremolo-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.withNumberOfStrokesHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['repeat note'] = {
    requiredCommandProgression: 'note',
    prohibitedCommandProgressions: [ 'empty line after note' ],
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.repeat.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      parserState.numberOfSimileMarks += 1
      lastChordParamsValue.simileMark = {
        refId: `simile-mark-${parserState.numberOfSimileMarks}`,
        count: 1,
        finish: true
      }
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.repeatHighlight, (match) => {
            return `<span class="eh" ref-id="simile-mark-${parserState.numberOfSimileMarks}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="simile-mark-${parserState.numberOfSimileMarks}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.repeatHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 1,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      addSimileUnitsToPageSchema(parserState, lastChordParamsValue.simileMark, currentNumberOfMeasures, currentNumberOfStaves, currentNumberOfVoices, currentNumberOfUnits)
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  scenarios['repeat note via simile'] = {
    requiredCommandProgression: 'repeat note',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.viaSimile.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['repeat note number of times'] = {
    requiredCommandProgression: 'repeat note',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isNumberOfTimes(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.simileMark.count = numberOfTimes(tokenValues)
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedNumber = joinedTokenValuesWithRealDelimiters.replace(
          regexps.simileCountHighlight, (match) => {
            return `<span class="cnh" ref-id="simile-mark-${parserState.numberOfSimileMarks}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="simile-mark-${parserState.numberOfSimileMarks}">${joinedTokenValuesWithRealDelimitersWithHighlightedNumber}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedNumber = joinedTokenValuesWithRealDelimiters.replace(
        regexps.simileCountHighlight, (match) => {
          return `<span class="cnh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedNumber
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['repeat note vertical correction'] = {
    requiredCommandProgression: 'repeat note',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isVerticalCorrection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.simileMark.yCorrection = verticalCorrection(tokenValues)
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.verticalCorrectionHighlight, (match) => {
            return `<span class="th" ref-id="simile-mark-${parserState.numberOfSimileMarks}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="simile-mark-${parserState.numberOfSimileMarks}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedNumber = joinedTokenValuesWithRealDelimiters.replace(
        regexps.simileCountHighlight, (match) => {
          return `<span class="th">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedNumber
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with dynamic'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withDynamic.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const dynamicTextValue = regexps.withDynamic.match(tokenValues)[0]
      lastChordParamsValue.articulationParams = lastChordParamsValue.articulationParams || []
      const newArticulationParams = {
        name: 'dynamicMark',
        textValue: dynamicTextValue
      }
      lastChordParamsValue.articulationParams.push(newArticulationParams)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfArticulations = lastChordParamsValue.articulationParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithSplittedParts = joinedTokenValuesWithRealDelimiters.split(regexps.withDynamicHighlight)
        const joinedTokenValuesWithRealDelimitersFirstPart = joinedTokenValuesWithRealDelimitersWithSplittedParts[0]
        const joinedTokenValuesWithRealDelimitersSecondPart = joinedTokenValuesWithRealDelimitersWithSplittedParts[1]
        const joinedTokenValuesWithRealDelimitersFirstPartWithHighlightedElement = `${joinedTokenValuesWithRealDelimitersFirstPart}<span class="eh" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">dynamic</span>`
        const joinedTokenValuesWithRealDelimitersSecondPartWithHighlightedElement = joinedTokenValuesWithRealDelimitersSecondPart.replace(
          regexps.stringHighlight, (match) => {
            return `<span class="sth" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${match}</span>`
          }
        )
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = `${joinedTokenValuesWithRealDelimitersFirstPartWithHighlightedElement}${joinedTokenValuesWithRealDelimitersSecondPartWithHighlightedElement}`
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithSplittedParts = joinedTokenValuesWithRealDelimiters.split(regexps.withDynamicHighlight)
      const joinedTokenValuesWithRealDelimitersFirstPart = joinedTokenValuesWithRealDelimitersWithSplittedParts[0]
      const joinedTokenValuesWithRealDelimitersSecondPart = joinedTokenValuesWithRealDelimitersWithSplittedParts[1]
      const joinedTokenValuesWithRealDelimitersFirstPartWithHighlightedElement = `${joinedTokenValuesWithRealDelimitersFirstPart}<span class="eh">dynamic</span>`
      const joinedTokenValuesWithRealDelimitersSecondPartWithHighlightedElement = joinedTokenValuesWithRealDelimitersSecondPart.replace(
        regexps.stringHighlight, (match) => {
          return `<span class="sth">${match}</span>`
        }
      )
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = `${joinedTokenValuesWithRealDelimitersFirstPartWithHighlightedElement}${joinedTokenValuesWithRealDelimitersSecondPartWithHighlightedElement}`
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
  scenarios['note with dynamic above or below'] = {
    requiredCommandProgression: 'note with dynamic',
    onTheSameLineAsPrevScenario: true,
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
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastArticulationParamsValue = lastArticulationParams(lastChordParamsValue)
      lastArticulationParamsValue.direction = directionByAboveBelowOverUnder(tokenValues)
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
  scenarios['note with dynamic above or below stave'] = {
    requiredCommandProgression: 'note with dynamic',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isAboveBelowOverUnderStaveLines(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastArticulationParamsValue = lastArticulationParams(lastChordParamsValue)
      lastArticulationParamsValue.direction = directionByAboveBelowOverUnderStaveLines(tokenValues)
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
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with dynamic direction'] = {
    requiredCommandProgression: 'note with dynamic',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isDirection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastArticulationParamsValue = lastArticulationParams(lastChordParamsValue)
      lastArticulationParamsValue.direction = direction(tokenValues)
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
  scenarios['note dynamic vertical correction'] = {
    requiredCommandProgression: 'note with dynamic',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isVerticalCorrection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastArticulationParamsValue = lastArticulationParams(lastChordParamsValue)
      lastArticulationParamsValue.yCorrection = verticalCorrection(tokenValues)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfArticulations = lastChordParamsValue.articulationParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.verticalCorrectionHighlight, (match) => {
            return `<span class="th" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfArticulations}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
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
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with lyrics'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withLyrics.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.relatedLyrics = lastChordParamsValue.relatedLyrics || []
      lastChordParamsValue.relatedLyrics.push({})
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfLyrics = lastChordParamsValue.relatedLyrics.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.lyricsHighlight, (match) => {
            return `<span class="eh" ref-id="lyrics-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfLyrics}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="lyrics-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfLyrics}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.lyricsHighlight, (match) => {
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
  scenarios['note with lyrics text value'] = {
    requiredCommandProgression: 'note with lyrics',
    onTheSameLineAsPrevScenario: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.textValue.test(tokenValues, false, true)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastLyricValue = lastLyric(lastChordParamsValue)
      const textValue = regexps.textValue.match(tokenValues)[0]
      lastLyricValue.textValue = textValue
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfLyrics = lastChordParamsValue.relatedLyrics.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedString = joinedTokenValuesWithRealDelimiters.replace(
          regexps.stringHighlight, (match) => {
            return `<span class="sth" ref-id="lyrics-text-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfLyrics}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="lyrics-text-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfLyrics}">${joinedTokenValuesWithRealDelimitersWithHighlightedString}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedString = joinedTokenValuesWithRealDelimiters.replace(
        regexps.stringHighlight, (match) => {
          return `<span class="sth">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedString
      )
    }
  }
  scenarios['note with lyrics followed by dash'] = {
    requiredCommandProgression: 'note with lyrics',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.followedByDash.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastLyricValue = lastLyric(lastChordParamsValue)
      lastLyricValue.dashAfter = true
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfLyrics = lastChordParamsValue.relatedLyrics.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.dashHighlight, (match) => {
            return `<span class="eh" ref-id="lyrics-dash-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfLyrics}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="lyrics-dash-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfLyrics}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.dashHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    }
  }
  scenarios['note with lyrics where underscore starts'] = {
    requiredCommandProgression: 'note with lyrics',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.underscoreStarts.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastLyricValue = lastLyric(lastChordParamsValue)
      lastLyricValue.underscoreStarts = true
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfLyrics = lastChordParamsValue.relatedLyrics.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.underscoreHighlight, (match) => {
            return `<span class="eh" ref-id="lyrics-underscore-starts-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfLyrics}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="lyrics-underscore-starts-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfLyrics}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.underscoreHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    }
  }
  scenarios['note with lyrics where underscore finishes'] = {
    requiredCommandProgression: 'note with lyrics',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.underscoreFinishes.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastLyricValue = lastLyric(lastChordParamsValue)
      lastLyricValue.underscoreFinishes = true
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfLyrics = lastChordParamsValue.relatedLyrics.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.underscoreHighlight, (match) => {
            return `<span class="eh" ref-id="lyrics-underscore-finishes-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfLyrics}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="lyrics-underscore-finishes-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfLyrics}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.underscoreHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    }
  }
  scenarios['note with lyrics with vertical correction'] = {
    requiredCommandProgression: 'note with lyrics',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isVerticalCorrection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const lastLyricValue = lastLyric(lastChordParamsValue)
      lastLyricValue.yCorrection = verticalCorrection(tokenValues)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      const currentNumberOfLyrics = lastChordParamsValue.relatedLyrics.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedNumber = joinedTokenValuesWithRealDelimiters.replace(
          regexps.verticalCorrectionHighlight, (match) => {
            return `<span class="th" ref-id="lyrics-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfLyrics}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="lyrics-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}-${currentNumberOfLyrics}">${joinedTokenValuesWithRealDelimitersWithHighlightedNumber}</span>`
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
    }
  }
  scenarios['note with pedal'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withPedal.test(tokenValues) &&
        !regexps.release.test(
          [
            foundNextTokenValueOnTheLine(
              unitext,
              currentToken.firstCharIndexOfNextToken
            )
          ]
        )
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState.numberOfPedalMarks += 1
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.pedalMark = {
        key: `pedal-${parserState.numberOfPedalMarks}`,
        textValue: 'Ped.',
        start: true,
        finish: true
      }
      parserState[`lastStartPedalMark-${parserState.numberOfPedalMarks}`] = lastChordParamsValue.pedalMark
      if (regexps.withSustain.test(tokenValues)) {
        lastChordParamsValue.pedalMark.withBrackets = true
        lastChordParamsValue.pedalMark.finish = false
      }
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.withPedalHighlight, (match) => {
            return `<span class="eh" ref-id="pedal-${parserState.numberOfPedalMarks}">${match}</span>`
          }
        ).replace(
          regexps.withSustainHighlight, (match) => {
            return `<span class="eh" ref-id="pedal-line-${parserState.numberOfPedalMarks}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="pedal-${parserState.numberOfPedalMarks}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.withPedalHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      ).replace(
        regexps.withSustainHighlight, (match) => {
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
  scenarios['note with pedal under'] = {
    requiredCommandProgression: 'note with pedal',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.belowUnder.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          joinedTokenValuesWithRealDelimiters
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
  scenarios['note with pedal under stave index'] = {
    requiredCommandProgression: 'note with pedal under',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isStaveIndex(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const staveIndex = staveIndexByTokens(tokenValues, true)
      lastChordParamsValue.pedalMark.underStaveIndex = staveIndex
      const numberOfMeasures = parserState.pageSchema.measuresParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.staveIndexHighlight, (match) => {
            return `<span class="csph" ref-id="stave-${numberOfMeasures}-${staveIndex + 1}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="stave-${numberOfMeasures}-${staveIndex + 1}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.staveIndexHighlight, (match) => {
          return `<span class="csph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 3
  }
  scenarios['note with pedal vertical correction'] = {
    requiredCommandProgression: 'note with pedal',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isVerticalCorrection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.pedalMark.yCorrection = verticalCorrection(tokenValues)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.verticalCorrectionHighlight, (match) => {
            return `<span class="th" ref-id="pedal-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="pedal-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
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
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with pedal text'] = {
    requiredCommandProgression: 'note with pedal',
    prohibitedCommandProgressions: [ 'note with pedal opens with bracket', 'note with pedal before|after' ],
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.text.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.pedalMark.textValue = regexps.text.match(tokenValues)[0]
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedString = joinedTokenValuesWithRealDelimiters.replace(
          regexps.stringHighlight, (match) => {
            return `<span class="sth" ref-id="pedal-text-${parserState.numberOfPedalMarks}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="pedal-text-${parserState.numberOfPedalMarks}">${joinedTokenValuesWithRealDelimitersWithHighlightedString}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedString = joinedTokenValuesWithRealDelimiters.replace(
        regexps.stringHighlight, (match) => {
          return `<span class="sth">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedString
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with pedal opens with bracket'] = {
    requiredCommandProgression: 'note with pedal',
    prohibitedCommandProgressions: [ 'note with pedal text', 'note with pedal before|after' ],
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.opensWithBracket.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.pedalMark.textValue = undefined
      lastChordParamsValue.pedalMark.withBrackets = true
      lastChordParamsValue.pedalMark.finish = false
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedString = joinedTokenValuesWithRealDelimiters.replace(
          regexps.bracketHighlight, (match) => {
            return `<span class="eh" ref-id="pedal-line-${parserState.numberOfPedalMarks}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="pedal-line-${parserState.numberOfPedalMarks}">${joinedTokenValuesWithRealDelimitersWithHighlightedString}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedString = joinedTokenValuesWithRealDelimiters.replace(
        regexps.bracketHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedString
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with pedal before|after'] = {
    requiredCommandProgression: 'note with pedal',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.afterBefore.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const pedalPositionToTheChord = regexps.afterBefore.match(tokenValues)[0]
      if (pedalPositionToTheChord === 'after') {
        lastChordParamsValue.pedalMark.afterUnit = true
      } else if (pedalPositionToTheChord === 'before') {
        lastChordParamsValue.pedalMark.beforeUnit = true
      }
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
  scenarios['note with variable peak'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withVariablePeak.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      if (parserState[`lastStartPedalMark-${parserState.numberOfPedalMarks}`]) {
        parserState[`lastStartPedalMark-${parserState.numberOfPedalMarks}`].finish = false
        parserState[`lastStartPedalMark-${parserState.numberOfPedalMarks}`].withBrackets = true
      }
      lastChordParamsValue.pedalMark = {
        key: `pedal-${parserState.numberOfPedalMarks}`,
        variablePeak: true
      }
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.withVariablePeakHighlight, (match) => {
            return `<span class="eh" ref-id="variable-peak-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="variable-peak-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.withVariablePeakHighlight, (match) => {
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
  scenarios['note with variable peak before|after'] = {
    requiredCommandProgression: 'note with variable peak',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.afterBefore.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const variablePeakPositionToTheChord = regexps.afterBefore.match(tokenValues)[0]
      if (variablePeakPositionToTheChord === 'after') {
        lastChordParamsValue.pedalMark.afterUnit = true
      } else if (variablePeakPositionToTheChord === 'before') {
        lastChordParamsValue.pedalMark.beforeUnit = true
      }
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
  scenarios['note with variable peak text'] = {
    requiredCommandProgression: 'note with variable peak',
    prohibitedCommandProgressions: [ 'note with variable peak before|after' ],
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.text.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.pedalMark.textValue = regexps.text.match(tokenValues)[0]
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedString = joinedTokenValuesWithRealDelimiters.replace(
          regexps.stringHighlight, (match) => {
            return `<span class="sth" ref-id="variable-peak-text-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="variable-peak-text-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedString}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedString = joinedTokenValuesWithRealDelimiters.replace(
        regexps.stringHighlight, (match) => {
          return `<span class="sth">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedString
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with release'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.withRelease.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      if (parserState[`lastStartPedalMark-${parserState.numberOfPedalMarks}`]) {
        parserState[`lastStartPedalMark-${parserState.numberOfPedalMarks}`].finish = false
      }
      lastChordParamsValue.pedalMark = {
        key: `pedal-${parserState.numberOfPedalMarks}`,
        release: true,
        finish: true
      }
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedString = joinedTokenValuesWithRealDelimiters.replace(
          regexps.withReleaseHighlight, (match) => {
            return `<span class="eh" ref-id="release-${parserState.numberOfPedalMarks}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="release-${parserState.numberOfPedalMarks}">${joinedTokenValuesWithRealDelimitersWithHighlightedString}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedString = joinedTokenValuesWithRealDelimiters.replace(
        regexps.withReleaseHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedString
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
  scenarios['note with release before|after'] = {
    requiredCommandProgression: 'note with release',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.afterBefore.test(tokenValues) &&
        !regexps.afterMeasure.test(
          [
            currentToken.value,
            foundNextTokenValueOnTheLine(
              unitext,
              currentToken.firstCharIndexOfNextToken
            )
          ]
        )
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      const releasePositionToTheChord = regexps.afterBefore.match(tokenValues)[0]
      if (releasePositionToTheChord === 'after') {
        lastChordParamsValue.pedalMark.afterUnit = true
      } else if (releasePositionToTheChord === 'before') {
        lastChordParamsValue.pedalMark.beforeUnit = true
      }
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
  scenarios['note with release bracket'] = {
    requiredCommandProgression: 'note with release',
    prohibitedCommandProgressions: [ 'note with release before|after' ],
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.bracket.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.pedalMark.withBrackets = true
      lastChordParamsValue.pedalMark.withBracketClosure = true
      lastChordParamsValue.pedalMark.release = false
      lastChordParamsValue.pedalMark.finish = true
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedString = joinedTokenValuesWithRealDelimiters.replace(
          regexps.bracketHighlight, (match) => {
            return `<span class="eh" ref-id="pedal-line-${parserState.numberOfPedalMarks}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="pedal-line-${parserState.numberOfPedalMarks}">${joinedTokenValuesWithRealDelimitersWithHighlightedString}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedString = joinedTokenValuesWithRealDelimiters.replace(
        regexps.bracketHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedString
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with release at the end of measure'] = {
    requiredCommandProgression: 'note with release',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.atTheEndOfTheMeasure.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.pedalMark.atEndOfMeasure = true
      lastChordParamsValue.pedalMark.finish = true
      if (lastChordParamsValue.pedalMark.withBrackets) {
        lastChordParamsValue.pedalMark.withBracketClosure = true
        lastChordParamsValue.pedalMark.tillEndOfMeasure = true
      }
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedString = joinedTokenValuesWithRealDelimiters.replace(
          regexps.measureHighlight, (match) => {
            return `<span class="cmph" ref-id="measure-${currentNumberOfMeasures}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="measure-${currentNumberOfMeasures}">${joinedTokenValuesWithRealDelimitersWithHighlightedString}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedString = joinedTokenValuesWithRealDelimiters.replace(
        regexps.measureHighlight, (match) => {
          return `<span class="cmph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedString
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  }
  scenarios['note with release after measure'] = {
    requiredCommandProgression: 'note with release',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.afterMeasure.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.pedalMark.atEndOfMeasure = true
      lastChordParamsValue.pedalMark.tillEndOfMeasure = true
      lastChordParamsValue.pedalMark.release = false
      lastChordParamsValue.pedalMark.withBrackets = true
      lastChordParamsValue.pedalMark.withBracketClosure = false
      lastChordParamsValue.pedalMark.finish = false
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedString = joinedTokenValuesWithRealDelimiters.replace(
          regexps.measureHighlight, (match) => {
            return `<span class="cmph" ref-id="measure-${currentNumberOfMeasures}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="measure-${currentNumberOfMeasures}">${joinedTokenValuesWithRealDelimitersWithHighlightedString}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedString = joinedTokenValuesWithRealDelimiters.replace(
        regexps.measureHighlight, (match) => {
          return `<span class="cmph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedString
      )
    },
    itIsNewCommandProgressionFromLevel: 2
  },
  scenarios['note with horizontal correction'] = {
    requiredCommandProgression: 'note',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isHorizontalCorrection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastStaveParamsValue = lastStaveParams(lastMeasureParamsValue)
      const lastVoiceParamsValue = lastVoiceParams(lastStaveParamsValue)
      const lastChordParamsValue = lastNonSimileChordParams(lastVoiceParamsValue)
      lastChordParamsValue.relatedXCorrection = horizontalCorrection(tokenValues)
      const currentNumberOfMeasures = parserState.pageSchema.measuresParams.length
      const currentNumberOfStaves = lastMeasureParamsValue.stavesParams.length
      const currentNumberOfVoices = lastStaveParamsValue.voicesParams.length
      const currentNumberOfUnits = parserState.numberOfUnitsBeforeFinishingDeclaringNewOne
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.horizontalCorrectionHighlight, (match) => {
            return `<span class="th" ref-id="unit-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="articulation-${currentNumberOfMeasures}-${currentNumberOfStaves}-${currentNumberOfVoices}-${currentNumberOfUnits}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.horizontalCorrectionHighlight, (match) => {
          return `<span class="th">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 1
  }
}
