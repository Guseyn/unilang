'use strict'

import parserScenarios from '#unilang/language/parser/scenarios/parserScenarios.js'
import mapWithScenariosAndScenariosWhereItIsRequired from '#unilang/language/parser/scenarios/mapWithScenariosAndScenariosWhereItIsRequired.js'
const constructedParserScenarios = parserScenarios()
const constructedMapWithScenariosAndScenariosWhereItIsRequired = mapWithScenariosAndScenariosWhereItIsRequired(constructedParserScenarios)

import withoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem from '#unilang/language/parser/scenarios/token/withoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem.js'
import tokenValuesFromTokens from '#unilang/language/parser/scenarios/token/tokenValuesFromTokens.js'
import joinedTokensWithRealDelimiters from '#unilang/language/parser/scenarios/token/joinedTokensWithRealDelimiters.js'

const NEW_LINE_REGEXP = /[\r\n|\r|\n]/
const SPACE_REGEXP = /[\s]/
const EMPTY_STRING = ''
const REGULAR = 'regular'
const ON_EMPTY_LINE = 'on empty line'
const LAST_CHAR = 'last char'
const LAST_LEVEL = 'last level'

/* ──────────────────────────────────────────────────────────────── */
/* Helpers for scenario selection and validation                    */
/* ──────────────────────────────────────────────────────────────── */

const collectScenarioNamesThatFollowProgression = (progressionOfCommandsFromScenarios) => {
  const scenarioNamesThatFollowProgressionOfCommand = []

  if (progressionOfCommandsFromScenarios.length > 0) {
    for (let scenarioNameIndex = 0; scenarioNameIndex < progressionOfCommandsFromScenarios.length; scenarioNameIndex++) {
      const scenarioName = progressionOfCommandsFromScenarios[scenarioNameIndex]
      const scenariosWhereRequired = constructedMapWithScenariosAndScenariosWhereItIsRequired[scenarioName]

      if (scenariosWhereRequired && scenariosWhereRequired.length > 0) {
        scenarioNamesThatFollowProgressionOfCommand.push(...scenariosWhereRequired)
      }
    }
  }

  // Common scenarios are always considered
  scenarioNamesThatFollowProgressionOfCommand.push(
    ...constructedMapWithScenariosAndScenariosWhereItIsRequired.common
  )

  return scenarioNamesThatFollowProgressionOfCommand
}

const scenarioRespectsSameLineConstraint = (scenario, lineNumber, lastScenarioLineNumber) => {
  if (!scenario.onTheSameLineAsPrevScenario) {
    return true
  }
  return lineNumber === lastScenarioLineNumber.value
}

const scenarioRespectsStartOnNewLineConstraint = (scenario, lineNumber, lastScenarioLineNumber, numberOfActivatedScenarios) => {
  if (!scenario.startsOnNewLine) {
    return true
  }
  return (lineNumber > lastScenarioLineNumber.value) || (numberOfActivatedScenarios.value === 0)
}

const scenarioHasProhibitedProgressionsInProgress = (scenario, progressionOfCommandsFromScenarios) => {
  if (!scenario.prohibitedCommandProgressions) {
    return false
  }

  for (let index = 0; index < scenario.prohibitedCommandProgressions.length; index++) {
    const prohibitedProgression = scenario.prohibitedCommandProgressions[index]
    if (progressionOfCommandsFromScenarios.indexOf(prohibitedProgression) !== -1) {
      return true
    }
  }

  return false
}

const enqueueActionWhenProgressionOfCommandsChanges = ({
  scenario,
  scenarioName,
  unitext,
  lineNumber,
  currentToken,
  finalTokenValues,
  joinedTokenValuesWithRealDelimiters,
  progressionOfCommandsFromScenarios,
  queueOfActionsOnProgressionOfCommandsChange
}) => {
  if (!scenario.actionWhenProgressionOfCommandsChanges) {
    return
  }

  queueOfActionsOnProgressionOfCommandsChange.unshift({
    scenarioName,
    scenarioType: scenario.type,
    levelOfCommandProgression: scenario.itIsNewCommandProgressionFromLevel,
    action: scenario.actionWhenProgressionOfCommandsChanges,
    activateOnLastToken: scenario.activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore,
    argumentsFromMainAction: {
      unitext,
      lineNumber,
      currentToken,
      tokenValues: finalTokenValues,
      joinedTokenValuesWithRealDelimiters,
      progressionOfCommandsFromScenarios
    }
  })
}

const applyQueuedActionsAffectedByProgressionChange = (
  parserState,
  progressionOfCommandsFromScenarios,
  lineNumber,
  queueOfActionsOnProgressionOfCommandsChange,
  scenarioNameThatChangedCommandsProgression
) => {
  for (let actionIndex = 0; actionIndex < queueOfActionsOnProgressionOfCommandsChange.length; actionIndex++) {
    const currentActionOnProgressionOfCommandsChange = queueOfActionsOnProgressionOfCommandsChange[actionIndex]
    const scenarioNameInQueue = currentActionOnProgressionOfCommandsChange.scenarioName

    const scenarioIsNotInProgression =
      progressionOfCommandsFromScenarios.indexOf(scenarioNameInQueue) === -1
    const scenarioIsLastInProgression =
      progressionOfCommandsFromScenarios.indexOf(scenarioNameInQueue) ===
      (progressionOfCommandsFromScenarios.length - 1)

    if (scenarioIsNotInProgression || scenarioIsLastInProgression) {
      currentActionOnProgressionOfCommandsChange.action(
        parserState,
        scenarioNameThatChangedCommandsProgression,
        lineNumber,
        currentActionOnProgressionOfCommandsChange.argumentsFromMainAction
      )
      queueOfActionsOnProgressionOfCommandsChange.splice(actionIndex, 1)
      actionIndex--
    }
  }
}

/* ──────────────────────────────────────────────────────────────── */
/* Core: running scenarios                                         */
/* ──────────────────────────────────────────────────────────────── */

const runParserScenarios = (
  parserScenarios,
  typeOfScenarios,
  numberOfActivatedScenarios,
  progressionOfCommandsFromScenarios,
  lastScenarioLineNumber,
  unitext,
  lineNumber,
  itIsLastChar,
  currentToken,
  tokenAccumulator,
  delimitersBeforeFirstTokenOnTheLine,
  delimitersAfterEachToken,
  parserState,
  queueOfActionsOnProgressionOfCommandsChange
) => {
  const tokenValues = tokenValuesFromTokens(tokenAccumulator)
  const tokenValuesWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem =
    withoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem(tokenAccumulator)
  const joinedTokenValuesWithRealDelimiters =
    joinedTokensWithRealDelimiters(tokenAccumulator, delimitersBeforeFirstTokenOnTheLine, delimitersAfterEachToken)

  const scenarioNamesThatFollowProgressionOfCommand =
    collectScenarioNamesThatFollowProgression(progressionOfCommandsFromScenarios)

  for (let scenarioNameIndex = 0; scenarioNameIndex < scenarioNamesThatFollowProgressionOfCommand.length; scenarioNameIndex++) {
    const scenarioName = scenarioNamesThatFollowProgressionOfCommand[scenarioNameIndex]
    const scenario = parserScenarios[scenarioName]

    const respectsSameLineConstraint =
      scenarioRespectsSameLineConstraint(scenario, lineNumber, lastScenarioLineNumber)
    if (!respectsSameLineConstraint) {
      continue
    }

    const respectsStartsOnNewLineConstraint =
      scenarioRespectsStartOnNewLineConstraint(scenario, lineNumber, lastScenarioLineNumber, numberOfActivatedScenarios)
    if (!respectsStartsOnNewLineConstraint) {
      continue
    }

    const hasProhibitedProgressions =
      scenarioHasProhibitedProgressionsInProgress(scenario, progressionOfCommandsFromScenarios)
    if (hasProhibitedProgressions) {
      continue
    }

    const finalTokenValues = scenario.considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem
      ? tokenValuesWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem
      : tokenValues

    scenario.type = scenario.type || REGULAR

    if (currentToken) {
      currentToken.isOnNewLine =
        (lineNumber > lastScenarioLineNumber.value || (numberOfActivatedScenarios.value === 0))
    }

    if (scenario.type !== typeOfScenarios) {
      continue
    }

    const scenarioConditionIsMet = scenario.condition(
      unitext,
      lineNumber,
      currentToken,
      finalTokenValues,
      joinedTokenValuesWithRealDelimiters,
      progressionOfCommandsFromScenarios,
      parserState
    )

    if (!scenarioConditionIsMet) {
      continue
    }

    // Command progression management
    if (scenario.itIsNewCommandProgressionFromLevel !== undefined) {
      if (scenario.itIsNewCommandProgressionFromLevel !== LAST_LEVEL) {
        progressionOfCommandsFromScenarios.splice(scenario.itIsNewCommandProgressionFromLevel)
      }

      progressionOfCommandsFromScenarios.push(scenarioName)

      if (!parserState.applyOnlyHighlightingWithoutRefIds || !parserState.applyHighlighting) {
        const scenarioNameThatChangedCommandsProgression = scenarioName

        applyQueuedActionsAffectedByProgressionChange(
          parserState,
          progressionOfCommandsFromScenarios,
          lineNumber,
          queueOfActionsOnProgressionOfCommandsChange,
          scenarioNameThatChangedCommandsProgression
        )

        enqueueActionWhenProgressionOfCommandsChanges({
          scenario,
          scenarioName,
          unitext,
          lineNumber,
          currentToken,
          finalTokenValues,
          joinedTokenValuesWithRealDelimiters,
          progressionOfCommandsFromScenarios,
          queueOfActionsOnProgressionOfCommandsChange
        })
      }
    }

    const highlightingOnlyMode =
      parserState.applyHighlighting && parserState.applyOnlyHighlightingWithoutRefIds

    if (highlightingOnlyMode) {
      scenario.actionOnlyForHighlightingWithoutRefIds(
        parserState,
        joinedTokenValuesWithRealDelimiters,
        finalTokenValues
      )
    } else {
      scenario.action(
        unitext,
        lineNumber,
        currentToken,
        finalTokenValues,
        joinedTokenValuesWithRealDelimiters,
        progressionOfCommandsFromScenarios,
        parserState
      )
    }

    tokenAccumulator.length = 0
    lastScenarioLineNumber.value = lineNumber
    numberOfActivatedScenarios.value += 1
    break
  }
}

/* ──────────────────────────────────────────────────────────────── */
/* Main parser                                                      */
/* ──────────────────────────────────────────────────────────────── */

export default function (
  unitext,
  progressionOfCommandsFromScenarios = [],
  applyHighlighting = true,
  applyOnlyHighlightingWithoutRefIds = true,
  fonts = {
    'chord-letters': ['gentium plus', 'gothic a1'],
    'music': ['bravura', 'leland'],
    'text': ['noto-sans', 'noto-serif']
  }
) {
  const mapOfCharIndexesWithProgressionOfCommandsFromScenarios = {}

  const numberOfActivatedScenarios = { value: 0 }
  const queueOfActionsOnProgressionOfCommandsChange = []

  const parserState = {
    pageSchema: {},
    fonts,
    highlightsHtmlBuffer: [],
    applyHighlighting,
    applyOnlyHighlightingWithoutRefIds,
    indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders: [],
    indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholdersForConnection: [],
    indexesInHighlightsHtmlBufferWithNotesDeclarationsOfLastChord: [],
    lastMentionedStyleKey: undefined,
    lastMentionedMidiSettingKey: undefined,
    lastMentionedUnitPosition: undefined,
    lastMentionedPageLinePosition: undefined,
    lastMentionedMeasurePosition: undefined,
    lastMentionedStavePosition: undefined,
    lastMentionedVoicePosition: undefined,
    calculatedUnitPageLineIndexByLastMentionedPositions: undefined,
    calculatedUnitMeasureIndexByLastMentionedPositions: undefined,
    calculatedUnitStaveIndexByLastMentionedPositions: undefined,
    calculatedUnitVoiceIndexByLastMentionedPositions: undefined,
    calculatedUnitIndexByLastMentionedPositions: undefined,
    lastMentionedConnectionPageLinePosition: undefined,
    lastMentionedConnectionMeasurePosition: undefined,
    lastMentionedConnectionStavePosition: undefined,
    lastMentionedConnectionVoicePosition: undefined,
    lastMentionedNoteIndex: undefined,
    lastMentionedUnitsCompression: undefined,
    lastMentionedUnitsCompressionWasForSpecificLine: false,
    lastMentionedUnitsStretching: undefined,
    lastMentionedUnitsStretchingWasForAllLines: false,
    numberOfChordsBeforeFinishingDeclaringNewOne: 0,
    newlineAlreadyIntroducedNewMeasure: false,
    customStyles: {},
    midiSettings: {},
    errors: [],
    comments: [],
    emptyLineNumbers: [],
    numberOfPageLines: 0,
    lastClef: {},
    lastChordDuration: {},
    lastStemDirection: {},
    lastStavePosition: {},
    lastBeamStatus: {},
    keysOfLastNote: [],
    lastNoteTextValue: undefined,
    lastNoteTextPositionApplicationToNote: undefined,
    lastGhostStatus: {},
    chordIsActivatedInPreviousCommand: false,
    chordScopeIsActive: false,
    lastCrossStaveConnectionsParamsForEachLine: undefined,
    lastCrossStaveConnectionsParamsForEachLineId: 1,
    lastInstrumentTitlesParams: undefined,
    lastInstrumentTitlesParamsForEachLineId: 1,
    lastKeySignatureName: undefined,
    lastKeySignatureNameForEachLineId: 0,
    lastClefNames: [],
    lastTimeSignatureParams: undefined,
    lastTimeSignatureValueForEachLineId: 1,
    numberOfGlissandos: 0,
    numberOfSlurs: 0,
    slurMarkChords: {},
    lastSlurDirection: undefined,
    lastSShapeSlurPartDirection: undefined,
    lastSlurRoundness: undefined,
    lastSlurLeftYCorrection: undefined,
    lastSlurRightYCorrection: undefined,
    lastSlurWithSShape: undefined,
    lastSlurRightPointPlacement: undefined,
    lastGlissandoDirection: undefined,
    lastGlissandoForm: undefined,
    lastDeclaredGlissando: undefined,
    lastGlissandoBeforeMeasure: undefined,
    lastGlissandoAfterMeasure: undefined,
    numberOfTuplets: 0,
    lastTupletValue: undefined,
    lastChordParamsWithFinishedTupletMarkThatStartedBefore: undefined,
    lastChordParamsWithStartedTupletMark: undefined,
    lastTupletDirection: undefined,
    lastTupletIsAboveOrBelowStaveLines: undefined,
    lastTupletWithBrackets: undefined,
    lastTupletVerticalCorrection: undefined,
    lastChordLetterDirection: undefined,
    numberOfOctaveSignMarks: 0,
    numberOfDynamicMarks: 0,
    numberOfSimileMarks: 0,
    numberOfVoltaMarks: 0,
    numberOfPedalMarks: 0
  }

  const currentTokenChars = []
  const currentLineChars = []
  const allPrevTokens = []
  const prevTokensOnTheLine = []
  const tokenAccumulator = []
  const delimitersBeforeFirstTokenOnTheLine = []
  const delimitersAfterEachToken = []

  let firstTokenIsBehindOnTheLine = false
  let lineNumber = 1
  let tokenNumber = 0

  const lastScenarioLineNumber = { value: lineNumber }

  for (let charIndex = 0; charIndex < unitext.length; charIndex++) {
    const currentChar = unitext[charIndex]
    const nextChar = unitext[charIndex + 1]
    const itIsLastChar = !nextChar
    const itIsNewLineChar = NEW_LINE_REGEXP.test(currentChar)
    const itIsDelimiterBetweenTokens = SPACE_REGEXP.test(currentChar)
    const nextIsDelimiterBetweenTokens = nextChar && SPACE_REGEXP.test(nextChar)

    if (!itIsDelimiterBetweenTokens) {
      const sinceItIsNonDelimiterCharWeCanAssumeThatWeDontNeedToCollectDelimiterCharsBeforeFirstToken = true
      firstTokenIsBehindOnTheLine = sinceItIsNonDelimiterCharWeCanAssumeThatWeDontNeedToCollectDelimiterCharsBeforeFirstToken

      currentTokenChars.push(currentChar)
      currentLineChars.push(currentChar)

      if (!itIsLastChar) {
        mapOfCharIndexesWithProgressionOfCommandsFromScenarios[charIndex] =
          progressionOfCommandsFromScenarios.slice()
        continue
      }
    } else {
      if (!firstTokenIsBehindOnTheLine) {
        delimitersBeforeFirstTokenOnTheLine.push(currentChar)
      }
    }

    if (currentTokenChars.length > 0) {
      const noProcessedTokensOnTheLine = prevTokensOnTheLine.length === 0
      const firstTokenInProcessing = tokenNumber === 0
      const prevTokenOnTheLine = prevTokensOnTheLine[prevTokensOnTheLine.length - 1]
      const prevToken = allPrevTokens[allPrevTokens.length - 1]

      const currentToken = (
        prevTokenOnTheLine &&
        prevTokenOnTheLine.tokenNumber === tokenNumber
      )
        ? prevTokenOnTheLine
        : {
            value: currentTokenChars.join(EMPTY_STRING),
            tokenNumber
          }

      currentToken.firstOnTheLine = firstTokenInProcessing || (prevToken && prevToken.lastOnTheLine)
      currentToken.lastOnTheLine = itIsNewLineChar || itIsLastChar

      delimitersAfterEachToken[tokenNumber] = delimitersAfterEachToken[tokenNumber] || []

      if (itIsDelimiterBetweenTokens) {
        delimitersAfterEachToken[tokenNumber].push(currentChar)
      }

      if (!nextIsDelimiterBetweenTokens || currentToken.lastOnTheLine) {
        currentToken.firstCharIndexOfNextToken = charIndex + 1
        tokenAccumulator.push(currentToken)

        runParserScenarios(
          constructedParserScenarios,
          REGULAR,
          numberOfActivatedScenarios,
          progressionOfCommandsFromScenarios,
          lastScenarioLineNumber,
          unitext,
          lineNumber,
          itIsLastChar,
          currentToken,
          tokenAccumulator,
          delimitersBeforeFirstTokenOnTheLine,
          delimitersAfterEachToken,
          parserState,
          queueOfActionsOnProgressionOfCommandsChange
        )

        const tokenIsNew = noProcessedTokensOnTheLine
          ? true
          : prevTokenOnTheLine.tokenNumber !== tokenNumber

        if (tokenIsNew) {
          prevTokensOnTheLine.push(currentToken)
          allPrevTokens.push(currentToken)
        }

        const nextTokenToBeConsideredOnNextIteration =
          itIsNewLineChar || !nextIsDelimiterBetweenTokens || itIsLastChar

        if (nextTokenToBeConsideredOnNextIteration) {
          tokenNumber += 1
          currentTokenChars.length = 0
        }

        const currentTokenIsLastOnTheLineThereforeWeNeedToStartCollectingDelimiterCharsBeforeNextFirstTokenOnTheLine =
          currentToken.lastOnTheLine

        if (currentTokenIsLastOnTheLineThereforeWeNeedToStartCollectingDelimiterCharsBeforeNextFirstTokenOnTheLine) {
          firstTokenIsBehindOnTheLine = false
          delimitersBeforeFirstTokenOnTheLine.length = 0
        }
      }
    } else {
      if (
        parserState.applyHighlighting &&
        itIsLastChar &&
        itIsDelimiterBetweenTokens &&
        (parserState.highlightsHtmlBuffer !== undefined)
      ) {
        parserState.highlightsHtmlBuffer.push(delimitersBeforeFirstTokenOnTheLine.join(EMPTY_STRING))
      }
    }

    if (itIsNewLineChar) {
      if (currentLineChars.join(EMPTY_STRING).length === 0 && parserState.emptyLineNumbers !== undefined) {
        parserState.emptyLineNumbers.push(lineNumber)

        runParserScenarios(
          constructedParserScenarios,
          ON_EMPTY_LINE,
          numberOfActivatedScenarios,
          progressionOfCommandsFromScenarios,
          lastScenarioLineNumber,
          unitext,
          lineNumber,
          itIsLastChar,
          undefined,
          tokenAccumulator,
          delimitersBeforeFirstTokenOnTheLine,
          delimitersAfterEachToken,
          parserState,
          queueOfActionsOnProgressionOfCommandsChange
        )
      }

      lineNumber += 1
      prevTokensOnTheLine.length = 0
      currentLineChars.length = 0
      tokenAccumulator.length = 0
    }

    mapOfCharIndexesWithProgressionOfCommandsFromScenarios[charIndex] =
      progressionOfCommandsFromScenarios.slice()
  }

  if (!applyOnlyHighlightingWithoutRefIds || !applyHighlighting) {
    for (let actionIndex = 0; actionIndex < queueOfActionsOnProgressionOfCommandsChange.length; actionIndex++) {
      const currentActionOnProgressionOfCommandsChange =
        queueOfActionsOnProgressionOfCommandsChange[actionIndex]

      if (currentActionOnProgressionOfCommandsChange.activateOnLastToken) {
        const scenarioNameThatChangedCommandsProgression = LAST_CHAR
        currentActionOnProgressionOfCommandsChange.action(
          parserState,
          scenarioNameThatChangedCommandsProgression,
          lineNumber,
          currentActionOnProgressionOfCommandsChange.argumentsFromMainAction
        )
      }
    }
  }

  if (!parserState.applyHighlighting) {
    if (parserState.highlightsHtmlBuffer.length !== 0) {
      throw new Error('parserState.highlightsHtmlBuffer.length is 0, although !parserState.applyHighlighting')
    }

    parserState.highlightsHtmlBuffer = [unitext]
  }

  const parsedObject = {
    pageSchema: parserState.pageSchema,
    highlightsHtmlBuffer: parserState.highlightsHtmlBuffer,
    customStyles: parserState.customStyles,
    errors: parserState.errors,
    comments: parserState.comments,
    midiSettings: parserState.midiSettings,
    mapOfCharIndexesWithProgressionOfCommandsFromScenarios
  }

  return parsedObject
}
